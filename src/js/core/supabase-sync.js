/**
 * Modulo de Sincronizacao em Nuvem em Tempo Real (Supabase PostgreSQL + Realtime)
 * Permite que 2 ou mais usuarios utilizem o PCP Visual C-TEC simultaneamente.
 */
(function(){
'use strict';

const SUPABASE_URL = 'https://awfdugynqaowlrupddgu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3ZmR1Z3lucWFvd2xydXBkZGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5NzAyNTcsImV4cCI6MjEwOTU0NjI1N30.eWLO-5Yda8krDSoQI3uvMeYY0qYB9RpKEZy8hYN86MY';
const STATE_ROW_ID = 'ctec_main';
const REV_KEY = 'pcp_ctec_cloud_revision_v1';
const USER_KEY = 'pcp_ctec_cloud_user_v1';
const CLIENT_ID = 'cli_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36);

let sbClient = null;
let isApplyingRemote = false;
let isPushing = false;
let pendingPush = false;
let pushTimer = null;
let initialPullDone = false; // Bloqueio: nunca envia para nuvem antes de confirmar e carregar o estado atual
let localRevision = Number(localStorage.getItem(REV_KEY) || 0);

// Seguranca absoluta: nunca sincronizar se estiver rodando localmente (file://), em testes automatizados (webdriver/headless) ou sem protocolo web
function isSafeEnvironment() {
  if (typeof window === 'undefined' || !window.location) return false;
  if (window.location.protocol === 'file:') return false;
  if (navigator.webdriver) return false;
  return true;
}

function getUserName() {
  return (localStorage.getItem(USER_KEY) || 'PCP C-TEC').trim() || 'PCP C-TEC';
}

function setUserName(name) {
  const clean = String(name || '').trim() || 'PCP C-TEC';
  localStorage.setItem(USER_KEY, clean);
}

function setCloudStatus(state, text) {
  const dot = document.getElementById('cloudSyncDot');
  const lbl = document.getElementById('cloudSyncText');
  if (!dot || !lbl) return;
  const colors = {
    online: '#16a34a',
    syncing: '#eab308',
    remote: '#2563eb',
    error: '#dc2626',
    offline: '#9ca3af'
  };
  dot.style.background = colors[state] || colors.offline;
  lbl.textContent = text;
}

function ensureCloudBar() {
  if (document.getElementById('cloudSyncBar')) return;
  const topRight = document.querySelector('.top > div:last-child') || document.querySelector('.top');
  if (!topRight) return;

  const bar = document.createElement('div');
  bar.id = 'cloudSyncBar';
  bar.style.cssText = 'display:inline-flex;align-items:center;gap:6px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:4px 10px;font-size:12px;color:#1e293b;';
  bar.innerHTML = `
    <span id="cloudSyncDot" style="width:9px;height:9px;border-radius:50%;background:#eab308;display:inline-block;flex-shrink:0"></span>
    <span id="cloudSyncText" style="font-weight:600;white-space:nowrap">Conectando nuvem...</span>
    <span style="color:#cbd5e1">|</span>
    <label style="display:inline-flex;align-items:center;gap:4px;color:#475569;font-size:11px">
      Usuário:
      <input id="cloudUserInput" type="text" value="${escHtml(getUserName())}" title="Seu nome para identificação nas atualizações em nuvem" style="width:95px;padding:2px 6px;font-size:11px;border:1px solid #cbd5e1;border-radius:5px;background:#fff;color:#0f172a">
    </label>
    <button id="cloudSyncBtn" type="button" class="secondary" style="padding:3px 8px;font-size:11px;border-radius:5px;cursor:pointer" title="Buscar dados mais recentes da nuvem agora">Sincronizar</button>
  `;
  topRight.prepend(bar);

  const inp = document.getElementById('cloudUserInput');
  if (inp) {
    inp.onchange = () => setUserName(inp.value);
    inp.onblur = () => setUserName(inp.value);
  }
  const btn = document.getElementById('cloudSyncBtn');
  if (btn) {
    btn.onclick = () => pullFromCloud(true);
  }
}

function formatShortTime(isoStr) {
  if (!isoStr) return '';
  try {
    return new Date(isoStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch (e) {
    return '';
  }
}

function readJsonStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}') || {};
  } catch (e) {
    return {};
  }
}

async function restFetch(path, options = {}) {
  const headers = Object.assign({
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  }, options.headers || {});
  const res = await fetch(SUPABASE_URL + '/rest/v1/' + path, Object.assign({}, options, { headers }));
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return await res.json();
  }
  return null;
}

