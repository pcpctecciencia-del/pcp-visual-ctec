/**
 * Camada de Regras V71-V89: Regra de Amostras 150mL, SKUs Exportacao (PY), Deduplicacao, CROP 5L e Guardas de UI
 */

// ============================================================================
// Patch Block #26 [id="v71-export-completo-script"]
// ============================================================================
(function(){
'use strict';
const v71PrevDownload=window.downloadWeeklyPng;
if(typeof v71PrevDownload==='function'){
  window.downloadWeeklyPng=async function(){
    const sec=document.getElementById('semanal');
    if(!sec) return await v71PrevDownload();
    sec.classList.add('v71-exporting');
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    try{
      return await v71PrevDownload();
    }finally{
      sec.classList.remove('v71-exporting');
    }
  };
}
function v71Wire(){
  const btn=document.getElementById('weekSharePng');
  if(btn && typeof window.downloadWeeklyPng==='function') btn.onclick=window.downloadWeeklyPng;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v71Wire);else v71Wire();
setTimeout(v71Wire,0);
})();

// ============================================================================
// Patch Block #27 [id="v73-fluxo-real-script"]
// ============================================================================
(function(){
'use strict';
function v73Finished(b){let st='';try{st=String(stageOfBatch(b)||'').trim()}catch(e){st=String(b?.stage||'').trim()}return String(b?.status||'').trim()==='Finalizada'||st==='Apontamento'}
function v73HasLot(b){return String(b?.lot||'').trim()!==''}
function v73Week(){return $('v73BatchWeek')?.value||$('weekSelect')?.value||$('boWeek')?.value||OPS.week||currentIsoWeek()}
function v73WeekSet(week=v73Week()){return new Set(isoWeekDates(week))}
function v73Line(product){try{return batchSectorName(product)||'SEM SETOR'}catch(e){return D.find(x=>norm(x.produto)===norm(product)&&!isSampleSku(x))?.linha||'SEM SETOR'}}
function v73QtyText(b){let c=batchCounts(b),parts=[];['1','5','20','50','200','150'].forEach(k=>{let q=Number(c?.[k]||0);if(q>0){let kg=(String(b?.produto||'').toUpperCase().includes('REMOBAC')||String(b?.produto||'').toUpperCase().includes('TEC OXI'));parts.push(`${k==='150'?'Amostra':k+(kg?'KG':'L')} ${q.toLocaleString('pt-BR')}`)}});return parts.join(' • ')}
function v73PriorityRank(p){let s=String(p||'Normal').toUpperCase();return s.includes('URG')?0:s.includes('ALTA')?1:s.includes('NORMAL')?2:3}
function v73AreaRank(line){let s=norm(line||'');if(s.includes('ANVISA'))return 0;if(s.includes('VETER'))return 1;if(s.includes('AGRICOLA')||s.includes('CROP'))return 2;return 3}
function v73TodoRows(){return (MPS.batches||[]).filter(b=>!v73Finished(b)&&!b.date).sort((a,b)=>v73PriorityRank(a.priority)-v73PriorityRank(b.priority)||v73AreaRank(v73Line(a.produto))-v73AreaRank(v73Line(b.produto))||String(a.produto||'').localeCompare(String(b.produto||''),'pt-BR'))}
function v73ScheduledRows(week=v73Week()){const set=v73WeekSet(week);return (MPS.batches||[]).filter(b=>!v73Finished(b)&&b.date&&set.has(b.date)).sort((a,b)=>String(a.date).localeCompare(String(b.date))||v73AreaRank(v73Line(a.produto))-v73AreaRank(v73Line(b.produto))||String(a.produto||'').localeCompare(String(b.produto||''),'pt-BR'))}
function v73FilterRows(rows){const q=String($('batchNameFilter')?.value||'').trim().toUpperCase(),sec=$('batchSectorFilter')?.value||'';return rows.filter(b=>(!q||String(b.produto||'').toUpperCase().includes(q))&&(!sec||v73Line(b.produto)===sec))}
function v73Row(b,kind){const qty=v73QtyText(b),line=v73Line(b.produto),lot=String(b.lot||'').trim(),sent=!!lot,stage=stageOfBatch(b),date=b.date?b.date.split('-').reverse().join('/'):'—';const badge=sent?`<span class="v73-badge v73-sent">LOTE ${escHtml(lot)} • ENCAMINHADA</span>`:`<span class="v73-badge v73-pending">SEM LOTE • ENTRA EM COMPRAS</span>`;const nodist=!qty?'<span class="v73-badge v73-warn">SEM QUANTIDADES POR APRESENTAÇÃO</span>':'';let actions=`<button class="secondary smallbtn" onclick="openBatch('${b.id}')">${kind==='todo'?'Programar / Editar':'Editar'}</button>`;if(kind==='scheduled'&&!sent)actions+=`<button class="secondary smallbtn" onclick="v73Unschedule('${b.id}')">Voltar para A Fazer</button>`;actions+=`<button class="secondary smallbtn" onclick="deleteBatch('${b.id}')">Excluir</button>`;return `<div class=v73-batch-row><div class=namecell><div class=product>${escHtml(b.produto)}</div><div class=sub>${escHtml(line)}${qty?` • ${escHtml(qty)}`:''}</div><div>${badge}${nodist}</div>${b.obs?`<div class=sub><b>Obs.:</b> ${escHtml(b.obs)}</div>`:''}</div><div><small>${kind==='todo'?'Prioridade':'Data'}</small><b>${kind==='todo'?escHtml(b.priority||'Normal'):date}</b></div><div><small>Kg</small><b>${fmtKg(effectiveBatchKg(b))}</b></div><div><small>S&amp;OP</small><b>${escHtml(sopOfBatch(b))}</b></div><div><small>Etapa</small><b>${escHtml(stage)}</b></div><div class=actions>${actions}</div></div>`}
function v73Grouped(rows,kind){if(!rows.length)return `<div class=v73-empty>${kind==='todo'?'Nenhuma batelada aguardando programação.':'Nenhuma batelada programada para esta semana.'}</div>`;let g={};rows.forEach(b=>{let s=v73Line(b.produto);(g[s]||(g[s]=[])).push(b)});return Object.keys(g).sort((a,b)=>v73AreaRank(a)-v73AreaRank(b)||a.localeCompare(b,'pt-BR')).map(s=>`<div class=v73-sector><div class=v73-sector-head><b>${escHtml(s)}</b><span>${g[s].length} batelada(s)</span></div>${g[s].map(b=>v73Row(b,kind)).join('')}</div>`).join('')}
function v73SetupBatchUI(){const box=$('mps_bateladas');if(!box)return;if(!box.dataset.v73){box.dataset.v73='1';box.innerHTML=`<div class="notice v73-flow-note"><b>Fluxo do PCP:</b> primeiro crie a batelada em <b>Itens a Fazer</b>, sem obrigatoriedade de data. Quando decidir o dia, programe-a na semana. A Programação Semanal usa somente as bateladas com data. Quando houver <b>lote</b>, o sistema entende que a batelada já foi encaminhada para a produção.</div><div class=v73-batch-head><div class=v73-batch-tabs><button id=v73TabTodo class=active>A Fazer <span id=v73CountTodo class=v73-batch-counter>0</span></button><button id=v73TabWeek>Programadas na Semana <span id=v73CountWeek class=v73-batch-counter>0</span></button></div><button id=newBatch class=primary>+ Nova batelada a fazer</button></div><div class=v73-batch-filters><input id=batchNameFilter placeholder="Filtrar por produto"><select id=batchSectorFilter><option value="">Todos os setores</option></select><label>Semana programada<input id=v73BatchWeek type=week></label></div><div id=v73Todo class="v73-batch-section active"></div><div id=v73Week class=v73-batch-section></div>`;$('newBatch').onclick=()=>openBatch();$('v73TabTodo').onclick=()=>{OPS.v73BatchView='TODO';save();renderBatches()};$('v73TabWeek').onclick=()=>{OPS.v73BatchView='WEEK';save();renderBatches()};$('batchNameFilter').oninput=renderBatches;$('batchSectorFilter').onchange=renderBatches;$('v73BatchWeek').onchange=()=>{OPS.week=$('v73BatchWeek').value;if($('weekSelect'))$('weekSelect').value=OPS.week;if($('boWeek'))$('boWeek').value=OPS.week;save();renderBatches();renderWeekly();renderBombonas();renderMRP()}}}
window.v73Unschedule=function(id){const b=(MPS.batches||[]).find(x=>x.id===id);if(!b)return;if(v73HasLot(b)){alert('Esta batelada já possui lote e foi considerada encaminhada para a produção. Remova o lote na edição antes de voltar para A Fazer.');return}b.date='';b.status='A fazer';b.stage='A fazer';b.updatedAt=Date.now();save();renderBatches();renderWeekly();renderBombonas();renderMRP()};
renderBatches=function(){v73SetupBatchUI();if(!$('v73Todo'))return;const week=v73Week();if($('v73BatchWeek'))$('v73BatchWeek').value=week;const sectors=[...new Set((MPS.batches||[]).filter(b=>!v73Finished(b)).map(b=>v73Line(b.produto)).filter(Boolean))].sort((a,b)=>v73AreaRank(a)-v73AreaRank(b)||a.localeCompare(b,'pt-BR'));const sf=$('batchSectorFilter'),old=sf?.value||'';if(sf){sf.innerHTML='<option value="">Todos os setores</option>'+sectors.map(s=>`<option>${escHtml(s)}</option>`).join('');if(sectors.includes(old))sf.value=old}const todo=v73FilterRows(v73TodoRows()),weekRows=v73FilterRows(v73ScheduledRows(week));$('v73CountTodo').textContent=v73TodoRows().length;$('v73CountWeek').textContent=v73ScheduledRows(week).length;$('v73Todo').innerHTML=v73Grouped(todo,'todo');$('v73Week').innerHTML=v73Grouped(weekRows,'scheduled');const view=OPS.v73BatchView==='WEEK'?'WEEK':'TODO';$('v73TabTodo').classList.toggle('active',view==='TODO');$('v73TabWeek').classList.toggle('active',view==='WEEK');$('v73Todo').classList.toggle('active',view==='TODO');$('v73Week').classList.toggle('active',view==='WEEK')};
function v73ProcurementBatches(week){const set=v73WeekSet(week||v73Week());return (MPS.batches||[]).filter(b=>!v73Finished(b)&&!v73HasLot(b)&&(!b.date||set.has(b.date)))}
bombonaScopedBatches=function(){return v73ProcurementBatches($('boWeek')?.value||v73Week())};
mrpBatchSelection=function(){return v73ProcurementBatches(v73Week()).filter(b=>{let kg=effectiveBatchKg(b);return kg!==null&&kg>0})};
function v73SetupPurchaseUI(){const bo=$('boScope');if(bo){bo.innerHTML='<option value="PCP">A Fazer + semana selecionada sem lote</option>';bo.value='PCP';OPS.packScope='PCP';bo.disabled=true}const mf=$('mrpBatchFilter');if(mf){mf.innerHTML='<option value="OPEN">A Fazer + semana selecionada sem lote</option>';mf.value='OPEN';mf.disabled=true}const bsec=$('bombonas');if(bsec){let n=bsec.querySelector('.v73-purchase-rule');if(!n){n=document.createElement('div');n.className='notice v73-purchase-rule';const tb=bsec.querySelector('.toolbar');if(tb)tb.insertAdjacentElement('afterend',n)}if(n)n.innerHTML='<b>Regra do pedido de bombonas:</b> soma todas as bateladas <b>A Fazer</b> + as bateladas da <b>semana selecionada que ainda não possuem lote</b>. Ao informar um lote, a batelada é considerada encaminhada para a produção e deixa de entrar no pedido.'}const mrp=$('mrp');if(mrp){let n=mrp.querySelector('.v73-purchase-rule');if(!n){n=document.createElement('div');n.className='notice v73-purchase-rule';const tb=mrp.querySelector('.toolbar');if(tb)tb.insertAdjacentElement('afterend',n)}if(n)n.innerHTML='<b>Regra do MRP:</b> utiliza a mesma base das bombonas: <b>A Fazer + semana selecionada sem lote</b>. Com lote, a batelada já foi encaminhada e sai da necessidade de compra.'}}
if(typeof renderBombonas==='function'){const p=renderBombonas;renderBombonas=function(){v73SetupPurchaseUI();const r=p.apply(this,arguments);v73SetupPurchaseUI();const d=bombonaScopedBatches(),und=d.filter(b=>{let c=batchCounts(b);return !['1','5','20','50','200','150'].some(k=>Number(c?.[k]||0)>0)}).length;let n=$('bombonas')?.querySelector('.v73-purchase-rule');if(n&&und)n.innerHTML+=` <b>Atenção:</b> ${und} batelada(s) A Fazer estão sem quantidades por apresentação e não geram necessidade de embalagem até serem detalhadas.`;return r}}
if(typeof renderMRP==='function'){const p=renderMRP;renderMRP=function(){v73SetupPurchaseUI();const r=p.apply(this,arguments);v73SetupPurchaseUI();return r}}
function v73Wire(){v73SetupBatchUI();v73SetupPurchaseUI();renderBatches();if($('weekSelect')){const old=$('weekSelect').onchange;$('weekSelect').onchange=function(e){if(old)old.call(this,e);OPS.week=this.value;if($('v73BatchWeek'))$('v73BatchWeek').value=this.value;if($('boWeek'))$('boWeek').value=this.value;save();renderBatches();renderBombonas();renderMRP()}}if($('boWeek')){const old=$('boWeek').onchange;$('boWeek').onchange=function(e){if(old)old.call(this,e);OPS.week=this.value;if($('v73BatchWeek'))$('v73BatchWeek').value=this.value;if($('weekSelect'))$('weekSelect').value=this.value;save();renderBatches();renderMRP()}}try{renderBombonas()}catch(e){console.error('V73 bombonas',e)}try{renderMRP()}catch(e){console.error('V73 MRP',e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v73Wire);else v73Wire();setTimeout(v73Wire,0);
})();

// ============================================================================
// Patch Block #28 [id="v74-patch"]
// ============================================================================
(function(){
'use strict';
/*
V74 — Catálogo completo na criação de bateladas
- O seletor não depende mais somente dos itens presentes no estoque/relatório atual.
- Reúne cadastro de embalagens, tanques, produtos x fórmulas, estoque e vínculos editáveis.
- Produto próprio, exportação e marca terceirizada continuam separados pelo nome comercial.
*/
function v74CanonicalName(name){
  let p=String(name||'').trim();
  if(!p)return '';
  if(typeof v50CanonicalProductName==='function')p=v50CanonicalProductName(p);
  return p;
}
function v74AllProductNames(){
  const map=new Map();
  const add=(name)=>{
    name=v74CanonicalName(name);
    if(!name)return;
    if(norm(name)===norm('Ped Casco Plus'))return; // cadastro separado descontinuado
    const k=norm(name);
    if(!map.has(k))map.set(k,name);
  };
  // Prioriza os cadastros mestres para manter a nomenclatura oficial.
  (PACKAGING_MASTER||[]).forEach(x=>add(x.product));
  (TANK_MASTER||[]).forEach(x=>add(x.product));
  (PROD_FORMULA||[]).forEach(x=>{if(x.active!==false)add(x.product)});
  if(OPS&&OPS.formulaLinks)Object.values(OPS.formulaLinks).forEach(x=>{if(x&&x.active!==false)add(x.product)});
  (D||[]).filter(x=>!isSampleSku(x)).forEach(x=>add(x.produto));
  ((MPS&&MPS.batches)||[]).forEach(x=>add(x.produto));
  return [...map.values()].sort((a,b)=>a.localeCompare(b,'pt-BR',{sensitivity:'base'}));
}

// A criação de bateladas deve sempre enxergar o catálogo completo.
batchProductOptions=function(){ return v74AllProductNames(); };
v47CreationProductOptions=function(){ return v74AllProductNames(); };

// Mantém rótulos úteis sem esconder nenhum produto por falta de pedido/estoque.
v47OptionLabel=function(product){
  try{
    if(typeof v48IsContractProduct==='function' && v48IsContractProduct(product)){
      const active=typeof v48HasActiveOrder==='function' && v48HasActiveOrder(product);
      return `${product} — MARCA TERCEIRIZADA${active?' / PEDIDO':''}`;
    }
    const demand=(D||[]).some(x=>norm(x.produto)===norm(product)&&x.sobDemanda);
    return demand?`${product} — SOB DEMANDA`:product;
  }catch(e){return product}
};

// Garante apresentações virtuais quando o produto existe no mestre, mas ainda não apareceu em relatório CIGAM.
const v74ProductSkusPrev=productSkus;
productSkus=function(prod){
  let rows=v74ProductSkusPrev(prod)||[];
  const mains=rows.filter(x=>!isSampleSku(x));
  if(!mains.length && typeof v46PackRows==='function'){
    const virtual=v46PackRows(prod,prod)||[];
    virtual.forEach(r=>{
      let existing=(D||[]).find(x=>norm(x.item)===norm(r.item));
      if(!existing){D.push(r); existing=r;}
      if(!rows.includes(existing))rows.push(existing);
    });
  }
  if(!rows.some(isSampleSku))rows.push(sampleSkuForProduct(prod));
  return rows.sort((a,b)=>{
    let sa=isSampleSku(a)?1:0,sb=isSampleSku(b)?1:0;if(sa!==sb)return sa-sb;
    let aa=apInfo(a.ap),bb=apInfo(b.ap);
    let va=aa.kind==='L'?aa.liters:(aa.kind==='KG'?aa.kg:9999),vb=bb.kind==='L'?bb.liters:(bb.kind==='KG'?bb.kg:9999);
    return va-vb;
  });
};

// Reaplica a lista completa sempre que o modal for aberto.
const v74OpenBatchPrev=openBatch;
openBatch=function(id=null){
  v74OpenBatchPrev(id);
  const sel=$('batchProduct');
  if(!sel)return;
  const b=id?MPS.batches.find(z=>z.id===id):null;
  const current=b?.produto||sel.value;
  const prods=v74AllProductNames();
  sel.innerHTML=prods.map(p=>`<option value="${escHtml(p)}">${escHtml(v47OptionLabel(p))}</option>`).join('');
  if(current&&prods.some(p=>norm(p)===norm(current))){
    sel.value=prods.find(p=>norm(p)===norm(current));
  }else if(prods.length){sel.value=prods[0]}
  sel.disabled=!!b;
  if(!b){
    let dens=productDensity(sel.value,null);$('batchDensity').value=dens??'';
    updateBatchTankOptions('');
    renderBatchDist(null);
  }
};

// Atualiza apresentações/tanque/fórmula quando trocar o produto manualmente.
function v74WireProductChange(){
  const sel=$('batchProduct');if(!sel)return;
  sel.onchange=()=>{
    let dens=productDensity(sel.value,null);$('batchDensity').value=dens??'';
    updateBatchTankOptions('');
    renderBatchDist(null);
  };
}
const v74OpenBatchFinal=openBatch;
openBatch=function(id=null){v74OpenBatchFinal(id);v74WireProductChange();};
})();

// ============================================================================
// Patch Block #29 [id="v75-samples-150ml-patch"]
// ============================================================================
(function(){
'use strict';
/* V75 — Regra única de amostra: SOMENTE apresentação de 150 mL.
   A linha/área "AMOSTRAS" por si só não transforma um item em amostra. */
function v75Is150MlValue(value){
  const raw=String(value??'').toUpperCase().replace(',', '.').replace(/\s+/g,'');
  if(!raw)return false;
  if(/150ML/.test(raw))return true;
  if(/(?:^|[^0-9])0?\.150?L(?:$|[^A-Z0-9])/.test(raw))return true;
  if(/^0?\.15L$/.test(raw))return true;
  /* Nos cadastros da C-TEC, apresentação numérica 150 corresponde à amostra 150 mL. */
  if(/^150(?:\.0+)?$/.test(raw))return true;
  return false;
}

apInfo=function(ap){
  let s=String(ap??'').toUpperCase().replace(',','.').trim(),compact=s.replace(/\s+/g,'');
  if(v75Is150MlValue(s))return{kind:'L',liters:.15,key:'150ML',label:'150ML'};
  let kg=s.match(/([\d.]+)\s*KG/);if(kg)return{kind:'KG',kg:Number(kg[1]),key:kg[1]+'KG',label:kg[1]+'KG'};
  let gr=s.match(/([\d.]+)\s*GR?\b/);if(gr)return{kind:'KG',kg:Number(gr[1])/1000,key:gr[1]+'GR',label:gr[1]+'GR'};
  let l=s.match(/([\d.]+)\s*L/);if(l)return{kind:'L',liters:Number(l[1]),key:String(Number(l[1]))+'L',label:String(Number(l[1]))+'L'};
  let n=Number(compact);if(Number.isFinite(n))return{kind:'L',liters:n,key:String(n)+'L',label:String(n)+'L'};
  return{kind:'OTHER',key:s,label:s};
};

isSampleSku=function(x){
  if(!x)return false;
  return v75Is150MlValue(x.ap) || v75Is150MlValue(x.item);
};

isSampleItem=function(item){
  const x=(D||[]).find(z=>z.item===item);
  return x?isSampleSku(x):v75Is150MlValue(item);
};

/* Padroniza os 150 mL já existentes, independentemente de terem vindo do CIGAM,
   de backup antigo ou do cadastro virtual de amostra. */
function v75NormalizeSamples(){
  let changed=false;
  (D||[]).forEach(x=>{
    if(isSampleSku(x) && String(x.ap||'').trim()!=='150 ML'){
      x.ap='150 ML'; changed=true;
    }
  });
  if(changed && typeof save==='function')save();
}

/* Uma única linha de amostra 150 mL por produto na criação da batelada.
   Se houver um SKU real do CIGAM, ele tem preferência sobre a amostra virtual. */
productSkus=function(prod){
  const all=(D||[]).filter(x=>norm(x.produto)===norm(prod)&&!(isThird(x)&&x.semPedido));
  const main=all.filter(x=>!isSampleSku(x));
  if(norm(prod)==='TABLETE CLOR'||norm(prod)==='TABLET CLOR')return main;
  const samples=all.filter(isSampleSku).sort((a,b)=>{
    const ar=String(a.cod||'').trim()?0:1, br=String(b.cod||'').trim()?0:1;
    if(ar!==br)return ar-br;
    return String(a.item||'').localeCompare(String(b.item||''),'pt-BR');
  });
  const sample=samples[0]||sampleSkuForProduct(prod);
  const rows=[...main,sample];
  return rows.sort((a,b)=>{
    let sa=isSampleSku(a)?1:0,sb=isSampleSku(b)?1:0;if(sa!==sb)return sa-sb;
    let aa=apInfo(a.ap),bb=apInfo(b.ap),
        va=aa.kind==='L'?aa.liters:(aa.kind==='KG'?aa.kg:9999),
        vb=bb.kind==='L'?bb.liters:(bb.kind==='KG'?bb.kg:9999);
    return va-vb;
  });
};

/* Mantém o cadastro virtual explicitamente como 150 mL. */
sampleSkuForProduct=function(prod){
  let x=(D||[]).find(z=>norm(z.produto)===norm(prod)&&isSampleSku(z));
  if(x)return x;
  return {linha:'AMOSTRAS',produto:prod,ap:'150 ML',item:`Amostra - ${prod} 150ML`,cod:'',ref:'',att:'',est:'',atual:'',pedidoAtivo:false,hist:[],virtualSample:true};
};

function v75Refresh(){
  v75NormalizeSamples();
  try{ if(typeof renderMPS==='function')renderMPS(); }catch(e){}
  try{ if(typeof renderWeekly==='function')renderWeekly(); }catch(e){}
}

v75NormalizeSamples();
/* Não força re-render geral no carregamento para evitar interferir na navegação;
   a nova regra passa a valer imediatamente nas próximas renderizações/aberturas. */
})();

// ============================================================================
// Patch Block #30 [id="v76-py-exportacao-patch"]
// ============================================================================
(function(){
'use strict';
/*
V76 — nomenclatura CIGAM com final PY = produto EXPORTAÇÃO.
Ex.: TEC PRO FILM 5L PY -> Tec Pro Film Exportação 5L.
O sufixo PY é nome do relatório, não cria um novo produto comercial no PCP.
*/
function v76AllNames(){
  const map=new Map(), add=n=>{n=String(n||'').trim();if(n&&!map.has(norm(n)))map.set(norm(n),n)};
  try{(PACKAGING_MASTER||[]).forEach(x=>add(x.product))}catch(e){}
  try{(TANK_MASTER||[]).forEach(x=>add(x.product))}catch(e){}
  try{(PROD_FORMULA||[]).forEach(x=>add(x.product))}catch(e){}
  try{(D||[]).forEach(x=>add(x.produto))}catch(e){}
  try{((MPS&&MPS.batches)||[]).forEach(x=>add(x.produto))}catch(e){}
  return [...map.values()];
}
function v76StripPresentation(s){
  return norm(s)
    .replace(/\b(150)\s*ML\b/g,' ')
    .replace(/\b(1|5|20|50|200|1000)\s*(L|KG)\b/g,' ')
    .replace(/\bPY\b\s*$/,' ')
    .replace(/\s+/g,' ').trim();
}
function v76ExportBase(s){
  return norm(s).replace(/\bEXPORTACAO\b/g,' ').replace(/\bEXPORT\b/g,' ').replace(/\s+/g,' ').trim();
}
function v76PyInfo(reportName){
  const raw=String(reportName||'').trim(), nn=norm(raw);
  if(!/\bPY\s*$/.test(nn))return null;
  let m=nn.match(/\b(150)\s*ML\b/) || nn.match(/\b(1|5|20|50|200|1000)\s*(L|KG)\b/);
  const size=m?Number(m[1]):null, unit=m?(m[2]||'ML'):'';
  const base=v76StripPresentation(raw);
  const names=v76AllNames().filter(n=>/\bEXPORTACAO\b/.test(norm(n)));
  let product=names.find(n=>v76ExportBase(n)===base)||null;
  if(!product){
    product=names.find(n=>v76ExportBase(n).includes(base)||base.includes(v76ExportBase(n)))||null;
  }
  if(!product)return null;
  return {product,size,unit,report:raw};
}
function v76ApMatches(row,info){
  if(!row||!info)return false;
  if(info.size===null)return true;
  const a=apInfo(row.ap||row.item||'');
  if(info.unit==='ML')return isSampleSku(row) && info.size===150;
  if(info.unit==='KG')return a.kind==='KG' && Number(a.kg)===Number(info.size);
  return a.kind==='L' && Number(a.liters)===Number(info.size);
}
function v76EnsureRows(product){
  let rows=(D||[]).filter(x=>norm(x.produto)===norm(product));
  if(!rows.length && typeof v46PackRows==='function'){
    try{
      (v46PackRows(product,product)||[]).forEach(r=>{
        let x=(D||[]).find(z=>norm(z.item)===norm(r.item));
        if(!x){D.push(r);x=r}
      });
      rows=(D||[]).filter(x=>norm(x.produto)===norm(product));
    }catch(e){}
  }
  return rows;
}
function v76FindExportRow(reportName){
  const info=v76PyInfo(reportName);if(!info)return null;
  let rows=v76EnsureRows(info.product);
  let x=rows.find(r=>v76ApMatches(r,info));
  if(!x && info.unit==='L'){
    x=rows.find(r=>{let a=apInfo(r.ap||r.item||'');return Number(a.liters)===Number(info.size)});
  }
  if(!x && info.unit==='KG'){
    x=rows.find(r=>{let a=apInfo(r.ap||r.item||'');return Number(a.kg)===Number(info.size)});
  }
  if(x){x.nomeRelatorio=info.report;x.exportPy=true;}
  return x||null;
}

/* Importação de pedidos: tenta primeiro as regras existentes; se ainda não encontrou,
   resolve automaticamente qualquer item terminado em PY para o produto Exportação. */
const v76FindPrev=find;
find=function(c,n){
  let x=v76FindPrev(c,n);if(x)return x;
  x=v76FindExportRow(n);
  if(x){x.cod=String(c||x.cod||'');return x}
  return null;
};

/* Catálogo de bateladas: elimina aliases PY separados e mantém o produto Exportação oficial. */
const v76BatchProductOptionsPrev=batchProductOptions;
batchProductOptions=function(){
  const map=new Map();
  (v76BatchProductOptionsPrev()||[]).forEach(p=>{
    let info=v76PyInfo(p+' 5L');
    let name=(/\bPY\s*$/.test(norm(p)) && info?.product)?info.product:p;
    if(name&&!map.has(norm(name)))map.set(norm(name),name);
  });
  return [...map.values()].sort((a,b)=>a.localeCompare(b,'pt-BR',{sensitivity:'base'}));
};
if(typeof v47CreationProductOptions==='function')v47CreationProductOptions=function(){return batchProductOptions()};

/* Migra aliases antigos, especialmente Tec Oxi PY, sem apagar histórico de bateladas. */
function v76MigrateOldPy(){
  let changed=false;
  (D||[]).slice().forEach(src=>{
    if(!/\bPY\s*$/.test(norm(src.produto)))return;
    const fake=`${src.produto} ${String(src.ap||'').trim()}`;
    const info=v76PyInfo(fake);if(!info)return;
    let target=(D||[]).find(z=>z!==src&&norm(z.produto)===norm(info.product)&&v76ApMatches(z,info));
    if(target){
      ['cod','est','atual','pedidoAtivo','semPedido','ultimoSaldoEncerrado'].forEach(k=>{if((target[k]===undefined||target[k]===null||target[k]==='')&&src[k]!==undefined&&src[k]!==null&&src[k]!=='')target[k]=src[k]});
      if(Array.isArray(src.hist)&&src.hist.length){target.hist=(target.hist||[]).concat(src.hist)}
      const i=D.indexOf(src);if(i>=0)D.splice(i,1);
    }else{src.produto=info.product}
    changed=true;
  });
  ((MPS&&MPS.batches)||[]).forEach(b=>{
    if(!/\bPY\s*$/.test(norm(b.produto)))return;
    const info=v76PyInfo(`${b.produto} 5L`);if(info?.product){b.produto=info.product;changed=true}
  });
  if(changed)try{save()}catch(e){}
}
v76MigrateOldPy();

/* Reabre o seletor com a lista já normalizada. */
const v76OpenBatchPrev=openBatch;
openBatch=function(id=null){
  v76OpenBatchPrev(id);
  const sel=$('batchProduct');if(!sel)return;
  const b=id?MPS.batches.find(z=>z.id===id):null,current=b?.produto||sel.value,prods=batchProductOptions();
  sel.innerHTML=prods.map(p=>`<option value="${escHtml(p)}">${escHtml(typeof v47OptionLabel==='function'?v47OptionLabel(p):p)}</option>`).join('');
  const hit=prods.find(p=>norm(p)===norm(current));if(hit)sel.value=hit;
  sel.disabled=!!b;
};
})();

// ============================================================================
// Patch Block #31 [id="v77-patch"]
// ============================================================================
(function(){
'use strict';
/*
V77 — regra de encerramento corrigida
- Somente produtos de MARCA TERCEIRIZADA podem ser encerrados automaticamente
  quando deixam de constar no relatório CIGAM.
- Produtos próprios, exportação, Bolívia/PY e amostras 150 mL NÃO são encerrados
  apenas por ausência em um relatório novo.
- Para estes itens, o sistema mantém o último estoque conhecido até que um novo
  valor seja importado ou o usuário faça um ajuste manual.
*/

function v77Key(x){
  return String(x?.cod||'').trim() || norm(String(x?.item||'')) || `${norm(x?.produto||'')}|${norm(x?.ap||'')}`;
}
function v77LastKnownStock(x){
  let cur=N(x?.est); if(cur!==null)return cur;
  let old=N(x?.ultimoSaldoEncerrado); if(old!==null)return old;
  let hs=Array.isArray(x?.hist)?x.hist:[];
  for(let i=hs.length-1;i>=0;i--){
    let n=N(hs[i]?.estoque); if(n!==null)return n;
  }
  return null;
}
function v77HasKnownHistory(x){
  return N(x?.est)!==null || N(x?.ultimoSaldoEncerrado)!==null || (Array.isArray(x?.hist)&&x.hist.some(h=>N(h?.estoque)!==null));
}
function v77ReopenOwnItems(addHistory=false){
  let changed=0, now=new Date().toLocaleString('pt-BR');
  (D||[]).forEach(x=>{
    if(isThird(x))return;
    let wasClosed=(x.semPedido===true || x.sampleCancelled===true);
    let stock=v77LastKnownStock(x);
    if(N(x.est)===null && stock!==null)x.est=stock;
    x.semPedido=false;
    x.sampleCancelled=false;
    if(v77HasKnownHistory(x) || String(x.cod||'').trim())x.pedidoAtivo=true;
    if(wasClosed){
      changed++;
      if(addHistory){
        x.hist=x.hist||[];
        x.hist.push({data:now,estoque:x.est,rel:'Correção V77',evento:'REATIVADO — ausência no relatório não encerra produto próprio/exportação'});
      }
    }
  });
  return changed;
}

/* Corrige imediatamente registros próprios/exportação que tenham sido encerrados
   por versões anteriores, restaurando o último saldo disponível. */
const v77Reopened=v77ReopenOwnItems(true);
if(v77Reopened){try{save()}catch(e){console.error(e)}}

/* A importação antiga ainda executa suas regras internas. Nós preservamos o estado
   dos itens não terceirizados e corrigimos qualquer encerramento indevido após a leitura. */
const v77ImportPrev=importPDF;
importPDF=async function(file){
  v77ReopenOwnItems(false);
  const before=new Map();
  (D||[]).forEach(x=>{
    if(!isThird(x))before.set(v77Key(x),{
      est:x.est,
      pedidoAtivo:x.pedidoAtivo,
      atual:x.atual,
      ultimoSaldoEncerrado:x.ultimoSaldoEncerrado
    });
  });

  await v77ImportPrev(file);

  let restored=0;
  (D||[]).forEach(x=>{
    if(isThird(x))return;
    const imported=(x.hist||[]).some(h=>h&&h.rel===file.name);
    if(imported){
      x.semPedido=false;
      x.sampleCancelled=false;
      x.pedidoAtivo=true;
      return;
    }

    const old=before.get(v77Key(x));
    if(old){
      /* Ausente no relatório: conserva o último saldo/estado operacional. */
      if(N(x.est)===null && N(old.est)!==null)x.est=old.est;
      if(N(x.est)===null && N(old.ultimoSaldoEncerrado)!==null)x.est=old.ultimoSaldoEncerrado;
      x.pedidoAtivo=old.pedidoAtivo;
      if(old.atual)x.atual=old.atual;
    }else{
      let last=v77LastKnownStock(x);
      if(N(x.est)===null && last!==null)x.est=last;
      if(v77HasKnownHistory(x)||String(x.cod||'').trim())x.pedidoAtivo=true;
    }
    if(x.semPedido===true || x.sampleCancelled===true)restored++;
    x.semPedido=false;
    x.sampleCancelled=false;
  });

  v77ReopenOwnItems(false);
  try{save()}catch(e){console.error(e)}
  try{render()}catch(e){console.error(e)}

  if($('msg')){
    const base=String($('msg').textContent||'').replace(/\s+/g,' ').trim();
    $('msg').textContent=(base?base+' ':'')+'Regra: somente marcas terceirizadas ausentes são encerradas; produtos próprios/exportação mantêm o último estoque conhecido.';
  }
};

/* Garante a regra também após restauração de backup antigo. */
if(typeof restoreBackup==='function'){
  const v77RestorePrev=restoreBackup;
  restoreBackup=async function(file){
    await v77RestorePrev(file);
    v77ReopenOwnItems(true);
    try{save()}catch(e){console.error(e)}
    try{render()}catch(e){console.error(e)}
  };
}

/* Proteção final antes de desenhar estoque/dashboard. */
const v77RenderPrev=render;
render=function(){
  v77ReopenOwnItems(false);
  return v77RenderPrev.apply(this,arguments);
};

try{render()}catch(e){console.error(e)}
})();

// ============================================================================
// Patch Block #32 [id="v78-tec-oxi-py-fix"]
// ============================================================================
(function(){
'use strict';
/* V78 — reconhecimento explícito do TEC OXI PY em KG.
   001878 — TEC OXI 5KG PY = Tec Oxi Exportação 5KG.
   A regra também prepara 20/50/200KG PY caso apareçam no CIGAM. */
function v78Code(v){return String(v||'').replace(/\D/g,'').replace(/^0+/,'')||'0'}
function v78EnsureTecOxiExportKg(size,code=''){
  const prod='Tec Oxi Exportação', ap=`${size} KG`, item=`${prod} ${size}KG`;
  let row=(D||[]).find(x=>norm(x.produto)===norm(prod) && apInfo(x.ap||x.item||'').kind==='KG' && Number(apInfo(x.ap||x.item||'').kg)===Number(size));
  if(!row){
    row={linha:'ANVISA',produto:prod,ap,item,cod:String(code||''),ref:0,att:0,est:'',atual:'',pedidoAtivo:false,hist:[]};
    D.push(row);
  }
  if(code)row.cod=String(code);
  row.linha='ANVISA'; row.produto=prod; row.ap=ap; row.item=item; row.exportPy=true;
  return row;
}
function v78TecOxiPy(c,n){
  const nn=norm(n), code=v78Code(c);
  const m=nn.match(/^TEC OXI\s+(5|20|50|200)\s*KG\s+PY$/);
  if(!m && code!=='1878')return null;
  const size=m?Number(m[1]):5;
  const knownCode=size===5?'001878':String(c||'');
  return v78EnsureTecOxiExportKg(size,knownCode);
}
const v78FindPrev=find;
find=function(c,n){
  const special=v78TecOxiPy(c,n);
  if(special)return special;
  return v78FindPrev(c,n);
};
/* Corrige cadastro antigo/alias caso exista e garante o SKU solicitado. */
const v78row=v78EnsureTecOxiExportKg(5,'001878');
(D||[]).forEach(x=>{
  if(x===v78row)return;
  if((v78Code(x.cod)==='1878'||norm(x.item)==='TEC OXI 5KG PY') && norm(x.produto)!==norm('Tec Oxi Exportação')){
    if(x.est!==''&&x.est!==null&&x.est!==undefined)v78row.est=x.est;
    if(x.atual)v78row.atual=x.atual;
    if(Array.isArray(x.hist)&&x.hist.length)v78row.hist=[...(v78row.hist||[]),...x.hist];
    x.cod=''; x.pedidoAtivo=false; x.semPedido=true;
  }
});
/* Se a tela de revisar estiver aberta na sessão atual, remove o 001878 da lista. */
if(Array.isArray(R)){
  for(let i=R.length-1;i>=0;i--){if(v78Code(R[i]?.cod)==='1878'||norm(R[i]?.nome)==='TEC OXI 5KG PY')R.splice(i,1)}
}
try{save();if(typeof rh==='function')rh();}catch(e){}
})();

// ============================================================================
// Patch Block #33 [id="v79-dedup-stock-fix"]
// ============================================================================
(function(){
'use strict';
/* V79 — corrige duplicidades de SKUs no estoque.
   Um produto + apresentação deve existir uma única vez na base.
   A correção também limpa duplicatas já salvas no localStorage. */
function v79ApKey(x){
  if(typeof isSampleSku==='function' && isSampleSku(x)) return '150ML';
  const a=typeof apInfo==='function'?apInfo(x?.ap||x?.item||''):null;
  if(a?.kind==='L' && Number.isFinite(Number(a.liters))) return `${Number(a.liters)}L`;
  if(a?.kind==='KG' && Number.isFinite(Number(a.kg))) return `${Number(a.kg)}KG`;
  return norm(String(x?.ap||x?.item||''));
}
function v79RowKey(x){return `${norm(x?.produto||'')}|${v79ApKey(x)}|${isThird(x)?'T':'P'}`;}
function v79DateValue(v){
  const s=String(v||'').trim();if(!s)return 0;
  let m=s.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:[, ]+)(\d{2}):(\d{2})(?::(\d{2}))?/);
  if(m)return new Date(+m[3],+m[2]-1,+m[1],+m[4],+m[5],+(m[6]||0)).getTime();
  m=s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);if(m)return new Date(+m[3],+m[2]-1,+m[1]).getTime();
  const t=Date.parse(s);return Number.isFinite(t)?t:0;
}
function v79Score(x){return (v79DateValue(x?.atual)/1e12)+(String(x?.cod||'').trim()?8:0)+(N(x?.est)!==null?6:0)+(x?.ajusteManualEstoque?12:0)+(N(x?.ref)!==null&&N(x?.ref)!==0?2:0)+(N(x?.att)!==null&&N(x?.att)!==0?2:0);}
function v79MergeGroup(rows){
  rows=[...rows].sort((a,b)=>v79Score(b)-v79Score(a));const base=rows[0];
  const latest=rows.reduce((best,r)=>v79DateValue(r?.atual)>v79DateValue(best?.atual)?r:best,rows[0]);
  const stockRow=rows.find(r=>r?.ajusteManualEstoque&&N(r?.est)!==null)||(N(latest?.est)!==null?latest:rows.find(r=>N(r?.est)!==null));
  if(stockRow){base.est=stockRow.est;if(stockRow.atual)base.atual=stockRow.atual;}
  const codRow=rows.find(r=>String(r?.cod||'').trim());if(codRow)base.cod=codRow.cod;
  const refRow=rows.find(r=>N(r?.ref)!==null&&N(r?.ref)!==0);if(refRow)base.ref=refRow.ref;
  const attRow=rows.find(r=>N(r?.att)!==null&&N(r?.att)!==0);if(attRow)base.att=attRow.att;
  const manual=rows.find(r=>r?.ajusteManualEstoque);if(manual){base.ajusteManualEstoque=true;base.ajusteManualData=manual.ajusteManualData||base.ajusteManualData;base.ajusteManualMotivo=manual.ajusteManualMotivo||base.ajusteManualMotivo;}
  base.pedidoAtivo=rows.some(r=>r?.pedidoAtivo===true);base.semPedido=rows.every(r=>r?.semPedido===true);base.sampleCancelled=rows.every(r=>r?.sampleCancelled===true);
  if(rows.some(r=>isThird(r)))base.tipo='Terceirizado';
  const h=[],seen=new Set();rows.forEach(r=>(Array.isArray(r?.hist)?r.hist:[]).forEach(e=>{const k=JSON.stringify(e);if(!seen.has(k)){seen.add(k);h.push(e)}}));h.sort((a,b)=>v79DateValue(a?.data)-v79DateValue(b?.data));base.hist=h;
  return base;
}
function v79Dedup(saveAfter=true){
  if(!Array.isArray(D)||D.length<2)return 0;const groups=new Map();
  D.forEach(x=>{const k=v79RowKey(x);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(x)});
  const clean=[];let removed=0;groups.forEach(rows=>{clean.push(v79MergeGroup(rows));removed+=Math.max(0,rows.length-1)});
  if(removed){D=clean;if(saveAfter){try{save()}catch(e){console.error(e)}}}return removed;
}
const v79Removed=v79Dedup(true);
if(typeof importPDF==='function'){
  const v79ImportPrev=importPDF;importPDF=async function(file){await v79ImportPrev(file);const n=v79Dedup(true);if(n&&$('msg'))$('msg').textContent=String($('msg').textContent||'')+` Duplicidades consolidadas: ${n}.`;try{render()}catch(e){console.error(e)}};
}
const v79RenderPrev=render;render=function(){v79Dedup(false);return v79RenderPrev.apply(this,arguments)};
try{render()}catch(e){console.error(e)}
})();

