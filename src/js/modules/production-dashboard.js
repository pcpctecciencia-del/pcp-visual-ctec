/**
 * Modulo de Dashboard Executivo de Producao (Comparativos 2024-2026, Metas, Ritmo Diario e Rastreabilidade)
 */
function prodDashState(){
  OPS.prodDashboard = OPS.prodDashboard || {};
  let s = OPS.prodDashboard;
  if (!Array.isArray(s.production2026) || s.production2026.length !== 12) s.production2026 = [...PROD_EXEC_SEED.production[2026]];
  if (!Array.isArray(s.sales2026) || s.sales2026.length !== 12) s.sales2026 = [...PROD_EXEC_SEED.sales[2026]];
  if (!Array.isArray(s.days2026) || s.days2026.length !== 12) s.days2026 = [...PROD_EXEC_SEED.days2026];
  if (N(s.targetSales) === null) s.targetSales = PROD_EXEC_SEED.targetSales2026;
  if (N(s.targetProduction) === null) s.targetProduction = PROD_EXEC_SEED.targetProduction2026;
  if (N(s.baseProduction2025) === null) s.baseProduction2025 = PROD_EXEC_SEED.production2025Total;
  if (s.note === undefined) s.note = '';
  return s;
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
        let diff = av - bv; // Producao - Vendas
        let cls = diff >= 0 ? 'pos' : 'warn';
        rightBadge = `<span class="prod-pill ${cls}" title="Saldo: Produção - Vendas">${fmtSignedTon(diff)}</span>`;
      } else {
        // YoY: a = 2025, b = 2026
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
  let prod26 = state.production2026.map(v => N(v) || 0);
  let sales26 = state.sales2026.map(v => N(v) || 0);
  let prod25 = exec.production[2025];
  let sales25 = exec.sales[2025];
  let prod24 = exec.production[2024];
  let sales24 = exec.sales[2024];
  let salesGoal = N(state.targetSales) || 0;
  let prodGoal = N(state.targetProduction) || 0;
  let base25 = N(state.baseProduction2025) || exec.production2025Total;
  let days = state.days2026.map(v => Math.max(0, N(v) || 0));

  let prodTotal = tonSum(prod26);
  let salesTotal = tonSum(sales26);
  let balanceTotal = prodTotal - salesTotal;

  let activeIdxs = monthsLbl.map((_, i) => i).filter(i => prod26[i] > 0 || sales26[i] > 0);
  let activeMonthsCount = activeIdxs.length;
  let remainMonthsCount = Math.max(0, 12 - activeMonthsCount);

  let workDaysActive = activeIdxs.reduce((a, i) => a + days[i], 0);
  let totalWorkDaysYear = tonSum(days);
  let prodAvg = workDaysActive ? prodTotal / workDaysActive : 0;
  let salesAvg = workDaysActive ? salesTotal / workDaysActive : 0;

  let goalPct = salesGoal ? (salesTotal / salesGoal * 100) : 0;
  let prodGoalPct = prodGoal ? (prodTotal / prodGoal * 100) : 0;

  // Comparativo justo: meses realizados de 2026 contra os mesmos meses de 2025
  let prod25SamePeriod = activeIdxs.reduce((a, i) => a + (Number(prod25[i]) || 0), 0);
  let prodVs25Same = prod25SamePeriod ? pctDelta(prod25SamePeriod, prodTotal) : 0;
  let prodVs25Full = pctDelta(base25, prodTotal);

  // 1. Preencher KPIs Executivos Superiores
  if ($('execProdYtd')) $('execProdYtd').textContent = fmtTon(prodTotal);
  if ($('execProdGoalBadge')) {
    $('execProdGoalBadge').textContent = `${prodGoalPct.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% da meta`;
    $('execProdGoalBadge').className = 'prod-kpi-badge ' + (prodGoalPct >= 80 ? 'good' : prodGoalPct >= 50 ? 'info' : 'warn');
  }
  if ($('execProdMeter')) $('execProdMeter').style.width = `${Math.min(100, prodGoalPct).toFixed(1)}%`;
  let prodRem = Math.max(0, prodGoal - prodTotal);
  if ($('execProdHint')) $('execProdHint').textContent = `Meta: ${fmtTon(prodGoal, 1)} • Faltam ${fmtTon(prodRem, 1)} (${activeMonthsCount}/12 meses)`;

  if ($('execSalesYtd')) $('execSalesYtd').textContent = fmtTon(salesTotal);
  if ($('execGoalStatus')) {
    $('execGoalStatus').textContent = `${goalPct.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% da meta`;
    $('execGoalStatus').className = 'prod-kpi-badge ' + (goalPct >= 80 ? 'good' : goalPct >= 50 ? 'warn' : 'bad');
  }
  if ($('execSalesMeter')) $('execSalesMeter').style.width = `${Math.min(100, goalPct).toFixed(1)}%`;
  let salesRem = Math.max(0, salesGoal - salesTotal);
  if ($('execGoalHint')) $('execGoalHint').textContent = `Meta: ${fmtTon(salesGoal, 1)} • Faltam ${fmtTon(salesRem, 1)}`;

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
    $('execProdVs2025').innerHTML = `<span class="${pctClass(prodVs25Same)}">${fmtSignedPct(prodVs25Same)}</span>`;
  }
  if ($('execYoySameBadge')) {
    $('execYoySameBadge').textContent = `Jan–${monthsLbl[activeIdxs.at(-1) ?? 0]} (26 vs 25)`;
    $('execYoySameBadge').className = 'prod-kpi-badge ' + (prodVs25Same >= 0 ? 'good' : 'warn');
  }
  if ($('execProdVs2025Hint')) {
    $('execProdVs2025Hint').textContent = `Mesmo período 2025: ${fmtTon(prod25SamePeriod, 1)} • Ano 2025 todo: ${fmtTon(base25, 1)} (${fmtSignedPct(prodVs25Full)})`;
  }

  if ($('execProdAvg')) $('execProdAvg').textContent = fmtTon(prodAvg, 1);
  if ($('execSalesAvg')) $('execSalesAvg').textContent = fmtTon(salesAvg, 1);
  if ($('execWorkdaysBadge')) $('execWorkdaysBadge').textContent = `${workDaysActive} dias úteis ativos`;
  if ($('execProdAvgHint')) {
    let mAvgProd = activeMonthsCount ? prodTotal / activeMonthsCount : 0;
    let mAvgSales = activeMonthsCount ? salesTotal / activeMonthsCount : 0;
    $('execProdAvgHint').textContent = `Média mensal: ${fmtTon(mAvgProd, 1)} prod. / ${fmtTon(mAvgSales, 1)} vendas`;
  }

  // Card 6: Ritmo Necessario nos meses restantes
  let paceProdMonth = remainMonthsCount > 0 ? prodRem / remainMonthsCount : 0;
  let paceSalesMonth = remainMonthsCount > 0 ? salesRem / remainMonthsCount : 0;
  if ($('execRemainMonthsBadge')) {
    $('execRemainMonthsBadge').textContent = remainMonthsCount > 0 ? `${remainMonthsCount} mês(es) em aberto` : 'Ano fechado';
  }
  if ($('execPaceNeeded')) {
    $('execPaceNeeded').textContent = remainMonthsCount > 0 ? `${fmtTon(paceProdMonth, 1)}/mês` : 'Meta concluída';
  }
  if ($('execPaceHint')) {
    $('execPaceHint').textContent = remainMonthsCount > 0
      ? `Para 100% da meta: produzir ${fmtTon(paceProdMonth, 1)}/mês e vender ${fmtTon(paceSalesMonth, 1)}/mês`
      : `12 meses preenchidos no exercício de 2026`;
  }

  // 2. Campos de Metas
  if ($('prodGoalSales')) $('prodGoalSales').value = salesGoal;
  if ($('prodGoalProduction')) $('prodGoalProduction').value = prodGoal;
  if ($('prodBaseProduction')) $('prodBaseProduction').value = base25;
  if ($('prodDashNote')) $('prodDashNote').value = state.note || '';

  // 3. Tabela Interativa Mensal Completa (Com Prod 2025, Prod 2026, YoY, Vendas 2026, Saldo, Dias Uteis, Ritmo Diario e Meta Mensal)
  let monthlyProdTarget = prodGoal > 0 ? prodGoal / 12 : 358.76;
  if ($('prodEditBody')) {
    $('prodEditBody').innerHTML = monthsLbl.map((m, i) => {
      let p25 = Number(prod25[i]) || 0;
      let p26 = prod26[i];
      let s26 = sales26[i];
      let d26 = days[i];
      let hasData = (p26 > 0 || s26 > 0);
      let yoy = (p26 > 0 && p25 > 0) ? pctDelta(p25, p26) : null;
      let bal = p26 - s26;
      let pDay = (d26 > 0 && p26 > 0) ? (p26 / d26) : 0;
      let sDay = (d26 > 0 && s26 > 0) ? (s26 / d26) : 0;
      let mGoalPct = (monthlyProdTarget > 0 && p26 > 0) ? (p26 / monthlyProdTarget * 100) : 0;
      let barCls = mGoalPct >= 100 ? 'ok' : mGoalPct >= 85 ? '' : 'warn';

      return `<tr class="${hasData ? 'month-active' : 'month-empty'}">
        <td>
          <b>${m}</b>
          <span class="prod-month-status ${hasData ? 'done' : 'open'}">${hasData ? 'Realizado' : 'Aberto'}</span>
        </td>
        <td style="color:#475569;font-weight:600">${fmtTon(p25, 1)}</td>
        <td>
          <div class="prod-input-wrap">
            <input data-pm="${i}" data-kind="production" type="number" min="0" step="0.01" placeholder="0,0" value="${p26 || ''}">
            <span class="prod-input-unit">t</span>
          </div>
        </td>
        <td>${yoy !== null ? pillDeltaHtml(yoy, '%') : '<span class="muted">—</span>'}</td>
        <td>
          <div class="prod-input-wrap sales-input">
            <input data-pm="${i}" data-kind="sales" type="number" min="0" step="0.01" placeholder="0,0" value="${s26 || ''}">
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
            <input data-pm="${i}" data-kind="days" type="number" min="0" step="1" value="${d26 || ''}">
            <span class="prod-input-unit">d</span>
          </div>
        </td>
        <td style="font-size:12px">
          ${hasData
            ? `<b style="color:#1e40af">${pDay.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</b> <span class="muted">/</span> <b style="color:#c2410c">${sDay.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</b> <small class="muted">t/d</small>`
            : '<span class="muted">—</span>'}
        </td>
        <td class="prod-goal-cell">
          ${p26 > 0
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
    let avgP25 = tonSum(prod25) / 12;
    let avgP26 = activeMonthsCount ? prodTotal / activeMonthsCount : 0;
    let avgS26 = activeMonthsCount ? salesTotal / activeMonthsCount : 0;
    let avgBal = avgP26 - avgS26;
    let avgDays = activeMonthsCount ? workDaysActive / activeMonthsCount : 0;
    $('prodEditFoot').innerHTML = `
      <tr class="prod-foot-total">
        <td style="text-align:left;padding-left:14px">ACUMULADO 2026 (${activeMonthsCount} meses)</td>
        <td>${fmtTon(prod25SamePeriod, 1)} <small style="display:block;font-weight:400;color:#cbd5e1;font-size:10px">Ano 25: ${fmtTon(tonSum(prod25), 1)}</small></td>
        <td>${fmtTon(prodTotal, 2)}</td>
        <td>${pillDeltaHtml(prodVs25Same, '%')}</td>
        <td>${fmtTon(salesTotal, 2)}</td>
        <td><span class="prod-pill ${balanceTotal >= 0 ? 'pos' : 'warn'}">${fmtSignedTon(balanceTotal)}</span></td>
        <td>${workDaysActive} d <small style="display:block;font-weight:400;color:#cbd5e1;font-size:10px">Ano: ${totalWorkDaysYear} d</small></td>
        <td>${prodAvg.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} / ${salesAvg.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} t/d</td>
        <td>${prodGoalPct.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% da meta anual</td>
      </tr>
      <tr class="prod-foot-avg">
        <td style="text-align:left;padding-left:14px">MÉDIA MENSAL REALIZADA</td>
        <td>${fmtTon(avgP25, 1)}/mês</td>
        <td>${fmtTon(avgP26, 1)}/mês</td>
        <td>${avgP25 ? fmtSignedPct(pctDelta(avgP25, avgP26)) : '—'}</td>
        <td>${fmtTon(avgS26, 1)}/mês</td>
        <td>${fmtSignedTon(avgBal)}/mês</td>
        <td>${avgDays.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} d/mês</td>
        <td>Meta prod.: ${fmtTon(monthlyProdTarget, 1)}/mês</td>
        <td>Meta vendas: ${fmtTon(salesGoal / 12, 1)}/mês</td>
      </tr>
    `;
  }

  $('prodEditBody')?.querySelectorAll('input').forEach(inp => inp.onchange = () => {
    let i = Number(inp.dataset.pm), v = Math.max(0, N(inp.value) || 0), s = prodDashState();
    if (inp.dataset.kind === 'production') s.production2026[i] = v;
    else if (inp.dataset.kind === 'sales') s.sales2026[i] = v;
    else s.days2026[i] = v;
    save();
    renderProduction();
  });

  // 4. Graficos Comparativos Duplos
  let fmtVal = v => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' t';
  if ($('execProdSalesChart')) {
    $('execProdSalesChart').innerHTML = buildExecDualRows(monthsLbl, prod26, sales26, 'prod', 'sales', fmtVal, 'balance');
  }
  if ($('execProdCompareChart')) {
    $('execProdCompareChart').innerHTML = buildExecDualRows(monthsLbl, prod25, prod26, 'prev', 'prod', fmtVal, 'yoy');
  }

  // 5. Consolidado Trimestral (1º ao 4º Trimestre) + Cards Trienais (2024-2026)
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
          <th>Prod. 2025</th>
          <th>Prod. 2026</th>
          <th>Δ% Prod.</th>
          <th>Vendas 2026</th>
          <th>Saldo (P−V)</th>
        </tr>
      </thead>
      <tbody>
        ${quarters.map(q => {
          let qp25 = q.idxs.reduce((a, i) => a + (Number(prod25[i]) || 0), 0);
          let qp26 = q.idxs.reduce((a, i) => a + (Number(prod26[i]) || 0), 0);
          let qs26 = q.idxs.reduce((a, i) => a + (Number(sales26[i]) || 0), 0);
          let qBal = qp26 - qs26;
          let qYoy = (qp26 > 0 && qp25 > 0) ? pctDelta(qp25, qp26) : null;
          return `<tr>
            <td><b>${q.label}</b></td>
            <td>${fmtTon(qp25, 1)}</td>
            <td><b>${qp26 ? fmtTon(qp26, 1) : '—'}</b></td>
            <td>${qYoy !== null ? pillDeltaHtml(qYoy, '%') : '—'}</td>
            <td><b>${qs26 ? fmtTon(qs26, 1) : '—'}</b></td>
            <td class="${pctClass(qBal)}">${(qp26 || qs26) ? fmtSignedTon(qBal) : '—'}</td>
          </tr>`;
        }).join('')}
        <tr style="background:#f8fafc;font-weight:800;border-top:2px solid #cbd5e1">
          <td><b>Total Ano</b></td>
          <td>${fmtTon(tonSum(prod25), 1)}</td>
          <td><b>${fmtTon(prodTotal, 1)}</b></td>
          <td>${pillDeltaHtml(prodVs25Same, '%')}</td>
          <td><b>${fmtTon(salesTotal, 1)}</b></td>
          <td class="${pctClass(balanceTotal)}"><b>${fmtSignedTon(balanceTotal)}</b></td>
        </tr>
      </tbody>
    </table>`;
  }

  let p24Total = tonSum(prod24), p25Total = tonSum(prod25), s24Total = tonSum(sales24), s25Total = tonSum(sales25);
  if ($('execHistoryCards')) {
    $('execHistoryCards').innerHTML = [
      `<div class="hist-card"><small>Produção 2024</small><b>${fmtTon(p24Total, 1)}</b><small>Média: ${fmtTon(p24Total / 12, 1)}/mês</small></div>`,
      `<div class="hist-card"><small>Produção 2025</small><b>${fmtTon(p25Total, 1)}</b><small class="${pctClass(pctDelta(p24Total, p25Total))}">${fmtSignedPct(pctDelta(p24Total, p25Total))} vs 2024</small></div>`,
      `<div class="hist-card"><small>Vendas 2024</small><b>${fmtTon(s24Total, 1)}</b><small>Média: ${fmtTon(s24Total / 12, 1)}/mês</small></div>`,
      `<div class="hist-card"><small>Vendas 2025</small><b>${fmtTon(s25Total, 1)}</b><small class="${pctClass(pctDelta(s24Total, s25Total))}">${fmtSignedPct(pctDelta(s24Total, s25Total))} vs 2024</small></div>`,
      `<div class="hist-card"><small>Projeção Anual Produção 2026</small><b>${fmtTon(activeMonthsCount ? (prodTotal / activeMonthsCount) * 12 : 0, 1)}</b><small>No ritmo atual de ${fmtTon(activeMonthsCount ? prodTotal / activeMonthsCount : 0, 1)}/mês</small></div>`,
      `<div class="hist-card"><small>Projeção Anual Vendas 2026</small><b>${fmtTon(activeMonthsCount ? (salesTotal / activeMonthsCount) * 12 : 0, 1)}</b><small>No ritmo atual de ${fmtTon(activeMonthsCount ? salesTotal / activeMonthsCount : 0, 1)}/mês</small></div>`
    ].join('');
  }

  // 6. Rastreabilidade Operacional por Bateladas Finalizadas
  let years = [...new Set((MPS.batches || []).filter(b => b.date).map(b => b.date.slice(0, 4)))], now = String(new Date().getFullYear());
  if (!years.includes(now)) years.push(now);
  years.sort();
  let sel = $('prodYear').value || years.at(-1) || now;
  $('prodYear').innerHTML = years.map(y => `<option ${y === sel ? 'selected' : ''}>${y}</option>`).join('');
  sel = $('prodYear').value;

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
      <td><b>${names[i]}</b></td>
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