function isDialogEditing() {
  const openDialogs = document.querySelectorAll('dialog[open]');
  return openDialogs.length > 0;
}

function applyRemoteRow(row, sourceLabel = 'nuvem') {
  if (!row || !Array.isArray(row.dados)) return;
  isApplyingRemote = true;
  try {
    D = sanitizeData(structuredClone(row.dados));
    H = Array.isArray(row.importacoes) ? structuredClone(row.importacoes) : [];
    MPS = row.mps && typeof row.mps === 'object' ? structuredClone(row.mps) : { items: {}, batches: [] };
    BATCH_REFS = row.batch_refs && typeof row.batch_refs === 'object' ? structuredClone(row.batch_refs) : BATCH_REFS;
    MP = row.mp && typeof row.mp === 'object' ? structuredClone(row.mp) : MP;
    OPS = row.ops && typeof row.ops === 'object' ? structuredClone(row.ops) : OPS;

    if (!OPS.density) OPS.density = {};
    if (!OPS.packStock) OPS.packStock = {};
    if (!OPS.areaOverrides) OPS.areaOverrides = {};
    if (!OPS.stockOverrides) OPS.stockOverrides = {};
    if (!OPS.v63AreaOverrides) OPS.v63AreaOverrides = {};
    if (!OPS.v63StockOverrides) OPS.v63StockOverrides = {};
    if (!OPS.formulaLinks) OPS.formulaLinks = {};
    if (!OPS.weekWorkdays) OPS.weekWorkdays = {};
    window.OPS = OPS;

    if (!MP.stock) MP = mpInitialState();
    if (!MPS.items) MPS.items = {};
    if (!MPS.plans) MPS.plans = {};
    if (!MPS.masterPlans) MPS.masterPlans = {};
    if (!Array.isArray(MPS.batches)) MPS.batches = [];

    if (row.pack_custom && typeof row.pack_custom === 'object' && Object.keys(row.pack_custom).length > 0) {
      localStorage.setItem('pcp_ctec_pack_custom_v99', JSON.stringify(row.pack_custom));
    }
    if (row.mp_policy && typeof row.mp_policy === 'object' && Object.keys(row.mp_policy).length > 0) {
      localStorage.setItem('pcp_ctec_mp_policy_v90', JSON.stringify(row.mp_policy));
    }

    const hadTableteV108 = Boolean(OPS && OPS.tableteClorUnificadoV108);
    const hadDorumV111 = Boolean(OPS && OPS.dorumPeracidUnificadoV111);
    try { if (typeof window.v102Run === 'function') window.v102Run(); } catch (e) {}
    try { if (typeof window.v104ApplyProFormulaLinks === 'function') window.v104ApplyProFormulaLinks(); } catch (e) {}
    try { if (typeof window.v106MergeAliases === 'function') window.v106MergeAliases(); } catch (e) {}
    try { if (typeof window.v63ApplyAll === 'function') window.v63ApplyAll(); } catch (e) {}
    const migratedTableteV108 = (!hadTableteV108 && Boolean(OPS && OPS.tableteClorUnificadoV108)) || (!hadDorumV111 && Boolean(OPS && OPS.dorumPeracidUnificadoV111));

    // Persistir localmente sem disparar novo push
    origSave();

    localRevision = Number(row.revision || 1);
    localStorage.setItem(REV_KEY, String(localRevision));

    // Atualizar seletores e telas
    const ls = [...new Set(D.map(x => x.linha).filter(Boolean))].sort();
    if ($('linha')) {
      const cur = $('linha').value;
      $('linha').innerHTML = '<option value="">Todas as linhas</option>' + ls.map(x => `<option>${x}</option>`).join('');
      $('linha').value = cur;
    }
    if ($('mpsLinha')) {
      const cur = $('mpsLinha').value;
      $('mpsLinha').innerHTML = '<option value="">Todos os setores</option>' + ls.map(x => `<option>${x}</option>`).join('');
      $('mpsLinha').value = cur;
    }
    if ($('stockLine')) {
      const cur = $('stockLine').value;
      $('stockLine').innerHTML = '<option value="">Todas as linhas</option>' + ls.map(x => `<option>${x}</option>`).join('');
      $('stockLine').value = cur;
    }
    if (!OPS.week) OPS.week = currentIsoWeek();
    if ($('weekSelect')) $('weekSelect').value = OPS.week;
    if ($('boWeek')) $('boWeek').value = OPS.week;

    try { render(); } catch (e) { console.error(e); }
    try { renderBatches(); } catch (e) { console.error(e); }
    try { renderEngineering(); } catch (e) { console.error(e); }
    try { renderMaterials(); } catch (e) { console.error(e); }
    try { renderMRP(); } catch (e) { console.error(e); }
    try { renderWeekly(); } catch (e) { console.error(e); }
    try { renderBombonas(); } catch (e) { console.error(e); }
    try { renderProduction(); } catch (e) { console.error(e); }

    const who = row.updated_by || 'Nuvem';
    const when = formatShortTime(row.updated_at);
    setCloudStatus(
      sourceLabel === 'realtime' ? 'remote' : 'online',
      `Nuvem On • Rev #${localRevision} (${who}${when ? ' às ' + when : ''})`
    );
    if (migratedTableteV108) {
      setTimeout(() => { try { scheduleCloudPush(); } catch (e) {} }, 300);
    }
  } finally {
    isApplyingRemote = false;
  }
}