// ============================================================================
// Patch Block #34 [id="v80-amostras-area-fix"]
// ============================================================================
(function(){
'use strict';
/* V80 — AMOSTRAS é exclusivo de SKU 150 mL.
   Produtos normais 1L/5L/20L/50L/etc. nunca podem permanecer na área AMOSTRAS.
   A área principal é recuperada do cadastro mestre do produto. */
function v80MasterLine(product){
  const key=norm(product||'');
  let r=null;
  try{r=(PACKAGING_MASTER||[]).find(x=>norm(x.product||'')===key)}catch(e){}
  if(r&&r.line)return String(r.line).trim();
  try{r=(D||[]).find(x=>norm(x.produto||'')===key&&!isSampleSku(x)&&norm(x.linha||'')!=='AMOSTRAS')}catch(e){}
  return r?String(r.linha||'').trim():'';
}
function v80RepairSampleAreas(doSave=true){
  let changed=false;
  OPS.areaOverrides=OPS.areaOverrides||{};
  OPS.v63AreaOverrides=OPS.v63AreaOverrides||{};

  const products=new Set((D||[]).map(x=>norm(x.produto||'')).filter(Boolean));
  products.forEach(pk=>{
    const rows=(D||[]).filter(x=>norm(x.produto||'')===pk);
    const hasMain=rows.some(x=>!isSampleSku(x));
    if(!hasMain)return;
    const product=rows[0]?.produto||'';
    const master=v80MasterLine(product);
    if(!master||norm(master)==='AMOSTRAS')return;
    if(norm(OPS.areaOverrides[pk]||'')==='AMOSTRAS'){OPS.areaOverrides[pk]=master;changed=true;}
    if(norm(OPS.v63AreaOverrides[pk]||'')==='AMOSTRAS'){OPS.v63AreaOverrides[pk]=master;changed=true;}
  });

  (D||[]).forEach(x=>{
    if(isSampleSku(x)){
      if(norm(x.linha||'')!=='AMOSTRAS'){x.linha='AMOSTRAS';changed=true;}
      if(String(x.ap||'').trim()!=='150 ML'){x.ap='150 ML';changed=true;}
      return;
    }
    if(norm(x.linha||'')==='AMOSTRAS'){
      const master=v80MasterLine(x.produto);
      if(master&&norm(master)!=='AMOSTRAS'){x.linha=master;changed=true;}
    }
  });
  if(changed&&doSave&&typeof save==='function')save();
  return changed;
}

/* Corrige dados antigos assim que a versão abre. */
v80RepairSampleAreas(true);

/* Garante a regra após importações e antes de qualquer tabela ser desenhada. */
if(typeof render==='function'){
  const v80RenderPrev=render;
  render=function(){v80RepairSampleAreas(false);return v80RenderPrev.apply(this,arguments)};
}

/* Na edição, AMOSTRAS só pode ser área de um SKU realmente 150 mL. */
if(typeof openItem==='function'){
  const v80OpenItemPrev=openItem;
  openItem=function(item){
    v80RepairSampleAreas(false);
    const out=v80OpenItemPrev.apply(this,arguments);
    try{
      const x=(D||[]).find(z=>z.item===item), sel=document.getElementById('mArea');
      if(x&&sel){
        if(isSampleSku(x)){
          if(![...sel.options].some(o=>norm(o.value)==='AMOSTRAS'))sel.add(new Option('AMOSTRAS','AMOSTRAS'));
          sel.value='AMOSTRAS';
          sel.disabled=true;
          sel.title='Amostras são exclusivamente apresentações de 150 mL.';
        }else{
          [...sel.options].filter(o=>norm(o.value)==='AMOSTRAS').forEach(o=>o.remove());
          sel.disabled=false;
          if(norm(sel.value)==='AMOSTRAS')sel.value=v80MasterLine(x.produto)||'';
        }
      }
    }catch(e){console.error(e)}
    return out;
  };
}

/* Reaplica após carregamento completo, sem duplicar registros. */
setTimeout(()=>{try{if(v80RepairSampleAreas(true)&&typeof render==='function')render();}catch(e){console.error(e)}},0);
})();

