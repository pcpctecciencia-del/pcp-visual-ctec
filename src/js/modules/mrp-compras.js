/**
 * Modulo de MRP (Necessidade de Materias-Primas) e Exportacao de Compras (XLSX)
 */
function mrpBatchSelection(){
  let mode=$('mrpBatchFilter')?.value||'OPEN';
  return (MPS.batches||[]).filter(b=>{let kg=effectiveBatchKg(b);if(kg===null||kg<=0||b.status==='Finalizada')return false;if(mode==='CONFIRM')return b.status==='Programada'||b.status==='Em produção';if(mode==='PROGRAMADA')return b.status==='Programada';if(mode==='PRODUCAO')return b.status==='Em produção';return true})
}
function productFormulaLink(product){return PROD_FORMULA.find(p=>p.active!==false&&mpNorm(p.product)===mpNorm(product))||null}
function mrpData(){
  let batches=mrpBatchSelection(),need={},problems=[];
  batches.forEach(b=>{let kg=effectiveBatchKg(b)||0,link=productFormulaLink(b.produto);if(!link||!link.formula){problems.push(`${b.produto}: sem fórmula vinculada`);return}let f=formulaGet(link.formula);if(!f||f.pending){problems.push(`${b.produto}: fórmula ${link.formula||'não definida'} pendente`);return}(f.components||[]).forEach(c=>{let pct=Number(c.pct)||0;if(pct<=0)return;need[c.material]=(need[c.material]||0)+kg*pct/100})});
  let allNames=[...new Set([...Object.keys(MP.stock||{}),...Object.keys(need)])];
  let rows=allNames.map(material=>{let stock=mpStock(material),req=need[material]||0,proj=stock===null?null:stock-req,buy=proj===null?null:Math.max(0,-proj),code=(MP.codes||{})[material]||MATERIAL_CIGAM_BY_NAME[material]||'',status=stock===null&&req>0?'REVISAR':buy>0?'COMPRAR':req>0?'OK':'SEM CONSUMO';return{material,code,stock,req,proj,buy,status}}).sort((a,b)=>(b.buy||0)-(a.buy||0)||b.req-a.req||a.material.localeCompare(b.material,'pt-BR'));
  return{batches,rows,problems}
}
function mrpBadge(s){let c=s==='COMPRAR'?'buy':s==='OK'?'ok':s==='REVISAR'?'review':'none';return`<span class="mrp-status ${c}">${s}</span>`}
function renderMrpChart(rows){
  if(!$('mrpShortageChart'))return;let top=rows.filter(r=>(r.buy||0)>0).slice(0,10),max=Math.max(...top.map(r=>r.buy),1);
  if(!top.length){$('mrpShortageChart').innerHTML='<div class=chartempty>Nenhuma falta de matéria-prima no plano selecionado.</div>';return}
  $('mrpShortageChart').innerHTML=`<div class=hbar-list>${top.map(r=>`<div class=hbar-row><div class=hbar-label title="${escHtml(r.material)}">${escHtml(r.material)}</div><div class=hbar-track><div class="hbar-fill stack-critical" style="width:${r.buy/max*100}%"></div></div><div class=hbar-value>${stockFmt(r.buy)}</div></div>`).join('')}</div>`;
}
function renderMRP(){
  if(!$('mrpBody'))return;
  let d=mrpData(),view=$('mrpView')?.value||'ALL',q=($('mrpQ')?.value||'').trim().toUpperCase(),rows=d.rows;
  if(view==='PLAN')rows=rows.filter(r=>r.req>0);
  if(view==='BUY')rows=rows.filter(r=>(r.buy||0)>0||r.status==='REVISAR');
  if(q)rows=rows.filter(r=>`${r.material} ${r.code}`.toUpperCase().includes(q));
  $('mrpBody').innerHTML=rows.map(r=>{
    let pc=r.proj===null?'':r.proj<0?'negative':r.proj>0?'positive':'zero';
    return `<tr><td>${escHtml(r.code||'—')}</td><td><b>${escHtml(r.material)}</b></td><td class=percent>${stockFmt(r.stock)}</td><td class=percent>${stockFmt(r.req)}</td><td class="percent ${pc}">${r.proj===null?'—':stockFmt(r.proj)}</td><td class=percent><b class="${(r.buy||0)>0?'mrp-buy':''}">${r.buy===null?'—':stockFmt(r.buy)}</b></td><td>${mrpBadge(r.status)}</td></tr>`
  }).join('');
  let used=d.rows.filter(r=>r.req>0),buy=d.rows.filter(r=>(r.buy||0)>0);
  if($('mrpAllCount'))$('mrpAllCount').textContent=d.rows.length;
  if($('mrpBatchCount'))$('mrpBatchCount').textContent=d.batches.length;
  if($('mrpMatCount'))$('mrpMatCount').textContent=used.length;
  if($('mrpBuyCount'))$('mrpBuyCount').textContent=buy.length;
  if($('mrpBuyKg'))$('mrpBuyKg').textContent=stockFmt(buy.reduce((a,r)=>a+(r.buy||0),0))+' kg';
  $('mrpStockDate').textContent=MP.updated||'—';
  $('mrpProblems').innerHTML=d.problems.length?`<div class=mrp-problems><b>Planejamento não calculado em ${d.problems.length} batelada(s):</b> ${d.problems.map(escHtml).join(' • ')}</div>`:'';
  renderMrpChart(d.rows)
}
function exportMrpXlsx(onlyBuy=false){
  if(!window.XLSX){
    alert('O gerador de Excel não carregou. Verifique a internet e reabra o PCP Visual.');
    return;
  }
  let d=mrpData(),rows=onlyBuy?d.rows.filter(r=>(r.buy||0)>0||r.status==='REVISAR'):d.rows;
  let headers=['Código CIGAM','Matéria-prima','Estoque atual (kg)','Necessidade do plano (kg)','Saldo projetado (kg)','Comprar mínimo (kg)','Situação'];
  let data=[headers,...rows.map(r=>[
    String(r.code||''),
    String(r.material||''),
    r.stock===null||r.stock===undefined?'':Number(r.stock),
    r.req===null||r.req===undefined?'':Number(r.req),
    r.proj===null||r.proj===undefined?'':Number(r.proj),
    r.buy===null||r.buy===undefined?'':Number(r.buy),
    String(r.status||'')
  ])];

  let ws=XLSX.utils.aoa_to_sheet(data);

  // Código CIGAM sempre como texto para preservar zeros à esquerda.
  for(let row=2;row<=data.length;row++){
    let c=ws['A'+row];
    if(c){c.t='s';c.z='@';c.v=String(c.v??'')}
  }

  // Colunas numéricas como números reais, com casas decimais preservadas.
  ['C','D','E','F'].forEach(col=>{
    for(let row=2;row<=data.length;row++){
      let c=ws[col+row];
      if(c && c.v!=='' && c.v!==null && c.v!==undefined){
        c.t='n';
        c.v=Number(c.v);
        c.z='#,##0.000000';
      }
    }
  });

  ws['!cols']=[
    {wch:16},
    {wch:52},
    {wch:21},
    {wch:25},
    {wch:23},
    {wch:23},
    {wch:18}
  ];
  ws['!autofilter']={ref:`A1:G${Math.max(1,data.length)}`};

  let wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,onlyBuy?'Somente Faltas':'MRP Compras');

  // Aba simples de resumo para facilitar o envio ao Compras.
  let buyRows=d.rows.filter(r=>(r.buy||0)>0);
  let summary=[
    ['PCP C-TEC — MRP / Compras'],
    ['Gerado em',new Date().toLocaleString('pt-BR')],
    ['Arquivo de estoque',MP.source||''],
    ['Estoque atualizado em',MP.updated||''],
    ['Bateladas consideradas',d.batches.length],
    ['Total de materiais',d.rows.length],
    ['Materiais com consumo',d.rows.filter(r=>r.req>0).length],
    ['Materiais com saldo projetado negativo',buyRows.length],
    ['Compra mínima total (kg)',buyRows.reduce((a,r)=>a+(Number(r.buy)||0),0)],
    [],
    ['Regra','Saldo projetado = Estoque atual - Necessidade do plano'],
    ['Observação','Comprar mínimo atende somente ao plano atual. Parâmetros de estoque serão incorporados futuramente.']
  ];
  let ws2=XLSX.utils.aoa_to_sheet(summary);
  ws2['!cols']=[{wch:40},{wch:70}];
  if(ws2['B9']){ws2['B9'].t='n';ws2['B9'].z='#,##0.000000'}
  XLSX.utils.book_append_sheet(wb,ws2,'Resumo');

  let name=onlyBuy?'PCP_CTEC_Compras_MP_Somente_Faltas.xlsx':'PCP_CTEC_Compras_MP_Tabela_Completa.xlsx';
  XLSX.writeFile(wb,name,{compression:true});
}