async function pullFromCloud(force = false) {
  try {
    if (!isSafeEnvironment()) {
      setCloudStatus('offline', 'Modo Local / Testes (Nuvem Desconectada)');
      return;
    }
    if (!force && isDialogEditing()) return;
    setCloudStatus('syncing', 'Sincronizando nuvem...');
    const rows = await restFetch(`pcp_cloud_state?id=eq.${STATE_ROW_ID}&select=*`);
    if (!Array.isArray(rows) || !rows.length) {
      initialPullDone = true;
      await pushToCloudNow('Carga Inicial');
      return;
    }
    const row = rows[0];
    const remoteRev = Number(row.revision || 1);
    if (force || remoteRev !== localRevision || row.client_id !== CLIENT_ID) {
      applyRemoteRow(row, 'pull');
    } else {
      const when = formatShortTime(row.updated_at);
      setCloudStatus('online', `Nuvem On • Rev #${localRevision}${when ? ' (' + when + ')' : ''}`);
    }
    initialPullDone = true;
  } catch (err) {
    console.warn('Falha ao buscar estado na nuvem:', err);
    setCloudStatus('error', 'Modo Local (sem conexão com nuvem)');
  }
}

async function pushToCloudNow(reasonLabel) {
  if (!isSafeEnvironment() || !initialPullDone || isApplyingRemote) return;
  if (isPushing) {
    pendingPush = true;
    return;
  }
  isPushing = true;
  try {
    setCloudStatus('syncing', 'Salvando na nuvem...');
    // Consultar revisao atual na nuvem para incrementar com seguranca
    let remoteRev = localRevision;
    try {
      const meta = await restFetch(`pcp_cloud_state?id=eq.${STATE_ROW_ID}&select=revision`);
      if (Array.isArray(meta) && meta[0] && Number(meta[0].revision) > remoteRev) {
        remoteRev = Number(meta[0].revision);
      }
    } catch (e) {}

    const nextRev = remoteRev + 1;
    const nowIso = new Date().toISOString();
    const user = reasonLabel || getUserName();

    const payload = {
      id: STATE_ROW_ID,
      dados: D,
      importacoes: H,
      mps: MPS,
      batch_refs: BATCH_REFS,
      mp: MP,
      ops: OPS,
      pack_custom: readJsonStorage('pcp_ctec_pack_custom_v99'),
      mp_policy: readJsonStorage('pcp_ctec_mp_policy_v90'),
      versao: 'V106',
      updated_by: user,
      client_id: CLIENT_ID,
      revision: nextRev,
      updated_at: nowIso
    };

    await restFetch(`pcp_cloud_state?on_conflict=id`, {
      method: 'POST',
      headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(payload)
    });

    localRevision = nextRev;
    localStorage.setItem(REV_KEY, String(localRevision));
    const when = formatShortTime(nowIso);
    setCloudStatus('online', `Nuvem Salva • Rev #${localRevision} (${user} às ${when})`);
  } catch (err) {
    console.error('Erro ao salvar na nuvem:', err);
    setCloudStatus('error', 'Salvo localmente • Erro ao enviar p/ nuvem');
  } finally {
    isPushing = false;
    if (pendingPush) {
      pendingPush = false;
      scheduleCloudPush();
    }
  }
}