// ============================================================================
// Patch Block #35 [id="v81-amostras-revisao-geral"]
// ============================================================================
(function(){
'use strict';
/* V81 — revisão geral da classificação de AMOSTRAS.
   Regra absoluta: somente apresentação 150 mL pode pertencer à área AMOSTRAS.
   Para produtos normais, inclusive BOL/Exportação, recupera a área do cadastro-base/SEED. */
function v81Explicit150(x){
  if(!x)return false;
  const ap=String(x.ap||'').toUpperCase().replace(',','.').replace(/\s+/g,'');
  const item=String(x.item||'').toUpperCase().replace(',','.').replace(/\s+/g,'');
  return ap==='150ML'||ap==='150'||ap==='0.15L'||ap==='0.150L'||item.includes('150ML');
}
function v81BaseName(product){
  return String(product||'').replace(/\s*\(BOL\)\s*$/i,'').trim();
}
function v81SeedLine(product){
  const key=norm(product||''),base=norm(v81BaseName(product));
  let rows=[];
  try{rows=(SEED||[]).filter(x=>!v81Explicit150(x)&&(norm(x.produto||'')===key||norm(x.produto||'')===base)&&norm(x.linha||'')!=='AMOSTRAS')}catch(e){}
  if(!rows.length)return '';
  const counts={};rows.forEach(x=>{let l=String(x.linha||'').trim();if(l)counts[l]=(counts[l]||0)+1});
  return Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0]||'';
}
function v81MasterLine(product){
  let line=v81SeedLine(product);if(line)return line;
  const key=norm(product||''),base=norm(v81BaseName(product));
  try{
    let p=(PACKAGING_MASTER||[]).find(x=>norm(x.product||'')===key)||(PACKAGING_MASTER||[]).find(x=>norm(x.product||'')===base);
    if(p&&p.line&&norm(p.line)!=='AMOSTRAS')return String(p.line).trim();
  }catch(e){}
  try{
    let p=(PROD_FORMULA||[]).find(x=>norm(x.product||'')===key)||(PROD_FORMULA||[]).find(x=>norm(x.product||'')===base);
    if(p&&p.line&&norm(p.line)!=='AMOSTRAS')return String(p.line).trim();
  }catch(e){}
  try{
    let d=(D||[]).find(x=>!v81Explicit150(x)&&norm(x.produto||'')===key&&norm(x.linha||'')!=='AMOSTRAS');
    if(d)return String(d.linha||'').trim();
  }catch(e){}
  return '';
}
function v81ProductArea(product){
  const pk=norm(product||'');
  const override=String((OPS.v63AreaOverrides||{})[pk]||(OPS.areaOverrides||{})[pk]||'').trim();
  if(override&&norm(override)!=='AMOSTRAS')return override;
  return v81MasterLine(product)||'';
}
function v81RepairAllSampleAreas(saveNow=true){
  OPS.areaOverrides=OPS.areaOverrides||{};OPS.v63AreaOverrides=OPS.v63AreaOverrides||{};
  let changed=0;
  const products=[...new Set((D||[]).map(x=>String(x.produto||'').trim()).filter(Boolean))];
  products.forEach(product=>{
    const rows=(D||[]).filter(x=>norm(x.produto||'')===norm(product));
    const hasMain=rows.some(x=>!v81Explicit150(x));
    if(!hasMain)return;
    const pk=norm(product),master=v81MasterLine(product);
    if(!master||norm(master)==='AMOSTRAS')return;
    if(norm(OPS.areaOverrides[pk]||'')==='AMOSTRAS'){OPS.areaOverrides[pk]=master;changed++}
    if(norm(OPS.v63AreaOverrides[pk]||'')==='AMOSTRAS'){OPS.v63AreaOverrides[pk]=master;changed++}
    rows.forEach(x=>{
      if(v81Explicit150(x)){
        if(norm(x.linha||'')!=='AMOSTRAS'){x.linha='AMOSTRAS';changed++}
        if(String(x.ap||'').trim()!=='150 ML'){x.ap='150 ML';changed++}
      }else if(norm(x.linha||'')==='AMOSTRAS'){
        x.linha=master;changed++;
      }
    });
  });
  /* Qualquer 150 mL continua sendo amostra, mesmo se for de BOL/exportação. */
  (D||[]).forEach(x=>{if(v81Explicit150(x)&&norm(x.linha||'')!=='AMOSTRAS'){x.linha='AMOSTRAS';changed++}});
  OPS.v81SampleAudit={at:new Date().toLocaleString('pt-BR'),corrected:changed};
  if(changed&&saveNow&&typeof save==='function')save();
  return changed;
}
/* Corrige antes de desenhar qualquer tela. */
v81RepairAllSampleAreas(true);

/* Área de batelada nunca será AMOSTRAS para produto normal. */
batchSectorName=function(prod){
  let line=v81ProductArea(prod)||'SEM SETOR';
  if(norm(line)==='AMOSTRAS')line=v81MasterLine(prod)||'SEM SETOR';
  if(line==='MAPA AGRÍCOLA FERTILIZANTES')return'FERTILIZANTES';
  if(line==='MAPA AGRÍCOLA ADJUVANTES')return'ADJUVANTES';
  return line||'SEM SETOR';
};

/* O render faz uma auditoria leve para corrigir backups antigos também. */
if(typeof render==='function'){
  const v81RenderPrev=render;
  render=function(){v81RepairAllSampleAreas(false);return v81RenderPrev.apply(this,arguments)};
}
if(typeof renderBatches==='function'){
  const v81RenderBatchesPrev=renderBatches;
  renderBatches=function(){v81RepairAllSampleAreas(false);return v81RenderBatchesPrev.apply(this,arguments)};
}

/* Na edição, bloqueia AMOSTRAS para qualquer apresentação que não seja 150 mL. */
if(typeof openItem==='function'){
  const v81OpenItemPrev=openItem;
  openItem=function(item){
    v81RepairAllSampleAreas(false);
    const r=v81OpenItemPrev.apply(this,arguments);
    try{
      const x=(D||[]).find(z=>z.item===item),sel=document.getElementById('mArea');
      if(x&&sel){
        if(v81Explicit150(x)){
          if(![...sel.options].some(o=>norm(o.value)==='AMOSTRAS'))sel.add(new Option('AMOSTRAS','AMOSTRAS'));
          sel.value='AMOSTRAS';sel.disabled=true;
        }else{
          [...sel.options].filter(o=>norm(o.value)==='AMOSTRAS').forEach(o=>o.remove());
          sel.disabled=false;
          const area=v81ProductArea(x.produto);if(area)sel.value=area;
        }
      }
    }catch(e){console.error('V81 openItem',e)}
    return r;
  };
}

/* Casos BOL atuais: todos são produtos normais, não amostras. */
['Surfa Drop Acelera Fix (BOL)','Surfa Drop Control (BOL)','Tec Clean Tank (BOL)','Surfa Drop Foam Off (BOL)','Surfa Drop D-Lemon (BOL)'].forEach(p=>{
  const line=v81MasterLine(p)||'MAPA AGRÍCOLA ADJUVANTES';
  (D||[]).filter(x=>norm(x.produto||'')===norm(p)&&!v81Explicit150(x)).forEach(x=>x.linha=line);
  const pk=norm(p);if(norm((OPS.areaOverrides||{})[pk]||'')==='AMOSTRAS')OPS.areaOverrides[pk]=line;if(norm((OPS.v63AreaOverrides||{})[pk]||'')==='AMOSTRAS')OPS.v63AreaOverrides[pk]=line;
});
try{save();render();renderBatches();}catch(e){console.error('V81 final',e)}
})();

