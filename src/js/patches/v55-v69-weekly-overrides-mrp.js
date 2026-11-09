/**
 * Camada de Regras V55-V69: Layout Semanal, Vinculo Editavel Produto x Formula, Areas e Compras em Aberto
 */

// ============================================================================
// Patch Block #15 [id="v55-patch"]
// ============================================================================
(function(){
'use strict';

function v55Qty(c,k){ let v=N(c?.[k]); return Number.isFinite(v)?v:0; }
window.v55Qty=v55Qty;
/* V57: garante zero nas litragem sem produção, em vez de célula em branco. */
/* V58: zeros em todas as saídas semanais e sem coluna de tanque nas visualizações/relatórios. */
function v55Line(product){ return D.find(z=>norm(z.produto)===norm(product)&&!isSampleSku(z))?.linha||''; }
function v55StageButtons(b){
  let stage=stageOfBatch(b), si=Math.max(0,V41_STAGES.indexOf(stage));
  return V41_STAGES.map((s,i)=>{
    let cls=i<si?'done':i===si?'on':'', mark=i<=si?'✓':'';
    return `<td><button class="v41-stage ${cls}" title="${escHtml(s)}" onclick="setWeeklyStage('${b.id}','${s}')">${mark}</button></td>`;
  }).join('');
}

renderWeekly=function(){
  if(!$('weeklyDays'))return;
  let week=$('weekSelect')?.value||OPS.week||currentIsoWeek();
  OPS.week=week;
  let dates=isoWeekDates(week),arr=weeklyBatches(week),names=['SEGUNDA-FEIRA','TERÇA-FEIRA','QUARTA-FEIRA','QUINTA-FEIRA','SEXTA-FEIRA'],today=new Date().toISOString().slice(0,10);
  let total=arr.reduce((a,b)=>a+effectiveBatchKg(b),0),done=arr.filter(b=>stageOfBatch(b)==='Apontamento').reduce((a,b)=>a+effectiveBatchKg(b),0),prod=arr.filter(b=>stageOfBatch(b)==='Produção').reduce((a,b)=>a+effectiveBatchKg(b),0),analysis=arr.filter(b=>stageOfBatch(b)==='Análise').reduce((a,b)=>a+effectiveBatchKg(b),0),env=arr.filter(b=>stageOfBatch(b)==='Envase').reduce((a,b)=>a+effectiveBatchKg(b),0),fila=arr.filter(b=>stageOfBatch(b)==='Em Fila').reduce((a,b)=>a+effectiveBatchKg(b),0),mto=0,mts=0,bo=0;
  arr.forEach(b=>{let s=operationalSplitKg(b);mto+=s.mto;mts+=s.mts;if(sopOfBatch(b)==='BO')bo+=effectiveBatchKg(b)});
  if($('weekKg'))$('weekKg').textContent=fmtKg(total);
  if($('weekAvg'))$('weekAvg').textContent=fmtKg(total/5);
  if($('weekDoneKg'))$('weekDoneKg').textContent=fmtKg(done);
  if($('weekProdKg'))$('weekProdKg').textContent=fmtKg(prod);
  if($('weekAnalysisKg'))$('weekAnalysisKg').textContent=fmtKg(analysis);
  if($('weekFillKg'))$('weekFillKg').textContent=fmtKg(env);
  if($('weekQueueKg'))$('weekQueueKg').textContent=fmtKg(fila);
  if($('weekBatchProgress'))$('weekBatchProgress').textContent=`${arr.filter(b=>stageOfBatch(b)==='Apontamento').length} / ${arr.length}`;
  if($('weekSop'))$('weekSop').textContent=`${fmtKg(mto)} / ${fmtKg(mts)} / ${fmtKg(bo)}`;

  $('weeklyDays').innerHTML=dates.map((d,i)=>{
    let bs=arr.filter(b=>b.date===d),kg=bs.reduce((a,b)=>a+effectiveBatchKg(b),0);
    let rows=bs.map(b=>{
      let c=batchCounts(b),line=v55Line(b.produto);
      return `<tr class="${lineClass(line)}"><td>${lineTag(line)}</td><td><b>${escHtml(b.produto)}</b></td><td>${v55Qty(c,'1')}</td><td>${v55Qty(c,'5')}</td><td>${v55Qty(c,'20')}</td><td>${v55Qty(c,'50')}</td><td>${v55Qty(c,'200')}</td><td>${v55Qty(c,'150')}</td><td>${escHtml(b.lot||'')}</td><td><b>${fmtKg(effectiveBatchKg(b))}</b></td><td><b>${escHtml(sopOfBatch(b))}</b></td>${v55StageButtons(b)}</tr>`;
    }).join('');
    return `<div class=v41-day><div class="v41-day-head ${d===today?'today':''}"><b>${names[i]} • ${new Date(d+'T12:00:00').toLocaleDateString('pt-BR')}${d===today?' • HOJE':''}</b><span>${bs.length} batelada(s)</span><b>${fmtKg(kg)}</b></div><div class=tablewrap><table class=v41-week-table><thead><tr><th>Linha</th><th>Produto</th><th>1L</th><th>5L</th><th>20L</th><th>50L</th><th>200L</th><th>Amostra</th><th>Lote</th><th>Kg</th><th>S&amp;OP</th><th>Fila</th><th>Produção</th><th>Análise</th><th>Envase</th><th>Apont.</th></tr></thead><tbody>${rows||'<tr><td colspan=16 class=muted>Nenhuma produção programada.</td></tr>'}</tbody></table></div></div>`;
  }).join('');

  let pack=packagingAggregate(arr),boxes=boxAggregate(arr);
  if($('weeklyPackaging'))$('weeklyPackaging').innerHTML=pack.length?`<div class=v41-order-list>${pack.map(r=>`<div class=v41-order-chip><b>${r.size}L ${escHtml(r.color)} • Mod. ${escHtml(r.model)}</b><br>${r.qty.toLocaleString('pt-BR')} un.</div>`).join('')}</div>`:'<div class=chartempty>Sem consumo de bombonas nesta semana.</div>';
  if($('weeklyBoxes'))$('weeklyBoxes').innerHTML=boxes.length?`<div class=v41-order-list>${boxes.map(r=>`<div class=v41-order-chip><b>${escHtml(r.type)}</b><br>${r.boxes} caixa(s) • ${r.units} bombonas</div>`).join('')}</div>`:'<div class=chartempty>Sem caixas de 5L nesta semana.</div>';
};

weeklyText=function(){
  let week=$('weekSelect').value,arr=v41WeeklyRows(week),lines=['PROGRAMAÇÃO SEMANAL DE PRODUÇÃO'];
  arr.forEach(b=>{let c=batchCounts(b);lines.push(`${b.date?.split('-').reverse().join('/')||'—'} | ${b.produto} | 1L ${v55Qty(c,'1')} | 5L ${v55Qty(c,'5')} | 20L ${v55Qty(c,'20')} | 50L ${v55Qty(c,'50')} | 200L ${v55Qty(c,'200')} | Amostra ${v55Qty(c,'150')} | ${fmtKg(effectiveBatchKg(b))} | S&OP ${sopOfBatch(b)} | ${stageOfBatch(b)}`)});
  return lines.join('\n');
};

exportWeeklyCsv=function(){
  let week=$('weekSelect').value,arr=v41WeeklyRows(week),h=['Data','Linha','Produto','1L','5L','20L','50L','200L','Amostra','Lote','Kg','S&OP','Etapa'];
  let csv=[h.join(';'),...arr.map(b=>{let c=batchCounts(b);return[b.date,v55Line(b.produto),b.produto,v55Qty(c,'1'),v55Qty(c,'5'),v55Qty(c,'20'),v55Qty(c,'50'),v55Qty(c,'200'),v55Qty(c,'150'),b.lot||'',effectiveBatchKg(b),sopOfBatch(b),stageOfBatch(b)].map(escCsv).join(';')})].join('\n');
  downloadTextFile(`Programacao_Semanal_${week}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');
};

function v55PrintableWeek(){
  let week=$('weekSelect').value,arr=v41WeeklyRows(week),dates=isoWeekDates(week),names=['SEGUNDA-FEIRA','TERÇA-FEIRA','QUARTA-FEIRA','QUINTA-FEIRA','SEXTA-FEIRA'];
  return `<h2>PROGRAMAÇÃO SEMANAL DE PRODUÇÃO</h2>${dates.map((d,i)=>{let bs=arr.filter(b=>b.date===d);return `<h3>${names[i]} • ${new Date(d+'T12:00:00').toLocaleDateString('pt-BR')}</h3><table><thead><tr><th>Produto</th><th>1L</th><th>5L</th><th>20L</th><th>50L</th><th>200L</th><th>Amostra</th><th>Kg</th><th>S&amp;OP</th><th>Etapa</th></tr></thead><tbody>${(bs.length?bs:[null]).map(b=>{if(!b)return '<tr><td colspan=10>Nenhuma produção programada.</td></tr>';let c=batchCounts(b);return `<tr><td>${escHtml(b.produto)}</td><td>${v55Qty(c,'1')}</td><td>${v55Qty(c,'5')}</td><td>${v55Qty(c,'20')}</td><td>${v55Qty(c,'50')}</td><td>${v55Qty(c,'200')}</td><td>${v55Qty(c,'150')}</td><td>${fmtKg(effectiveBatchKg(b))}</td><td>${escHtml(sopOfBatch(b))}</td><td>${escHtml(stageOfBatch(b))}</td></tr>`}).join('')}</tbody></table>`}).join('')}`;
}
printWeekly=function(){let w=window.open('','_blank');if(!w){alert('Permita pop-ups para imprimir.');return}w.document.write(`<html><head><title>Programação Semanal</title><style>body{font-family:Arial;padding:18px;color:#111}table{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:11px}th,td{border:1px solid #ddd;padding:5px}th{background:#eee}</style></head><body>${v55PrintableWeek()}</body></html>`);w.document.close();w.print()};

window.v55WeekPeriod = v55WeekPeriod;
function v55WeekPeriod(){
  let week=$('weekSelect')?.value||OPS.week||currentIsoWeek(),dates=isoWeekDates(week);
  return `${new Date(dates[0]+'T12:00:00').toLocaleDateString('pt-BR')} a ${new Date(dates[4]+'T12:00:00').toLocaleDateString('pt-BR')}`;
}
window.v55EnsureExportHeader = v55EnsureExportHeader;
function v55EnsureExportHeader(){
  const sec=$('semanal');if(!sec)return;
  let h=$('v55ExportHeader');
  if(!h){h=document.createElement('div');h.id='v55ExportHeader';sec.insertBefore(h,sec.firstChild)}
  const logo=document.querySelector('aside .logo img')?.src||'';
  h.innerHTML=`<div class=brand>${logo?`<img src="${logo}" alt="Grupo C-TEC">`:''}<div><h2>PROGRAMAÇÃO SEMANAL DE PRODUÇÃO</h2><p>Mesma tabela utilizada para operação e acompanhamento.</p></div></div><div class=meta><b>${v55WeekPeriod()}</b><br>Gerado em ${new Date().toLocaleString('pt-BR')}</div>`;
}
async function v55DownloadSameTablePng(){
  const sec=$('semanal');if(!sec){alert('Programação semanal não encontrada.');return}
  if(typeof html2canvas!=='function'){alert('O gerador de imagem não carregou. Abra o sistema com internet e tente novamente.');return}
  v55EnsureExportHeader();sec.classList.add('v55-exporting');
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  try{
    const canvas=await html2canvas(sec,{backgroundColor:'#ffffff',scale:1.2,useCORS:true,logging:false,windowWidth:Math.max(1200,sec.scrollWidth+20)});
    const week=$('weekSelect')?.value||OPS.week||currentIsoWeek(),a=document.createElement('a');
    a.download=`Programacao_Semanal_CTEC_${week}.png`;a.href=canvas.toDataURL('image/png');document.body.appendChild(a);a.click();a.remove();
  }catch(err){console.error(err);alert('Não foi possível gerar a imagem da tabela semanal.')}finally{sec.classList.remove('v55-exporting')}
}
window.downloadWeeklyPng=v55DownloadSameTablePng;

function v55Wire(){
  if($('weekSharePng'))$('weekSharePng').onclick=v55DownloadSameTablePng;
  if($('weekPrint'))$('weekPrint').onclick=printWeekly;
  if($('weekCsv'))$('weekCsv').onclick=exportWeeklyCsv;
  if($('weekCopy'))$('weekCopy').onclick=()=>copyText(weeklyText());
  const p=document.querySelector('#semanal .hero p');if(p)p.textContent='Esta é a única tabela semanal: você opera nela e a imagem do WhatsApp é gerada diretamente desta mesma tabela.';
}

v55Wire();
renderWeekly();
v55Wire();
})();

// ============================================================================
// Patch Block #16 [id="v56-patch"]
// ============================================================================
(function(){
'use strict';

/*
V56
Mantém integralmente o layout semanal da V55.
A informação de TANQUE continua disponível somente na criação/edição da batelada,
mas é removida de qualquer tabela semanal destinada ao pessoal da produção.
Como a imagem é gerada da mesma tabela operacional, ela também fica sem o tanque.
*/
function v56RemoveTankFromWeeklyTables(){
  document.querySelectorAll('#weeklyDays table').forEach(table=>{
    const headers=[...table.querySelectorAll('thead th')];
    const indexes=[];
    headers.forEach((th,i)=>{
      if(/^tanque$/i.test((th.textContent||'').trim())) indexes.push(i);
    });
    indexes.sort((a,b)=>b-a).forEach(idx=>{
      table.querySelectorAll('tr').forEach(tr=>{
        const cells=[...tr.children];
        if(cells[idx]) cells[idx].remove();
      });
    });
  });
}

const v56RenderWeeklyPrev=renderWeekly;
renderWeekly=function(){
  v56RenderWeeklyPrev();
  v56RemoveTankFromWeeklyTables();
};

// Garante também antes de gerar a imagem da mesma tabela.
const v56PngPrev=window.downloadWeeklyPng;
if(typeof v56PngPrev==='function'){
  window.downloadWeeklyPng=async function(){
    v56RemoveTankFromWeeklyTables();
    return await v56PngPrev();
  };
}

function v56Wire(){
  v56RemoveTankFromWeeklyTables();
  if($('weekSharePng') && typeof window.downloadWeeklyPng==='function') $('weekSharePng').onclick=window.downloadWeeklyPng;
  const p=document.querySelector('#semanal .hero p');
  if(p)p.textContent='Esta é a única tabela semanal: você opera nela e a imagem do WhatsApp é gerada diretamente desta mesma tabela. ';
}

renderWeekly();
v56Wire();
})();

// ============================================================================
// Patch Block #17 [id="v59-patch"]
// ============================================================================
(function(){
'use strict';

/*
V59 — correção definitiva da programação semanal.
- Não depende de constantes internas de versões antigas.
- Mostra 0 em todas as apresentações sem quantidade.
- Não mostra tanque na tabela semanal, PNG, impressão, CSV ou resumo.
- Mantém tanque somente dentro da criação/edição da batelada.
*/
const V59_STAGES=['Em Fila','Produção','Análise','Envase','Apontamento'];
function v59Qty(c,k){
  const n=Number(c && c[k]);
  return Number.isFinite(n)?n:0;
}
function v59Line(product){
  return D.find(z=>norm(z.produto)===norm(product)&&!isSampleSku(z))?.linha||'';
}
function v59StageButtons(b){
  const stage=stageOfBatch(b), idx=Math.max(0,V59_STAGES.indexOf(stage));
  return V59_STAGES.map((s,i)=>{
    const cls=i<idx?'done':i===idx?'on':'', mark=i<=idx?'✓':'';
    return `<td><button class="v41-stage ${cls}" title="${escHtml(s)}" onclick="setWeeklyStage('${b.id}','${s}')">${mark}</button></td>`;
  }).join('');
}

renderWeekly=function(){
  if(!$('weeklyDays'))return;
  const week=$('weekSelect')?.value||OPS.week||currentIsoWeek();
  OPS.week=week;
  const dates=isoWeekDates(week), arr=weeklyBatches(week), names=['SEGUNDA-FEIRA','TERÇA-FEIRA','QUARTA-FEIRA','QUINTA-FEIRA','SEXTA-FEIRA'], today=new Date().toISOString().slice(0,10);
  const total=arr.reduce((a,b)=>a+effectiveBatchKg(b),0),
        done=arr.filter(b=>stageOfBatch(b)==='Apontamento').reduce((a,b)=>a+effectiveBatchKg(b),0),
        prod=arr.filter(b=>stageOfBatch(b)==='Produção').reduce((a,b)=>a+effectiveBatchKg(b),0),
        analysis=arr.filter(b=>stageOfBatch(b)==='Análise').reduce((a,b)=>a+effectiveBatchKg(b),0),
        env=arr.filter(b=>stageOfBatch(b)==='Envase').reduce((a,b)=>a+effectiveBatchKg(b),0),
        fila=arr.filter(b=>stageOfBatch(b)==='Em Fila').reduce((a,b)=>a+effectiveBatchKg(b),0);
  let mto=0,mts=0,bo=0;
  arr.forEach(b=>{const s=operationalSplitKg(b);mto+=s.mto;mts+=s.mts;if(sopOfBatch(b)==='BO')bo+=effectiveBatchKg(b)});
  if($('weekKg'))$('weekKg').textContent=fmtKg(total);
  if($('weekAvg'))$('weekAvg').textContent=fmtKg(total/5);
  if($('weekDoneKg'))$('weekDoneKg').textContent=fmtKg(done);
  if($('weekProdKg'))$('weekProdKg').textContent=fmtKg(prod);
  if($('weekAnalysisKg'))$('weekAnalysisKg').textContent=fmtKg(analysis);
  if($('weekFillKg'))$('weekFillKg').textContent=fmtKg(env);
  if($('weekQueueKg'))$('weekQueueKg').textContent=fmtKg(fila);
  if($('weekBatchProgress'))$('weekBatchProgress').textContent=`${arr.filter(b=>stageOfBatch(b)==='Apontamento').length} / ${arr.length}`;
  if($('weekSop'))$('weekSop').textContent=`${fmtKg(mto)} / ${fmtKg(mts)} / ${fmtKg(bo)}`;

  $('weeklyDays').innerHTML=dates.map((d,i)=>{
    const bs=arr.filter(b=>b.date===d),kg=bs.reduce((a,b)=>a+effectiveBatchKg(b),0);
    const rows=bs.map(b=>{
      const c=batchCounts(b),line=v59Line(b.produto);
      return `<tr class="${lineClass(line)}"><td>${lineTag(line)}</td><td><b>${escHtml(b.produto)}</b></td><td>${v59Qty(c,'1')}</td><td>${v59Qty(c,'5')}</td><td>${v59Qty(c,'20')}</td><td>${v59Qty(c,'50')}</td><td>${v59Qty(c,'200')}</td><td>${v59Qty(c,'150')}</td><td>${escHtml(b.lot||'')}</td><td><b>${fmtKg(effectiveBatchKg(b))}</b></td><td><b>${escHtml(sopOfBatch(b))}</b></td>${v59StageButtons(b)}</tr>`;
    }).join('');
    return `<div class=v41-day><div class="v41-day-head ${d===today?'today':''}"><b>${names[i]} • ${new Date(d+'T12:00:00').toLocaleDateString('pt-BR')}${d===today?' • HOJE':''}</b><span>${bs.length} batelada(s)</span><b>${fmtKg(kg)}</b></div><div class=tablewrap><table class=v41-week-table><thead><tr><th>Linha</th><th>Produto</th><th>1L</th><th>5L</th><th>20L</th><th>50L</th><th>200L</th><th>Amostra</th><th>Lote</th><th>Kg</th><th>S&amp;OP</th><th>Fila</th><th>Produção</th><th>Análise</th><th>Envase</th><th>Apont.</th></tr></thead><tbody>${rows||'<tr><td colspan=16 class=muted>Nenhuma produção programada.</td></tr>'}</tbody></table></div></div>`;
  }).join('');

  const pack=packagingAggregate(arr),boxes=boxAggregate(arr);
  if($('weeklyPackaging'))$('weeklyPackaging').innerHTML=pack.length?`<div class=v41-order-list>${pack.map(r=>`<div class=v41-order-chip><b>${r.size}L ${escHtml(r.color)} • Mod. ${escHtml(r.model)}</b><br>${r.qty.toLocaleString('pt-BR')} un.</div>`).join('')}</div>`:'<div class=chartempty>Sem consumo de bombonas nesta semana.</div>';
  if($('weeklyBoxes'))$('weeklyBoxes').innerHTML=boxes.length?`<div class=v41-order-list>${boxes.map(r=>`<div class=v41-order-chip><b>${escHtml(r.type)}</b><br>${r.boxes} caixa(s) • ${r.units} bombonas</div>`).join('')}</div>`:'<div class=chartempty>Sem caixas de 5L nesta semana.</div>';
};

weeklyText=function(){
  const week=$('weekSelect').value,arr=v41WeeklyRows(week),lines=['PROGRAMAÇÃO SEMANAL DE PRODUÇÃO'];
  arr.forEach(b=>{const c=batchCounts(b);lines.push(`${b.date?.split('-').reverse().join('/')||'—'} | ${b.produto} | 1L ${v59Qty(c,'1')} | 5L ${v59Qty(c,'5')} | 20L ${v59Qty(c,'20')} | 50L ${v59Qty(c,'50')} | 200L ${v59Qty(c,'200')} | Amostra ${v59Qty(c,'150')} | ${fmtKg(effectiveBatchKg(b))} | S&OP ${sopOfBatch(b)} | ${stageOfBatch(b)}`)});
  return lines.join('\n');
};
weeklyShareText=weeklyText;

exportWeeklyCsv=function(){
  const week=$('weekSelect').value,arr=v41WeeklyRows(week),h=['Data','Linha','Produto','1L','5L','20L','50L','200L','Amostra','Lote','Kg','S&OP','Etapa'];
  const csv=[h.join(';'),...arr.map(b=>{const c=batchCounts(b);return[b.date,v59Line(b.produto),b.produto,v59Qty(c,'1'),v59Qty(c,'5'),v59Qty(c,'20'),v59Qty(c,'50'),v59Qty(c,'200'),v59Qty(c,'150'),b.lot||'',effectiveBatchKg(b),sopOfBatch(b),stageOfBatch(b)].map(escCsv).join(';')})].join('\n');
  downloadTextFile(`Programacao_Semanal_${week}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8');
};

function v59PrintableWeek(){
  const week=$('weekSelect').value,arr=v41WeeklyRows(week),dates=isoWeekDates(week),names=['SEGUNDA-FEIRA','TERÇA-FEIRA','QUARTA-FEIRA','QUINTA-FEIRA','SEXTA-FEIRA'];
  return `<h2>PROGRAMAÇÃO SEMANAL DE PRODUÇÃO</h2>${dates.map((d,i)=>{const bs=arr.filter(b=>b.date===d);return `<h3>${names[i]} • ${new Date(d+'T12:00:00').toLocaleDateString('pt-BR')}</h3><table><thead><tr><th>Produto</th><th>1L</th><th>5L</th><th>20L</th><th>50L</th><th>200L</th><th>Amostra</th><th>Kg</th><th>S&amp;OP</th><th>Etapa</th></tr></thead><tbody>${(bs.length?bs:[null]).map(b=>{if(!b)return '<tr><td colspan=10>Nenhuma produção programada.</td></tr>';const c=batchCounts(b);return `<tr><td>${escHtml(b.produto)}</td><td>${v59Qty(c,'1')}</td><td>${v59Qty(c,'5')}</td><td>${v59Qty(c,'20')}</td><td>${v59Qty(c,'50')}</td><td>${v59Qty(c,'200')}</td><td>${v59Qty(c,'150')}</td><td>${fmtKg(effectiveBatchKg(b))}</td><td>${escHtml(sopOfBatch(b))}</td><td>${escHtml(stageOfBatch(b))}</td></tr>`}).join('')}</tbody></table>`}).join('')}`;
}
printWeekly=function(){
  const w=window.open('','_blank');if(!w){alert('Permita pop-ups para imprimir.');return}
  w.document.write(`<html><head><title>Programação Semanal</title><style>body{font-family:Arial;padding:18px;color:#111}table{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:11px}th,td{border:1px solid #ddd;padding:5px}th{background:#eee}</style></head><body>${v59PrintableWeek()}</body></html>`);w.document.close();w.print();
};

function v59Wire(){
  if($('weekSharePng')&&typeof window.downloadWeeklyPng==='function')$('weekSharePng').onclick=window.downloadWeeklyPng;
  if($('weekPrint'))$('weekPrint').onclick=printWeekly;
  if($('weekCsv'))$('weekCsv').onclick=exportWeeklyCsv;
  if($('weekCopy'))$('weekCopy').onclick=()=>copyText(weeklyText());
  const p=document.querySelector('#semanal .hero p');if(p)p.textContent='Esta é a única tabela semanal: você opera nela e a imagem do WhatsApp é gerada diretamente desta mesma tabela.';
}

renderWeekly();
v59Wire();
})();

// ============================================================================
// Patch Block #18 [id="v60-patch"]
// ============================================================================
(function(){
'use strict';

function v60AreaOptions(){
  return [...new Set(D.map(x=>String(x.linha||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'))
}
function v60RefreshAreaOptions(){
  let dl=$('areaOptions'); if(dl) dl.innerHTML=v60AreaOptions().map(a=>`<option value="${escHtml(a)}"></option>`).join('');
  let lines=v60AreaOptions();
  ['linha','stockLine','mpsLinha','batchSectorFilter'].forEach(id=>{
    let el=$(id); if(!el || el.tagName!=='SELECT') return;
    let current=el.value;
    let first=id==='linha'?'Todas as linhas':id==='stockLine'?'Todas as linhas':id==='mpsLinha'?'Todos os setores':'Todos os setores';
    el.innerHTML=`<option value="">${first}</option>`+lines.map(a=>`<option value="${escHtml(a)}">${escHtml(a)}</option>`).join('');
    if(lines.includes(current)) el.value=current;
  })
}

const v60OpenPrev=openItem;
openItem=function(item){
  v60OpenPrev(item);
  let x=D.find(z=>z.item===item); if(!x) return;
  v60RefreshAreaOptions();
  if($('mArea')) $('mArea').value=x.linha||'';
  if($('mEstoqueManual')) $('mEstoqueManual').value=x.est??'';
  if($('mEstoqueMotivo')) $('mEstoqueMotivo').value='';
  if($('chartSub')) $('chartSub').textContent=`Histórico de importações e ajustes manuais • Área atual: ${x.linha||'não definida'}`;
};

saveParams=function(){
  let x=D.find(z=>z.item===editingItem); if(!x) return;
  let r=$('mRef').value.trim(), a=$('mAtt').value.trim();
  let oldArea=String(x.linha||'').trim();
  let newArea=String($('mArea')?.value||'').trim();
  let oldStock=N(x.est);
  let stockRaw=String($('mEstoqueManual')?.value??'').trim();
  let newStock=stockRaw===''?null:Number(stockRaw.replace(',','.'));
  let motivo=String($('mEstoqueMotivo')?.value||'').trim();
  let now=new Date().toLocaleString('pt-BR');

  x.ref=r===''?'':Number(r);
  x.att=a===''?'':Number(a);
  x.tipo=$('mTipo').value||'Próprio';
  if(!isThird(x)) x.semPedido=false;

  if(newArea){
    x.linha=newArea;
    if(oldArea!==newArea){
      x.hist=x.hist||[];
      x.hist.push({data:now,estoque:x.est,rel:'Ajuste manual',evento:`ÁREA/LINHA ALTERADA: ${oldArea||'não definida'} → ${newArea}`});
    }
  }

  if(stockRaw!=='' && Number.isFinite(newStock) && newStock!==oldStock){
    x.ultimoEstoqueRelatorio=oldStock;
    x.est=newStock;
    x.atual=now;
    x.ajusteManualEstoque=true;
    x.ajusteManualData=now;
    x.ajusteManualMotivo=motivo||'Ajuste manual de estoque';
    x.hist=x.hist||[];
    x.hist.push({data:now,estoque:newStock,rel:'Ajuste manual',evento:`ESTOQUE AJUSTADO MANUALMENTE${motivo?` — ${motivo}`:''}${oldStock!==null?` (anterior: ${oldStock})`:''}`});
  }

  save();
  v60RefreshAreaOptions();
  render();
  renderMPS();
  renderBatches();
  renderWeekly();
  openItem(x.item)
};

// O próximo relatório CIGAM reassume o estoque oficial automaticamente.
const v60ImportPrev=importPDF;
importPDF=async function(file){
  await v60ImportPrev(file);
  D.forEach(x=>{
    if(x.ajusteManualEstoque && x.atual){
      // Se o item acabou de ser atualizado pelo importador, encerra a marcação manual.
      let last=(x.hist||[]).at(-1);
      if(last && last.rel===file.name){
        x.ajusteManualEstoque=false;
        x.ajusteManualMotivo='';
        x.ajusteManualData='';
      }
    }
  });
  save(); render();
};

// Exibe discretamente quando o estoque foi ajustado manualmente.
const v60RenderPrev=render;
render=function(){
  v60RenderPrev();
  ['body','body2'].forEach(id=>{
    let body=$(id); if(!body) return;
    body.querySelectorAll('tr[data-i]').forEach(tr=>{
      let item=decodeURIComponent(tr.dataset.i||''),x=D.find(z=>z.item===item); if(!x) return;
      let first=tr.children[0]; if(first) first.innerHTML=typeof dashLineBadge==='function'?dashLineBadge(x.linha):`<span class=area-inline>${escHtml(x.linha||'')}</span>`;
      if(x.ajusteManualEstoque){
        let cells=[...tr.children];
        let stockCell=id==='body'?cells[7]:cells[7];
        if(stockCell && !stockCell.querySelector('.manual-stock-note')) stockCell.insertAdjacentHTML('beforeend',' <span class=manual-stock-note title="'+escHtml(x.ajusteManualMotivo||'Ajuste manual')+'">AJUSTADO</span>');
      }
    })
  });
};

v60RefreshAreaOptions();
render();
})();

// ============================================================================
// Patch Block #19 [id="v61-patch"]
// ============================================================================
(function(){
'use strict';

/*
V61 — vínculo de Produto × Fórmula editável.
- Alterações salvas em OPS.formulaLinks e entram imediatamente no MRP.
- Produtos que existem no estoque, mas não estavam no cadastro de engenharia, também aparecem.
- Produtos da Bolívia recebem vínculo inicial com a fórmula equivalente, mas continuam editáveis.
*/

OPS.formulaLinks=OPS.formulaLinks||{};

const V61_BOL_DEFAULTS={
  'SURFA DROP ACELERA FIX (BOL)':{formula:'SURFA DROP ACELERA FIX',relation:'IGUAL',note:'Bolívia — usa a mesma fórmula do produto base.'},
  'SURFA DROP CONTROL (BOL)':{formula:'SURFA DROP CONTROL',relation:'IGUAL',note:'Bolívia — usa a mesma fórmula do produto base.'},
  'TEC CLEAN TANK (BOL)':{formula:'TEC CLEAN TANK',relation:'IGUAL',note:'Bolívia — usa a mesma fórmula do produto base.'},
  'SURFA DROP FOAM OFF (BOL)':{formula:'SURFA DROP FOAM OFF',relation:'IGUAL',note:'Bolívia — usa a mesma fórmula do produto base.'},
  'SURFA DROP D-LEMON (BOL)':{formula:'SURFA DROP D-LEMON',relation:'IGUAL',note:'Bolívia — usa a mesma fórmula do produto base.'}
};

function v61Key(product){return norm(product)}
window.v61Key=v61Key;
function v61Line(product){return D.find(x=>norm(x.produto)===norm(product)&&!isSampleSku(x))?.linha||PROD_FORMULA.find(x=>norm(x.product)===norm(product))?.line||''}
function v61Static(product){return PROD_FORMULA.find(x=>norm(x.product)===norm(product))||null}
function v61Override(product){return OPS.formulaLinks[v61Key(product)]||null}
function v61Current(product){
  let o=v61Override(product); if(o)return {...o,product};
  let s=v61Static(product); if(s)return {...s};
  return {product,formula:'',relation:'SEM FÓRMULA',note:'',active:true,line:v61Line(product)}
}
function v61AllProducts(){
  return [...new Set([
    ...PROD_FORMULA.map(x=>x.product),
    ...D.filter(x=>!isSampleSku(x)).map(x=>x.produto)
  ].filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'))
}
function v61SaveLink(product,patch){
  let cur=v61Current(product), next={...cur,...patch,product,line:v61Line(product),updatedAt:Date.now()};
  if(['DESCONTINUADO','DESCONSIDERADO'].includes(next.relation))next.active=false;else next.active=true;
  if(next.relation==='SEM FÓRMULA')next.formula='';
  OPS.formulaLinks[v61Key(product)]=next;
  save();
  renderEngineering();
  renderMRP();
}
function v61ResetLink(product){
  delete OPS.formulaLinks[v61Key(product)];
  save();renderEngineering();renderMRP();
}
window.v61ResetLink=v61ResetLink;

// Seed only once. User can later change or remove freely.
if(!OPS.formulaLinkSeedV61){
  Object.entries(V61_BOL_DEFAULTS).forEach(([product,d])=>{
    if(D.some(x=>norm(x.produto)===norm(product)) && !v61Override(product)){
      OPS.formulaLinks[v61Key(product)]={product,formula:d.formula,relation:d.relation,note:d.note,active:true,line:v61Line(product),updatedAt:Date.now()}
    }
  });
  OPS.formulaLinkSeedV61=true;
  save();
}

// Override final lookup used by MRP.
const v61FormulaLookupPrev=productFormulaLink;
productFormulaLink=function(product){
  let o=v61Override(product);
  if(o){
    if(o.active===false||['DESCONTINUADO','DESCONSIDERADO'].includes(o.relation))return null;
    return {...o,product};
  }
  return v61FormulaLookupPrev(product)
};

function v61RelationOptions(selected){
  return ['BASE','IGUAL','VARIAÇÃO','SEM FÓRMULA','PENDENTE','DESCONTINUADO','DESCONSIDERADO']
    .map(x=>`<option value="${x}" ${x===selected?'selected':''}>${x}</option>`).join('')
}
function v61FormulaOptions(selected){
  let names=(FORMULAS||[]).map(f=>f.name).sort((a,b)=>a.localeCompare(b,'pt-BR'));
  return `<option value="">— SEM FÓRMULA —</option>`+names.map(n=>`<option value="${escHtml(n)}" ${n===selected?'selected':''}>${escHtml(n)}</option>`).join('')
}
function v61EnsureNotice(){
  let view=$('eng_produtos'); if(!view||view.querySelector('.v61-eng-note'))return;
  let tb=view.querySelector('.tablewrap');
  if(tb)tb.insertAdjacentHTML('beforebegin','<div class="v61-eng-note"><b>Vínculo editável:</b> selecione a relação e a fórmula de cada produto. A alteração é salva automaticamente e passa a ser usada imediatamente pelo MRP. Produtos “(BOL)” podem utilizar a mesma fórmula do produto correspondente.</div>')
}

renderEngineering=function(){
  try{
    if(!$('engFormulaBody'))return;
    v61EnsureNotice();

    // Fórmulas
    let q=($('engQ')?.value||'').trim().toUpperCase(),typ=$('engType')?.value||'',fs=(FORMULAS||[]).filter(f=>(!typ||f.status===typ)&&(!q||`${f.name} ${f.base||''} ${(f.components||[]).map(c=>c.material).join(' ')}`.toUpperCase().includes(q)));
    $('engFormulaBody').innerHTML=fs.length?fs.map(f=>{let sum=formulaSum(f),linked=v61AllProducts().filter(p=>productFormulaLink(p)?.formula===f.name),filled=linked.filter(p=>BATCH_REFS[p]!==undefined&&BATCH_REFS[p]!=='').length;return `<tr data-formula="${encodeURIComponent(f.name)}"><td><b>${escHtml(f.name)}</b></td><td>${engBadge(f.status)}</td><td>${escHtml(f.base||'—')}</td><td>${f.pending?'—':(f.components||[]).length}</td><td><span class="formula-sum ${sumClass(sum)}">${f.pending?'—':sum.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:5})+'%'}</span></td><td>${linked.length?`${filled}/${linked.length}`:'—'}</td><td>${escHtml(f.note||'')}</td></tr>`}).join(''):'<tr><td colspan=7 class=muted>Nenhuma fórmula encontrada.</td></tr>';
    $('engFormulaBody').querySelectorAll('tr[data-formula]').forEach(tr=>tr.onclick=()=>openFormula(decodeURIComponent(tr.dataset.formula)));

    // Produtos × fórmulas editável
    let pq=($('engProdQ')?.value||'').trim().toUpperCase(),rel=$('engProdRel')?.value||'';
    let products=v61AllProducts().map(product=>({product,link:v61Current(product)})).filter(r=>(!rel||r.link.relation===rel)&&(!pq||`${r.product} ${r.link.formula||''} ${r.link.line||v61Line(r.product)}`.toUpperCase().includes(pq)));

    $('engProductBody').innerHTML=products.length?products.map(({product,link})=>{
      let f=formulaGet(link.formula),base=f?.base||'',br=BATCH_REFS[product]??'',pack5='—',box5='—';
      try{let z=packagingSpec(product,'5'),bx=boxSpec(product);pack5=z?`${z.color} • Mod. ${z.model}`:'—';box5=bx?`${bx.type} • ${bx.units} un.`:'—'}catch(e){}
      let bol=/\(BOL\)/i.test(product),valid=!!link.formula&&!!formulaGet(link.formula)&&!formulaGet(link.formula)?.pending;
      return `<tr class="${valid?'v61-linked':'v61-unlinked'}">
        <td>${escHtml(v61Line(product)||link.line||'')}</td>
        <td><b>${escHtml(product)}</b>${bol?'<span class=v61-bol-tag>BOLÍVIA</span>':''}</td>
        <td><select class=v61-rel-select data-product="${encodeURIComponent(product)}">${v61RelationOptions(link.relation||'SEM FÓRMULA')}</select></td>
        <td><select class=v61-formula-select data-product="${encodeURIComponent(product)}">${v61FormulaOptions(link.formula||'')}</select>${valid?'<div class=v61-save-status>Vínculo válido para MRP</div>':''}</td>
        <td>${escHtml(base||'—')}</td>
        <td>${escHtml(pack5)}</td>
        <td>${escHtml(box5)}</td>
        <td>${link.active===false?'—':`<input class=batch-ref-inline data-product="${encodeURIComponent(product)}" type=number min=0 step=any value="${escHtml(br)}" placeholder="kg">`}</td>
        <td><input class=v61-note-input data-product="${encodeURIComponent(product)}" value="${escHtml(link.note||'')}" placeholder="Observação"></td>
        <td><button class="smallbtn secondary v61-reset" onclick="v61ResetLink('${encodeURIComponent(product)}')">Restaurar</button></td>
      </tr>`
    }).join(''):'<tr><td colspan=10 class=muted>Nenhum produto encontrado.</td></tr>';

    $('engProductBody').querySelectorAll('.v61-formula-select').forEach(sel=>{
      sel.onchange=e=>{e.stopPropagation();let product=decodeURIComponent(sel.dataset.product),cur=v61Current(product),formula=sel.value,relation=cur.relation||'IGUAL';if(!formula)relation='SEM FÓRMULA';else if(relation==='SEM FÓRMULA')relation='IGUAL';v61SaveLink(product,{formula,relation})}
    });
    $('engProductBody').querySelectorAll('.v61-rel-select').forEach(sel=>{
      sel.onchange=e=>{e.stopPropagation();let product=decodeURIComponent(sel.dataset.product);v61SaveLink(product,{relation:sel.value})}
    });
    $('engProductBody').querySelectorAll('.v61-note-input').forEach(inp=>{
      inp.onchange=e=>{e.stopPropagation();let product=decodeURIComponent(inp.dataset.product);v61SaveLink(product,{note:inp.value})}
    });
    $('engProductBody').querySelectorAll('.batch-ref-inline').forEach(inp=>{
      inp.onclick=e=>e.stopPropagation();inp.onchange=e=>{e.stopPropagation();let p=decodeURIComponent(inp.dataset.product),v=inp.value.trim();BATCH_REFS[p]=v===''?'':Number(v);save();renderMRP()}
    });

    // Embalagens
    if($('engPackBody')){
      let eq=($('engPackQ')?.value||'').trim().toUpperCase(),packs=[];(PACKAGING_MASTER||[]).forEach(p=>{try{let ps5=packagingSpec(p.product,'5'),bx=boxSpec(p.product),hay=`${p.line} ${p.product} ${p.brand} ${ps5?.color||''} ${bx?.type||''}`.toUpperCase();if(ps5&&(!eq||hay.includes(eq)))packs.push({p,ps5,bx})}catch(e){}});
      $('engPackBody').innerHTML=packs.length?packs.map(({p,ps5,bx})=>`<tr><td>${escHtml(p.line||'')}</td><td><b>${escHtml(p.product)}</b></td><td>${escHtml(p.brand||'—')}</td><td>${escHtml(ps5?.color||'—')}</td><td>${escHtml(ps5?.model||'C')}</td><td><b>${escHtml(bx?.type||'—')}</b></td><td>${bx?.units||'—'}</td></tr>`).join(''):'<tr><td colspan=7 class=muted>Nenhum cadastro de embalagem 5L encontrado.</td></tr>'
    }

    let all=v61AllProducts(), linked=all.filter(p=>{let l=productFormulaLink(p);return l&&l.formula&&formulaGet(l.formula)});
    $('engFormulaCount').textContent=(FORMULAS||[]).filter(f=>!f.pending).length;
    $('engProductCount').textContent=linked.length;
    $('engVariationCount').textContent=(FORMULAS||[]).filter(f=>f.status==='VARIAÇÃO').length;
    $('engPendingCount').textContent=all.filter(p=>{let l=productFormulaLink(p);return !l||!l.formula||!formulaGet(l.formula)||formulaGet(l.formula)?.pending}).length
  }catch(err){
    console.error('Engenharia V61:',err);
    if($('engProductBody'))$('engProductBody').innerHTML='<tr><td colspan=10><div class=safe-error>Erro ao carregar vínculos editáveis. Os demais módulos continuam funcionando.</div></td></tr>'
  }
};

// Rebind engineering filters to the new renderer.
if($('engQ'))$('engQ').oninput=renderEngineering;
if($('engType'))$('engType').onchange=renderEngineering;
if($('engProdQ'))$('engProdQ').oninput=renderEngineering;
if($('engProdRel'))$('engProdRel').onchange=renderEngineering;
if($('engPackQ'))$('engPackQ').oninput=renderEngineering;

renderEngineering();
renderMRP();
})();

// ============================================================================
// Patch Block #20 [id="v62-patch"]
// ============================================================================
(function(){
'use strict';

OPS.areaOverrides=OPS.areaOverrides||{};
OPS.stockOverrides=OPS.stockOverrides||{};

function v62ProductKey(product){ return norm(product||''); }
function v62ItemKey(x){ return norm((x&&x.item)||''); }
function v62ApplyOverrides(){
  D.forEach(x=>{
    let ak=v62ProductKey(x.produto), area=OPS.areaOverrides[ak];
    if(area) x.linha=area;
    let sk=v62ItemKey(x), ov=OPS.stockOverrides[sk];
    if(ov && Number.isFinite(Number(ov.value))){
      x.est=Number(ov.value);
      x.ajusteManualEstoque=true;
      x.ajusteManualData=ov.date||x.ajusteManualData||'';
      x.ajusteManualMotivo=ov.reason||x.ajusteManualMotivo||'Ajuste manual de estoque';
      if(ov.date) x.atual=ov.date;
    }
  });
}

function v62RefreshAreaUI(){
  if(typeof v60RefreshAreaOptions==='function') v60RefreshAreaOptions();
}

function v62SaveParams(){
  let x=D.find(z=>z.item===editingItem); if(!x) return;
  let r=String($('mRef')?.value??'').trim(), a=String($('mAtt')?.value??'').trim();
  let newArea=String($('mArea')?.value||'').trim();
  let oldStock=N(x.est), stockRaw=String($('mEstoqueManual')?.value??'').trim();
  let newStock=stockRaw===''?null:Number(stockRaw.replace(',','.'));
  let motivo=String($('mEstoqueMotivo')?.value||'').trim();
  let now=new Date().toLocaleString('pt-BR');

  x.ref=r===''?'':Number(r);
  x.att=a===''?'':Number(a);
  x.tipo=$('mTipo')?.value||'Próprio';
  if(!isThird(x)) x.semPedido=false;

  if(newArea){
    let pk=v62ProductKey(x.produto);
    OPS.areaOverrides[pk]=newArea;
    D.filter(z=>v62ProductKey(z.produto)===pk).forEach(z=>{
      let before=String(z.linha||'').trim();
      z.linha=newArea;
      if(before!==newArea){
        z.hist=z.hist||[];
        z.hist.push({data:now,estoque:z.est,rel:'Ajuste manual',evento:`ÁREA/LINHA ALTERADA: ${before||'não definida'} → ${newArea}`});
      }
    });
  }

  if(stockRaw!=='' && Number.isFinite(newStock)){
    let sk=v62ItemKey(x);
    if(newStock!==oldStock || !OPS.stockOverrides[sk]){
      x.ultimoEstoqueRelatorio=(x.ultimoEstoqueRelatorio!==undefined?x.ultimoEstoqueRelatorio:oldStock);
      x.est=newStock;
      x.atual=now;
      x.ajusteManualEstoque=true;
      x.ajusteManualData=now;
      x.ajusteManualMotivo=motivo||'Ajuste manual de estoque';
      OPS.stockOverrides[sk]={value:newStock,reason:x.ajusteManualMotivo,date:now,item:x.item,produto:x.produto};
      x.hist=x.hist||[];
      x.hist.push({data:now,estoque:newStock,rel:'Ajuste manual',evento:`ESTOQUE AJUSTADO MANUALMENTE${motivo?` — ${motivo}`:''}${oldStock!==null?` (anterior: ${oldStock})`:''}`});
    }else if(motivo){
      x.ajusteManualMotivo=motivo;
      OPS.stockOverrides[sk].reason=motivo;
    }
  }

  save();
  v62RefreshAreaUI();
  render();
  try{renderMPS()}catch(e){console.error(e)}
  try{renderBatches()}catch(e){console.error(e)}
  try{renderWeekly()}catch(e){console.error(e)}
  try{renderMRP()}catch(e){console.error(e)}
  openItem(x.item);
  let st=$('v62SaveStatus');
  if(!st){
    st=document.createElement('span'); st.id='v62SaveStatus';
    $('saveParam')?.insertAdjacentElement('afterend',st);
  }
  if(st){st.textContent='✓ Alterações salvas'; setTimeout(()=>{if(st)st.textContent=''},2200)}
}

// A V60 criou a nova função, mas o clique continuava ligado à função antiga.
// Aqui o botão é explicitamente religado à rotina correta.
saveParams=v62SaveParams;
if($('saveParam')) $('saveParam').onclick=v62SaveParams;

const v62OpenPrev=openItem;
openItem=function(item){
  let x=D.find(z=>z.item===item);
  if(x){
    let area=OPS.areaOverrides[v62ProductKey(x.produto)]; if(area) x.linha=area;
    let ov=OPS.stockOverrides[v62ItemKey(x)]; if(ov&&Number.isFinite(Number(ov.value))) x.est=Number(ov.value);
  }
  v62OpenPrev(item);
  x=D.find(z=>z.item===item); if(!x)return;
  if($('mArea'))$('mArea').value=x.linha||'';
  if($('mEstoqueManual'))$('mEstoqueManual').value=x.est??'';
  if($('mEstoqueMotivo'))$('mEstoqueMotivo').value=x.ajusteManualMotivo||'';
};

const v62ImportPrev=importPDF;
importPDF=async function(file){
  await v62ImportPrev(file);
  Object.keys(OPS.stockOverrides||{}).forEach(sk=>{
    let x=D.find(z=>v62ItemKey(z)===sk); if(!x)return;
    let imported=(x.hist||[]).some(h=>h&&h.rel===file.name);
    if(imported){
      delete OPS.stockOverrides[sk];
      x.ajusteManualEstoque=false;
      x.ajusteManualMotivo='';
      x.ajusteManualData='';
    }
  });
  D.forEach(x=>{let area=OPS.areaOverrides[v62ProductKey(x.produto)]; if(area)x.linha=area});
  save();
  v62RefreshAreaUI();
  render();
};

const v62RestorePrev=restoreBackup;
restoreBackup=async function(file){
  await v62RestorePrev(file);
  OPS.areaOverrides=OPS.areaOverrides||{};
  OPS.stockOverrides=OPS.stockOverrides||{};
  v62ApplyOverrides();
  save();
  v62RefreshAreaUI();
  render();
};
if($('restore')) $('restore').onchange=async e=>{let f=e.target.files[0];if(!f)return;try{await restoreBackup(f)}catch(err){alert('Erro ao restaurar backup: '+err.message)}e.target.value=''};

v62ApplyOverrides();
save();
v62RefreshAreaUI();
render();
})();

// ============================================================================
// Patch Block #21 [id="v63-patch"]
// ============================================================================
(function(){
'use strict';

/*
V63
- Classificação/Área passa a ter persistência forte por PRODUTO.
- Estoque manual passa a ter persistência forte por CÓDIGO CIGAM (fallback item).
- O botão Salvar é recriado para eliminar handlers antigos.
- Overrides são reaplicados antes de qualquer renderização importante.
- Dorum Pos Green é corrigido como MAPA VETERINÁRIO por padrão.
*/

OPS.areaOverrides=OPS.areaOverrides||{};
OPS.stockOverrides=OPS.stockOverrides||{};
OPS.v63AreaOverrides=OPS.v63AreaOverrides||{};
OPS.v63StockOverrides=OPS.v63StockOverrides||{};

const V63_AREAS=[
  'ANVISA',
  'MAPA VETERINÁRIO',
  'MAPA AGRÍCOLA FERTILIZANTES',
  'MAPA AGRÍCOLA ADJUVANTES',
  'AMOSTRAS',
  'EXPORTAÇÃO',
  'OUTROS'
];

function v63NormProduct(v){return norm(v||'')}
function v63StockKey(x){
  let c=String(x?.cod||'').trim();
  return c?'COD:'+c.replace(/\D/g,''):'ITEM:'+norm(x?.item||'');
}
function v63AreaFor(x){
  OPS.v63AreaOverrides=OPS.v63AreaOverrides||{};
  OPS.areaOverrides=OPS.areaOverrides||{};
  let k=v63NormProduct(x?.produto);
  return OPS.v63AreaOverrides[k]||OPS.areaOverrides[k]||String(x?.linha||'').trim();
}
function v63StockOverrideFor(x){
  OPS.v63StockOverrides=OPS.v63StockOverrides||{};
  OPS.stockOverrides=OPS.stockOverrides||{};
  let k=v63StockKey(x);
  return OPS.v63StockOverrides[k]||OPS.stockOverrides[norm(x?.item||'')]||null;
}
function v63ApplyAll(){
  OPS.areaOverrides=OPS.areaOverrides||{};
  OPS.stockOverrides=OPS.stockOverrides||{};
  OPS.v63AreaOverrides=OPS.v63AreaOverrides||{};
  OPS.v63StockOverrides=OPS.v63StockOverrides||{};
  D.forEach(x=>{
    let area=v63AreaFor(x);
    if(area)x.linha=area;
    let ov=v63StockOverrideFor(x);
    if(ov&&Number.isFinite(Number(ov.value))){
      x.est=Number(ov.value);
      x.ajusteManualEstoque=true;
      x.ajusteManualData=ov.date||x.ajusteManualData||'';
      x.ajusteManualMotivo=ov.reason||x.ajusteManualMotivo||'Ajuste manual de estoque';
      if(ov.date)x.atual=ov.date;
    }
  });
}
window.v63ApplyAll=v63ApplyAll;

function v63EnsureAreaControl(){
  let old=$('mArea'); if(!old)return;
  let current=old.value||'';
  if(old.tagName!=='SELECT'){
    let sel=document.createElement('select');
    sel.id='mArea';
    sel.name='mArea';
    old.replaceWith(sel);
    old=sel;
  }
  let existing=[...new Set([...V63_AREAS,...D.map(x=>String(x.linha||'').trim()).filter(Boolean)])];
  old.innerHTML=existing.map(a=>`<option value="${escHtml(a)}">${escHtml(a)}</option>`).join('');
  if(current&&!existing.includes(current)){
    old.insertAdjacentHTML('beforeend',`<option value="${escHtml(current)}">${escHtml(current)}</option>`);
  }
  if(current)old.value=current;
}

function v63SetArea(product,area,now){
  let pk=v63NormProduct(product);
  OPS.v63AreaOverrides[pk]=area;
  OPS.areaOverrides[pk]=area; // compatibilidade com V60/V62
  D.filter(z=>v63NormProduct(z.produto)===pk).forEach(z=>{
    let before=String(z.linha||'').trim();
    z.linha=area;
    if(before!==area){
      z.hist=z.hist||[];
      z.hist.push({data:now,estoque:z.est,rel:'Ajuste manual',evento:`ÁREA/LINHA ALTERADA: ${before||'não definida'} → ${area}`});
    }
  });
}

function v63SetStock(x,value,reason,now){
  let key=v63StockKey(x),old=N(x.est);
  x.ultimoEstoqueRelatorio=(x.ultimoEstoqueRelatorio!==undefined?x.ultimoEstoqueRelatorio:old);
  x.est=value;
  x.atual=now;
  x.ajusteManualEstoque=true;
  x.ajusteManualData=now;
  x.ajusteManualMotivo=reason||'Ajuste manual de estoque';
  let obj={value,reason:x.ajusteManualMotivo,date:now,item:x.item,produto:x.produto,cod:x.cod||''};
  OPS.v63StockOverrides[key]=obj;
  OPS.stockOverrides[norm(x.item||'')]=obj; // compatibilidade
  x.hist=x.hist||[];
  if(value!==old){
    x.hist.push({data:now,estoque:value,rel:'Ajuste manual',evento:`ESTOQUE AJUSTADO MANUALMENTE${reason?` — ${reason}`:''}${old!==null?` (anterior: ${old})`:''}`});
  }
}

function v63SaveItem(){
  let x=D.find(z=>z.item===editingItem); if(!x)return;
  let now=new Date().toLocaleString('pt-BR');
  let r=String($('mRef')?.value??'').trim();
  let a=String($('mAtt')?.value??'').trim();
  let area=String($('mArea')?.value||'').trim();
  let stockRaw=String($('mEstoqueManual')?.value??'').trim();
  let stock=stockRaw===''?null:Number(stockRaw.replace(',','.'));
  let reason=String($('mEstoqueMotivo')?.value||'').trim();

  x.ref=r===''?'':Number(r);
  x.att=a===''?'':Number(a);
  x.tipo=$('mTipo')?.value||'Próprio';
  if(!isThird(x))x.semPedido=false;

  if(area)v63SetArea(x.produto,area,now);
  if(stockRaw!==''&&Number.isFinite(stock))v63SetStock(x,stock,reason,now);

  v63ApplyAll();
  save();

  try{render()}catch(e){console.error(e)}
  try{renderMPS()}catch(e){console.error(e)}
  try{renderBatches()}catch(e){console.error(e)}
  try{renderWeekly()}catch(e){console.error(e)}
  try{renderMRP()}catch(e){console.error(e)}

  openItem(x.item);

  let btn=$('saveParam');
  if(btn){
    let s=$('v63AreaStatus');
    if(!s){s=document.createElement('span');s.id='v63AreaStatus';btn.insertAdjacentElement('afterend',s)}
    s.textContent='✓ Área e estoque salvos';
    setTimeout(()=>{if(s)s.textContent=''},2600);
  }
}

function v63WireSaveButton(){
  let btn=$('saveParam'); if(!btn)return;
  let fresh=btn.cloneNode(true);
  btn.replaceWith(fresh);
  fresh.onclick=function(ev){ev.preventDefault();v63SaveItem()};
}

const v63OpenPrev=openItem;
openItem=function(item){
  v63ApplyAll();
  v63OpenPrev(item);
  let x=D.find(z=>z.item===item); if(!x)return;
  v63EnsureAreaControl();
  if($('mArea'))$('mArea').value=v63AreaFor(x)||'';
  if($('mEstoqueManual'))$('mEstoqueManual').value=(x.est??'');
  if($('mEstoqueMotivo'))$('mEstoqueMotivo').value=x.ajusteManualMotivo||'';
  if($('chartSub'))$('chartSub').textContent=`Histórico de importações e ajustes manuais • Área atual: ${v63AreaFor(x)||'não definida'}`;
  v63WireSaveButton();
};

const v63RenderPrev=render;
render=function(){
  v63ApplyAll();
  v63RenderPrev();
};

if(typeof renderMPS==='function'){
  const p=renderMPS; renderMPS=function(){v63ApplyAll();return p.apply(this,arguments)};
}
if(typeof renderBatches==='function'){
  const p=renderBatches; renderBatches=function(){v63ApplyAll();return p.apply(this,arguments)};
}
if(typeof renderWeekly==='function'){
  const p=renderWeekly; renderWeekly=function(){v63ApplyAll();return p.apply(this,arguments)};
}
if(typeof renderMRP==='function'){
  const p=renderMRP; renderMRP=function(){v63ApplyAll();return p.apply(this,arguments)};
}

/* Nova importação assume o estoque oficial apenas dos itens realmente atualizados.
   A classificação manual da área NUNCA é removida pela importação. */
const v63ImportPrev=importPDF;
importPDF=async function(file){
  await v63ImportPrev(file);
  D.forEach(x=>{
    let last=(x.hist||[]).at(-1);
    if(last&&last.rel===file.name){
      let key=v63StockKey(x);
      delete OPS.v63StockOverrides[key];
      delete OPS.stockOverrides[norm(x.item||'')];
      x.ajusteManualEstoque=false;
      x.ajusteManualMotivo='';
      x.ajusteManualData='';
    }
  });
  v63ApplyAll();
  save();
  render();
};

/* Correção de cadastro conhecida informada pelo usuário. */
(function(){
  let k=v63NormProduct('Dorum Pos Green');
  let current=OPS.v63AreaOverrides[k]||OPS.areaOverrides[k]||'';
  if(!current||norm(current)==='ANVISA'){
    OPS.v63AreaOverrides[k]='MAPA VETERINÁRIO';
    OPS.areaOverrides[k]='MAPA VETERINÁRIO';
  }
})();

v63ApplyAll();
save();
v63EnsureAreaControl();
v63WireSaveButton();
render();

})();

// ============================================================================
// Patch Block #22 []
// ============================================================================
/* V65 — correção limpa: bateladas finalizadas/apontadas não pertencem mais à fila
   "Bateladas a Fazer", mas continuam preservadas no histórico e programação semanal. */
(function(){
  function v65IsFinalizedBatch(b){
    return !!b && (String(b.status||'').trim()==='Finalizada' || String(stageOfBatch(b)||'').trim()==='Apontamento');
  }

  function v65CleanFinalizedFilter(){
    const s=document.getElementById('batchStatusFilter');
    if(!s)return;
    Array.from(s.options).forEach(o=>{
      const v=String(o.value||o.textContent||'').trim();
      if(v==='Finalizada')o.remove();
    });
    if(String(s.value||'').trim()==='Finalizada')s.value='';
  }

  if(typeof renderBatches==='function'){
    const prevRenderBatches=renderBatches;
    renderBatches=function(){
      v65CleanFinalizedFilter();
      const original=MPS.batches;
      try{
        MPS.batches=(original||[]).filter(b=>!v65IsFinalizedBatch(b));
        return prevRenderBatches.apply(this,arguments);
      } finally {
        MPS.batches=original;
      }
    };
  }

  if(typeof setWeeklyStage==='function'){
    const prevSetWeeklyStage=setWeeklyStage;
    setWeeklyStage=function(id,stage){
      const result=prevSetWeeklyStage.apply(this,arguments);
      const b=(MPS.batches||[]).find(x=>x.id===id);
      if(b && String(stage||'').trim()==='Apontamento'){
        b.stage='Apontamento';
        b.status='Finalizada';
        b.updatedAt=Date.now();
        save();
      }
      v65CleanFinalizedFilter();
      try{renderBatches()}catch(e){console.error(e)}
      return result;
    };
  }

  document.addEventListener('DOMContentLoaded',()=>{
    v65CleanFinalizedFilter();
    try{renderBatches()}catch(e){console.error(e)}
  });
  setTimeout(()=>{
    v65CleanFinalizedFilter();
    try{renderBatches()}catch(e){console.error(e)}
  },0);
})();

// ============================================================================
// Patch Block #23 [id="v66-patch"]
// ============================================================================
(function(){
'use strict';
const V66_NAMES=['Seg','Ter','Qua','Qui','Sex'];
const V66_FULL=['SEGUNDA-FEIRA','TERÇA-FEIRA','QUARTA-FEIRA','QUINTA-FEIRA','SEXTA-FEIRA'];
function v66EnsureStore(){OPS.weekWorkdays=OPS.weekWorkdays||{}}
function v66WeekKey(){return document.getElementById('weekSelect')?.value||OPS.week||currentIsoWeek()}
function v66GetDays(week){
  v66EnsureStore();
  let cfg=OPS.weekWorkdays[week];
  if(!Array.isArray(cfg)||cfg.length!==5){cfg=[true,true,true,true,true];OPS.weekWorkdays[week]=cfg}
  return cfg.map(v=>v!==false);
}
function v66EnsureControl(){
  const sec=document.getElementById('semanal');if(!sec)return;
  let box=document.getElementById('v66Workdays');
  if(!box){box=document.createElement('div');box.id='v66Workdays';const toolbar=sec.querySelector('.toolbar');if(toolbar)toolbar.insertAdjacentElement('afterend',box);else sec.prepend(box)}
  v66RenderControl();
}
function v66RenderControl(){
  const box=document.getElementById('v66Workdays');if(!box)return;
  const week=v66WeekKey(),cfg=v66GetDays(week),dates=isoWeekDates(week),count=cfg.filter(Boolean).length;
  const opts=cfg.map((on,i)=>{
    const dt=dates[i]?new Date(dates[i]+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}):'';
    return '<label class="'+(on?'':'off')+'"><input type="checkbox" data-v66-day="'+i+'" '+(on?'checked':'')+'>'+V66_NAMES[i]+' '+dt+'</label>';
  }).join('');
  box.innerHTML='<div class="v66-title">Dias produtivos</div><div class="v66-options">'+opts+'</div><div class="v66-count">'+count+' dia'+(count===1?'':'s')+' produtivo'+(count===1?'':'s')+'</div><div class="v66-help">Desmarque feriados ou dias sem produção. A média da semana usa somente os dias marcados.</div>';
  box.querySelectorAll('input[data-v66-day]').forEach(inp=>inp.onchange=()=>{
    const idx=Number(inp.dataset.v66Day),w=v66WeekKey(),arr=v66GetDays(w);arr[idx]=!!inp.checked;OPS.weekWorkdays[w]=arr;save();renderWeekly();
  });
}
function v66ApplyAverageAndDayMarks(){
  const week=v66WeekKey(),cfg=v66GetDays(week),count=cfg.filter(Boolean).length,arr=weeklyBatches(week),total=arr.reduce((a,b)=>a+effectiveBatchKg(b),0);
  const avg=document.getElementById('weekAvg');if(avg)avg.textContent=count?fmtKg(total/count):'—';
  const label=avg?.closest('.v41-kpi')?.querySelector('small');if(label)label.textContent='Média por dia produtivo';
  [...document.querySelectorAll('#weeklyDays .v41-day')].forEach((el,i)=>{
    const active=cfg[i]!==false;el.classList.toggle('v66-nonproductive',!active);
    const first=el.querySelector('.v41-day-head b:first-child');if(!first)return;
    first.querySelector('.v66-day-badge')?.remove();
    if(!active){const badge=document.createElement('span');badge.className='v66-day-badge';badge.textContent='FERIADO / NÃO PRODUTIVO';first.appendChild(badge)}
  });
  v66RenderControl();
}
const v66RenderWeeklyPrev=renderWeekly;
renderWeekly=function(){const r=v66RenderWeeklyPrev.apply(this,arguments);v66EnsureControl();v66ApplyAverageAndDayMarks();return r};

if(typeof weeklyText==='function'){
  const prevWeeklyText=weeklyText;
  weeklyText=function(){
    const week=v66WeekKey(),cfg=v66GetDays(week),dates=isoWeekDates(week),count=cfg.filter(Boolean).length;
    const non=cfg.map((v,i)=>!v?(V66_NAMES[i]+' '+(dates[i]?new Date(dates[i]+'T12:00:00').toLocaleDateString('pt-BR'):'')):'').filter(Boolean);
    const base=prevWeeklyText.apply(this,arguments),parts=base.split('\n');
    return parts[0]+'\nDias produtivos: '+count+'/5'+(non.length?' • Não produtivo: '+non.join(', '):'')+'\n'+parts.slice(1).join('\n');
  };
  weeklyShareText=weeklyText;
}

if(typeof v59PrintableWeek==='function'){
  const prevPrintHtml=v59PrintableWeek;
  v59PrintableWeek=function(){
    const week=v66WeekKey(),cfg=v66GetDays(week),dates=isoWeekDates(week),count=cfg.filter(Boolean).length;
    let html=prevPrintHtml.apply(this,arguments);
    html=html.replace('<h2>PROGRAMAÇÃO SEMANAL DE PRODUÇÃO</h2>','<h2>PROGRAMAÇÃO SEMANAL DE PRODUÇÃO</h2><p><b>Dias produtivos:</b> '+count+'/5</p>');
    dates.forEach((d,i)=>{if(cfg[i]===false){const date=new Date(d+'T12:00:00').toLocaleDateString('pt-BR');html=html.replace('<h3>'+V66_FULL[i]+' • '+date+'</h3>','<h3>'+V66_FULL[i]+' • '+date+' — FERIADO / NÃO PRODUTIVO</h3>')}});
    return html;
  };
}

function v66Wire(){v66EnsureControl();v66ApplyAverageAndDayMarks()}
document.addEventListener('DOMContentLoaded',v66Wire);
setTimeout(v66Wire,0);
try{renderWeekly()}catch(e){console.error(e)}
})();

// ============================================================================
// Patch Block #24 [id="v68-patch"]
// ============================================================================
(function(){
'use strict';
/* V68 — patch único e isolado sobre a base estável V66.
   - KG nas colunas equivalentes (20KG -> 20, 50KG -> 50 etc.)
   - Ordem semanal ANVISA -> MAPA Veterinário -> CROP -> demais
   - As quantidades vêm somente da distribuição da batelada (b.dist),
     portanto ajuste manual de estoque não altera a programação semanal.
*/
function v68Line(product){
  const x=D.find(z=>norm(z.produto)===norm(product)&&!isSampleSku(z));
  if(x && typeof v63AreaFor==='function') return v63AreaFor(x)||x.linha||'';
  return x?.linha||'';
}
function v68LineRank(product){
  const c=lineClass(v68Line(product));
  if(c==='anvisa') return 0;
  if(c==='mapa') return 1;
  if(c==='crop') return 2;
  return 3;
}
function v68BatchSort(a,b){
  const da=String(a?.date||''), db=String(b?.date||'');
  if(da!==db) return da.localeCompare(db);
  const ra=v68LineRank(a?.produto), rb=v68LineRank(b?.produto);
  if(ra!==rb) return ra-rb;
  const pc=String(a?.produto||'').localeCompare(String(b?.produto||''),'pt-BR',{sensitivity:'base'});
  if(pc) return pc;
  return (Number(a?.createdAt)||0)-(Number(b?.createdAt)||0);
}

batchCounts=function(b){
  const out={'1':0,'5':0,'20':0,'50':0,'200':0,'150':0,other:[]};
  Object.entries(b?.dist||{}).forEach(([item,d])=>{
    const x=D.find(z=>z.item===item)||D.find(z=>norm(z.item)===norm(item));
    const a=apInfo(x?.ap||item);
    const q=(N(d?.mto)||0)+(N(d?.mts)||0);
    if(!q) return;
    if(a.key==='150ML') { out['150']+=q; return; }
    if(a.kind==='L') {
      const k=String(Number(a.liters));
      if(['1','5','20','50','200'].includes(k)) { out[k]+=q; return; }
    }
    if(a.kind==='KG') {
      const k=String(Number(a.kg));
      if(['1','5','20','50','200'].includes(k)) { out[k]+=q; return; }
    }
    out.other.push(`${a.label}: ${q}`);
  });
  ['1','5','20','50','200','150'].forEach(k=>{
    const n=Number(out[k]); out[k]=Number.isFinite(n)?n:0;
  });
  return out;
};

const v68WeeklyBatchesPrev=weeklyBatches;
weeklyBatches=function(week){
  const rows=v68WeeklyBatchesPrev.call(this,week)||[];
  return rows.slice().sort(v68BatchSort);
};

if(typeof v41WeeklyRows==='function'){
  v41WeeklyRows=function(week){ return weeklyBatches(week).slice().sort(v68BatchSort); };
}

try{renderWeekly()}catch(e){console.error('V68 render semanal:',e)}
})();

// ============================================================================
// Patch Block #25 [id="v69-patch"]
// ============================================================================
(function(){
'use strict';
/* V69 — Compras consideram somente bateladas em aberto.
   Em produção, Análise, Envase, Apontamento e Finalizadas NÃO entram
   em necessidade de bombonas nem de matérias-primas.
   Finalizadas/Apontadas também não aparecem em Bateladas a Fazer. */
function v69Stage(b){try{return String(stageOfBatch(b)||'').trim()}catch(e){return String(b?.stage||'').trim()}}
function v69Status(b){return String(b?.status||'').trim()}
function v69IsFinished(b){return v69Status(b)==='Finalizada'||v69Stage(b)==='Apontamento'}
function v69IsInProduction(b){const st=v69Stage(b),s=v69Status(b);return s==='Em produção'||['Produção','Análise','Envase'].includes(st)}
function v69IsOpenProcurement(b){
  if(!b||v69IsFinished(b)||v69IsInProduction(b))return false;
  const st=v69Stage(b),s=v69Status(b);
  return ['A fazer','Em Fila'].includes(st)||['A fazer','Programada','Rascunho',''].includes(s);
}
function v69IsScheduledOpen(b){return v69IsOpenProcurement(b)&&!!b.date&&(v69Stage(b)==='Em Fila'||v69Status(b)==='Programada')}
function v69NormalizeBatchStates(){
  (MPS.batches||[]).forEach(b=>{
    const st=v69Stage(b);
    if(st==='Apontamento')b.status='Finalizada';
    else if(['Produção','Análise','Envase'].includes(st))b.status='Em produção';
    else if(st==='Em Fila')b.status='Programada';
    else if(st==='A fazer'&&!b.date)b.status='A fazer';
  });
}

bombonaScopedBatches=function(){
  const scope=$('boScope')?.value||OPS.packScope||'WEEK';OPS.packScope=scope;
  const all=(MPS.batches||[]).filter(v69IsOpenProcurement);
  if(scope==='WEEK'){
    const week=$('boWeek')?.value||OPS.week||currentIsoWeek(),set=new Set(isoWeekDates(week));
    return all.filter(b=>b.date&&set.has(b.date));
  }
  if(scope==='CONFIRM')return all.filter(v69IsScheduledOpen);
  return all;
};

mrpBatchSelection=function(){
  const mode=$('mrpBatchFilter')?.value||'OPEN';
  let rows=(MPS.batches||[]).filter(b=>{const kg=effectiveBatchKg(b);return kg!==null&&kg>0&&v69IsOpenProcurement(b)});
  if(mode==='CONFIRM'||mode==='PROGRAMADA')rows=rows.filter(v69IsScheduledOpen);
  if(mode==='PRODUCAO')rows=[];
  return rows;
};

function v69CleanControls(){
  const bo=$('boScope');
  if(bo){
    const labels={WEEK:'Semana selecionada — somente em aberto',CONFIRM:'Todas programadas / em fila',OPEN:'Todas as bateladas em aberto'};
    Array.from(bo.options).forEach(o=>{if(labels[o.value])o.textContent=labels[o.value]});
  }
  const mf=$('mrpBatchFilter');
  if(mf){
    Array.from(mf.options).forEach(o=>{
      const v=String(o.value||'');
      if(v==='OPEN')o.textContent='Todas as bateladas em aberto';
      if(v==='CONFIRM')o.textContent='Programadas / em fila';
      if(v==='PROGRAMADA')o.textContent='Somente programadas / em fila';
      if(v==='PRODUCAO')o.remove();
    });
    if(mf.value==='PRODUCAO')mf.value='OPEN';
  }
  const note=document.querySelector('#mrp .mrp-note');
  if(note)note.innerHTML='<b>Regra de Compras:</b> o MRP considera somente bateladas <b>em aberto</b> (A fazer ou Programadas/Em Fila). Ao iniciar <b>Produção</b>, ou ao passar por Análise, Envase ou Apontamento, a batelada deixa automaticamente de gerar necessidade de matéria-prima.';
  const bsec=$('bombonas');
  if(bsec){
    let n=bsec.querySelector('.v69-open-note');
    if(!n){n=document.createElement('div');n.className='notice v69-open-note';const body=bsec.querySelector('.v41-bo-kpis')||bsec.querySelector('.toolbar');if(body)body.insertAdjacentElement('afterend',n)}
    if(n)n.innerHTML='<b>Regra de Compras:</b> a necessidade de bombonas considera somente bateladas <b>em aberto</b>. Bateladas que já entraram em Produção, Análise, Envase, Apontamento ou foram Finalizadas não são somadas novamente.';
  }
  const sf=$('batchStatusFilter');
  if(sf){
    Array.from(sf.options).forEach(o=>{if(String(o.value||o.textContent||'').trim()==='Finalizada')o.remove()});
    if(String(sf.value||'').trim()==='Finalizada')sf.value='';
  }
}

if(typeof renderBatches==='function'){
  const v69PrevRenderBatches=renderBatches;
  renderBatches=function(){
    v69NormalizeBatchStates();v69CleanControls();
    const original=MPS.batches;
    try{
      MPS.batches=(original||[]).filter(b=>!v69IsFinished(b));
      const r=v69PrevRenderBatches.apply(this,arguments);
      document.querySelectorAll('#batchList .batch-row-simple,#batchList .v41-batch-row').forEach(row=>{
        const t=(row.textContent||'').toUpperCase();if(t.includes('FINALIZADA')||t.includes('APONTAMENTO'))row.remove();
      });
      return r;
    }finally{MPS.batches=original}
  };
}
function v69RefreshPlanning(){
  v69NormalizeBatchStates();save();
  try{renderBatches()}catch(e){console.error('V69 bateladas',e)}
  try{renderBombonas()}catch(e){console.error('V69 bombonas',e)}
  try{renderMRP()}catch(e){console.error('V69 MRP',e)}
  try{renderMPS()}catch(e){console.error('V69 PMP',e)}
}
if(typeof setWeeklyStage==='function'){
  const v69PrevSetWeeklyStage=setWeeklyStage;
  setWeeklyStage=function(id,stage){
    const r=v69PrevSetWeeklyStage.apply(this,arguments),b=(MPS.batches||[]).find(x=>x.id===id);
    if(b){b.stage=stage;if(stage==='Apontamento')b.status='Finalizada';else if(['Produção','Análise','Envase'].includes(stage))b.status='Em produção';else if(stage==='Em Fila')b.status='Programada';b.updatedAt=Date.now()}
    v69RefreshPlanning();return r;
  };
}
if(typeof saveBatch==='function'){
  const v69PrevSaveBatch=saveBatch;
  saveBatch=function(){const r=v69PrevSaveBatch.apply(this,arguments);v69RefreshPlanning();return r};
}
function v69Wire(){
  v69CleanControls();
  if($('boScope'))$('boScope').onchange=()=>{OPS.packScope=$('boScope').value;save();renderBombonas()};
  if($('mrpBatchFilter'))$('mrpBatchFilter').onchange=renderMRP;
  v69RefreshPlanning();
}
document.addEventListener('DOMContentLoaded',v69Wire);setTimeout(v69Wire,0);
})();
