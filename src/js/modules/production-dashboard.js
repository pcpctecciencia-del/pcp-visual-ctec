/**
 * Modulo de Dashboard Executivo de Producao (Multi-Anos Dinamico, Comparativos, Metas, Ritmo Diario e Rastreabilidade)
 */
const DEFAULT_WORKDAYS_12 = [22, 20, 22, 22, 21, 22, 23, 21, 22, 22, 21, 23];

function prodDashState(){
  OPS.prodDashboard = OPS.prodDashboard || {};
  let s = OPS.prodDashboard;

  // Compatibilidade legada 2026
  if (!Array.isArray(s.production2026) || s.production2026.length !== 12) s.production2026 = [...PROD_EXEC_SEED.production[2026]];
  if (!Array.isArray(s.sales2026) || s.sales2026.length !== 12) s.sales2026 = [...PROD_EXEC_SEED.sales[2026]];
  if (!Array.isArray(s.days2026) || s.days2026.length !== 12) s.days2026 = [...PROD_EXEC_SEED.days2026];
  if (N(s.targetSales) === null) s.targetSales = PROD_EXEC_SEED.targetSales2026;
  if (N(s.targetProduction) === null) s.targetProduction = PROD_EXEC_SEED.targetProduction2026;
  if (N(s.baseProduction2025) === null) s.baseProduction2025 = PROD_EXEC_SEED.production2025Total;
  if (s.note === undefined) s.note = '';

  // Estrutura Multi-Anos (2024, 2025, 2026, 2027...)
  s.years = s.years || {};

  // Garantir 2024
  if (!s.years['2024']) {
    let p24 = [...(PROD_EXEC_SEED.production[2024] || Array(12).fill(0))];
    let v24 = [...(PROD_EXEC_SEED.sales[2024] || Array(12).fill(0))];
    s.years['2024'] = {
      production: p24,
      sales: v24,
      days: [...DEFAULT_WORKDAYS_12],
      targetProduction: Number(tonSum(p24).toFixed(2)),
      targetSales: Number(tonSum(v24).toFixed(2)),
      note: 'Histórico consolidado 2024'
    };
  }

  // Garantir 2025
  if (!s.years['2025']) {
    let p25 = [...(PROD_EXEC_SEED.production[2025] || Array(12).fill(0))];
    let v25 = [...(PROD_EXEC_SEED.sales[2025] || Array(12).fill(0))];
    s.years['2025'] = {
      production: p25,
      sales: v25,
      days: [...DEFAULT_WORKDAYS_12],
      targetProduction: Number(s.baseProduction2025 || tonSum(p25).toFixed(2)),
      targetSales: Number(tonSum(v25).toFixed(2)),
      note: 'Histórico consolidado 2025'
    };
  }

  // Garantir 2026 (sincronizado com os campos legados para nao perder nenhuma edicao ja feita)
  if (!s.years['2026']) {
    s.years['2026'] = {
      production: [...s.production2026],
      sales: [...s.sales2026],
      days: [...s.days2026],
      targetProduction: Number(s.targetProduction) || PROD_EXEC_SEED.targetProduction2026,
      targetSales: Number(s.targetSales) || PROD_EXEC_SEED.targetSales2026,
      note: s.note || ''
    };
  } else {
    // Manter 2026 e campos legados espelhados
    if (!Array.isArray(s.years['2026'].production) || s.years['2026'].production.length !== 12) s.years['2026'].production = [...s.production2026];
    if (!Array.isArray(s.years['2026'].sales) || s.years['2026'].sales.length !== 12) s.years['2026'].sales = [...s.sales2026];
    if (!Array.isArray(s.years['2026'].days) || s.years['2026'].days.length !== 12) s.years['2026'].days = [...s.days2026];
  }

  // Garantir 2027 ja disponivel para planejamento futuro
  if (!s.years['2027']) {
    s.years['2027'] = {
      production: Array(12).fill(0),
      sales: Array(12).fill(0),
      days: [...DEFAULT_WORKDAYS_12],
      targetProduction: Number(s.years['2026'].targetProduction || PROD_EXEC_SEED.targetProduction2026),
      targetSales: Number(s.years['2026'].targetSales || PROD_EXEC_SEED.targetSales2026),
      note: 'Planejamento anual 2027'
    };
  }

  // Sanitizar todos os anos cadastrados
  Object.keys(s.years).forEach(yr => {
    let yObj = s.years[yr];
    if (!Array.isArray(yObj.production) || yObj.production.length !== 12) yObj.production = Array(12).fill(0);
    if (!Array.isArray(yObj.sales) || yObj.sales.length !== 12) yObj.sales = Array(12).fill(0);
    if (!Array.isArray(yObj.days) || yObj.days.length !== 12) yObj.days = [...DEFAULT_WORKDAYS_12];
    if (N(yObj.targetProduction) === null) yObj.targetProduction = PROD_EXEC_SEED.targetProduction2026;
    if (N(yObj.targetSales) === null) yObj.targetSales = PROD_EXEC_SEED.targetSales2026;
    if (yObj.note === undefined) yObj.note = '';
  });

  if (!s.activeYear || !s.years[s.activeYear]) s.activeYear = '2026';
  if (!s.refYear || !s.years[s.refYear]) {
    let prev = String(Number(s.activeYear) - 1);
    s.refYear = s.years[prev] ? prev : Object.keys(s.years).sort()[0];
  }
  if (!s.compareMetric) s.compareMetric = 'production'; // 'production' ou 'sales'

  return s;
}

function syncLegacy2026(s){
  if (s.years && s.years['2026']) {
    s.production2026 = [...s.years['2026'].production];
    s.sales2026 = [...s.years['2026'].sales];
    s.days2026 = [...s.years['2026'].days];
    s.targetProduction = s.years['2026'].targetProduction;
    s.targetSales = s.years['2026'].targetSales;
    s.note = s.years['2026'].note;
  }
}