// ============================================================================
// Patch Block #36 [id="v83-weekly-mobile-script"]
// ============================================================================
(function(){
'use strict';
async function v83DownloadWeeklyPng(){
  const sec=document.getElementById('semanal');
  if(!sec){alert('Programação semanal não encontrada.');return}
  if(typeof html2canvas!=='function'){alert('O gerador de imagem não carregou. Abra o sistema com internet e tente novamente.');return}
  if(typeof v55EnsureExportHeader==='function')v55EnsureExportHeader();
  const old={w:sec.style.width,max:sec.style.maxWidth,min:sec.style.minWidth};
  sec.style.width='1040px';sec.style.maxWidth='1040px';sec.style.minWidth='1040px';
  sec.classList.add('v55-exporting','v83-exporting');
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  try{
    const canvas=await html2canvas(sec,{backgroundColor:'#ffffff',scale:2,useCORS:true,logging:false,windowWidth:1080,scrollX:0,scrollY:0});
    const week=document.getElementById('weekSelect')?.value||((window.OPS&&OPS.week)||'semana');
    const a=document.createElement('a');a.download=`Programacao_Semanal_CTEC_${week}.png`;a.href=canvas.toDataURL('image/png');document.body.appendChild(a);a.click();a.remove();
  }catch(e){console.error(e);alert('Não foi possível gerar a imagem semanal.');}
  finally{
    sec.classList.remove('v83-exporting','v55-exporting');
    sec.style.width=old.w;sec.style.maxWidth=old.max;sec.style.minWidth=old.min;
  }
}
window.downloadWeeklyPng=v83DownloadWeeklyPng;
function wire(){const b=document.getElementById('weekSharePng');if(b)b.onclick=v83DownloadWeeklyPng;}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
setTimeout(wire,0);
})();