function scheduleCloudPush() {
  if (!isSafeEnvironment() || !initialPullDone || isApplyingRemote) return;
  if (pushTimer) clearTimeout(pushTimer);
  setCloudStatus('syncing', 'Alteração pendente para nuvem...');
  pushTimer = setTimeout(() => {
    pushTimer = null;
    pushToCloudNow();
  }, 550);
}

// Interceptar save() global para sincronizar automaticamente qualquer alteracao
const origSave = window.save || save;
const wrappedSave = function() {
  const res = origSave.apply(this, arguments);
  if (!isApplyingRemote) {
    scheduleCloudPush();
  }
  return res;
};
window.save = wrappedSave;
save = wrappedSave;

// Configurar Realtime via WebSocket + Verificacao Periodica de Seguranca
function setupRealtimeAndPolling() {
  try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      sbClient
        .channel('pcp_cloud_state_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'pcp_cloud_state', filter: `id=eq.${STATE_ROW_ID}` },
          (payload) => {
            const newRow = payload?.new;
            if (!newRow) return;
            if (newRow.client_id === CLIENT_ID) return;
            if (Number(newRow.revision || 0) <= localRevision) return;
            if (isDialogEditing()) {
              setCloudStatus('remote', `Nova atualização disponível de ${newRow.updated_by || 'outro usuário'} (feche a janela para atualizar)`);
              return;
            }
            applyRemoteRow(newRow, 'realtime');
          }
        )
        .subscribe();
    }
  } catch (e) {
    console.warn('Realtime WebSocket indisponível, usando polling automático:', e);
  }

  // Polling leve a cada 15s para garantir sincronia mesmo em redes com bloqueio de WebSocket
  setInterval(async () => {
    if (document.hidden || isPushing || isApplyingRemote || pushTimer) return;
    try {
      const meta = await restFetch(`pcp_cloud_state?id=eq.${STATE_ROW_ID}&select=revision,client_id,updated_by`);
      if (Array.isArray(meta) && meta[0]) {
        const remoteRev = Number(meta[0].revision || 0);
        if (remoteRev > localRevision && meta[0].client_id !== CLIENT_ID && !isDialogEditing()) {
          await pullFromCloud(true);
        }
      }
    } catch (e) {}
  }, 15000);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !isPushing && !pushTimer) {
      pullFromCloud(false);
    }
  });
}

function initCloudSync() {
  ensureCloudBar();
  pullFromCloud(false);
  setupRealtimeAndPolling();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCloudSync);
} else {
  initCloudSync();
}

window.pcpCloudSync = {
  pull: () => pullFromCloud(true),
  push: () => pushToCloudNow()
};

})();