function saveProdTargets(){
  let s = prodDashState();
  let actYr = s.activeYear;
  let refYr = s.refYear;
  let yAct = s.years[actYr];
  if (yAct) {
    yAct.targetSales = Math.max(0, N($('prodGoalSales')?.value) || 0);
    yAct.targetProduction = Math.max(0, N($('prodGoalProduction')?.value) || 0);
    yAct.note = $('prodDashNote')?.value || '';
  }
  let baseInputVal = N($('prodBaseProduction')?.value);
  if (baseInputVal !== null && baseInputVal >= 0) {
    if (s.years[refYr]) {
      s.years[refYr].customBaseTotal = baseInputVal;
    }
    if (refYr === '2025') {
      s.baseProduction2025 = baseInputVal;
    }
  }
  syncLegacy2026(s);
  save();
  renderProduction();
}
window.saveProdTargets = saveProdTargets;

function addNewExecYear(){
  let s = prodDashState();
  let existing = Object.keys(s.years).map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  let suggested = existing.length ? String(existing.at(-1) + 1) : '2027';
  let input = prompt('Digite o ano que deseja adicionar ou abrir (ex.: 2027, 2028):', suggested);
  if (!input) return;
  let yr = String(input).trim().replace(/\D/g, '');
  if (yr.length !== 4 || Number(yr) < 2020 || Number(yr) > 2050) {
    alert('Informe um ano válido com 4 dígitos (ex.: 2027).');
    return;
  }
  if (!s.years[yr]) {
    let prevYr = String(Number(yr) - 1);
    let prevObj = s.years[prevYr] || s.years[s.activeYear];
    s.years[yr] = {
      production: Array(12).fill(0),
      sales: Array(12).fill(0),
      days: prevObj ? [...prevObj.days] : [...DEFAULT_WORKDAYS_12],
      targetProduction: prevObj ? Number(prevObj.targetProduction || 0) : PROD_EXEC_SEED.targetProduction2026,
      targetSales: prevObj ? Number(prevObj.targetSales || 0) : PROD_EXEC_SEED.targetSales2026,
      note: `Planejamento anual ${yr}`
    };
  }
  s.activeYear = yr;
  let prev = String(Number(yr) - 1);
  if (s.years[prev]) s.refYear = prev;
  save();
  renderProduction();
}

function fmtTon(v, maxDec = 2){
  let d = Math.max(0, Number(maxDec) || 0);
  return (Number(v) || 0).toLocaleString('pt-BR', { minimumFractionDigits: Math.min(1, d), maximumFractionDigits: d }) + ' t';
}

function fmtSignedTon(v){
  let n = Number(v) || 0;
  let sign = n > 0.005 ? '+' : '';
  return sign + n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + ' t';
}

function fmtSignedPct(v){
  let n = Number(v) || 0;
  let sign = n > 0.05 ? '+' : '';
  return sign + n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
}

function tonSum(arr){
  return (arr || []).reduce((a, b) => a + (Number(b) || 0), 0);
}

function pctDelta(base, val){
  if (!base) return 0;
  return (val - base) / base * 100;
}

function pctClass(v){
  return v > 0.05 ? 'delta-pos' : v < -0.05 ? 'delta-neg' : 'delta-zero';
}

function pillDeltaHtml(v, suffix = '%'){
  let n = Number(v) || 0;
  let cls = n > 0.05 ? 'pos' : n < -0.05 ? 'neg' : 'neutral';
  let sign = n > 0.05 ? '+' : '';
  return `<span class="prod-pill ${cls}">${sign}${n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${suffix}</span>`;
}

function buildExecDualRows(labels, a, b, clsA, clsB, formatter, mode = 'balance'){
  let max = Math.max(...labels.map((_, i) => Math.max(Number(a[i]) || 0, Number(b[i]) || 0)), 1);
  return labels.map((lab, i) => {
    let av = Number(a[i]) || 0, bv = Number(b[i]) || 0;
    let hasData = (av > 0 || bv > 0);
    let rightBadge = '<span class="prod-pill neutral">—</span>';
    if (hasData) {
      if (mode === 'balance') {
        let diff = av - bv;
        let cls = diff >= 0 ? 'pos' : 'warn';
        rightBadge = `<span class="prod-pill ${cls}" title="Saldo: Produção - Vendas">${fmtSignedTon(diff)}</span>`;
      } else {
        if (bv > 0 && av > 0) {
          rightBadge = pillDeltaHtml(pctDelta(av, bv), '%');
        } else if (bv === 0) {
          rightBadge = '<span class="prod-pill neutral">Aberto</span>';
        }
      }
    }
    return `<div class="exec-row exec-row-didactic">
      <div class="exec-label"><b>${lab}</b></div>
      <div class="exec-track">
        <span class="exec-bar ${clsA}" style="width:${(av / max * 100).toFixed(2)}%"></span>
        <span class="exec-bar ${clsB}" style="width:${(bv / max * 100).toFixed(2)}%"></span>
      </div>
      <div class="exec-values"><b>${formatter(av)}</b> <span class="muted">/</span> <b>${formatter(bv)}</b></div>
      <div class="exec-delta-col" style="text-align:right">${rightBadge}</div>
    </div>`;
  }).join('');
}