// ============================================================================
// Patch Block #37 [id="v84-logo-export-script"]
// ============================================================================
(function(){
'use strict';
async function v84EnsureHeaderLogo(){
  const sec=document.getElementById('semanal');
  if(!sec)return;
  if(typeof v55EnsureExportHeader==='function')v55EnsureExportHeader();
  let header=document.getElementById('v55ExportHeader');
  if(!header){
    header=document.createElement('div');header.id='v55ExportHeader';sec.insertBefore(header,sec.firstChild);
    header.innerHTML='<div class="brand"><img alt="Grupo C-TEC"><div><h2>PROGRAMAÇÃO SEMANAL DE PRODUÇÃO</h2><p>Mesma tabela utilizada para operação e acompanhamento.</p></div></div><div class="meta"></div>';
  }
  let brand=header.querySelector('.brand');
  if(!brand){brand=document.createElement('div');brand.className='brand';header.prepend(brand)}
  let logo=brand.querySelector('img');
  if(!logo){logo=document.createElement('img');logo.alt='Grupo C-TEC';brand.prepend(logo)}
  const original=document.querySelector('aside .logo img');
  if(original&&original.src)logo.src=original.src;
  let meta=header.querySelector('.meta');
  if(!meta){meta=document.createElement('div');meta.className='meta';header.appendChild(meta)}
  if(typeof v55WeekPeriod==='function')meta.innerHTML='<b>'+v55WeekPeriod()+'</b><br>Gerado em '+new Date().toLocaleString('pt-BR');
  try{if(logo.decode)await logo.decode()}catch(e){}
  if(!logo.complete)await new Promise(r=>{logo.onload=logo.onerror=()=>r()});
}
async function v84DownloadWeeklyPng(){
  const sec=document.getElementById('semanal');
  if(!sec){alert('Programação semanal não encontrada.');return}
  if(typeof html2canvas!=='function'){alert('O gerador de imagem não carregou. Abra o sistema com internet e tente novamente.');return}
  await v84EnsureHeaderLogo();
  const prevWidth=sec.style.width,prevMax=sec.style.maxWidth,prevMin=sec.style.minWidth;
  sec.style.width='1040px';sec.style.maxWidth='1040px';sec.style.minWidth='1040px';
  sec.classList.add('v55-exporting','v83-exporting','v84-exporting');
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  try{
    const week=document.getElementById('weekSelect')?.value||(window.OPS&&OPS.week)||'semana';
    const canvas=await html2canvas(sec,{backgroundColor:'#ffffff',scale:2.15,useCORS:true,allowTaint:true,logging:false,windowWidth:1080,scrollX:0,scrollY:0});
    const a=document.createElement('a');a.download=`Programacao_Semanal_CTEC_${week}.png`;a.href=canvas.toDataURL('image/png');document.body.appendChild(a);a.click();a.remove();
  }catch(err){console.error(err);alert('Não foi possível gerar a imagem semanal.')}
  finally{
    sec.classList.remove('v84-exporting','v83-exporting','v55-exporting');
    sec.style.width=prevWidth;sec.style.maxWidth=prevMax;sec.style.minWidth=prevMin;
  }
}
window.downloadWeeklyPng=v84DownloadWeeklyPng;
function v84Wire(){const b=document.getElementById('weekSharePng');if(b)b.onclick=v84DownloadWeeklyPng}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v84Wire);else v84Wire();
setTimeout(v84Wire,0);
})();

// ============================================================================
// Patch Block #38 [id="v85-mrp-performance-script"]
// ============================================================================
(function(){
'use strict';
/*
V85 — Regras distintas de compras + otimização leve
BOMBONAS: permanece V73 = A Fazer + semana selecionada SEM LOTE.
MATÉRIAS-PRIMAS / MRP: considera TODA batelada ainda não apontada,
independentemente de lote/data: A Fazer, Em Fila, Produção, Análise e Envase.
Somente Apontamento/Finalizada deixa de consumir no MRP.
*/
function v85Stage(b){
  try{return String(stageOfBatch(b)||'').trim()}catch(e){return String(b?.stage||'').trim()}
}
function v85MrpOpen(b){
  if(!b)return false;
  const st=v85Stage(b), status=String(b.status||'').trim();
  if(status==='Finalizada'||st==='Apontamento')return false;
  const kg=Number(effectiveBatchKg(b));
  return Number.isFinite(kg)&&kg>0;
}
/* Regra do MRP deliberadamente independente de lote e da semana selecionada. */
mrpBatchSelection=function(){
  return (MPS.batches||[]).filter(v85MrpOpen);
};
function v85SetupMrpUI(){
  const mf=document.getElementById('mrpBatchFilter');
  if(mf){
    mf.innerHTML='<option value="OPEN">Todas em aberto — A Fazer até Envase</option>';
    mf.value='OPEN';
    mf.disabled=true;
    mf.title='O MRP considera todas as bateladas não apontadas, com ou sem lote.';
  }
  const mrp=document.getElementById('mrp');
  if(!mrp)return;
  const base=mrp.querySelector('.mrp-note');
  if(base)base.innerHTML='<b>Regra do MRP de Compras:</b> Estoque atual − necessidade de <b>todas as bateladas não apontadas</b> = saldo projetado. Entram no cálculo: <b>A Fazer, Em Fila, Produção, Análise e Envase</b>, com ou sem lote. A batelada só deixa o MRP quando for marcada como <b>Apontamento</b> / Finalizada.';
  let n=mrp.querySelector('.v73-purchase-rule');
  if(!n){
    n=document.createElement('div');n.className='notice v73-purchase-rule v85-mrp-rule';
    const tb=mrp.querySelector('.toolbar');if(tb)tb.insertAdjacentElement('afterend',n);
  }
  if(n){
    n.classList.add('v85-mrp-rule');
    n.innerHTML='<b>Matérias-primas usam uma regra diferente das bombonas:</b> o lote <b>não retira</b> a batelada do MRP. Enquanto estiver A Fazer, Em Fila, Produção, Análise ou Envase, seu consumo continua comprometido. Somente após <b>Apontamento</b> ela sai da soma.';
  }
}
/* V73 redesenha o texto do MRP; esta camada reaplica a regra correta após cada render. */
if(typeof renderMRP==='function'){
  const v85RenderMrpPrev=renderMRP;
  renderMRP=function(){
    const r=v85RenderMrpPrev.apply(this,arguments);
    v85SetupMrpUI();
    return r;
  };
}
/* Bombonas permanecem exatamente com a regra sem lote; apenas restauramos o texto do MRP
   caso o render de Bombonas tenha acionado a rotina antiga de interface. */
if(typeof renderBombonas==='function'){
  const v85RenderBombPrev=renderBombonas;
  renderBombonas=function(){
    const r=v85RenderBombPrev.apply(this,arguments);
    v85SetupMrpUI();
    return r;
  };
}
/*
Performance: havia várias camadas históricas de setWeeklyStage, cada uma redesenhando
os mesmos módulos repetidamente. A versão final passa a atualizar o estado uma única vez.
Os demais painéis se recalculam normalmente ao serem abertos pelo menu.
*/
window.setWeeklyStage=function(id,stage){
  const b=(MPS.batches||[]).find(x=>x.id===id);if(!b)return;
  b.stage=stage;
  if(stage==='Apontamento')b.status='Finalizada';
  else if(['Produção','Análise','Envase'].includes(stage))b.status='Em produção';
  else if(stage==='Em Fila')b.status='Programada';
  else if(stage==='A fazer')b.status='A fazer';
  b.updatedAt=Date.now();
  save();
  /* O clique acontece na Programação Semanal: redesenha só o que está visível. */
  try{renderWeekly()}catch(e){console.error('V85 semanal',e)}
};
/* Pequeno debounce nos campos de busca para evitar reconstruir tabelas a cada tecla. */
function v85Debounce(fn,wait){let t;return function(){const a=arguments,c=this;clearTimeout(t);t=setTimeout(()=>fn.apply(c,a),wait)}}
function v85WireSearch(id,fn,wait=110){const el=document.getElementById(id);if(el&&typeof fn==='function')el.oninput=v85Debounce(fn,wait)}
function v85Wire(){
  v85SetupMrpUI();
  v85WireSearch('q',()=>render(),120);
  v85WireSearch('q2',()=>render(),120);
  v85WireSearch('pq',()=>renderPendencias(),110);
  v85WireSearch('mpsQ',()=>renderMPS(),110);
  v85WireSearch('batchNameFilter',()=>renderBatches(),110);
  v85WireSearch('matQ',()=>renderMaterials(),110);
  v85WireSearch('mrpQ',()=>renderMRP(),110);
  v85WireSearch('engQ',()=>renderEngineering(),110);
  v85WireSearch('engProdQ',()=>renderEngineering(),110);
  v85WireSearch('engPackQ',()=>renderEngineering(),110);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v85Wire);else v85Wire();
setTimeout(v85Wire,0);
try{v85SetupMrpUI()}catch(e){console.error('V85 UI',e)}
})();