function renderProduction(){
  if (!$('prodBody')) return;
  let state = prodDashState();
  let exec = PROD_EXEC_SEED;
  let monthsLbl = exec.months;

  let allYears = Object.keys(state.years).sort();
  let actYr = state.activeYear;
  let refYr = state.refYear;
  let yAct = state.years[actYr];
  let yRef = state.years[refYr];

  // Popular seletores de Ano Principal e Ano de Referencia no Hero
  if ($('execActiveYear')) {
    $('execActiveYear').innerHTML = allYears.map(y => `<option value="${y}" ${y === actYr ? 'selected' : ''}>${y}</option>`).join('');
    $('execActiveYear').onchange = (e) => {
      let newYr = e.target.value;
      state.activeYear = newYr;
      let prev = String(Number(newYr) - 1);
      if (state.years[prev] && state.refYear === newYr) {
        state.refYear = prev;
      } else if (state.years[prev]) {
        state.refYear = prev;
      }
      if ($('prodYear') && [...$('prodYear').options].some(o => o.value === newYr)) {
        $('prodYear').value = newYr;
      }
      save();
      renderProduction();
    };
  }
  if ($('execRefYear')) {
    $('execRefYear').innerHTML = allYears.map(y => `<option value="${y}" ${y === refYr ? 'selected' : ''}>${y}${y === actYr ? ' (mesmo ano)' : ''}</option>`).join('');
    $('execRefYear').onchange = (e) => {
      state.refYear = e.target.value;
      save();
      renderProduction();
    };
  }
  if ($('execAddYearBtn')) {
    $('execAddYearBtn').onclick = addNewExecYear;
  }

  // Pills rapidos de ano no Hero
  if ($('execYearPills')) {
    $('execYearPills').innerHTML = `<span style="font-size:11px;color:#cbd5e1;margin-right:4px">Acesso rápido aos anos:</span>` +
      allYears.map(y => {
        let pSum = tonSum(state.years[y].production);
        let isAct = y === actYr;
        let isRef = y === refYr && !isAct;
        return `<button type="button" class="prod-year-pill ${isAct ? 'active' : isRef ? 'ref-only' : ''}" data-yr="${y}">
          ${y} • ${fmtTon(pSum, 0)}${isAct ? ' (Em Análise)' : isRef ? ' (Ref.)' : ''}
        </button>`;
      }).join('');
    $('execYearPills').querySelectorAll('button[data-yr]').forEach(btn => {
      btn.onclick = () => {
        let newYr = btn.dataset.yr;
        state.activeYear = newYr;
        let prev = String(Number(newYr) - 1);
        if (state.years[prev] && prev !== newYr) state.refYear = prev;
        if ($('prodYear') && [...$('prodYear').options].some(o => o.value === newYr)) {
          $('prodYear').value = newYr;
        }
        save();
        renderProduction();
      };
    });
  }

  let prodAct = yAct.production.map(v => N(v) || 0);
  let salesAct = yAct.sales.map(v => N(v) || 0);
  let daysAct = yAct.days.map(v => Math.max(0, N(v) || 0));

  let prodRef = yRef.production.map(v => N(v) || 0);
  let salesRef = yRef.sales.map(v => N(v) || 0);

  let salesGoal = N(yAct.targetSales) || 0;
  let prodGoal = N(yAct.targetProduction) || 0;
  let refProdSum = tonSum(prodRef);
  let baseRefTotal = N(yRef.customBaseTotal) !== null && N(yRef.customBaseTotal) > 0
    ? N(yRef.customBaseTotal)
    : (refYr === '2025' ? (N(state.baseProduction2025) || refProdSum) : refProdSum);

  let prodTotal = tonSum(prodAct);
  let salesTotal = tonSum(salesAct);
  let balanceTotal = prodTotal - salesTotal;

  let activeIdxs = monthsLbl.map((_, i) => i).filter(i => prodAct[i] > 0 || salesAct[i] > 0);
  let openIdxs = monthsLbl.map((_, i) => i).filter(i => !(prodAct[i] > 0 || salesAct[i] > 0));
  let activeMonthsCount = activeIdxs.length;
  let remainMonthsCount = openIdxs.length;

  // VINCULO TOTAL DOS DIAS UTEIS DA TABELA COM O CARD SUPERIOR:
  // totalWorkDaysYear = soma exata dos 12 campos "Dias Úteis" da tabela (ex.: 252 dias)
  let totalWorkDaysYear = tonSum(daysAct);
  let workDaysActive = activeIdxs.reduce((a, i) => a + daysAct[i], 0);
  let workDaysRemaining = openIdxs.reduce((a, i) => a + daysAct[i], 0);

  // Media diaria nos dias realizados + media considerando o calendario completo da tabela
  let denomDays = workDaysActive > 0 ? workDaysActive : (totalWorkDaysYear || 1);
  let prodAvg = prodTotal / denomDays;
  let salesAvg = salesTotal / denomDays;
  let prodAvgFullYear = totalWorkDaysYear > 0 ? prodTotal / totalWorkDaysYear : 0;
  let salesAvgFullYear = totalWorkDaysYear > 0 ? salesTotal / totalWorkDaysYear : 0;

  let goalPct = salesGoal ? (salesTotal / salesGoal * 100) : 0;
  let prodGoalPct = prodGoal ? (prodTotal / prodGoal * 100) : 0;

  // Comparativo justo com o Ano de Referencia (mesmos meses realizados e ano completo)
  let refSamePeriod = activeIdxs.reduce((a, i) => a + (Number(prodRef[i]) || 0), 0);
  let prodVsRefSame = refSamePeriod ? pctDelta(refSamePeriod, prodTotal) : 0;
  let prodVsRefFull = baseRefTotal ? pctDelta(baseRefTotal, prodTotal) : 0;

  // Atualizar Titulos Dinamicos dos Cards e Paineis
  if ($('kpiTitleProd')) $('kpiTitleProd').textContent = `Produção Acumulada ${actYr}`;
  if ($('kpiTitleSales')) $('kpiTitleSales').textContent = `Vendas Acumuladas ${actYr}`;
  if ($('kpiTitleBalance')) $('kpiTitleBalance').textContent = `Balanço Prod. − Vendas (${actYr})`;
  if ($('kpiTitleYoy')) $('kpiTitleYoy').textContent = `Evolução Prod. (${actYr} vs ${refYr})`;
  if ($('kpiTitleDaily')) $('kpiTitleDaily').textContent = `Média Diária (${actYr})`;
  if ($('kpiTitlePace')) $('kpiTitlePace').textContent = `Ritmo Necessário p/ Meta ${actYr}`;

  if ($('prodEditPanelTitle')) $('prodEditPanelTitle').textContent = `Planejamento Mensal, Metas e Lançamento de Dados (${actYr} vs ${refYr})`;
  if ($('prodEditPanelTag')) $('prodEditPanelTag').textContent = `Em Análise: ${actYr} • Base: ${refYr}`;
  if ($('lblGoalProd')) $('lblGoalProd').textContent = `Meta anual de produção ${actYr} (t)`;
  if ($('lblGoalSales')) $('lblGoalSales').textContent = `Meta anual de vendas ${actYr} (t)`;
  if ($('lblBaseRef')) $('lblBaseRef').textContent = `Produção anual base ${refYr} (t)`;
  if ($('lblDashNote')) $('lblDashNote').textContent = `Observação / Premissa de ${actYr}`;

  if ($('thRefProd')) $('thRefProd').textContent = `Prod. ${refYr}`;
  if ($('thRefProdSub')) $('thRefProdSub').textContent = `Referência ${refYr} (t)`;
  if ($('thActProd')) $('thActProd').textContent = `Produção ${actYr}`;
  if ($('thYoySub')) $('thYoySub').textContent = `${actYr} vs ${refYr}`;
  if ($('thActSales')) $('thActSales').textContent = `Vendas ${actYr}`;
  if ($('thActDays')) $('thActDays').textContent = `Dias Úteis ${actYr}`;
  if ($('thActGoal')) $('thActGoal').textContent = `Meta Mensal ${actYr}`;

  // 1. Preencher KPIs Executivos Superiores
  if ($('execProdYtd')) $('execProdYtd').textContent = fmtTon(prodTotal);
  if ($('execProdGoalBadge')) {
    $('execProdGoalBadge').textContent = `${prodGoalPct.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% da meta`;
    $('execProdGoalBadge').className = 'prod-kpi-badge ' + (prodGoalPct >= 80 ? 'good' : prodGoalPct >= 50 ? 'info' : 'warn');
  }
  if ($('execProdMeter')) $('execProdMeter').style.width = `${Math.min(100, prodGoalPct).toFixed(1)}%`;
  let prodRem = Math.max(0, prodGoal - prodTotal);
  if ($('execProdHint')) $('execProdHint').textContent = `Meta ${actYr}: ${fmtTon(prodGoal, 1)} • Faltam ${fmtTon(prodRem, 1)} (${activeMonthsCount}/12 meses)`;

  if ($('execSalesYtd')) $('execSalesYtd').textContent = fmtTon(salesTotal);
  if ($('execGoalStatus')) {
    $('execGoalStatus').textContent = `${goalPct.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% da meta`;
    $('execGoalStatus').className = 'prod-kpi-badge ' + (goalPct >= 80 ? 'good' : goalPct >= 50 ? 'warn' : 'bad');
  }
  if ($('execSalesMeter')) $('execSalesMeter').style.width = `${Math.min(100, goalPct).toFixed(1)}%`;
  let salesRem = Math.max(0, salesGoal - salesTotal);
  if ($('execGoalHint')) $('execGoalHint').textContent = `Meta ${actYr}: ${fmtTon(salesGoal, 1)} • Faltam ${fmtTon(salesRem, 1)}`;

  if ($('execBalanceYtd')) {
    $('execBalanceYtd').textContent = fmtSignedTon(balanceTotal);
    $('execBalanceYtd').className = pctClass(balanceTotal);
  }
  if ($('execBalanceBadge')) {
    $('execBalanceBadge').textContent = balanceTotal >= 0 ? 'Reposição Estoque' : 'Giro > Produção';
    $('execBalanceBadge').className = 'prod-kpi-badge ' + (balanceTotal >= 0 ? 'good' : 'warn');
  }
  if ($('execSalesHint')) {
    let ratio = prodTotal ? (salesTotal / prodTotal * 100) : 0;
    $('execSalesHint').textContent = balanceTotal >= 0
      ? `Produção superou vendas em ${fmtTon(balanceTotal)} (${ratio.toFixed(1)}% escoado)`
      : `Vendas superaram produção em ${fmtTon(Math.abs(balanceTotal))} (${ratio.toFixed(1)}% sobre prod.)`;
  }

  if ($('execProdVs2025')) {
    let mainDelta = activeMonthsCount > 0 ? prodVsRefSame : prodVsRefFull;
    $('execProdVs2025').innerHTML = `<span class="${pctClass(mainDelta)}">${fmtSignedPct(mainDelta)}</span>`;
  }
  if ($('execYoySameBadge')) {
    $('execYoySameBadge').textContent = activeMonthsCount > 0
      ? `Jan–${monthsLbl[activeIdxs.at(-1)]} (${actYr.slice(-2)} vs ${refYr.slice(-2)})`
      : `${actYr} vs ${refYr}`;
    $('execYoySameBadge').className = 'prod-kpi-badge ' + (prodVsRefSame >= 0 ? 'good' : 'warn');
  }
  if ($('execProdVs2025Hint')) {
    $('execProdVs2025Hint').textContent = `Mesmo período ${refYr}: ${fmtTon(refSamePeriod, 1)} • Ano ${refYr} todo: ${fmtTon(baseRefTotal, 1)} (${fmtSignedPct(prodVsRefFull)})`;
  }

  // Card 5: Media Diaria vinculada diretamente a soma dos dias uteis da tabela!
  if ($('execProdAvg')) $('execProdAvg').textContent = fmtTon(prodAvg, 1);
  if ($('execSalesAvg')) $('execSalesAvg').textContent = fmtTon(salesAvg, 1);
  if ($('execWorkdaysBadge')) {
    $('execWorkdaysBadge').textContent = remainMonthsCount > 0 && workDaysActive > 0
      ? `${totalWorkDaysYear} d na tabela (${workDaysActive} d realizados)`
      : `${totalWorkDaysYear} dias úteis na tabela`;
  }
  if ($('execProdAvgHint')) {
    let mAvgProd = activeMonthsCount ? prodTotal / activeMonthsCount : 0;
    let mAvgSales = activeMonthsCount ? salesTotal / activeMonthsCount : 0;
    $('execProdAvgHint').textContent = remainMonthsCount > 0 && totalWorkDaysYear > 0
      ? `Nos ${totalWorkDaysYear} d do ano: ${fmtTon(prodAvgFullYear, 1)}/d prod. e ${fmtTon(salesAvgFullYear, 1)}/d vendas • Média/mês: ${fmtTon(mAvgProd, 1)}`
      : `Média mensal (${activeMonthsCount} meses): ${fmtTon(mAvgProd, 1)} prod. / ${fmtTon(mAvgSales, 1)} vendas`;
  }

  // Card 6: Ritmo Necessario nos meses e dias uteis restantes da tabela!
  let paceProdMonth = remainMonthsCount > 0 ? prodRem / remainMonthsCount : 0;
  let paceSalesMonth = remainMonthsCount > 0 ? salesRem / remainMonthsCount : 0;
  let paceProdDay = workDaysRemaining > 0 ? prodRem / workDaysRemaining : 0;
  if ($('execRemainMonthsBadge')) {
    $('execRemainMonthsBadge').textContent = remainMonthsCount > 0
      ? `${remainMonthsCount} mês(es) • ${workDaysRemaining} d restantes`
      : '12 meses preenchidos';
  }
  if ($('execPaceNeeded')) {
    $('execPaceNeeded').textContent = remainMonthsCount > 0 ? `${fmtTon(paceProdMonth, 1)}/mês` : (prodRem <= 0 ? 'Meta atingida!' : `Faltam ${fmtTon(prodRem, 1)}`);
  }
  if ($('execPaceHint')) {
    $('execPaceHint').textContent = remainMonthsCount > 0
      ? `Prod.: ${fmtTon(paceProdMonth, 1)}/mês (${fmtTon(paceProdDay, 1)}/dia útil nos ${workDaysRemaining} d restantes) • Vendas: ${fmtTon(paceSalesMonth, 1)}/mês`
      : `Exercício ${actYr} com 12 meses lançados (${totalWorkDaysYear} dias úteis)`;
  }

  // 2. Campos de Metas
  if ($('prodGoalSales')) $('prodGoalSales').value = salesGoal;
  if ($('prodGoalProduction')) $('prodGoalProduction').value = prodGoal;
  if ($('prodBaseProduction')) $('prodBaseProduction').value = Number(baseRefTotal.toFixed(2));
  if ($('prodDashNote')) $('prodDashNote').value = yAct.note || '';

  // 3. Tabela Interativa Mensal Completa
  let monthlyProdTarget = prodGoal > 0 ? prodGoal / 12 : 358.76;
  if ($('prodEditBody')) {
    $('prodEditBody').innerHTML = monthsLbl.map((m, i) => {
      let pRef = Number(prodRef[i]) || 0;
      let sRef = Number(salesRef[i]) || 0;
      let pAct = prodAct[i];
      let sAct = salesAct[i];
      let dAct = daysAct[i];
      let hasData = (pAct > 0 || sAct > 0);
      let yoy = (pAct > 0 && pRef > 0) ? pctDelta(pRef, pAct) : null;
      let bal = pAct - sAct;
      let pDay = (dAct > 0 && pAct > 0) ? (pAct / dAct) : 0;
      let sDay = (dAct > 0 && sAct > 0) ? (sAct / dAct) : 0;
      let mGoalPct = (monthlyProdTarget > 0 && pAct > 0) ? (pAct / monthlyProdTarget * 100) : 0;
      let barCls = mGoalPct >= 100 ? 'ok' : mGoalPct >= 85 ? '' : 'warn';

      return `<tr class="${hasData ? 'month-active' : 'month-empty'}">
        <td>
          <b>${m}/${actYr.slice(-2)}</b>
          <span class="prod-month-status ${hasData ? 'done' : 'open'}">${hasData ? 'Realizado' : 'Aberto'}</span>
        </td>
        <td style="color:#475569;font-weight:600" title="Vendas ${m}/${refYr}: ${fmtTon(sRef, 1)}">
          ${fmtTon(pRef, 1)}
          <small style="display:block;font-size:10px;color:#94a3b8;font-weight:400">Vend. ${refYr.slice(-2)}: ${fmtTon(sRef, 1)}</small>
        </td>
        <td>
          <div class="prod-input-wrap">
            <input data-pm="${i}" data-kind="production" type="number" min="0" step="0.01" placeholder="0,0" value="${pAct || ''}">
            <span class="prod-input-unit">t</span>
          </div>
        </td>
        <td>${yoy !== null ? pillDeltaHtml(yoy, '%') : '<span class="muted">—</span>'}</td>
        <td>
          <div class="prod-input-wrap sales-input">
            <input data-pm="${i}" data-kind="sales" type="number" min="0" step="0.01" placeholder="0,0" value="${sAct || ''}">
            <span class="prod-input-unit">t</span>
          </div>
        </td>
        <td>
          ${hasData
            ? `<span class="prod-pill ${bal >= 0 ? 'pos' : 'warn'}">${fmtSignedTon(bal)}</span>`
            : '<span class="muted">—</span>'}
        </td>
        <td>
          <div class="prod-input-wrap days-input">
            <input data-pm="${i}" data-kind="days" type="number" min="0" step="1" value="${dAct}">
            <span class="prod-input-unit">d</span>
          </div>
        </td>
        <td style="font-size:12px">
          ${hasData
            ? `<b style="color:#1e40af">${pDay.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</b> <span class="muted">/</span> <b style="color:#c2410c">${sDay.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</b> <small class="muted">t/d</small>`
            : `<span class="muted" title="${dAct} dias úteis planejados">${dAct} d planejados</span>`}
        </td>
        <td class="prod-goal-cell">
          ${pAct > 0
            ? `<div class="prod-goal-mini">
                <div class="prod-goal-bar"><span class="${barCls}" style="width:${Math.min(100, mGoalPct).toFixed(0)}%"></span></div>
                <b style="font-size:11px;min-width:36px;text-align:right">${Math.round(mGoalPct)}%</b>
              </div>`
            : `<span class="muted" style="font-size:11px">Meta: ${fmtTon(monthlyProdTarget, 0)}</span>`}
        </td>
      </tr>`;
    }).join('');
  }

  if ($('prodEditFoot')) {
    let avgPRef = tonSum(prodRef) / 12;
    let avgPAct = activeMonthsCount ? prodTotal / activeMonthsCount : 0;
    let avgSAct = activeMonthsCount ? salesTotal / activeMonthsCount : 0;
    let avgBal = avgPAct - avgSAct;
    let avgDaysAll = totalWorkDaysYear / 12;
    $('prodEditFoot').innerHTML = `
      <tr class="prod-foot-total">
        <td style="text-align:left;padding-left:14px">TOTAL / ACUMULADO ${actYr} (${activeMonthsCount}/12 m)</td>
        <td>${fmtTon(refSamePeriod, 1)} <small style="display:block;font-weight:400;color:#cbd5e1;font-size:10px">Ano ${refYr}: ${fmtTon(tonSum(prodRef), 1)}</small></td>
        <td>${fmtTon(prodTotal, 2)}</td>
        <td>${pillDeltaHtml(activeMonthsCount > 0 ? prodVsRefSame : prodVsRefFull, '%')}</td>
        <td>${fmtTon(salesTotal, 2)}</td>
        <td><span class="prod-pill ${balanceTotal >= 0 ? 'pos' : 'warn'}">${fmtSignedTon(balanceTotal)}</span></td>
        <td><b style="font-size:14px;color:#93c5fd">${totalWorkDaysYear} d</b> <small style="display:block;font-weight:400;color:#cbd5e1;font-size:10px">Ativos: ${workDaysActive} d | Rest.: ${workDaysRemaining} d</small></td>
        <td>${prodAvg.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} / ${salesAvg.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} t/d</td>
        <td>${prodGoalPct.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% da meta ${actYr}</td>
      </tr>
      <tr class="prod-foot-avg">
        <td style="text-align:left;padding-left:14px">MÉDIA MENSAL (${actYr})</td>
        <td>${fmtTon(avgPRef, 1)}/mês</td>
        <td>${fmtTon(avgPAct, 1)}/mês</td>
        <td>${avgPRef && avgPAct ? fmtSignedPct(pctDelta(avgPRef, avgPAct)) : '—'}</td>
        <td>${fmtTon(avgSAct, 1)}/mês</td>
        <td>${fmtSignedTon(avgBal)}/mês</td>
        <td>${avgDaysAll.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} d/mês (soma: ${totalWorkDaysYear} d)</td>
        <td>Meta prod.: ${fmtTon(monthlyProdTarget, 1)}/mês</td>
        <td>Meta vendas: ${fmtTon(salesGoal / 12, 1)}/mês</td>
      </tr>
    `;
  }

  $('prodEditBody')?.querySelectorAll('input').forEach(inp => {
    inp.onchange = () => {
      let i = Number(inp.dataset.pm), v = Math.max(0, N(inp.value) || 0), s = prodDashState();
      let curY = s.years[s.activeYear];
      if (!curY) return;
      if (inp.dataset.kind === 'production') curY.production[i] = v;
      else if (inp.dataset.kind === 'sales') curY.sales[i] = v;
      else curY.days[i] = v;
      syncLegacy2026(s);
      save();
      renderProduction();
    };
  });

  // 4. Graficos Comparativos Dinamicos (Ano em Analise vs Ano de Referencia)
  let fmtVal = v => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' t';
  if ($('chartTitleProdSales')) $('chartTitleProdSales').textContent = `Produção × Vendas ${actYr} (Mês a Mês)`;
  if ($('chartTagProdSales')) $('chartTagProdSales').textContent = `${actYr} • Toneladas`;
  if ($('lgActProd')) $('lgActProd').textContent = `Produção ${actYr} (t)`;
  if ($('lgActSales')) $('lgActSales').textContent = `Vendas ${actYr} (t)`;

  if ($('execProdSalesChart')) {
    $('execProdSalesChart').innerHTML = buildExecDualRows(monthsLbl, prodAct, salesAct, 'prod', 'sales', fmtVal, 'balance');
  }

  let isCompSales = state.compareMetric === 'sales';
  if ($('btnCompareProd')) {
    $('btnCompareProd').className = isCompSales ? 'smallbtn' : 'smallbtn primary';
    $('btnCompareProd').style.cssText = isCompSales
      ? 'padding:4px 9px;font-size:11px;border-radius:6px;cursor:pointer;border:1px solid #cbd5e1;background:#fff;color:#1e293b'
      : 'padding:4px 9px;font-size:11px;border-radius:6px;cursor:pointer';
    $('btnCompareProd').onclick = () => { state.compareMetric = 'production'; save(); renderProduction(); };
  }
  if ($('btnCompareSales')) {
    $('btnCompareSales').className = isCompSales ? 'smallbtn primary' : 'smallbtn';
    $('btnCompareSales').style.cssText = !isCompSales
      ? 'padding:4px 9px;font-size:11px;border-radius:6px;cursor:pointer;border:1px solid #cbd5e1;background:#fff;color:#1e293b'
      : 'padding:4px 9px;font-size:11px;border-radius:6px;cursor:pointer';
    $('btnCompareSales').onclick = () => { state.compareMetric = 'sales'; save(); renderProduction(); };
  }

  let metricLabel = isCompSales ? 'Vendas' : 'Produção';
  if ($('chartTitleCompare')) $('chartTitleCompare').textContent = `${metricLabel}: ${refYr} × ${actYr} (Mês a Mês)`;
  if ($('lgRefCompare')) $('lgRefCompare').textContent = `${metricLabel} ${refYr} (Ref.)`;
  if ($('lgActCompare')) $('lgActCompare').textContent = `${metricLabel} ${actYr} (Análise)`;

  if ($('execProdCompareChart')) {
    let refArr = isCompSales ? salesRef : prodRef;
    let actArr = isCompSales ? salesAct : prodAct;
    let barClsAct = isCompSales ? 'sales' : 'prod';
    $('execProdCompareChart').innerHTML = buildExecDualRows(monthsLbl, refArr, actArr, 'prev', barClsAct, fmtVal, 'yoy');
  }

  // 5. Consolidado Trimestral Dinamico (actYr vs refYr) + Painel Interativo de Todos os Anos
  if ($('summaryQuarterTitle')) $('summaryQuarterTitle').textContent = `Consolidação Trimestral (${actYr} vs ${refYr})`;
  if ($('summaryQuarterTag')) $('summaryQuarterTag').textContent = `${actYr} vs ${refYr}`;

  const quarters = [
    { label: '1º Trimestre (Jan–Mar)', idxs: [0, 1, 2] },
    { label: '2º Trimestre (Abr–Jun)', idxs: [3, 4, 5] },
    { label: '3º Trimestre (Jul–Set)', idxs: [6, 7, 8] },
    { label: '4º Trimestre (Out–Dez)', idxs: [9, 10, 11] }
  ];
  if ($('execSummaryTable')) {
    $('execSummaryTable').innerHTML = `<table>
      <thead>
        <tr>
          <th>Período</th>
          <th>Prod. ${refYr}</th>
          <th>Prod. ${actYr}</th>
          <th>Δ% Prod.</th>
          <th>Vendas ${refYr}</th>
          <th>Vendas ${actYr}</th>
          <th>Saldo ${actYr}</th>
        </tr>
      </thead>
      <tbody>
        ${quarters.map(q => {
          let qpRef = q.idxs.reduce((a, i) => a + (Number(prodRef[i]) || 0), 0);
          let qpAct = q.idxs.reduce((a, i) => a + (Number(prodAct[i]) || 0), 0);
          let qsRef = q.idxs.reduce((a, i) => a + (Number(salesRef[i]) || 0), 0);
          let qsAct = q.idxs.reduce((a, i) => a + (Number(salesAct[i]) || 0), 0);
          let qBal = qpAct - qsAct;
          let qYoy = (qpAct > 0 && qpRef > 0) ? pctDelta(qpRef, qpAct) : null;
          return `<tr>
            <td><b>${q.label}</b></td>
            <td>${fmtTon(qpRef, 1)}</td>
            <td><b>${qpAct ? fmtTon(qpAct, 1) : '—'}</b></td>
            <td>${qYoy !== null ? pillDeltaHtml(qYoy, '%') : '—'}</td>
            <td>${fmtTon(qsRef, 1)}</td>
            <td><b>${qsAct ? fmtTon(qsAct, 1) : '—'}</b></td>
            <td class="${pctClass(qBal)}">${(qpAct || qsAct) ? fmtSignedTon(qBal) : '—'}</td>
          </tr>`;
        }).join('')}
        <tr style="background:#f8fafc;font-weight:800;border-top:2px solid #cbd5e1">
          <td><b>Total Ano</b></td>
          <td>${fmtTon(tonSum(prodRef), 1)}</td>
          <td><b>${fmtTon(prodTotal, 1)}</b></td>
          <td>${pillDeltaHtml(activeMonthsCount > 0 ? prodVsRefSame : prodVsRefFull, '%')}</td>
          <td>${fmtTon(tonSum(salesRef), 1)}</td>
          <td><b>${fmtTon(salesTotal, 1)}</b></td>
          <td class="${pctClass(balanceTotal)}"><b>${fmtSignedTon(balanceTotal)}</b></td>
        </tr>
      </tbody>
    </table>`;
  }

  // Cards Historicos Interativos (Todos os anos cadastrados: 2024, 2025, 2026, 2027...)
  if ($('execHistoryCards')) {
    $('execHistoryCards').innerHTML = allYears.map(yr => {
      let yObj = state.years[yr];
      let pTot = tonSum(yObj.production);
      let sTot = tonSum(yObj.sales);
      let dTot = tonSum(yObj.days);
      let mAtivos = yObj.production.filter((v, idx) => (Number(v) || 0) > 0 || (Number(yObj.sales[idx]) || 0) > 0).length;
      let isAct = yr === actYr;
      let isRef = yr === refYr && !isAct;
      let badgeHtml = isAct
        ? `<span class="prod-pill pos" style="float:right">Em Análise</span>`
        : isRef
          ? `<span class="prod-pill neutral" style="float:right">Referência</span>`
          : `<span class="prod-pill neutral" style="float:right">Abrir ${yr}</span>`;
      return `<div class="hist-card interactive-year ${isAct ? 'active-year-card' : isRef ? 'ref-year-card' : ''}" data-card-yr="${yr}" title="Clique para selecionar ${yr} como Ano em Análise">
        <div>${badgeHtml}<small style="font-weight:800;color:#1e293b">EXERCÍCIO ${yr}</small></div>
        <b style="color:#1e40af;margin-top:6px">Prod.: ${fmtTon(pTot, 1)}</b>
        <div style="font-size:14px;font-weight:700;color:#c2410c;margin-top:2px">Vendas: ${fmtTon(sTot, 1)}</div>
        <small style="margin-top:6px">${mAtivos}/12 meses ativos • ${dTot} dias úteis • Saldo: ${fmtSignedTon(pTot - sTot)}</small>
      </div>`;
    }).join('');

    $('execHistoryCards').querySelectorAll('[data-card-yr]').forEach(card => {
      card.onclick = () => {
        let newYr = card.dataset.cardYr;
        state.activeYear = newYr;
        let prev = String(Number(newYr) - 1);
        if (state.years[prev] && prev !== newYr) state.refYear = prev;
        if ($('prodYear') && [...$('prodYear').options].some(o => o.value === newYr)) {
          $('prodYear').value = newYr;
        }
        save();
        renderProduction();
      };
    });
  }

  // 6. Rastreabilidade Operacional por Bateladas Finalizadas
  let batchYears = [...new Set([
    ...allYears,
    ...(MPS.batches || []).filter(b => b.date).map(b => b.date.slice(0, 4)),
    String(new Date().getFullYear())
  ])].sort();
  let sel = $('prodYear').value || actYr || batchYears.at(-1);
  $('prodYear').innerHTML = batchYears.map(y => `<option value="${y}" ${y === sel ? 'selected' : ''}>${y}</option>`).join('');
  sel = $('prodYear').value;
  if ($('opBatchChartTitle')) $('opBatchChartTitle').textContent = `Volume apontado mês a mês — Bateladas ${sel}`;

  let arr = (MPS.batches || []).filter(b => (b.status === 'Finalizada' || stageOfBatch(b) === 'Apontamento') && b.date?.startsWith(sel));
  let months = Array.from({ length: 12 }, (_, i) => ({ m: i + 1, kg: 0, batches: 0, mto: 0, mts: 0, b5: 0, boxes5: 0, b20: 0, b50: 0, b200: 0 }));
  arr.forEach(b => {
    let m = Number(b.date.slice(5, 7)) - 1;
    if (m < 0 || m > 11) return;
    let c = operationalSplitKg(b), cnt = batchCounts(b), kg = effectiveBatchKg(b);
    months[m].kg += kg;
    months[m].batches++;
    months[m].mto += c.mto;
    months[m].mts += c.mts;
    months[m].b5 += cnt['5'];
    months[m].boxes5 += cnt['5'] ? Math.ceil(cnt['5'] / BOX_RULE.units - 1e-12) : 0;
    months[m].b20 += cnt['20'];
    months[m].b50 += cnt['50'];
    months[m].b200 += cnt['200'];
  });

  let total = months.reduce((a, m) => a + m.kg, 0);
  let active = months.filter(m => m.kg > 0).length;
  let bombs = months.reduce((a, m) => a + m.b5 + m.b20 + m.b50 + m.b200, 0);
  let boxes5 = months.reduce((a, m) => a + m.boxes5, 0);
  let names = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  let max = Math.max(...months.map(m => m.kg), 1);

  $('prodYearKg').textContent = fmtKg(total);
  $('prodBatchCount').textContent = arr.length;
  $('prodActiveMonths').textContent = active;
  $('prodAvgMonth').textContent = fmtKg(active ? total / active : 0);
  $('prodBombTotal').textContent = bombs.toLocaleString('pt-BR');
  $('prodBoxTotal').textContent = boxes5.toLocaleString('pt-BR');

  $('prodChart').innerHTML = months.map((m, i) => `
    <div class="month-row" style="grid-template-columns:55px minmax(180px,1fr) 170px">
      <b>${names[i]}</b>
      <div class="month-bar"><span style="width:${(m.kg / max * 100).toFixed(1)}%"></span></div>
      <div style="text-align:right;font-size:12px"><b>${fmtKg(m.kg)}</b> <span class="muted">(${m.batches} bat.)</span></div>
    </div>
  `).join('');

  $('prodBody').innerHTML = months.map((m, i) => `
    <tr>
      <td><b>${names[i]}/${sel.slice(-2)}</b></td>
      <td><b>${fmtKg(m.kg)}</b></td>
      <td>${m.batches}</td>
      <td>${fmtKg(m.mto)}</td>
      <td>${fmtKg(m.mts)}</td>
      <td>${m.b5.toLocaleString('pt-BR')}</td>
      <td>${m.boxes5.toLocaleString('pt-BR')}</td>
      <td>${m.b20.toLocaleString('pt-BR')}</td>
      <td>${m.b50.toLocaleString('pt-BR')}</td>
      <td>${m.b200.toLocaleString('pt-BR')}</td>
    </tr>
  `).join('');

  if ($('prodFoot')) {
    let totMto = months.reduce((a, m) => a + m.mto, 0);
    let totMts = months.reduce((a, m) => a + m.mts, 0);
    let totB5 = months.reduce((a, m) => a + m.b5, 0);
    let totB20 = months.reduce((a, m) => a + m.b20, 0);
    let totB50 = months.reduce((a, m) => a + m.b50, 0);
    let totB200 = months.reduce((a, m) => a + m.b200, 0);
    $('prodFoot').innerHTML = `
      <tr style="background:#1e293b;color:#fff;font-weight:800">
        <td>TOTAL ${sel}</td>
        <td>${fmtKg(total)}</td>
        <td>${arr.length}</td>
        <td>${fmtKg(totMto)}</td>
        <td>${fmtKg(totMts)}</td>
        <td>${totB5.toLocaleString('pt-BR')}</td>
        <td>${boxes5.toLocaleString('pt-BR')}</td>
        <td>${totB20.toLocaleString('pt-BR')}</td>
        <td>${totB50.toLocaleString('pt-BR')}</td>
        <td>${totB200.toLocaleString('pt-BR')}</td>
      </tr>
    `;
  }
}