// ============================================================================
// Patch Block #39 [id="v86-crop-batch-fix-script"]
// ============================================================================
(function(){
'use strict';
/*
V86
1) Todo produto da marca C-TEC CROP, quando produzido em 5 L, consome
   bombona BRANCA Modelo B. A regra também vale para variantes (BOL),
   utilizando o cadastro-base do produto.
2) A edição de bateladas passa a abrir diretamente com a distribuição
   já salva e mantém as quantidades ao alterar a data.
*/

/* ---------- EMBALAGENS CROP ---------- */
const v86PackMasterPrev=packMaster;
packMaster=function(product){
  let hit=v86PackMasterPrev(product);
  if(hit)return hit;
  /* BOL é SKU comercial separado, mas usa a embalagem do produto-base. */
  const raw=String(product||'').trim();
  const base=raw.replace(/\s*\(BOL\)\s*$/i,'').replace(/\s+BOL\s*$/i,'').trim();
  if(base && norm(base)!==norm(raw)){
    hit=v86PackMasterPrev(base);
    if(hit)return hit;
  }
  return null;
};

const v86PackagingSpecPrev=packagingSpec;
packagingSpec=function(product,ap){
  const p=packMaster(product),a=apInfo(ap);
  if(p && a.kind==='L' && Number(a.liters)===5 && norm(p.brand||'').includes('C-TEC CROP')){
    return {size:5,color:'BRANCA',model:'B',brand:p.brand||'C-TEC CROP',note:p.note||''};
  }
  return v86PackagingSpecPrev(product,ap);
};

function v86SetupBombonaRule(){
  const sec=document.getElementById('bombonas');if(!sec)return;
  let n=sec.querySelector('.v86-crop-rule');
  if(!n){
    n=document.createElement('div');n.className='notice v86-crop-rule';
    const tb=sec.querySelector('.toolbar');
    if(tb)tb.insertAdjacentElement('afterend',n);
  }
  if(n)n.innerHTML='<b>Regra CROP 5L:</b> todos os produtos da marca C-TEC CROP utilizam bombona <b>BRANCA • Modelo B</b>. A necessidade é somada automaticamente no pedido, inclusive para variantes BOL vinculadas ao produto-base.';
}
if(typeof renderBombonas==='function'){
  const v86RenderBombPrev=renderBombonas;
  renderBombonas=function(){
    const r=v86RenderBombPrev.apply(this,arguments);
    v86SetupBombonaRule();
    return r;
  };
}

/* ---------- EDIÇÃO DE BATELADAS ---------- */
function v86ProductList(){
  try{if(typeof v74AllProductNames==='function')return v74AllProductNames()}catch(e){}
  try{if(typeof v47CreationProductOptions==='function')return v47CreationProductOptions()}catch(e){}
  try{return batchProductOptions()}catch(e){return[]}
}
function v86SavedApKey(item){
  const x=(D||[]).find(z=>z.item===item) || (D||[]).find(z=>norm(z.item||'')===norm(item||''));
  if(x)return apInfo(x.ap||x.item||'').key;
  return apInfo(item||'').key;
}
function v86ReconcileDist(b,prod){
  const saved=(b&&b.dist&&typeof b.dist==='object')?b.dist:{};
  const byAp={};
  Object.entries(saved).forEach(([item,d])=>{
    const key=v86SavedApKey(item);
    if(!key)return;
    if(!byAp[key])byAp[key]={mto:0,mts:0};
    byAp[key].mto+=(N(d?.mto)||0);
    byAp[key].mts+=(N(d?.mts)||0);
  });
  const out={};
  (productSkus(prod)||[]).forEach(x=>{
    const exact=saved[x.item];
    const key=apInfo(x.ap||x.item||'').key;
    const d=exact||byAp[key];
    if(d)out[x.item]={mto:N(d.mto)||0,mts:N(d.mts)||0};
  });
  return out;
}
function v86Meta(b,prod){
  const meta=document.getElementById('batchCreatedMeta');if(!meta)return;
  let extra='';
  try{if(typeof v48IsContractProduct==='function'&&v48IsContractProduct(prod))extra=' • <b>MARCA TERCEIRIZADA</b>'}catch(e){}
  if(b?.created){
    meta.innerHTML=`Criada em ${escHtml(b.created)}${b.updatedAt&&b.createdAt&&b.updatedAt!==b.createdAt?` • última alteração ${new Date(b.updatedAt).toLocaleString('pt-BR')}`:''}${extra}`;
  }else meta.innerHTML=extra?'<b>Marca terceirizada • fabricação interna.</b>':'A data de criação será registrada automaticamente.';
}

/* Substitui a cadeia histórica de wrappers por uma abertura única e estável. */
openBatch=function(id=null){
  editingBatchId=id;
  const b=id?(MPS.batches||[]).find(z=>z.id===id):null;
  let prods=v86ProductList();
  if(b?.produto && !prods.some(p=>norm(p)===norm(b.produto)))prods=[b.produto,...prods];
  const sel=document.getElementById('batchProduct');if(!sel)return;
  sel.innerHTML=prods.map(p=>`<option value="${escHtml(p)}">${escHtml(typeof v47OptionLabel==='function'?v47OptionLabel(p):p)}</option>`).join('');
  const current=b?.produto||prods[0]||'';
  const hit=prods.find(p=>norm(p)===norm(current))||current;
  sel.value=hit;sel.disabled=!!b;

  $('batchTitle').textContent=b?'Editar batelada':'Nova batelada a fazer';
  $('batchDate').value=b?.date||'';
  $('batchStatus').value=b?.status||'A fazer';
  $('batchStage').value=b?.stage||'A fazer';
  $('batchSop').value=b?.sop||'AUTO';
  $('batchLot').value=b?.lot||'';
  $('batchPriority').value=b?.priority||'Normal';
  $('batchObs').value=b?.obs||'';

  const dens=productDensity(sel.value,b);$('batchDensity').value=dens??'';
  updateBatchTankOptions(b?.tank||'');
  const stableDist=b?v86ReconcileDist(b,sel.value):{};
  renderBatchDist({...(b||{}),produto:sel.value,dist:stableDist});

  const saved=N(b?.productionKg),legacy=N(b?.kg);
  $('batchKg').value=b?(saved!==null&&saved>0?saved:(legacy!==null&&legacy>0?legacy:'')):'';
  $('batchKg').readOnly=false;
  v86Meta(b,sel.value);
  try{refreshBatchCalc()}catch(e){}
  $('batchDlg').showModal();
};

function v86RenderKeepingCurrent(){
  const dist=currentDialogDist();
  const prod=$('batchProduct').value;
  renderBatchDist({produto:prod,dist});
  try{refreshBatchCalc()}catch(e){}
}
/* A mudança de data não pode mais zerar/recriar a distribuição salva. */
if($('batchDate'))$('batchDate').onchange=v86RenderKeepingCurrent;
/* Troca de produto só existe em uma nova batelada; nesse caso inicia distribuição vazia. */
if($('batchProduct'))$('batchProduct').onchange=()=>{
  const prod=$('batchProduct').value,d=productDensity(prod);
  $('batchDensity').value=d??'';updateBatchTankOptions('');
  renderBatchDist({produto:prod,dist:{}});
  $('batchKg').value='';$('batchKg').readOnly=false;
  v86Meta(null,prod);
  try{refreshBatchCalc()}catch(e){}
};

function v86Wire(){
  v86SetupBombonaRule();
  if($('batchDate'))$('batchDate').onchange=v86RenderKeepingCurrent;
  try{renderBombonas()}catch(e){console.error('V86 bombonas',e)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v86Wire);else v86Wire();
setTimeout(v86Wire,0);
})();

// ============================================================================
// Patch Block #40 [id="v87-active-film-plus-fix-script"]
// ============================================================================
(function(){
'use strict';
/* V87 — ACTIVE FILM foi substituído por ACTIVE FILM PLUS.
   - ACTIVE FILM deixa de aparecer para novas bateladas/PMP.
   - Registros antigos de bateladas/PMP são migrados para ACTIVE FILM PLUS.
   - MRP usa sempre a fórmula ACTIVE FILM PLUS para essa substituição. */
const V87_OLD='Active Film';
const V87_NEW='Active Film Plus';
function v87IsOld(v){return norm(String(v||''))===norm(V87_OLD)}
function v87IsNew(v){return norm(String(v||''))===norm(V87_NEW)}
function v87Canonical(v){return v87IsOld(v)?V87_NEW:String(v||'').trim()}
function v87UniqueProducts(list){
  const m=new Map();
  (list||[]).forEach(v=>{
    const p=v87Canonical(v);if(!p)return;
    const k=norm(p);if(!m.has(k))m.set(k,p);
  });
  if(!m.has(norm(V87_NEW)))m.set(norm(V87_NEW),V87_NEW);
  m.delete(norm(V87_OLD));
  return [...m.values()].sort((a,b)=>a.localeCompare(b,'pt-BR',{sensitivity:'base'}));
}
function v87MergeMasterPlan(store){
  if(!store||typeof store!=='object')return false;
  const oldKey=Object.keys(store).find(k=>v87IsOld(k));
  if(!oldKey)return false;
  const newKey=Object.keys(store).find(k=>v87IsNew(k));
  const old=store[oldKey]||{};
  if(!newKey){store[V87_NEW]=old}
  else{
    const cur=store[newKey]||{};
    if(!(Number(cur.tanks)>0) && Number(old.tanks)>0)cur.tanks=old.tanks;
    if(!(Number(cur.weight)>0) && Number(old.weight)>0)cur.weight=old.weight;
    if(!String(cur.note||'').trim() && String(old.note||'').trim())cur.note=old.note;
    store[newKey]=cur;
  }
  delete store[oldKey];
  return true;
}
function v87MigrateState(){
  let changed=false;
  (MPS?.batches||[]).forEach(b=>{
    if(v87IsOld(b?.produto)){
      b.produto=V87_NEW;
      b.updatedAt=Date.now();
      changed=true;
    }
  });
  if(MPS?.masterPlans){Object.values(MPS.masterPlans).forEach(x=>{if(v87MergeMasterPlan(x))changed=true})}
  /* O cadastro estático antigo continua apenas como histórico técnico, não como produto ativo. */
  try{
    (PROD_FORMULA||[]).forEach(x=>{
      if(v87IsOld(x.product)){
        x.active=false;x.relation='DESCONTINUADO';x.formula='';
        x.note='Produto substituído por ACTIVE FILM PLUS.';
      }
    });
  }catch(e){}
  try{
    OPS.formulaLinks=OPS.formulaLinks||{};
    Object.keys(OPS.formulaLinks).forEach(k=>{
      const x=OPS.formulaLinks[k];
      if(v87IsOld(x?.product)||norm(k)===norm(V87_OLD)){delete OPS.formulaLinks[k];changed=true}
    });
  }catch(e){}
  return changed;
}

/* Catálogo de criação/PMP: nunca oferece ACTIVE FILM; garante ACTIVE FILM PLUS. */
if(typeof batchProductOptions==='function'){
  const v87BatchOptionsPrev=batchProductOptions;
  batchProductOptions=function(){return v87UniqueProducts(v87BatchOptionsPrev.apply(this,arguments))};
}
if(typeof v47CreationProductOptions==='function'){
  const v87CreateOptionsPrev=v47CreationProductOptions;
  v47CreationProductOptions=function(){return v87UniqueProducts(v87CreateOptionsPrev.apply(this,arguments))};
}

/* Compatibilidade com registros antigos que ainda cheguem com o nome anterior. */
if(typeof productSkus==='function'){
  const v87ProductSkusPrev=productSkus;
  productSkus=function(product){return v87ProductSkusPrev.call(this,v87Canonical(product))};
}
if(typeof productFormulaLink==='function'){
  const v87FormulaPrev=productFormulaLink;
  productFormulaLink=function(product){
    const p=v87Canonical(product);
    const hit=v87FormulaPrev.call(this,p);
    if(hit)return hit;
    if(v87IsNew(p))return {product:V87_NEW,formula:'ACTIVE FILM PLUS',relation:'BASE',note:'',active:true,line:'MAPA VETERINÁRIO'};
    return null;
  };
}

/* Se um backup antigo for restaurado, aplica novamente a substituição. */
if(typeof restoreBackup==='function'){
  const v87RestorePrev=restoreBackup;
  restoreBackup=async function(){
    const r=await v87RestorePrev.apply(this,arguments);
    const changed=v87MigrateState();
    if(changed)try{save()}catch(e){}
    try{renderMPS();renderBatches();renderMRP();renderWeekly();renderBombonas()}catch(e){console.error('V87 restore',e)}
    return r;
  };
}

/* Garante migração antes de abrir qualquer batelada. */
if(typeof openBatch==='function'){
  const v87OpenBatchPrev=openBatch;
  openBatch=function(id=null){
    if(v87MigrateState())try{save()}catch(e){}
    return v87OpenBatchPrev.call(this,id);
  };
}

const v87Changed=v87MigrateState();
if(v87Changed)try{save()}catch(e){}
try{renderMPS();renderBatches();renderMRP()}catch(e){console.error('V87 Active Film Plus',e)}
})();

// ============================================================================
// Patch Block #41 [id="v89-final-guard"]
// ============================================================================
(function(){
'use strict';
function v89Guard(){
  try{
    document.querySelectorAll('.wrap>section.panel').forEach((p,i)=>{if(!document.querySelector('.wrap>section.panel.active')&&i===0)p.classList.add('active')});
    const mv=document.getElementById('mrpView');if(mv&&mv.value==='ALL')mv.value='PLAN';
    document.querySelectorAll('.v89-note').forEach(x=>x.remove());
    if(MP&&MP.v89NeedsReimport){
      const host=document.getElementById('materiais')||document.getElementById('mrp');
      const hero=host?.querySelector('.hero');if(hero){const n=document.createElement('div');n.className='notice v89-note';n.innerHTML='<b>V89 corrigiu os dados antigos do MRP.</b> Importe novamente o PDF POSIÇÃO DE ESTOQUE — CG02296 para trazer o saldo mais recente.';hero.insertAdjacentElement('afterend',n)}
    }
  }catch(e){console.error('V89 guard',e)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v89Guard);else v89Guard();
setTimeout(v89Guard,0);
})();
