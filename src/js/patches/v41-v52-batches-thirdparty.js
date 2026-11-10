/**
 * Camada de Regras V41-V52: Geracao de Bateladas PMP, Marcas Terceirizadas e Calculo Oficial em Kg
 */

// ============================================================================
// Patch Block #4 [id="v41-patch"]
// ============================================================================
(function(){
'use strict';
const V41_STAGES=['Em Fila','Produção','Análise','Envase','Apontamento'];
window.V41_STAGES=V41_STAGES;
if(typeof window.v55Qty!=='function'){window.v55Qty=function(c,k){let v=N(c?.[k]);return Number.isFinite(v)?v:0};}

function v41Month(){return document.getElementById('pmpMonth')?.value||pmpDefaultMonth()}
function v41MasterStore(month=v41Month()){MPS.masterPlans=MPS.masterPlans||{};if(!MPS.masterPlans[month])MPS.masterPlans[month]={};return MPS.masterPlans[month]}
function v41ProductPlan(product,month=v41Month()){
  let m=v41MasterStore(month);
  if(!m[product]){
    let std=tankStandardFullKg(product,'')||N(BATCH_REFS[product])||0;
    m[product]={tanks:0,weight:std,note:''}
  }
  return m[product]
}
function v41ProductLine(product){return D.find(x=>norm(x.produto)===norm(product)&&!isSampleSku(x))?.linha||tankMaster(product)?.line||'SEM SETOR'}
function v41PmpBatches(product,month){return (MPS.batches||[]).filter(b=>b.pmpSource===true&&b.planMonth===month&&norm(b.produto)===norm(product))}
function v41PendingCount(product,month){return v41PmpBatches(product,month).length}
function v41PlanRows(){
  return batchProductOptions().map(product=>({product,line:v41ProductLine(product),plan:v41ProductPlan(product),tank:tankMaster(product)})).sort((a,b)=>a.line.localeCompare(b.line,'pt-BR')||a.product.localeCompare(b.product,'pt-BR'))
}
function v41GeneratePmpBatches(product){
  product=decodeURIComponent(product);let month=v41Month(),p=v41ProductPlan(product,month),target=Math.max(0,Math.floor(N(p.tanks)||0)),weight=Math.max(0,N(p.weight)||0),existing=v41PendingCount(product,month),missing=Math.max(0,target-existing);
  if(target<=0){alert('Informe a quantidade de tanques/bateladas no PMP.');return}
  if(weight<=0){alert('Informe o peso de referência da batelada.');return}
  if(missing<=0){alert('Todas as bateladas previstas desse produto já foram criadas.');return}
  let base=Date.now();
  for(let i=0;i<missing;i++){
    MPS.batches.push({id:'B'+(base+i),produto:product,date:'',kg:weight,calcKg:'',density:productDensity(product)??'',tank:'',status:'A fazer',stage:'A fazer',sop:'AUTO',lot:'',priority:'Normal',obs:'',dist:{},pmpSource:true,planMonth:month,createdAt:base+i,updatedAt:base+i,created:new Date(base+i).toLocaleString('pt-BR')})
  }
  save();renderMPS();renderBatches();renderMRP()
}
window.v41GeneratePmpBatches=v41GeneratePmpBatches;

renderMPS=function(){
  if(!$('mpsBody'))return;
  let month=v41Month();if($('pmpMonth')&&!$('pmpMonth').value)$('pmpMonth').value=month;
  let q=($('mpsQ')?.value||'').trim().toUpperCase(),line=$('mpsLinha')?.value||'',filter=$('mpsNeedFilter')?.value||'';
  let rows=v41PlanRows().filter(r=>(!q||`${r.product} ${r.line}`.toUpperCase().includes(q))&&(!line||r.line===line));
  rows=rows.filter(r=>{let tanks=Math.max(0,Math.floor(N(r.plan.tanks)||0)),created=v41PendingCount(r.product,month),remain=tanks-created;if(filter==='COM PLANO')return tanks>0;if(filter==='A PROGRAMAR')return remain>0;return true});
  $('mpsBody').innerHTML=rows.map(r=>{
    let tanks=Math.max(0,Math.floor(N(r.plan.tanks)||0)),weight=Math.max(0,N(r.plan.weight)||0),created=v41PendingCount(r.product,month),remain=tanks-created,total=tanks*weight,std=tankStandardFullKg(r.product,'')||0;
    return `<tr><td>${escHtml(r.line)}</td><td class=product><b>${escHtml(r.product)}</b><div class=v41-queue-note>${r.tank?.mainTank&&norm(r.tank.mainTank)!=='NAO HA'?`Tanque padrão ${escHtml(r.tank.mainTank)}`:'Sem tanque fixo'}${std?` • padrão cadastrado ${fmtKg(std)}`:''}</div></td><td><input class="mpsnum v41-plan-input" data-v41-product="${encodeURIComponent(r.product)}" data-v41-field=tanks type=number min=0 step=1 value="${tanks}"></td><td><input class="mpsnum v41-weight-input" data-v41-product="${encodeURIComponent(r.product)}" data-v41-field=weight type=number min=0 step=any value="${weight||''}"></td><td><b>${fmtKg(total)}</b></td><td>${created}</td><td class="${remain>0?'pmp-remain pos':remain<0?'pmp-remain over':'pmp-remain done'}">${remain}</td><td><input class="mpsnote pmp-plan-note" data-v41-product="${encodeURIComponent(r.product)}" data-v41-field=note value="${escHtml(r.plan.note||'')}" placeholder="Observação"></td><td><button class="smallbtn primary" onclick="v41GeneratePmpBatches('${encodeURIComponent(r.product)}')">Criar faltantes</button></td></tr>`
  }).join('');
  $('mpsBody').querySelectorAll('[data-v41-field]').forEach(el=>el.onchange=()=>{let product=decodeURIComponent(el.dataset.v41Product),p=v41ProductPlan(product,month),f=el.dataset.v41Field;if(f==='tanks')p.tanks=Math.max(0,Math.floor(N(el.value)||0));else if(f==='weight')p.weight=Math.max(0,N(el.value)||0);else p.note=el.value;save();renderMPS()});
  let all=v41PlanRows(),planned=all.filter(r=>(N(r.plan.tanks)||0)>0),tanks=planned.reduce((a,r)=>a+Math.max(0,Math.floor(N(r.plan.tanks)||0)),0),created=planned.reduce((a,r)=>a+v41PendingCount(r.product,month),0),remaining=Math.max(0,tanks-created);
  $('mpsNeedCount').textContent=planned.length;$('mpsMtoTotal').textContent=tanks;$('mpsMtsTotal').textContent=created;$('mpsBatchCount').textContent=remaining;
  renderBatches()
}
copyPreviousPmpMonth=function(){
  let cur=v41Month(),[y,m]=cur.split('-').map(Number),d=new Date(y,m-2,1),prev=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`,src=MPS.masterPlans?.[prev]||{};
  if(!Object.keys(src).length){alert('O mês anterior não possui PMP salvo.');return}
  if(!confirm(`Copiar o PMP de ${prev} para ${cur}?`))return;
  MPS.masterPlans=MPS.masterPlans||{};MPS.masterPlans[cur]=structuredClone(src);save();renderMPS()
}
exportMpsCsv=function(){
  let month=v41Month(),rows=v41PlanRows(),h=['Mês','Setor','Produto','Tanques/Bateladas planejadas','Peso por batelada kg','Kg total previsto','Bateladas criadas','Saldo de bateladas','Observação'];
  let csv=[h.join(';'),...rows.map(r=>{let t=Math.max(0,Math.floor(N(r.plan.tanks)||0)),w=N(r.plan.weight)||0,c=v41PendingCount(r.product,month);return[month,r.line,r.product,t,w,t*w,c,t-c,r.plan.note||''].map(escCsv).join(';')})].join('\n');
  downloadTextFile(`PMP_CTEC_${month}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8')
}

stageOfBatch=function(b){return b.stage|| (b.status==='A fazer'?'A fazer':b.status==='Em produção'?'Produção':b.status==='Finalizada'?'Apontamento':'Em Fila')}

openBatch=function(id=null){
  editingBatchId=id;let prods=batchProductOptions(),b=id?MPS.batches.find(z=>z.id===id):null;
  $('batchProduct').innerHTML=prods.map(p=>`<option>${escHtml(p)}</option>`).join('');
  $('batchTitle').textContent=b?'Batelada':'Nova batelada a fazer';$('batchProduct').disabled=!!b;$('batchProduct').value=b?.produto||prods[0]||'';
  $('batchDate').value=b?.date||'';$('batchStatus').value=b?.status||'A fazer';$('batchStage').value=b?.stage||'A fazer';$('batchSop').value=b?.sop||'AUTO';$('batchLot').value=b?.lot||'';$('batchPriority').value=b?.priority||'Normal';$('batchObs').value=b?.obs||'';
  let dens=productDensity($('batchProduct').value,b);$('batchDensity').value=dens??'';
  let std=tankStandardFullKg($('batchProduct').value,b?.tank||'')||0;$('batchKg').value=b?.kg??(std||'');
  updateBatchTankOptions(b?.tank||'');renderBatchDist(b);
  let meta=document.getElementById('batchCreatedMeta');if(meta)meta.textContent=b?.created?`Criada em ${b.created}${b.updatedAt&&b.createdAt&&b.updatedAt!==b.createdAt?` • última alteração ${new Date(b.updatedAt).toLocaleString('pt-BR')}`:''}`:'A data de criação será registrada automaticamente.';
  $('batchDlg').showModal()
}
renderBatchDist=function(b=null){
  let prod=$('batchProduct').value,skus=productSkus(prod),dist=b?.dist||{},dens=N($('batchDensity').value);if(dens===null)dens=productDensity(prod,b);
  $('batchDistBody').innerHTML=skus.map(x=>{let d=dist[x.item]||{mto:0,mts:0},tot=(N(d.mto)||0)+(N(d.mts)||0),kg=itemQtyKg(x.item,tot,dens),ps=packagingSpec(prod,x.ap),pk=ps&&[5,20,50,200].includes(ps.size)?`${ps.size}L ${ps.color} • Mod. ${ps.model}`:'—',bx=ps&&ps.size===5?boxSpec(prod):null,bxTxt=bx?`${bx.type} • 4 un.`:'—',sample=isSampleSku(x);return `<tr data-item="${encodeURIComponent(x.item)}"><td>${sample?`${escHtml(x.ap||'150 ML')} <span class="eng-status eng-none">AMOSTRA</span>`:escHtml(x.ap||'')}</td><td>${x.est===''||x.est===null||x.est===undefined?'—':x.est}</td><td><input class="mpsnum bd-mto" type=number min=0 step=1 value="${d.mto||0}"></td><td><input class="mpsnum bd-mts" type=number min=0 step=1 value="${d.mts||0}"></td><td class=bd-total><b>${tot}</b></td><td class=bd-kg>${kg===null?'—':fmtKg(kg)}</td><td>${sample?'Frasco amostra':escHtml(pk)}</td><td>${escHtml(bxTxt)}</td></tr>`}).join('');
  $('batchDistBody').querySelectorAll('input').forEach(inp=>inp.oninput=refreshBatchCalc);refreshBatchCalc()
}
fillBatchNeeds=function(){renderBatchDist({dist:{}})}
saveBatch=function(){
  let dist=currentDialogDist(),prod=$('batchProduct').value,dens=N($('batchDensity').value),tank=$('batchTank').value||'',date=$('batchDate').value,status=$('batchStatus').value||'A fazer',stage=$('batchStage').value||'A fazer';
  if(!prod){alert('Selecione um produto.');return}
  let mainQty=0,sampleQty=0;Object.entries(dist).forEach(([item,d])=>{let q=(N(d.mto)||0)+(N(d.mts)||0);if(isSampleItem(item))sampleQty+=q;else mainQty+=q});
  if(date&&mainQty<=0){alert('Para programar em uma data, informe as quantidades da batelada.');return}
  if(sampleQty>0&&!tank){alert('Amostras devem estar vinculadas ao tanque da batelada principal.');return}
  if(!date){status='A fazer';stage='A fazer'}else if(status==='A fazer'){status='Programada';stage='Em Fila'}
  if(stage==='Apontamento')status='Finalizada';else if(['Produção','Análise','Envase'].includes(stage))status='Em produção';else if(stage==='Em Fila')status='Programada';
  let calc=distKg(prod,dist,dens),calcKg=(calc.unknown===0&&calc.total>0)?calc.total:null,manual=N($('batchKg').value),tmp={produto:prod,dist,density:dens,tank,calcKg:calcKg||0,kg:manual||0},kg=mainQty>0?operationalBatchKg(tmp):(manual||tankStandardFullKg(prod,tank)||0);
  if(dens!==null&&dens>0)OPS.density[norm(prod)]=dens;
  let old=editingBatchId?MPS.batches.find(z=>z.id===editingBatchId):null,now=Date.now(),obj={id:editingBatchId||('B'+now),produto:prod,date,kg:kg||'',calcKg:calcKg||'',density:dens===null?'':dens,tank,status,stage,sop:$('batchSop').value||'AUTO',lot:$('batchLot').value.trim(),priority:$('batchPriority').value||'Normal',obs:$('batchObs').value,dist,createdAt:old?.createdAt||now,updatedAt:now,created:old?.created||new Date(now).toLocaleString('pt-BR'),pmpSource:old?.pmpSource||false,planMonth:old?.planMonth||''};
  if(editingBatchId){let i=MPS.batches.findIndex(z=>z.id===editingBatchId);if(i>=0)MPS.batches[i]={...MPS.batches[i],...obj}}else MPS.batches.push(obj);
  save();$('batchDlg').close();renderMPS();renderWeekly();renderBombonas();renderProduction();renderMRP()
}
renderBatches=function(){
  if(!$('batchList'))return;populateBatchSectorFilter();
  let f=$('batchStatusFilter')?.value||'',sector=$('batchSectorFilter')?.value||'',q=($('batchNameFilter')?.value||'').trim().toUpperCase();
  let arr=(MPS.batches||[]).map((b,idx)=>({...b,_sector:batchSectorName(b.produto),_order:Number(b.createdAt||0)||idx})).filter(b=>(!f||b.status===f)&&(!sector||b._sector===sector)&&(!q||String(b.produto||'').toUpperCase().includes(q))).sort((a,b)=>b._order-a._order);
  if(!arr.length){$('batchList').innerHTML='<div class=mps-empty>Nenhuma batelada cadastrada.</div>';return}
  let groups={};arr.forEach(b=>(groups[b._sector]||(groups[b._sector]=[])).push(b));
  $('batchList').innerHTML=Object.keys(groups).sort((a,b)=>a.localeCompare(b,'pt-BR')).map(sec=>`<div class=v41-sector><div class=v41-sector-head><b>${escHtml(sec)}</b><span>${groups[sec].length} batelada(s)</span></div>${groups[sec].map(b=>{let c=batchCounts(b),qtxt=['1','5','20','50','200','150'].filter(k=>Number(c[k]||0)>0).map(k=>`${k==='150'?'Amostra':k+'L'} ${c[k]}`).join(' • ');return `<div class=v41-batch-row><div class=namecell><div class=product>${escHtml(b.produto)}${b.pmpSource?`<span class=v41-batch-origin>PMP ${escHtml(b.planMonth||'')}</span>`:''}</div><div class=v41-queue-note>${qtxt||'Quantidades ainda não definidas'}${b.lot?` • Lote ${escHtml(b.lot)}`:''}</div><div class=v41-queue-note> criada em <b>${escHtml(b.created||'registro antigo')}</b></div></div><div><small>Data produção</small><b>${b.date?b.date.split('-').reverse().join('/'):'A definir'}</b></div><div><small>Peso referência</small><b>${fmtKg(effectiveBatchKg(b))}</b></div><div class=hide-md><small>S&amp;OP</small><b>${escHtml(sopOfBatch(b))}</b></div><div class=hide-md><small>Situação</small><b>${escHtml(b.status||'A fazer')}</b><div class=v41-queue-note>${escHtml(stageOfBatch(b))}</div></div><div class=actions><button class="smallbtn primary" onclick="openBatch('${b.id}')">${b.status==='A fazer'?'Programar':'Editar'}</button><button class="smallbtn secondary" onclick="deleteBatch('${b.id}')">Excluir</button></div></div>`}).join('')}</div>`).join('')
}

weeklyBatches=function(week){let set=new Set(isoWeekDates(week));return (MPS.batches||[]).filter(b=>b.date&&set.has(b.date)&&b.status!=='A fazer')}
setWeeklyStage=function(id,stage){let b=(MPS.batches||[]).find(x=>x.id===id);if(!b)return;b.stage=stage;if(stage==='Em Fila')b.status='Programada';else if(['Produção','Análise','Envase'].includes(stage))b.status='Em produção';else if(stage==='Apontamento')b.status='Finalizada';b.updatedAt=Date.now();save();renderWeekly();renderBatches();renderProduction();renderMRP()}
function v41StageButtons(b){let stage=stageOfBatch(b),si=Math.max(0,V41_STAGES.indexOf(stage));return V41_STAGES.map((s,i)=>{let cls=i<si?'done':i===si?'on':'',mark=i<=si?'✓':'';return `<td><button class="v41-stage ${cls}" title="${escHtml(s)}" onclick="setWeeklyStage('${b.id}','${s}')">${mark}</button></td>`}).join('')}
renderWeekly=function(){
  if(!$('weeklyDays'))return;let week=$('weekSelect')?.value||OPS.week||currentIsoWeek();OPS.week=week;let dates=isoWeekDates(week),arr=weeklyBatches(week),names=['SEGUNDA-FEIRA','TERÇA-FEIRA','QUARTA-FEIRA','QUINTA-FEIRA','SEXTA-FEIRA'],today=new Date().toISOString().slice(0,10);
  let total=arr.reduce((a,b)=>a+effectiveBatchKg(b),0),done=arr.filter(b=>stageOfBatch(b)==='Apontamento').reduce((a,b)=>a+effectiveBatchKg(b),0),prod=arr.filter(b=>stageOfBatch(b)==='Produção').reduce((a,b)=>a+effectiveBatchKg(b),0),analysis=arr.filter(b=>stageOfBatch(b)==='Análise').reduce((a,b)=>a+effectiveBatchKg(b),0),env=arr.filter(b=>stageOfBatch(b)==='Envase').reduce((a,b)=>a+effectiveBatchKg(b),0),fila=arr.filter(b=>stageOfBatch(b)==='Em Fila').reduce((a,b)=>a+effectiveBatchKg(b),0),mto=0,mts=0,bo=0;
  arr.forEach(b=>{let s=operationalSplitKg(b);mto+=s.mto;mts+=s.mts;if(sopOfBatch(b)==='BO')bo+=effectiveBatchKg(b)});
  if($('weekKg'))$('weekKg').textContent=fmtKg(total);if($('weekAvg'))$('weekAvg').textContent=fmtKg(total/5);if($('weekDoneKg'))$('weekDoneKg').textContent=fmtKg(done);if($('weekProdKg'))$('weekProdKg').textContent=fmtKg(prod);if($('weekAnalysisKg'))$('weekAnalysisKg').textContent=fmtKg(analysis);if($('weekFillKg'))$('weekFillKg').textContent=fmtKg(env);if($('weekQueueKg'))$('weekQueueKg').textContent=fmtKg(fila);if($('weekBatchProgress'))$('weekBatchProgress').textContent=`${arr.filter(b=>stageOfBatch(b)==='Apontamento').length} / ${arr.length}`;if($('weekSop'))$('weekSop').textContent=`${fmtKg(mto)} / ${fmtKg(mts)} / ${fmtKg(bo)}`;
  $('weeklyDays').innerHTML=dates.map((d,i)=>{let bs=arr.filter(b=>b.date===d),kg=bs.reduce((a,b)=>a+effectiveBatchKg(b),0),rows=bs.map(b=>{let c=batchCounts(b),x=D.find(z=>norm(z.produto)===norm(b.produto)&&!isSampleSku(z)),line=x?.linha||'';return `<tr class="${lineClass(line)}"><td>${lineTag(line)}</td><td><b>${escHtml(b.produto)}</b></td><td>${v55Qty(c,'1')}</td><td>${v55Qty(c,'5')}</td><td>${v55Qty(c,'20')}</td><td>${v55Qty(c,'50')}</td><td>${v55Qty(c,'200')}</td><td>${v55Qty(c,'150')}</td><td>${escHtml(b.lot||'')}</td><td><b>${fmtKg(effectiveBatchKg(b))}</b></td><td><b>${escHtml(sopOfBatch(b))}</b></td>${v41StageButtons(b)}</tr>`}).join('');return `<div class=v41-day><div class="v41-day-head ${d===today?'today':''}"><b>${names[i]} • ${new Date(d+'T12:00:00').toLocaleDateString('pt-BR')}${d===today?' • HOJE':''}</b><span>${bs.length} batelada(s)</span><b>${fmtKg(kg)}</b></div><div class=tablewrap><table class=v41-week-table><thead><tr><th>Linha</th><th>Produto</th><th>1L</th><th>5L</th><th>20L</th><th>50L</th><th>200L</th><th>Amostra</th><th>Lote</th><th>Kg</th><th>S&amp;OP</th><th>Fila</th><th>Produção</th><th>Análise</th><th>Envase</th><th>Apont.</th></tr></thead><tbody>${rows||'<tr><td colspan=16 class=muted>Nenhuma produção programada.</td></tr>'}</tbody></table></div></div>`}).join('');
  let pack=packagingAggregate(arr),boxes=boxAggregate(arr);if($('weeklyPackaging'))$('weeklyPackaging').innerHTML=pack.length?`<div class=v41-order-list>${pack.map(r=>`<div class=v41-order-chip><b>${r.size}L ${escHtml(r.color)} • Mod. ${escHtml(r.model)}</b><br>${r.qty.toLocaleString('pt-BR')} un.</div>`).join('')}</div>`:'<div class=chartempty>Sem consumo de bombonas nesta semana.</div>';if($('weeklyBoxes'))$('weeklyBoxes').innerHTML=boxes.length?`<div class=v41-order-list>${boxes.map(r=>`<div class=v41-order-chip><b>${escHtml(r.type)}</b><br>${r.boxes} caixa(s) • ${r.units} bombonas</div>`).join('')}</div>`:'<div class=chartempty>Sem caixas de 5L nesta semana.</div>'
}
function v41WeeklyRows(week){return weeklyBatches(week).sort((a,b)=>(a.date||'').localeCompare(b.date||'')||(a.createdAt||0)-(b.createdAt||0))}
weeklyText=function(){let week=$('weekSelect').value,arr=v41WeeklyRows(week),lines=['PROGRAMAÇÃO SEMANAL DE PRODUÇÃO'];arr.forEach(b=>{let c=batchCounts(b);lines.push(`${b.date?.split('-').reverse().join('/')||'—'} | ${b.produto} | 1L ${c['1']} | 5L ${c['5']} | 20L ${c['20']} | 50L ${c['50']} | 200L ${c['200']} | Amostra ${c['150']} | ${fmtKg(effectiveBatchKg(b))} | S&OP ${sopOfBatch(b)} | ${stageOfBatch(b)}`)});return lines.join('\n')}
weeklyShareText=weeklyText;
exportWeeklyCsv=function(){let week=$('weekSelect').value,arr=v41WeeklyRows(week),h=['Data','Linha','Produto','1L','5L','20L','50L','200L','Amostra','Lote','Kg','S&OP','Etapa'],csv=[h.join(';'),...arr.map(b=>{let c=batchCounts(b),x=D.find(z=>norm(z.produto)===norm(b.produto)&&!isSampleSku(z));return[b.date,x?.linha||'',b.produto,v55Qty(c,'1'),v55Qty(c,'5'),v55Qty(c,'20'),v55Qty(c,'50'),v55Qty(c,'200'),v55Qty(c,'150'),b.lot||'',effectiveBatchKg(b),sopOfBatch(b),stageOfBatch(b)].map(escCsv).join(';')})].join('\n');downloadTextFile(`Programacao_Semanal_${week}.csv`,'\ufeff'+csv,'text/csv;charset=utf-8')}
function v41PrintableWeek(){
  let week=$('weekSelect').value,arr=v41WeeklyRows(week),dates=isoWeekDates(week),names=['SEGUNDA-FEIRA','TERÇA-FEIRA','QUARTA-FEIRA','QUINTA-FEIRA','SEXTA-FEIRA'];
  return `<h2>PROGRAMAÇÃO SEMANAL DE PRODUÇÃO</h2>${dates.map((d,i)=>{let bs=arr.filter(b=>b.date===d);return `<h3>${names[i]} • ${new Date(d+'T12:00:00').toLocaleDateString('pt-BR')}</h3><table><thead><tr><th>Produto</th><th>1L</th><th>5L</th><th>20L</th><th>50L</th><th>200L</th><th>Amostra</th><th>Kg</th><th>S&OP</th><th>Etapa</th></tr></thead><tbody>${bs.map(b=>{let c=batchCounts(b);return `<tr><td>${escHtml(b.produto)}</td><td>${c['1']}</td><td>${c['5']}</td><td>${c['20']}</td><td>${c['50']}</td><td>${c['200']}</td><td>${c['150']}</td><td>${fmtKg(effectiveBatchKg(b))}</td><td>${escHtml(sopOfBatch(b))}</td><td>${escHtml(stageOfBatch(b))}</td></tr>`}).join('')}</tbody></table>`}).join('')}`
}
printWeekly=function(){let w=window.open('','_blank');if(!w){alert('Permita pop-ups para imprimir.');return}w.document.write(`<html><head><title>Programação Semanal</title><style>body{font-family:Arial;padding:18px;color:#111}table{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:11px}th,td{border:1px solid #ddd;padding:6px}th{background:#eee}</style></head><body>${v41PrintableWeek()}
</body></html>`);w.document.close();w.print()}
printWeeklyShare=printWeekly;
downloadWeeklyPng=async function(){
  let week=$('weekSelect').value,arr=v41WeeklyRows(week),dates=isoWeekDates(week),W=1650,rowH=42,head=92,kpi=58,dayHead=36,colHead=30,foot=55,names=['SEGUNDA','TERÇA','QUARTA','QUINTA','SEXTA'],counts=dates.map(d=>Math.max(1,arr.filter(b=>b.date===d).length)),H=head+kpi+foot+counts.reduce((a,n)=>a+dayHead+colHead+n*rowH,0)+20,canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;let ctx=canvas.getContext('2d'),y=0;
  const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h)},txt=(t,x,y,s=12,b=false,c='#111',al='left')=>{ctx.font=`${b?'700':'400'} ${s}px Arial`;ctx.fillStyle=c;ctx.textAlign=al;ctx.textBaseline='middle';ctx.fillText(String(t??''),x,y)};
  rect(0,0,W,H,'#fff');rect(0,y,W,head,'#c71920');txt('PROGRAMAÇÃO SEMANAL DE PRODUÇÃO',28,y+32,27,true,'#fff');txt(`Semana ${week}`,W-28,y+31,17,true,'#fff','right');txt(`Atualizado ${new Date().toLocaleString('pt-BR')}`,W-28,y+62,12,false,'#ffe4e6','right');y+=head;
  let total=arr.reduce((a,b)=>a+effectiveBatchKg(b),0),sops={MTO:0,MTS:0,BO:0};arr.forEach(b=>{let s=sopOfBatch(b);if(s==='MTO')sops.MTO+=effectiveBatchKg(b);else if(s==='MTS')sops.MTS+=effectiveBatchKg(b);else if(s==='BO')sops.BO+=effectiveBatchKg(b)});
  let kk=[['TOTAL',fmtKg(total)],['MÉDIA/DIA',fmtKg(total/5)],['BATELADAS',arr.length],['MTO',fmtKg(sops.MTO)],['MTS',fmtKg(sops.MTS)],['BO',fmtKg(sops.BO)]],kw=W/kk.length;rect(0,y,W,kpi,'#f3f4f6');kk.forEach((k,i)=>{txt(k[0],i*kw+10,y+18,10,true,'#667085');txt(k[1],i*kw+10,y+40,14,true)});y+=kpi;
  const cols=[105,370,58,58,58,58,58,75,110,95,100,85,135],heads=['Linha','Produto','1L','5L','20L','50L','200L','Amostra','Lote','Kg','S&OP','Tanque','Etapa'];
  dates.forEach((d,di)=>{let bs=arr.filter(b=>b.date===d);rect(0,y,W,dayHead,di%2?'#e9edf2':'#f1f4f7');txt(`${names[di]} • ${new Date(d+'T12:00:00').toLocaleDateString('pt-BR')}`,15,y+dayHead/2,14,true,'#344054');txt(`${bs.length} batelada(s)`,W-15,y+dayHead/2,12,true,'#344054','right');y+=dayHead;rect(0,y,W,colHead,'#f8fafc');let x=0;heads.forEach((h,i)=>{ctx.strokeStyle='#dfe3e8';ctx.strokeRect(x,y,cols[i],colHead);txt(h,x+cols[i]/2,y+colHead/2,9,true,'#475467','center');x+=cols[i]});y+=colHead;(bs.length?bs:[null]).forEach(b=>{x=0;let vals;if(b){let c=batchCounts(b),r=D.find(z=>norm(z.produto)===norm(b.produto)&&!isSampleSku(z)),line=r?.linha||'';vals=[lineTag?line.replace('MAPA AGRÍCOLA ','').replace('MAPA VETERINÁRIO','MAPA VET.'):line,b.produto,v55Qty(c,'1'),v55Qty(c,'5'),v55Qty(c,'20'),v55Qty(c,'50'),v55Qty(c,'200'),v55Qty(c,'150'),b.lot||'',fmtKg(effectiveBatchKg(b)),sopOfBatch(b),stageOfBatch(b)]}else vals=['','Nenhuma produção programada','','','','','','','','','',''];vals.forEach((v,i)=>{ctx.strokeStyle='#e5e7eb';ctx.strokeRect(x,y,cols[i],rowH);let s=String(v??'');if(i===1&&s.length>45)s=s.slice(0,43)+'…';txt(s,i===1?x+7:x+cols[i]/2,y+rowH/2,i===1?11:9,i===1,'#111',i===1?'left':'center');x+=cols[i]});y+=rowH})});
  rect(0,y,W,foot,'#f3f4f6');txt('A imagem utiliza exatamente as bateladas e etapas exibidas na Programação Semanal.',18,y+foot/2,12,false,'#475467');let a=document.createElement('a');a.download=`Programacao_Semanal_CTEC_${week}.png`;a.href=canvas.toDataURL('image/png');a.click()
}

function v41BoCatalog(){return packagingCatalogKeys().map(k=>{let [s,c,m]=k.split('|');return{key:k,size:Number(s),color:c,model:m}})}
bombonaScopedBatches=function(){let scope=$('boScope')?.value||OPS.packScope||'WEEK';OPS.packScope=scope;if(scope==='WEEK'){let set=new Set(isoWeekDates($('boWeek')?.value||OPS.week||currentIsoWeek()));return(MPS.batches||[]).filter(b=>b.date&&set.has(b.date)&&b.status!=='A fazer')}if(scope==='CONFIRM')return(MPS.batches||[]).filter(b=>b.status==='Programada'||b.status==='Em produção');return(MPS.batches||[]).filter(b=>b.status!=='Finalizada'&&b.status!=='A fazer'&&b.date)}
function v41BoData(){
  OPS.packOrder=OPS.packOrder||{};OPS.packCaps=OPS.packCaps||{valve:0,noValve:0,include5B:false};
  let agg=packagingAggregate(bombonaScopedBatches()),needMap={};agg.forEach(r=>needMap[r.key]=r.qty);
  let rows=v41BoCatalog().map(r=>{let rule=PACK_RULES[String(r.size)],stock=Math.max(0,N(OPS.packStock?.[r.key])||0),need=Math.max(0,N(needMap[r.key])||0),projected=stock-need,buy=Math.max(0,N(OPS.packOrder[r.key])||0),after=projected+buy,unitCube=rule?rule.cube/rule.units:0,cube=buy*unitCube,packEq=rule?buy/rule.units:0;return{...r,stock,need,projected,buy,after,cube,packEq,units:rule?.units||0}});
  let cube=rows.reduce((a,r)=>a+r.cube,0),pct=cube/TRUCK.operational*100,order=rows.reduce((a,r)=>a+r.buy,0),stock=rows.reduce((a,r)=>a+r.stock,0);
  let cap2050=rows.filter(r=>r.size===20||r.size===50).reduce((a,r)=>a+r.buy,0),cap5b=rows.filter(r=>r.size===5&&r.model==='B').reduce((a,r)=>a+r.buy,0),seals=rows.filter(r=>r.size===200).reduce((a,r)=>a+r.buy*2,0);
  return{rows,cube,pct,order,stock,cap2050,cap5b,seals}
}
bombonaOrderData=v41BoData;
renderBombonas=function(){
  if(!$('boBody'))return;let d=v41BoData();
  $('boBody').innerHTML=d.rows.map(r=>`<tr><td><b>${r.size}L</b></td><td>${escHtml(r.color)}</td><td>${escHtml(r.model)}</td><td>${r.need.toLocaleString('pt-BR')}</td><td><input class=v41-bo-stock data-key="${escHtml(r.key)}" type=number min=0 step=1 value="${r.stock}"></td><td class="${r.projected<0?'v41-bo-neg':'v41-bo-pos'}">${r.projected.toLocaleString('pt-BR')}</td><td><input class=v41-bo-buy data-key="${escHtml(r.key)}" type=number min=0 step=1 value="${r.buy||''}" placeholder="0"></td><td class="${r.after<0?'v41-bo-neg':'v41-bo-pos'}">${r.after.toLocaleString('pt-BR')}</td><td>${r.units}</td><td>${r.packEq.toLocaleString('pt-BR',{maximumFractionDigits:2})}</td><td>${fmtM3(r.cube)}</td></tr>`).join('');
  $('boBody').querySelectorAll('.v41-bo-stock').forEach(el=>el.onchange=()=>{OPS.packStock[el.dataset.key]=Math.max(0,N(el.value)||0);save();renderBombonas()});$('boBody').querySelectorAll('.v41-bo-buy').forEach(el=>el.oninput=()=>{OPS.packOrder[el.dataset.key]=Math.max(0,N(el.value)||0);save();renderBombonas()});
  if($('boNeed'))$('boNeed').textContent=d.rows.reduce((a,r)=>a+r.need,0).toLocaleString('pt-BR');if($('boStockTotal'))$('boStockTotal').textContent=d.stock.toLocaleString('pt-BR');if($('boOrderTotal'))$('boOrderTotal').textContent=d.order.toLocaleString('pt-BR');if($('boCube'))$('boCube').textContent=fmtM3(d.cube);if($('boUsePct'))$('boUsePct').textContent=d.pct.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';if($('boRemainCube'))$('boRemainCube').textContent=fmtM3(Math.max(0,TRUCK.operational-d.cube));
  let bar=$('boTruckBar');if(bar){bar.style.width=Math.min(100,d.pct)+'%';bar.className=d.pct>100?'over':d.pct>=90?'near':''}if($('boTruckText'))$('boTruckText').innerHTML=`<b>${fmtM3(d.cube)}</b> de 83,00 m³ • <b>${d.pct.toLocaleString('pt-BR',{maximumFractionDigits:1})}%</b>${d.pct>100?' • CAPACIDADE EXCEDIDA':''}`;
  let caps=OPS.packCaps;$('boCapValve').value=N(caps.valve)||0;$('boCapNoValve').value=N(caps.noValve)||0;$('boCap5B').checked=!!caps.include5B;$('boCap2050Need').textContent=d.cap2050.toLocaleString('pt-BR');$('boCap5BQty').textContent=caps.include5B?d.cap5b.toLocaleString('pt-BR'):'0';$('boSeal200').textContent=d.seals.toLocaleString('pt-BR');
  let capSum=(N(caps.valve)||0)+(N(caps.noValve)||0),capMsg=$('boCapCheck');if(capMsg)capMsg.innerHTML=capSum===d.cap2050?`<span style="color:#166534"><b>OK:</b> ${capSum} tampas para ${d.cap2050} bombonas 20L/50L.</span>`:`<span style="color:#b91c1c"><b>Revisar:</b> ${d.cap2050} bombonas 20L/50L exigem ${d.cap2050} tampas; distribuição informada = ${capSum}.</span>`;
  let ordered=d.rows.filter(r=>r.buy>0);$('boOrderSummary').innerHTML=ordered.length?`<div class=v41-order-list>${ordered.map(r=>`<div class=v41-order-chip><b>${r.size}L ${escHtml(r.color)} Mod.${escHtml(r.model)}</b><br>${r.buy} un. • ${fmtM3(r.cube)}</div>`).join('')}</div>`:'<div class=chartempty>Nenhuma bombona adicionada ao pedido.</div>'
}
bombonaText=function(){let d=v41BoData(),caps=OPS.packCaps||{},lines=['PEDIDO DE BOMBONAS'];d.rows.filter(r=>r.buy>0).forEach(r=>lines.push(`• ${r.size}L ${r.color} Modelo ${r.model}: ${r.buy} un.`));lines.push(`\nCubagem: ${fmtM3(d.cube)} / 83,00 m³ (${d.pct.toLocaleString('pt-BR',{maximumFractionDigits:1})}%)`);lines.push(`Tampas 20L/50L com válvula: ${N(caps.valve)||0}`);lines.push(`Tampas 20L/50L sem válvula: ${N(caps.noValve)||0}`);if(caps.include5B&&d.cap5b)lines.push(`Tampas 5L Modelo B: ${d.cap5b}`);if(d.seals)lines.push(`Lacre Vermelho p/ Bombona de 200L: ${d.seals}`);return lines.join('\n')}
exportBombCsv=function(){let d=v41BoData(),h=['Litragem','Cor','Modelo','Necessidade produção','Estoque atual','Saldo projetado','Comprar','Saldo após pedido','Un./pacote','Pacotes equivalentes','Cubagem m3'],csv=[h.join(';'),...d.rows.map(r=>[r.size,r.color,r.model,r.need,r.stock,r.projected,r.buy,r.after,r.units,r.packEq,r.cube].map(escCsv).join(';'))].join('\n');downloadTextFile('Pedido_Bombonas_CTEC.csv','\ufeff'+csv,'text/csv;charset=utf-8')}
async function v41BombStockImport(file){
  let rows=[];
  if(/\.csv$/i.test(file.name)){let txt=await file.text();rows=txt.split(/\r?\n/).map(l=>l.split(/[;\t]/))}
  else if(window.XLSX){let wb=XLSX.read(await file.arrayBuffer(),{type:'array'}),ws=wb.Sheets[wb.SheetNames[0]];rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''})}
  else {alert('Para XLSX, abra o sistema com internet para carregar o leitor Excel. Também é possível usar CSV.');return}
  let cat=v41BoCatalog(),matched=0;rows.forEach(row=>{let txt=norm(row.join(' ')),nums=row.map(v=>N(v)).filter(v=>v!==null);if(!nums.length)return;let qty=nums.at(-1),size=[200,50,20,5].find(s=>new RegExp(`\\b${s}\\s*L\\b`).test(txt)||new RegExp(`\\b${s}L\\b`).test(txt));if(!size)return;let model=/MODELO\\s*B|MOD\\.?\\s*B/.test(txt)?'B':/MODELO\\s*C|MOD\\.?\\s*C/.test(txt)?'C':'';let candidates=cat.filter(r=>r.size===size&&(!model||r.model===model)&&txt.includes(norm(r.color)));if(candidates.length===1){OPS.packStock[candidates[0].key]=Math.max(0,qty);matched++}});
  save();renderBombonas();alert(`${matched} saldos de bombonas reconhecidos no arquivo.`)
}
window.v41BombStockImport=v41BombStockImport;
async function v41BombPng(){
  let d=v41BoData(),rows=d.rows.filter(r=>r.buy>0),caps=OPS.packCaps||{},W=1200,rowH=44,H=190+Math.max(1,rows.length)*rowH+180,canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;let ctx=canvas.getContext('2d'),y=0;
  const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h)},txt=(t,x,y,s=15,b=false,c='#111',al='left')=>{ctx.font=`${b?'700':'400'} ${s}px Arial`;ctx.fillStyle=c;ctx.textAlign=al;ctx.textBaseline='middle';ctx.fillText(String(t??''),x,y)};
  rect(0,0,W,H,'#fff');rect(0,0,W,90,'#c71920');txt('PEDIDO DE BOMBONAS',28,32,27,true,'#fff');txt(`Cubagem ${fmtM3(d.cube)} / 83,00 m³ • ${d.pct.toLocaleString('pt-BR',{maximumFractionDigits:1})}%`,28,65,15,false,'#ffe4e6');y=110;let cols=[120,300,110,140,150,170],heads=['Litragem','Cor / Modelo','Comprar','Cubagem','Saldo após pedido','Pacotes equiv.'],x=20;heads.forEach((h,i)=>{rect(x,y,cols[i],34,'#f3f4f6');txt(h,x+cols[i]/2,y+17,11,true,'#475467','center');x+=cols[i]});y+=34;(rows.length?rows:[null]).forEach(r=>{x=20;let vals=r?[`${r.size}L`,`${r.color} / Mod.${r.model}`,r.buy,fmtM3(r.cube),r.after,r.packEq.toLocaleString('pt-BR',{maximumFractionDigits:2})]:['—','Nenhum item no pedido','','','',''];vals.forEach((v,i)=>{ctx.strokeStyle='#e5e7eb';ctx.strokeRect(x,y,cols[i],rowH);txt(v,x+cols[i]/2,y+rowH/2,12,i===1,'#111','center');x+=cols[i]});y+=rowH});y+=18;txt('ACESSÓRIOS',20,y,16,true,'#991b1b');y+=30;txt(`Tampas 20L/50L com válvula: ${N(caps.valve)||0}`,20,y,13,true);txt(`Tampas 20L/50L sem válvula: ${N(caps.noValve)||0}`,500,y,13,true);y+=28;if(caps.include5B)txt(`Tampas 5L Modelo B: ${d.cap5b}`,20,y,13,true);txt(`Lacre Vermelho p/ Bombona de 200L: ${d.seals}`,500,y,13,true);y+=38;rect(20,y,W-40,20,'#eef1f4');rect(20,y,(W-40)*Math.min(1,d.pct/100),20,d.pct>100?'#dc2626':d.pct>=90?'#f59e0b':'#22c55e');txt(`${d.pct.toLocaleString('pt-BR',{maximumFractionDigits:1})}% do caminhão`,W/2,y+10,11,true,'#111','center');let a=document.createElement('a');a.download=`Pedido_Bombonas_CTEC_${new Date().toISOString().slice(0,10)}.png`;a.href=canvas.toDataURL('image/png');a.click()
}
window.v41BombPng=v41BombPng;

function v41MaterialSnapshots(){MP.snapshots=Array.isArray(MP.snapshots)?MP.snapshots:[];if(!MP.snapshots.length&&MP.stock&&Object.keys(MP.stock).length){MP.snapshots.push({at:MP.updated||new Date().toLocaleString('pt-BR'),file:MP.source||'Base inicial',stock:structuredClone(MP.stock)})}return MP.snapshots}
function v41MaterialChart(points){
  if(!points.length)return'<div class=chartempty>O histórico começará a ser formado nas próximas importações.</div>';
  let W=860,H=220,L=55,R=20,T=20,B=38,vals=points.map(p=>Number(p.value)||0),min=Math.min(...vals),max=Math.max(...vals);if(max===min){max=min+1}let x=i=>L+(W-L-R)*(points.length===1?0.5:i/(points.length-1)),y=v=>T+(H-T-B)*(1-(v-min)/(max-min)),poly=points.map((p,i)=>`${x(i)},${y(p.value)}`).join(' ');
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:220px"><line x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}" stroke="#cbd5e1"/><line x1="${L}" y1="${T}" x2="${L}" y2="${H-B}" stroke="#cbd5e1"/><polyline points="${poly}" fill="none" stroke="#d71920" stroke-width="3"/>${points.map((p,i)=>`<circle cx="${x(i)}" cy="${y(p.value)}" r="4" fill="#d71920"><title>${escHtml(p.at)}: ${stockFmt(p.value)} kg</title></circle>`).join('')}<text x="${L-8}" y="${T+5}" text-anchor="end" font-size="11">${stockFmt(max)}</text><text x="${L-8}" y="${H-B}" text-anchor="end" font-size="11">${stockFmt(min)}</text></svg>`
}
function v41OpenMaterial(name){
  let snaps=v41MaterialSnapshots(),pts=snaps.map(s=>({at:s.at||s.date||'',file:s.file||'',value:N(s.stock?.[name])})).filter(p=>p.value!==null),cur=mpStock(name),vals=pts.map(p=>p.value),last=pts.at(-1)?.value??cur,prev=pts.length>1?pts.at(-2).value:null,delta=prev===null?null:last-prev;
  $('mpHistTitle').textContent=name;$('mpHistSummary').innerHTML=`<div><small>Estoque atual</small><b>${stockFmt(cur)} kg</b></div><div><small>Última variação</small><b>${delta===null?'—':(delta>=0?'+':'')+stockFmt(delta)+' kg'}</b></div><div><small>Menor registro</small><b>${vals.length?stockFmt(Math.min(...vals))+' kg':'—'}</b></div><div><small>Maior registro</small><b>${vals.length?stockFmt(Math.max(...vals))+' kg':'—'}</b></div>`;$('mpHistChart').innerHTML=v41MaterialChart(pts.slice(-30));$('mpHistTable').innerHTML=pts.length?`<table><thead><tr><th>Data/hora</th><th>Estoque kg</th><th>Arquivo</th></tr></thead><tbody>${pts.slice().reverse().map(p=>`<tr><td>${escHtml(p.at)}</td><td>${stockFmt(p.value)}</td><td>${escHtml(p.file)}</td></tr>`).join('')}</tbody></table>`:'Sem histórico de importações para este material.';$('mpHistoryDlg').showModal()
}
window.v41OpenMaterial=v41OpenMaterial;
renderMaterials=function(){
  if(!$('matBody'))return;let rows=materialRows(),q=($('matQ')?.value||'').trim().toUpperCase(),f=Number($('matFreq')?.value||0),cad=$('matCadastro')?.value||'',out=rows.filter(r=>(!f||r.count>=f)&&(!q||`${r.material} ${r.code} ${r.formulas.join(' ')}`.toUpperCase().includes(q))&&(!cad||(cad==='COM'?r.stock!==null:r.stock===null)));
  $('matBody').innerHTML=out.map(r=>`<tr class=v41-mp-row data-v41-mp="${encodeURIComponent(r.material)}"><td>${escHtml(r.code||'—')}</td><td><b>${escHtml(r.material)}</b>${r.zero?` <span class="eng-status eng-none">${r.zero} zero/QSP</span>`:''}<div class=v41-queue-note>Clique para ver histórico de estoque</div></td><td class=percent>${stockFmt(r.stock)}</td><td>${r.count}</td><td class=percent>${r.max?pctFmt(r.max):'—'}</td><td class=percent>${r.min?pctFmt(r.min):'—'}</td><td>${r.stock!==null?'<span class="eng-status eng-base">ATUALIZADO</span>':'<span class="eng-status eng-pend">SEM SALDO</span>'}</td><td>${r.formulas.slice(0,7).map(x=>`<span class=material-chip>${escHtml(x)}</span>`).join('')}${r.formulas.length>7?` <span class=muted>+${r.formulas.length-7}</span>`:''}</td></tr>`).join('');
  $('matBody').querySelectorAll('[data-v41-mp]').forEach(tr=>tr.onclick=()=>v41OpenMaterial(decodeURIComponent(tr.dataset.v41Mp)));$('matCount').textContent=rows.length;$('matStocked').textContent=rows.filter(r=>r.stock!==null).length;$('matNoStock').textContent=rows.filter(r=>r.stock===null).length;$('matZero').textContent=rows.reduce((a,r)=>a+r.zero,0);renderMaterialTopChart(rows.filter(r=>r.count>0));renderMpHistory()
}
importMpPDF=async function(file){
  $('mpMsg').textContent=' Lendo relatório de matérias-primas...';let parsed=await parseMpPdfSmart(file);if(parsed.items.length<5)parsed=parseMpPosition(await linesPDF(file));if(parsed.items.length<5)throw Error('Não foi possível reconhecer o relatório.');
  let stock={},codes={...MATERIAL_CIGAM_BY_NAME},unmatched=[],official=mpOfficialNames();parsed.items.forEach(r=>{let name=canonicalMpName(r.desc);stock[name]=(stock[name]||0)+r.qty;codes[name]=r.code;if(!official.includes(name))unmatched.push({code:r.code,name})});
  let now=new Date().toLocaleString('pt-BR'),date=parsed.reportDate||now;MP.stock=stock;MP.codes=codes;MP.updated=date;MP.source=file.name;MP.unmatched=unmatched;MP.history=MP.history||[];MP.history.push({file:file.name,date,importedAt:now,items:parsed.items.length,layout:parsed.layout});if(MP.history.length>50)MP.history=MP.history.slice(-50);MP.snapshots=MP.snapshots||[];MP.snapshots.push({at:now,date,file:file.name,stock:structuredClone(stock)});if(MP.snapshots.length>120)MP.snapshots=MP.snapshots.slice(-120);save();renderMaterials();renderMRP();$('mpMsg').textContent=` Atualizado: ${parsed.items.length} códigos consolidados. Histórico salvo para análise diária.`
}

const v41OldFind=find;
find=function(c,n){
  let code=String(c||'').replace(/^0+/,'');
  if(code==='1460'){let x=D.find(z=>norm(z.produto)==='SANI DROP OXI'&&apInfo(z.ap).kind==='L'&&apInfo(z.ap).liters===5);if(x)return x}
  if(code==='1900'){let x=D.find(z=>norm(z.produto)==='TEC BIO DESTROY'&&apInfo(z.ap).kind==='L'&&apInfo(z.ap).liters===1);if(x)return x}
  return v41OldFind(c,n)
}
ignore=function(n,c){let code=String(c||'').replace(/^0+/,'');return code==='228'||code==='229'||/BOMBA EXTRATORA|APLICADOR SEM RETORNO POS DIPPING|APLICADOR DE ESPUMA PRE DIPPING/i.test(n)}

function v41RebuildUI(){
  let mps=$('mps');if(mps)mps.innerHTML=`<div class=hero><h2>PMP — Plano Mestre de Produção</h2><p>O PMP define <b>o que produzir</b>: produto, quantidade de tanques/bateladas e peso de referência. As quantidades por embalagem e a data são definidas somente quando a batelada for programada.</p></div><div class=mps-tabs><button class=active data-mpsview=necessidades>Plano Mestre Mensal</button><button data-mpsview=bateladas>Bateladas a Fazer</button></div><div id=mps_necessidades class="mpsview active"><div class=pmp-toolbar-main><label>Mês do PMP<input id=pmpMonth type=month></label><input id=mpsQ placeholder="Filtrar por nome do produto"><select id=mpsLinha><option value="">Todos os setores</option></select><select id=mpsNeedFilter><option value="">Todos os produtos</option><option value="COM PLANO">Somente com plano</option><option value="A PROGRAMAR">Com bateladas a criar</option></select><button id=pmpCopyPrev class=secondary>Copiar mês anterior</button></div><div class=v41-pmp-kpis><div class=v41-kpi><small>Produtos no PMP</small><b id=mpsNeedCount>0</b></div><div class=v41-kpi><small>Tanques/bateladas planejados</small><b id=mpsMtoTotal>0</b></div><div class=v41-kpi><small>Bateladas já criadas</small><b id=mpsMtsTotal>0</b></div><div class=v41-kpi><small>Bateladas a criar</small><b id=mpsBatchCount>0</b></div></div><div class=notice>Exemplo: Iodo Block = 3 tanques; Tec Clor Premium = 7 tanques. O PMP não define 5L, 20L, 50L etc. Essas quantidades são decididas na batelada conforme a demanda.</div><div class=toolbar><button id=mpsCsv>Exportar PMP</button></div><div class=tablewrap><table class=v41-plan-table><thead><tr><th>Setor</th><th>Produto</th><th>Tanques/bateladas</th><th>Peso por batelada kg</th><th>Kg total previsto</th><th>Bateladas criadas</th><th>Saldo</th><th>Observação</th><th>Ação</th></tr></thead><tbody id=mpsBody></tbody></table></div></div><div id=mps_bateladas class=mpsview><div class=notice><b>Bateladas a Fazer:</b> não recebem data automaticamente. Quando decidir produzir, clique em <b>Programar</b>, informe a data, tanque e quantidades por apresentação.</div><div class=toolbar><button id=newBatch class=primary>+ Batelada avulsa a fazer</button><input id=batchNameFilter placeholder="Filtrar por nome"><select id=batchSectorFilter><option value="">Todos os setores</option></select><select id=batchStatusFilter><option value="">Todas as situações</option><option>A fazer</option><option>Programada</option><option>Em produção</option><option>Finalizada</option></select></div><div id=batchList></div></div>`;
  let weekly=$('semanal');if(weekly)weekly.innerHTML=`<div class=hero><h2>Programação Semanal</h2><p>Esta é a única visão semanal do sistema e é a mesma base usada para impressão e para a imagem do WhatsApp.</p></div><div class=v41-week-kpis><div class=v41-kpi><small>Total da semana</small><b id=weekKg>0 kg</b></div><div class=v41-kpi><small>Média diária</small><b id=weekAvg>0 kg</b></div><div class=v41-kpi><small>Apontado</small><b id=weekDoneKg>0 kg</b></div><div class=v41-kpi><small>Produção</small><b id=weekProdKg>0 kg</b></div><div class=v41-kpi><small>Análise</small><b id=weekAnalysisKg>0 kg</b></div><div class=v41-kpi><small>Envase</small><b id=weekFillKg>0 kg</b></div><div class=v41-kpi><small>Em fila</small><b id=weekQueueKg>0 kg</b></div><div class=v41-kpi><small>Bateladas concluídas</small><b id=weekBatchProgress>0 / 0</b></div><div class=v41-kpi><small>S&OP MTO / MTS / BO</small><b id=weekSop style="font-size:13px">0 / 0 / 0</b></div></div><div class=toolbar><label>Semana <input id=weekSelect type=week></label><button id=weekSharePng class=primary>Gerar imagem WhatsApp</button><button id=weekPrint>Imprimir / PDF</button><button id=weekCsv>Exportar CSV</button><button id=weekCopy>Copiar resumo</button></div><div class=notice>Fluxo: <b>Em Fila → Produção → Análise → Envase → Apontamento</b>. S&OP permanece visível em cada linha.</div><div id=weeklyDays></div><div class=viz-panel><div class=viz-head><div><h3>Bombonas da programação</h3><p>Necessidade calculada pelas bateladas desta semana.</p></div></div><div id=weeklyPackaging></div></div><div class=viz-panel><div class=viz-head><div><h3>Caixas 5L da programação</h3></div></div><div id=weeklyBoxes></div></div>`;
  let bo=$('bombonas');if(bo)bo.innerHTML=`<div class=hero><h2>Estoque e Pedido de Bombonas</h2><p>Fluxo igual ao controle atual: informe o estoque contado, o sistema desconta a programação e você decide manualmente quanto comprar. A cubagem do caminhão é calculada em tempo real.</p></div><div class=v41-bo-kpis><div class=v41-kpi><small>Necessidade da produção</small><b id=boNeed>0</b></div><div class=v41-kpi><small>Estoque contado</small><b id=boStockTotal>0</b></div><div class=v41-kpi><small>Pedido escolhido</small><b id=boOrderTotal>0</b></div><div class=v41-kpi><small>Cubagem do pedido</small><b id=boCube>0 m³</b></div><div class=v41-kpi><small>Uso do caminhão</small><b id=boUsePct>0%</b></div><div class=v41-kpi><small>Espaço restante</small><b id=boRemainCube>83 m³</b></div></div><div class=toolbar><select id=boScope><option value=WEEK>Programação da semana</option><option value=CONFIRM>Todas programadas + em produção</option><option value=OPEN>Todas as bateladas com data</option></select><label>Semana <input id=boWeek type=week></label><label class="filelabel secondary">Importar estoque CIGAM<input id=boStockFile type=file accept=".csv,.xlsx,.xls,text/csv"></label><button id=boPng class=primary>Gerar imagem do pedido</button><button id=boCopy>Copiar pedido</button><button id=boCsv>Exportar CSV</button></div><div class=notice><b>Estoque atual − necessidade da programação = saldo projetado.</b> O campo <b>Comprar</b> é sempre decidido por você. O sistema apenas calcula saldo após pedido e cubagem.</div><div class=tablewrap><table class=v41-bo-table><thead><tr><th>Bombona</th><th>Cor</th><th>Modelo</th><th>Necessidade</th><th>Estoque atual</th><th>Saldo projetado</th><th>Comprar</th><th>Saldo após pedido</th><th>Un./pacote</th><th>Pacotes equiv.</th><th>Cubagem</th></tr></thead><tbody id=boBody></tbody></table></div><div class=v41-truck><h3>Ocupação do caminhão</h3><div id=boTruckText></div><div class=v41-truck-track><span id=boTruckBar style="width:0%"></span></div><div class=muted>Limite operacional: 83 m³ • capacidade física: 84 m³.</div></div><div class=v41-access><div><small>Tampas 20L/50L necessárias</small><b id=boCap2050Need style="font-size:24px">0</b><div class=muted>20L e 50L usam o mesmo modelo de tampa.</div></div><div><label>Tampas com válvula<input id=boCapValve type=number min=0 step=1></label><label>Tampas sem válvula<input id=boCapNoValve type=number min=0 step=1></label></div><div><label><input id=boCap5B type=checkbox> Incluir tampa 5L Modelo B na carga</label><div style="margin-top:10px">Quantidade: <b id=boCap5BQty>0</b></div></div><div><small>Lacre Vermelho p/ Bombona de 200L</small><b id=boSeal200 style="font-size:24px">0</b><div class=muted>2 lacres por bombona de 200L.</div></div></div><div id=boCapCheck class=v41-alert></div><div class=viz-panel style="margin-top:12px"><div class=viz-head><div><h3>Resumo do pedido escolhido</h3></div></div><div id=boOrderSummary></div></div>`;
  if(!$('mpHistoryDlg'))document.body.insertAdjacentHTML('beforeend',`<dialog id=mpHistoryDlg><div class=mh><button class=close id=mpHistClose>Fechar</button><b id=mpHistTitle>Matéria-prima</b></div><div class=mb><div id=mpHistSummary class=v41-mp-summary></div><div id=mpHistChart class=v41-mp-chart></div><div class=tablewrap id=mpHistTable></div></div></dialog>`);
  let p=$('batchDate');if(p?.closest('label'))p.closest('label').childNodes[0].nodeValue='Data de produção (opcional)';
  if($('batchStatus'))$('batchStatus').innerHTML='<option>A fazer</option><option>Programada</option><option>Em produção</option><option>Finalizada</option>';
  if($('batchStage'))$('batchStage').innerHTML='<option>A fazer</option><option>Em Fila</option><option>Produção</option><option>Análise</option><option>Envase</option><option>Apontamento</option>';
  if($('batchFill'))$('batchFill').textContent='Limpar quantidades';
  let head=$('batchDistBody')?.closest('table')?.querySelector('thead');if(head)head.innerHTML='<tr><th>Apresentação</th><th>Estoque atual</th><th>MTO</th><th>MTS</th><th>Total</th><th>Kg</th><th>Embalagem</th><th>Caixa 5L</th></tr>';
  if(!$('batchCreatedMeta')){let help=$('batchDlg')?.querySelector('.batch-create-help');if(help)help.insertAdjacentHTML('afterend','<div id=batchCreatedMeta class=muted style="margin-bottom:9px"></div>')}
  let lines=[...new Set(D.map(x=>x.linha).filter(Boolean))].sort();if($('mpsLinha'))$('mpsLinha').innerHTML='<option value="">Todos os setores</option>'+lines.map(x=>`<option>${escHtml(x)}</option>`).join('');
  if($('pmpMonth'))$('pmpMonth').value=v41Month();if($('weekSelect'))$('weekSelect').value=OPS.week||currentIsoWeek();if($('boWeek'))$('boWeek').value=OPS.week||currentIsoWeek();if($('boScope'))$('boScope').value=OPS.packScope||'WEEK'
}
v41RebuildUI();

document.querySelectorAll('[data-mpsview]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-mpsview]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.mpsview').forEach(v=>v.classList.toggle('active',v.id==='mps_'+b.dataset.mpsview));if(b.dataset.mpsview==='bateladas')renderBatches()});
if($('mpsQ'))$('mpsQ').oninput=renderMPS;if($('mpsLinha'))$('mpsLinha').onchange=renderMPS;if($('mpsNeedFilter'))$('mpsNeedFilter').onchange=renderMPS;if($('pmpMonth'))$('pmpMonth').onchange=renderMPS;if($('pmpCopyPrev'))$('pmpCopyPrev').onclick=copyPreviousPmpMonth;if($('mpsCsv'))$('mpsCsv').onclick=exportMpsCsv;
if($('newBatch'))$('newBatch').onclick=()=>openBatch();if($('batchNameFilter'))$('batchNameFilter').oninput=renderBatches;if($('batchSectorFilter'))$('batchSectorFilter').onchange=renderBatches;if($('batchStatusFilter'))$('batchStatusFilter').onchange=renderBatches;
if($('batchProduct'))$('batchProduct').onchange=()=>{let d=productDensity($('batchProduct').value);$('batchDensity').value=d??'';updateBatchTankOptions();let std=tankStandardFullKg($('batchProduct').value,$('batchTank').value||'');if(std)$('batchKg').value=std;renderBatchDist()};if($('batchFill'))$('batchFill').onclick=fillBatchNeeds;if($('batchSave'))$('batchSave').onclick=saveBatch;
if($('weekSelect'))$('weekSelect').onchange=()=>{OPS.week=$('weekSelect').value;if($('boWeek'))$('boWeek').value=OPS.week;save();renderWeekly();renderBombonas()};if($('weekSharePng'))$('weekSharePng').onclick=downloadWeeklyPng;if($('weekPrint'))$('weekPrint').onclick=printWeekly;if($('weekCsv'))$('weekCsv').onclick=exportWeeklyCsv;if($('weekCopy'))$('weekCopy').onclick=()=>copyText(weeklyText());
if($('boWeek'))$('boWeek').onchange=()=>{OPS.week=$('boWeek').value;if($('weekSelect'))$('weekSelect').value=OPS.week;save();renderBombonas()};if($('boScope'))$('boScope').onchange=()=>{OPS.packScope=$('boScope').value;save();renderBombonas()};if($('boCapValve'))$('boCapValve').oninput=()=>{OPS.packCaps=OPS.packCaps||{};OPS.packCaps.valve=Math.max(0,N($('boCapValve').value)||0);save();renderBombonas()};if($('boCapNoValve'))$('boCapNoValve').oninput=()=>{OPS.packCaps=OPS.packCaps||{};OPS.packCaps.noValve=Math.max(0,N($('boCapNoValve').value)||0);save();renderBombonas()};if($('boCap5B'))$('boCap5B').onchange=()=>{OPS.packCaps=OPS.packCaps||{};OPS.packCaps.include5B=$('boCap5B').checked;save();renderBombonas()};if($('boStockFile'))$('boStockFile').onchange=async e=>{let f=e.target.files[0];if(f)await v41BombStockImport(f);e.target.value=''};if($('boPng'))$('boPng').onclick=v41BombPng;if($('boCopy'))$('boCopy').onclick=()=>copyText(bombonaText());if($('boCsv'))$('boCsv').onclick=exportBombCsv;
if($('mpHistClose'))$('mpHistClose').onclick=()=>$('mpHistoryDlg').close();

v41MaterialSnapshots();save();renderMPS();renderBatches();renderWeekly();renderBombonas();renderMaterials();renderMRP();
})();

// ============================================================================
// Patch Block #5 [id="v42-patch"]
// ============================================================================
(function(){
const V42_THIRD_ORDERS=[
  {code:'002322',report:'ACID ULTRA PREMIUM',product:'Acid Ultra Premium',ap:'5',stock:null},
  {code:'002200',report:'ACID ULTRA PREMIUM',product:'Acid Ultra Premium',ap:'20',stock:-35},
  {code:'002201',report:'ACID ULTRA PREMIUM',product:'Acid Ultra Premium',ap:'50',stock:-90},
  {code:'002202',report:'ALCA ULTRA PREMIUM',product:'Alca Ultra Premium',ap:'5',stock:-80},
  {code:'002203',report:'ALCA ULTRA PREMIUM',product:'Alca Ultra Premium',ap:'20',stock:-35},
  {code:'002204',report:'ALCA ULTRA PREMIUM',product:'Alca Ultra Premium',ap:'50',stock:-90},
  {code:'002378',report:'ACID PRO',product:'Acid Pro',ap:'50',stock:-56},
  {code:'002382',report:'ALCA PRO',product:'Alca Pro',ap:'50',stock:-56},
  {code:'001086',report:'DORUM CLOR PREMIUM',product:'Clor Premium Dorum',ap:'5',stock:-560},
  {code:'001087',report:'DORUM CLOR PREMIUM',product:'Clor Premium Dorum',ap:'20',stock:-140},
  {code:'001088',report:'DORUM CLOR PREMIUM',product:'Clor Premium Dorum',ap:'50',stock:-56},
  {code:'001090',report:'DORUM ACID',product:'Acid Dorum',ap:'5',stock:-100},
  {code:'001091',report:'DORUM ACID',product:'Acid Dorum',ap:'20',stock:-50},
  {code:'001092',report:'DORUM ACID',product:'Acid Dorum',ap:'50',stock:-26},
  {code:'001110',report:'DORUM POS GREEN',product:'DORUM POS GREEN',ap:'5',stock:-200},
  {code:'001111',report:'DORUM POS GREEN',product:'DORUM POS GREEN',ap:'20',stock:-140},
  {code:'001112',report:'DORUM POS GREEN',product:'DORUM POS GREEN',ap:'50',stock:null}
];
function v42Code(v){return String(v||'').replace(/\D/g,'').replace(/^0+/,'')}
function v42ThirdRuleByCode(c){let k=v42Code(c);return V42_THIRD_ORDERS.find(r=>v42Code(r.code)===k)||null}
function v42ThirdRuleByItem(n){
  let s=norm(n),size=(s.match(/\b(5|20|50)\s*L\b/)||[])[1];
  if(!size)return null;
  return V42_THIRD_ORDERS.find(r=>r.ap===size&&(s.includes(norm(r.report))||s.includes(norm(r.product))))||null
}
window.v42IsThirdOrderProduct = v42IsThirdOrderProduct;
function v42IsThirdOrderProduct(product){
  let n=norm(product);return V42_THIRD_ORDERS.some(r=>norm(r.product)===n||norm(r.report)===n)
}
function v42EnsureThirdOrders(){
  let first=!OPS.thirdOrderRulesV42,now=new Date().toLocaleString('pt-BR');
  V42_THIRD_ORDERS.forEach(r=>{
    let x=D.find(z=>v42Code(z.cod)===v42Code(r.code));
    if(!x)x=D.find(z=>norm(z.produto)===norm(r.product)&&String(apInfo(z.ap).liters||'')===String(r.ap));
    if(!x){
      x={linha:'ANVISA',produto:r.product,ap:r.ap,item:`${r.product} ${r.ap}L`,cod:r.code,ref:0,att:0,est:r.stock===null?'':r.stock,atual:now,pedidoAtivo:true,hist:[]};
      D.push(x)
    }
    x.linha=x.linha||'ANVISA';x.produto=r.product;x.ap=r.ap;x.item=`${r.product} ${r.ap}L`;x.cod=r.code;
    x.tipo='Terceirizado';x.terceiroPedido=true;x.nomeRelatorio=r.report;x.ref=0;x.att=0;
    if(first){
      x.pedidoAtivo=true;x.semPedido=false;
      if(r.stock!==null)x.est=r.stock;
      x.atual=now;x.hist=x.hist||[];x.hist.push({data:now,estoque:x.est,rel:'Regra V42',evento:'TERCEIRIZADO — PEDIDO'});
    }
  });
  (PROD_FORMULA||[]).forEach(p=>{if(v42IsThirdOrderProduct(p.product)){p.active=false;p.note=(p.note?`${p.note} • `:'')+'Terceirizado — não fabricar internamente.'}});
  OPS.thirdOrderRulesV42=true;save()
}
v42EnsureThirdOrders();

const v42FindPrev=find;
find=function(c,n){
  let r=v42ThirdRuleByCode(c)||v42ThirdRuleByItem(n);
  if(r){
    let x=D.find(z=>v42Code(z.cod)===v42Code(r.code))||D.find(z=>norm(z.produto)===norm(r.product)&&String(apInfo(z.ap).liters||'')===String(r.ap));
    if(x){x.tipo='Terceirizado';x.terceiroPedido=true;x.nomeRelatorio=r.report;x.cod=r.code;return x}
  }
  return v42FindPrev(c,n)
};

const v42StatPrev=stat;
stat=function(x){
  if(isThird(x)&&x.terceiroPedido){
    if(x.semPedido)return'SEM PEDIDO';
    if(x.pedidoAtivo)return'PEDIDO TERCEIRIZADO'
  }
  return v42StatPrev(x)
};
const v42BadgePrev=badge;
badge=function(s){
  if(s==='PEDIDO TERCEIRIZADO')return'<span class="badge terceiro">PEDIDO TERCEIRIZADO</span>';
  return v42BadgePrev(s)
};
const v42PendingPrev=pendingReasons;
pendingReasons=function(x){
  if(isThird(x)&&x.terceiroPedido)return[];
  return v42PendingPrev(x)
};
mpsCalc=function(x){
  if(isThird(x))return{mto:0,mts:0,total:0};
  let e=N(x.est),r=N(x.ref);if(e===null)e=0;if(r===null)r=0;let mto=Math.max(0,-e),after=e+mto,mts=Math.max(0,r-after);return{mto,mts,total:mto+mts}
};
batchProductOptions=function(){
  return [...new Set(D.filter(x=>!isSampleSku(x)&&!isThird(x)).map(x=>x.produto).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'))
};

const v42MrpBatchPrev=mrpBatchSelection;
mrpBatchSelection=function(){return v42MrpBatchPrev().filter(b=>!v42IsThirdOrderProduct(b.produto))};

const v42WeeklyBatchesPrev=weeklyBatches;
weeklyBatches=function(week){return v42WeeklyBatchesPrev(week).filter(b=>!v42IsThirdOrderProduct(b.produto))};

function v42RenderThirdOrders(){
  let host=document.getElementById('v42ThirdOrders');if(!host)return;
  let rows=V42_THIRD_ORDERS.map(r=>{let x=D.find(z=>v42Code(z.cod)===v42Code(r.code)),e=x?N(x.est):null;return{...r,x,e,status:x?stat(x):'PEDIDO TERCEIRIZADO'}});
  host.innerHTML=`<div class=v42-third-panel><div class=head><div><h3>Terceirizados em pedido</h3><div class=v42-note>Estes produtos são comprados de terceiros. Não entram no PMP, bateladas, programação semanal nem MRP de fabricação.</div></div><span>${rows.length} itens cadastrados</span></div><div class=tablewrap><table class=v42-third-table><thead><tr><th>Código CIGAM</th><th>Produto do relatório</th><th>Apresentação</th><th>Estoque / pedido</th><th>Situação</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${r.code}</b></td><td>${escHtml(r.report)}</td><td>${r.ap}L</td><td class="${r.e!==null&&r.e<0?'neg':r.e===null?'blank':''}">${r.e===null?'Aguardando valor':r.e.toLocaleString('pt-BR')}</td><td>${badge(r.status)}</td></tr>`).join('')}</tbody></table></div></div>`
}
function v42InjectUI(){
  let stock=document.getElementById('estoque');
  if(stock&&!document.getElementById('v42ThirdOrders')){let summary=stock.querySelector('.stock-summary');if(summary)summary.insertAdjacentHTML('afterend','<div id=v42ThirdOrders></div>')}
  ['stockStatus','st'].forEach(id=>{let s=document.getElementById(id);if(s&&![...s.options].some(o=>o.value==='PEDIDO TERCEIRIZADO')){let o=document.createElement('option');o.value='PEDIDO TERCEIRIZADO';o.textContent='Pedido terceirizado';s.appendChild(o)}})
}
v42InjectUI();

renderDashboardCharts=function(rows){
  rows=Array.isArray(rows)?rows:[];let statusBox=$('statusOverviewChart'),riskBox=$('lineRiskOverviewChart');if(!statusBox||!riskBox)return;
  const total=Math.max(rows.length,1),groups=[['NORMAL','Normal','fill-normal'],['ABAIXO DA REFERÊNCIA','Abaixo da referência','fill-abaixo'],['ATENÇÃO','Atenção','fill-atencao'],['CRÍTICO','Crítico','fill-critico'],['PEDIDO TERCEIRIZADO','Pedido terceirizado','fill-outros'],['AGUARDANDO ESTOQUE','Aguardando','fill-outros'],['SOB DEMANDA','Sob demanda','fill-outros']];
  statusBox.innerHTML=`<div class=hbar-list>${groups.map(([key,label,cls])=>{let n=rows.filter(x=>stat(x)===key).length,p=n*100/total;return `<div class=hbar-row><div class=hbar-label>${label}</div><div class=hbar-track><div class="hbar-fill ${cls}" style="width:${p}%"></div></div><div class=hbar-value>${n}</div></div>`}).join('')}</div>`;
  let map=new Map();rows.forEach(x=>{let k=x.linha||'Sem linha',s=stat(x),r=map.get(k)||{name:k,crit:0,att:0,below:0};if(s==='CRÍTICO')r.crit++;if(s==='ATENÇÃO')r.att++;if(s==='ABAIXO DA REFERÊNCIA')r.below++;map.set(k,r)});
  let arr=[...map.values()].filter(r=>r.crit+r.att+r.below>0).sort((a,b)=>(b.crit*4+b.att*2+b.below)-(a.crit*4+a.att*2+a.below));
  if(!arr.length){riskBox.innerHTML='<div class=chartempty>Nenhum item próprio em risco nos filtros atuais.</div>';return}
  let max=Math.max(...arr.map(r=>r.crit+r.att+r.below),1);
  riskBox.innerHTML=`<div class=risk-line-list>${arr.map(r=>`<div class=risk-line-row><div class=risk-line-name title="${escHtml(r.name)}">${escHtml(r.name)}</div><div class=risk-line-track><span class=crit style="width:${r.crit/max*100}%"></span><span class=att style="width:${r.att/max*100}%"></span><span class=below style="width:${r.below/max*100}%"></span></div><div class=risk-line-val>${r.crit} C • ${r.att} A • ${r.below} R</div></div>`).join('')}</div>`
};

const v42RenderPrev=render;
render=function(){v42RenderPrev();v42RenderThirdOrders()};

render();renderMPS();renderBatches();renderWeekly();renderMRP();renderEngineering();
})();

// ============================================================================
// Patch Block #6 [id="v44-patch"]
// ============================================================================
(function(){
'use strict';

const v44OperationalPrev=operationalBatchKg;
operationalBatchKg=function(b){
  let manual=N(b?.productionKg);
  if(manual!==null&&manual>0)return manual;
  if(b?.manualKg===true){let legacy=N(b?.kg);if(legacy!==null&&legacy>0)return legacy}
  return v44OperationalPrev(b)
};

refreshBatchCalc=function(){
  let prod=$('batchProduct').value,dens=N($('batchDensity').value),dist=currentDialogDist();

  $('batchDistBody').querySelectorAll('tr').forEach(tr=>{
    let item=decodeURIComponent(tr.dataset.item),
        mto=N(tr.querySelector('.bd-mto').value)||0,
        mts=N(tr.querySelector('.bd-mts').value)||0,
        tot=mto+mts,
        kg=itemQtyKg(item,tot,dens);
    tr.querySelector('.bd-total').innerHTML=`<b>${tot}</b>`;
    tr.querySelector('.bd-kg').textContent=kg===null?'—':fmtKg(kg)
  });

  let calc=distKg(prod,dist,dens),
      calcKg=(calc.unknown===0&&calc.total>0)?calc.total:null,
      tank=$('batchTank').value||'',
      manual=N($('batchKg').value),
      full=tankStandardFullKg(prod,tank),
      half=tankStandardHalfKg(prod,tank);

  $('batchKg').readOnly=false;
  $('batchCalcKg').textContent=calcKg===null?'Densidade pendente':fmtKg(calcKg);
  $('batchDensityMsg').textContent=dens===null
    ?(densityNote(prod)||'Informe a densidade para calcular os kg equivalentes das embalagens.')
    :'Kg equivalente das embalagens = quantidade × densidade × litragem';

  $('batchTankKg').textContent=(manual!==null&&manual>0)?fmtKg(manual):'INFORME O PESO';

  let diff=(manual!==null&&manual>0&&calcKg!==null)?manual-calcKg:null,
      pct=(manual!==null&&manual>0&&calcKg!==null)?calcKg/manual*100:null;

  $('batchRemainKg').textContent=diff===null?'—':fmtKg(diff);
  $('batchTankPct').textContent=pct===null?'—':pct.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';

  let meter=$('batchTankMeter'),w=pct===null?0:Math.min(100,pct);
  meter.style.width=w+'%';
  meter.className=pct>100?'over':pct>=95?'warn':'';

  if(manual===null||manual<=0){
    $('batchTankAlert').innerHTML='<span class=calc-warn>Informe quantos kg serão produzidos nesta batelada.</span>'
  }else if(calcKg===null||calcKg<=0){
    $('batchTankAlert').innerHTML=`<span class=calc-ok>Referência oficial de produção: ${fmtKg(manual)}.</span>`
  }else if(diff<0){
    $('batchTankAlert').innerHTML=`<span class=calc-warn>As embalagens somam ${fmtKg(calcKg)}, acima da referência de produção de ${fmtKg(manual)}.</span>`
  }else{
    $('batchTankAlert').innerHTML=`<span class=calc-ok>Produção de referência: ${fmtKg(manual)} • embalagens equivalem a ${fmtKg(calcKg)} • diferença ${fmtKg(diff)}.</span>`
  }

  let t=tankMaster(prod);
  if($('batchTankMeta')){
    $('batchTankMeta').textContent=t
      ?`${t.capacityL?`${t.capacityL.toLocaleString('pt-BR')} L físico • `:''}padrão cadastrado ${full?fmtKg(full):'não definido'}${half?` • meia ${fmtKg(half)}`:''}`
      :'Sem padrão de tanque cadastrado.'
  }
};

const v44OpenPrev=openBatch;
openBatch=function(id=null){
  v44OpenPrev(id);
  let b=id?MPS.batches.find(z=>z.id===id):null,
      prod=$('batchProduct').value,
      tank=$('batchTank').value||'',
      saved=N(b?.productionKg),
      legacy=N(b?.kg),
      suggestion=tankStandardFullKg(prod,tank);

  if(saved!==null&&saved>0)$('batchKg').value=saved;
  else if(legacy!==null&&legacy>0)$('batchKg').value=legacy;
  else if(suggestion!==null&&suggestion>0)$('batchKg').value=suggestion;
  else $('batchKg').value='';

  $('batchKg').readOnly=false;
  refreshBatchCalc()
};

if($('batchKg'))$('batchKg').oninput=refreshBatchCalc;

if($('batchTank'))$('batchTank').onchange=()=>{
  let prod=$('batchProduct').value,tank=$('batchTank').value||'';
  let current=N($('batchKg').value),suggestion=tankStandardFullKg(prod,tank);
  if((current===null||current<=0)&&suggestion)$('batchKg').value=suggestion;
  refreshBatchCalc()
};

saveBatch=function(){
  let dist=currentDialogDist(),
      prod=$('batchProduct').value,
      dens=N($('batchDensity').value),
      tank=$('batchTank').value||'',
      date=$('batchDate').value,
      status=$('batchStatus').value||'A fazer',
      stage=$('batchStage').value||'A fazer',
      productionKg=N($('batchKg').value);

  if(!prod){alert('Selecione um produto.');return}
  if(productionKg===null||productionKg<=0){
    alert('Informe quantos kg serão produzidos neste tanque/batelada.');
    $('batchKg').focus();
    return
  }

  let mainQty=0,sampleQty=0;
  Object.entries(dist).forEach(([item,d])=>{
    let q=(N(d.mto)||0)+(N(d.mts)||0);
    if(isSampleItem(item))sampleQty+=q;else mainQty+=q
  });

  if(date&&mainQty<=0){alert('Para programar em uma data, informe as quantidades da batelada.');return}
  if(sampleQty>0&&!tank){alert('Amostras devem estar vinculadas ao tanque da batelada principal.');return}

  if(!date){status='A fazer';stage='A fazer'}
  else if(status==='A fazer'){status='Programada';stage='Em Fila'}

  if(stage==='Apontamento')status='Finalizada';
  else if(['Produção','Análise','Envase'].includes(stage))status='Em produção';
  else if(stage==='Em Fila')status='Programada';

  let calc=distKg(prod,dist,dens),
      calcKg=(calc.unknown===0&&calc.total>0)?calc.total:null;

  if(dens!==null&&dens>0)OPS.density[norm(prod)]=dens;

  let old=editingBatchId?MPS.batches.find(z=>z.id===editingBatchId):null,
      now=Date.now(),
      obj={
        id:editingBatchId||('B'+now),
        produto:prod,
        date,
        kg:Number(productionKg.toFixed(3)),
        productionKg:Number(productionKg.toFixed(3)),
        manualKg:true,
        calcKg:calcKg===null?'':Number(calcKg.toFixed(3)),
        density:dens===null?'':dens,
        tank,
        status,
        stage,
        sop:$('batchSop').value||'AUTO',
        lot:$('batchLot').value.trim(),
        priority:$('batchPriority').value||'Normal',
        obs:$('batchObs').value,
        dist,
        createdAt:old?.createdAt||now,
        updatedAt:now,
        created:old?.created||new Date(now).toLocaleString('pt-BR'),
        pmpSource:old?.pmpSource||false,
        planMonth:old?.planMonth||''
      };

  if(editingBatchId){
    let i=MPS.batches.findIndex(z=>z.id===editingBatchId);
    if(i>=0)MPS.batches[i]={...MPS.batches[i],...obj}
  }else MPS.batches.push(obj);

  save();
  $('batchDlg').close();
  renderMPS();
  renderBatches();
  renderWeekly();
  renderBombonas();
  renderProduction();
  renderMRP()
};

// Ensure old queued batches can adopt the new field after being edited.
(MPS.batches||[]).forEach(b=>{
  if(b.productionKg===undefined&&b.manualKg===true&&N(b.kg)>0)b.productionKg=N(b.kg)
});

save();
})();

// ============================================================================
// Patch Block #7 [id="v45-patch"]
// ============================================================================
(function(){
'use strict';

/*
V45:
- O peso digitado na batelada é a fonte oficial de kg.
- Referência/padrão do tanque nunca sobrescreve esse valor.
- Programação semanal, MRP, dashboard e demais cálculos usam o mesmo peso salvo.
*/

// Fonte única de verdade para kg da batelada.
effectiveBatchKg=function(b){
  let manual=N(b?.productionKg);
  if(manual!==null&&manual>0)return manual;

  // Compatibilidade com bateladas antigas já salvas.
  let legacy=N(b?.kg);
  return legacy!==null&&legacy>0?legacy:0
};

operationalBatchKg=function(b){
  return effectiveBatchKg(b)
};

// Ao criar/abrir uma batelada, não preencher peso automaticamente pelo padrão.
const v45OpenPrev=openBatch;
openBatch=function(id=null){
  v45OpenPrev(id);

  let b=id?MPS.batches.find(z=>z.id===id):null,
      saved=N(b?.productionKg),
      legacy=N(b?.kg);

  if(b){
    $('batchKg').value=saved!==null&&saved>0?saved:(legacy!==null&&legacy>0?legacy:'')
  }else{
    $('batchKg').value=''
  }

  $('batchKg').readOnly=false;
  refreshBatchCalc()
};

// Trocar o tanque não altera mais o peso digitado.
if($('batchTank'))$('batchTank').onchange=()=>{
  refreshBatchCalc()
};

// Trocar produto também não deve preencher peso pelo padrão.
if($('batchProduct'))$('batchProduct').onchange=()=>{
  let d=productDensity($('batchProduct').value);
  $('batchDensity').value=d??'';
  updateBatchTankOptions();
  renderBatchDist();
  $('batchKg').value='';
  $('batchKg').readOnly=false;
  refreshBatchCalc()
};

// Atualização visual sem alterar o valor digitado.
refreshBatchCalc=function(){
  let prod=$('batchProduct').value,
      dens=N($('batchDensity').value),
      dist=currentDialogDist(),
      manual=N($('batchKg').value),
      tank=$('batchTank').value||'';

  $('batchDistBody').querySelectorAll('tr').forEach(tr=>{
    let item=decodeURIComponent(tr.dataset.item),
        mto=N(tr.querySelector('.bd-mto').value)||0,
        mts=N(tr.querySelector('.bd-mts').value)||0,
        tot=mto+mts,
        kg=itemQtyKg(item,tot,dens);

    tr.querySelector('.bd-total').innerHTML=`<b>${tot}</b>`;
    tr.querySelector('.bd-kg').textContent=kg===null?'—':fmtKg(kg)
  });

  let calc=distKg(prod,dist,dens),
      calcKg=(calc.unknown===0&&calc.total>0)?calc.total:null,
      reference=tankStandardFullKg(prod,tank),
      half=tankStandardHalfKg(prod,tank);

  $('batchKg').readOnly=false;
  $('batchCalcKg').textContent=calcKg===null?'Densidade pendente':fmtKg(calcKg);
  $('batchDensityMsg').textContent=dens===null
    ?(densityNote(prod)||'Informe a densidade para calcular os kg equivalentes das embalagens.')
    :'Kg equivalente das embalagens = quantidade × densidade × litragem';

  $('batchTankKg').textContent=(manual!==null&&manual>0)?fmtKg(manual):'INFORME O PESO';

  let diff=(manual!==null&&manual>0&&calcKg!==null)?manual-calcKg:null,
      pct=(manual!==null&&manual>0&&calcKg!==null)?calcKg/manual*100:null;

  $('batchRemainKg').textContent=diff===null?'—':fmtKg(diff);
  $('batchTankPct').textContent=pct===null?'—':pct.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';

  let meter=$('batchTankMeter'),w=pct===null?0:Math.min(100,pct);
  meter.style.width=w+'%';
  meter.className=pct>100?'over':pct>=95?'warn':'';

  if(manual===null||manual<=0){
    $('batchTankAlert').innerHTML='<span class=calc-warn>Informe o peso real desta batelada. O padrão não será usado automaticamente.</span>'
  }else if(calcKg===null||calcKg<=0){
    $('batchTankAlert').innerHTML=`<span class=calc-ok>O sistema contabilizará exatamente ${fmtKg(manual)} nesta batelada.</span>`
  }else{
    $('batchTankAlert').innerHTML=`<span class=calc-ok>Peso oficial: ${fmtKg(manual)} • embalagens equivalem a ${fmtKg(calcKg)}${diff!==null?` • diferença ${fmtKg(diff)}`:''}.</span>`
  }

  let t=tankMaster(prod);
  if($('batchTankMeta')){
    $('batchTankMeta').innerHTML=t
      ?`${t.capacityL?`${t.capacityL.toLocaleString('pt-BR')} L físico • `:''}padrão cadastrado ${reference?fmtKg(reference):'não definido'}${half?` • meia ${fmtKg(half)}`:''}<div class=v45-weight-help>Somente referência. Não altera o peso desta batelada.</div>`
      :'<span class=muted>Sem padrão de tanque cadastrado.</span>'
  }
};

if($('batchKg'))$('batchKg').oninput=refreshBatchCalc;

// Salva exatamente o que foi digitado.
saveBatch=function(){
  let dist=currentDialogDist(),
      prod=$('batchProduct').value,
      dens=N($('batchDensity').value),
      tank=$('batchTank').value||'',
      date=$('batchDate').value,
      status=$('batchStatus').value||'A fazer',
      stage=$('batchStage').value||'A fazer',
      productionKg=N($('batchKg').value);

  if(!prod){alert('Selecione um produto.');return}
  if(productionKg===null||productionKg<=0){
    alert('Informe o peso exato que será produzido nesta batelada.');
    $('batchKg').focus();
    return
  }

  let mainQty=0,sampleQty=0;
  Object.entries(dist).forEach(([item,d])=>{
    let q=(N(d.mto)||0)+(N(d.mts)||0);
    if(isSampleItem(item))sampleQty+=q;else mainQty+=q
  });

  if(date&&mainQty<=0){
    alert('Para programar em uma data, informe as quantidades da batelada.');
    return
  }
  if(sampleQty>0&&!tank){
    alert('Amostras devem estar vinculadas ao tanque da batelada principal.');
    return
  }

  if(!date){status='A fazer';stage='A fazer'}
  else if(status==='A fazer'){status='Programada';stage='Em Fila'}

  if(stage==='Apontamento')status='Finalizada';
  else if(['Produção','Análise','Envase'].includes(stage))status='Em produção';
  else if(stage==='Em Fila')status='Programada';

  let calc=distKg(prod,dist,dens),
      calcKg=(calc.unknown===0&&calc.total>0)?calc.total:null;

  if(dens!==null&&dens>0)OPS.density[norm(prod)]=dens;

  let old=editingBatchId?MPS.batches.find(z=>z.id===editingBatchId):null,
      now=Date.now(),
      exactKg=Number(productionKg.toFixed(3)),
      obj={
        id:editingBatchId||('B'+now),
        produto:prod,
        date,
        kg:exactKg,
        productionKg:exactKg,
        manualKg:true,
        calcKg:calcKg===null?'':Number(calcKg.toFixed(3)),
        density:dens===null?'':dens,
        tank,
        status,
        stage,
        sop:$('batchSop').value||'AUTO',
        lot:$('batchLot').value.trim(),
        priority:$('batchPriority').value||'Normal',
        obs:$('batchObs').value,
        dist,
        createdAt:old?.createdAt||now,
        updatedAt:now,
        created:old?.created||new Date(now).toLocaleString('pt-BR'),
        pmpSource:old?.pmpSource||false,
        planMonth:old?.planMonth||''
      };

  if(editingBatchId){
    let i=MPS.batches.findIndex(z=>z.id===editingBatchId);
    if(i>=0)MPS.batches[i]={...MPS.batches[i],...obj}
  }else{
    MPS.batches.push(obj)
  }

  save();
  $('batchDlg').close();

  renderMPS();
  renderBatches();
  renderWeekly();
  renderBombonas();
  renderProduction();
  renderMRP()
};

// A fila de bateladas também mostra o mesmo peso salvo.
const v45RenderBatchesPrev=renderBatches;
renderBatches=function(){
  v45RenderBatchesPrev();
  // O renderer já usa effectiveBatchKg(), que agora devolve productionKg sem ajuste.
};

// A programação semanal também usa exclusivamente effectiveBatchKg().
// O PNG, impressão, CSV, MRP e dashboard usam a mesma função.
save();
})();

// ============================================================================
// Patch Block #8 [id="v46-patch"]
// ============================================================================
(function(){
'use strict';

/*
V46
1) Produtos próprios sob demanda/exportação também ficam disponíveis na criação de bateladas,
   mesmo quando não possuem saldo/código ativo na base diária do CIGAM.
2) TEC OXI PY é disponibilizado como produto sob demanda.
3) Observações da batelada ficam visíveis na própria fila/lista, em uma linha compacta.
*/

function v46IsOwnMasterProduct(product){
  let t=(TANK_MASTER||[]).find(x=>norm(x.product)===norm(product));
  if(t)return norm(t.manufacturing||'PROPRIO')!=='TERCEIRIZADO';

  let f=(PROD_FORMULA||[]).find(x=>norm(x.product)===norm(product)&&x.active!==false);
  if(f)return true;

  let rows=D.filter(x=>norm(x.produto)===norm(product));
  return rows.length?rows.some(x=>!isThird(x)):false
}

window.v46PackRows = v46PackRows;
function v46PackRows(product, templateProduct=product){
  let p=(PACKAGING_MASTER||[]).find(x=>norm(x.product)===norm(templateProduct));
  if(!p||!p.packs)return [];

  let order=['1L','5L','20L','50L','200L','1000L'];
  return order.filter(k=>{
    let rec=p.packs[k];
    return rec && rec.color && rec.color!=='-'
  }).map(k=>{
    let liters=Number(k.replace('L',''));
    return {
      linha:p.line||'ANVISA',
      produto:product,
      ap:String(liters),
      item:`${product} ${liters}L`,
      cod:'',
      ref:0,
      att:0,
      est:'',
      atual:'',
      pedidoAtivo:false,
      semPedido:false,
      hist:[],
      tipo:'Próprio',
      sobDemanda:true,
      virtualDemand:true
    }
  })
}

function v46EnsureDemandProducts(){
  let candidates=new Set();

  (TANK_MASTER||[]).forEach(x=>{
    if(norm(x.manufacturing||'PROPRIO')!=='TERCEIRIZADO' && x.product)candidates.add(x.product)
  });

  (PROD_FORMULA||[]).forEach(x=>{
    if(x.active!==false && x.product && v46IsOwnMasterProduct(x.product))candidates.add(x.product)
  });

  (PACKAGING_MASTER||[]).forEach(x=>{
    if(x.product && v46IsOwnMasterProduct(x.product))candidates.add(x.product)
  });

  candidates.forEach(product=>{
    if(D.some(x=>norm(x.produto)===norm(product)&&!isSampleSku(x)))return;
    let rows=v46PackRows(product);
    rows.forEach(r=>D.push(r))
  });

  // Pedido sob demanda citado pelo usuário.
  if(!D.some(x=>norm(x.produto)===norm('Tec Oxi PY')&&!isSampleSku(x))){
    let rows=v46PackRows('Tec Oxi PY','Tec Oxi Exportação');
    if(!rows.length)rows=v46PackRows('Tec Oxi PY','Tec Oxi');
    rows.forEach(r=>D.push(r))
  }

  save()
}

v46EnsureDemandProducts();

/* O perfil de embalagem do TEC OXI PY segue o cadastro de exportação para permitir
   a distribuição da batelada nas apresentações disponíveis. */
const v46PackMasterPrev=packMaster;
packMaster=function(product){
  if(norm(product)===norm('Tec Oxi PY')){
    return (PACKAGING_MASTER||[]).find(p=>norm(p.product)===norm('Tec Oxi Exportação'))
      || (PACKAGING_MASTER||[]).find(p=>norm(p.product)===norm('Tec Oxi'))
      || null
  }
  return v46PackMasterPrev(product)
};

/* Fórmula de produção do TEC OXI PY: mesma família do TEC OXI. */
const v46ProductFormulaPrev=productFormulaLink;
productFormulaLink=function(product){
  if(norm(product)===norm('Tec Oxi PY')){
    return {product:'Tec Oxi PY',formula:'TEC OXI',relation:'IGUAL',note:'Produto sob demanda/exportação.',active:true,line:'ANVISA'}
  }
  return v46ProductFormulaPrev(product)
};

/* Todos os produtos próprios cadastrados ou sob demanda aparecem no seletor.
   Terceirizados continuam fora das bateladas internas. */
batchProductOptions=function(){
  return [...new Set(
    D.filter(x=>!isSampleSku(x) && !isThird(x))
     .map(x=>x.produto)
     .filter(Boolean)
  )].sort((a,b)=>a.localeCompare(b,'pt-BR'))
};

/* Garante apresentações para produto mestre/sob demanda mesmo sem estoque diário. */
const v46ProductSkusPrev=productSkus;
productSkus=function(prod){
  let rows=v46ProductSkusPrev(prod);

  if(rows.filter(x=>!isSampleSku(x)).length===0){
    let virtual=v46PackRows(prod, norm(prod)===norm('Tec Oxi PY')?'Tec Oxi Exportação':prod);
    virtual.forEach(r=>{
      let exists=D.find(x=>norm(x.item)===norm(r.item));
      if(!exists){D.push(r);rows.push(r)}
      else if(!rows.includes(exists))rows.push(exists)
    })
  }

  if(!rows.some(isSampleSku))rows.push(sampleSkuForProduct(prod));

  return rows.sort((a,b)=>{
    let sa=isSampleSku(a)?1:0,sb=isSampleSku(b)?1:0;
    if(sa!==sb)return sa-sb;
    let aa=apInfo(a.ap),bb=apInfo(b.ap),
        va=aa.kind==='L'?aa.liters:(aa.kind==='KG'?aa.kg:9999),
        vb=bb.kind==='L'?bb.liters:(bb.kind==='KG'?bb.kg:9999);
    return va-vb
  })
};

renderBatches=function(){
  if(!$('batchList'))return;
  populateBatchSectorFilter();

  let f=$('batchStatusFilter')?.value||'',
      sector=$('batchSectorFilter')?.value||'',
      q=($('batchNameFilter')?.value||'').trim().toUpperCase();

  let arr=(MPS.batches||[])
    .map((b,idx)=>({...b,_sector:batchSectorName(b.produto),_order:Number(b.createdAt||0)||idx}))
    .filter(b=>
      (!f||b.status===f) &&
      (!sector||b._sector===sector) &&
      (!q||`${b.produto||''} ${b.obs||''}`.toUpperCase().includes(q))
    )
    .sort((a,b)=>b._order-a._order);

  if(!arr.length){
    $('batchList').innerHTML='<div class=mps-empty>Nenhuma batelada cadastrada.</div>';
    return
  }

  let groups={};
  arr.forEach(b=>(groups[b._sector]||(groups[b._sector]=[])).push(b));

  $('batchList').innerHTML=Object.keys(groups).sort((a,b)=>a.localeCompare(b,'pt-BR')).map(sec=>
    `<div class=v41-sector>
      <div class=v41-sector-head>
        <b>${escHtml(sec)}</b>
        <span>${groups[sec].length} batelada(s)</span>
      </div>
      ${groups[sec].map(b=>{
        let c=batchCounts(b),
            qtxt=['1','5','20','50','200','150']
              .filter(k=>Number(c[k]||0)>0)
              .map(k=>`${k==='150'?'Amostra':k+'L'} ${c[k]}`)
              .join(' • '),
            demandProduct=D.some(x=>norm(x.produto)===norm(b.produto)&&x.sobDemanda);

        return `<div class=v41-batch-row>
          <div class=namecell>
            <div class=product>
              ${escHtml(b.produto)}
              ${b.pmpSource?`<span class=v41-batch-origin>PMP ${escHtml(b.planMonth||'')}</span>`:''}
              ${demandProduct?'<span class=v46-demand-tag>SOB DEMANDA</span>':''}
            </div>
            <div class=v41-queue-note>${qtxt||'Quantidades ainda não definidas'}${b.lot?` • Lote ${escHtml(b.lot)}`:''}</div>
            <div class=v41-queue-note>criada em <b>${escHtml(b.created||'registro antigo')}</b></div>
          </div>
          <div><small>Data produção</small><b>${b.date?b.date.split('-').reverse().join('/'):'A definir'}</b></div>
          <div><small>Peso</small><b>${fmtKg(effectiveBatchKg(b))}</b></div>
          <div class=hide-md><small>S&amp;OP</small><b>${escHtml(sopOfBatch(b))}</b></div>
          <div class=hide-md><small>Situação</small><b>${escHtml(b.status||'A fazer')}</b><div class=v41-queue-note>${escHtml(stageOfBatch(b))}</div></div>
          <div class=actions>
            <button class="smallbtn primary" onclick="openBatch('${b.id}')">${b.status==='A fazer'?'Programar':'Editar'}</button>
            <button class="smallbtn secondary" onclick="deleteBatch('${b.id}')">Excluir</button>
          </div>
          ${b.obs?`<div class=v46-batch-obs title="${escHtml(b.obs)}"><b>Obs.</b>${escHtml(b.obs)}</div>`:''}
        </div>`
      }).join('')}
    </div>`
  ).join('')
};

/* Atualiza lista e deixa o novo conjunto imediatamente disponível. */
renderMPS();
renderBatches();

})();

// ============================================================================
// Patch Block #9 [id="v47-patch"]
// ============================================================================
(function(){
'use strict';

/*
V47
- Produtos terceirizados aparecem na criação de batelada somente quando existe pedido ativo.
- Quando o pedido deixa de existir no relatório CIGAM, deixam de aparecer para novas bateladas.
- Bateladas terceirizadas já criadas continuam editáveis e podem entrar na Programação Semanal.
- Terceirizados continuam fora do MRP de matérias-primas.
*/

function v47ProductRows(product){
  return D.filter(x=>norm(x.produto)===norm(product)&&!isSampleSku(x))
}
function v47IsThirdProduct(product){
  let rows=v47ProductRows(product);
  return rows.length>0 && rows.some(x=>isThird(x))
}
function v47HasActiveThirdOrder(product){
  let rows=v47ProductRows(product).filter(x=>isThird(x));
  return rows.some(x=>x.pedidoAtivo===true && x.semPedido!==true)
}
function v47CreationProductOptions(){
  let names=[...new Set(D.filter(x=>!isSampleSku(x)).map(x=>x.produto).filter(Boolean))];
  return names.filter(product=>{
    if(!v47IsThirdProduct(product))return true;
    return v47HasActiveThirdOrder(product)
  }).sort((a,b)=>a.localeCompare(b,'pt-BR'))
}
function v47OptionLabel(product){
  if(v47IsThirdProduct(product) && v47HasActiveThirdOrder(product))return `${product} — TERCEIRIZADO / PEDIDO`;
  let demand=D.some(x=>norm(x.produto)===norm(product)&&x.sobDemanda);
  return demand?`${product} — SOB DEMANDA`:product
}
window.v47CreationProductOptions=v47CreationProductOptions;
window.v47OptionLabel=v47OptionLabel;
window.v47IsThirdProduct=v47IsThirdProduct;
window.v47HasActiveThirdOrder=v47HasActiveThirdOrder;

/* A lista do PMP permanece focada em fabricação própria.
   A lista de criação de batelada é mais ampla e inclui terceirizados com pedido ativo. */
batchProductOptions=function(){
  return [...new Set(
    D.filter(x=>!isSampleSku(x) && !isThird(x))
     .map(x=>x.produto)
     .filter(Boolean)
  )].sort((a,b)=>a.localeCompare(b,'pt-BR'))
};

openBatch=function(id=null){
  editingBatchId=id;
  let b=id?MPS.batches.find(z=>z.id===id):null,
      prods=v47CreationProductOptions();

  if(b && b.produto && !prods.some(p=>norm(p)===norm(b.produto)))prods.unshift(b.produto);

  $('batchProduct').innerHTML=prods.map(p=>
    `<option value="${escHtml(p)}">${escHtml(v47OptionLabel(p))}</option>`
  ).join('');

  $('batchTitle').textContent=b?'Editar batelada':'Nova batelada a fazer';
  $('batchProduct').disabled=!!b;
  $('batchProduct').value=b?.produto||prods[0]||'';
  $('batchDate').value=b?.date||'';
  $('batchStatus').value=b?.status||'A fazer';
  $('batchStage').value=b?.stage||'A fazer';
  $('batchSop').value=b?.sop||'AUTO';
  $('batchLot').value=b?.lot||'';
  $('batchPriority').value=b?.priority||'Normal';
  $('batchObs').value=b?.obs||'';

  let dens=productDensity($('batchProduct').value,b);
  $('batchDensity').value=dens??'';

  updateBatchTankOptions(b?.tank||'');
  renderBatchDist(b);

  let saved=N(b?.productionKg),legacy=N(b?.kg);
  if(b)$('batchKg').value=saved!==null&&saved>0?saved:(legacy!==null&&legacy>0?legacy:'');
  else $('batchKg').value='';

  $('batchKg').readOnly=false;

  let meta=document.getElementById('batchCreatedMeta');
  if(meta){
    let third=v47IsThirdProduct($('batchProduct').value);
    meta.innerHTML=b?.created
      ?`Criada em ${escHtml(b.created)}${b.updatedAt&&b.createdAt&&b.updatedAt!==b.createdAt?` • última alteração ${new Date(b.updatedAt).toLocaleString('pt-BR')}`:''}${third?' • <b>TERCEIRIZADO</b>':''}`
      :third
        ?'<b>Terceirizado com pedido ativo.</b> A batelada servirá para controle/programação e não alimentará o MRP de matérias-primas.'
        :'A data de criação será registrada automaticamente.'
  }

  refreshBatchCalc();
  $('batchDlg').showModal()
};

/* Ao trocar produto, mantém a regra de peso manual da V45/V46. */
if($('batchProduct'))$('batchProduct').onchange=()=>{
  let prod=$('batchProduct').value,d=productDensity(prod);
  $('batchDensity').value=d??'';
  updateBatchTankOptions();
  renderBatchDist();
  $('batchKg').value='';
  $('batchKg').readOnly=false;

  let meta=document.getElementById('batchCreatedMeta');
  if(meta){
    meta.innerHTML=v47IsThirdProduct(prod)
      ?'<b>Terceirizado com pedido ativo.</b> Não entra no MRP de matérias-primas.'
      :'A data de criação será registrada automaticamente.'
  }
  refreshBatchCalc()
};

/* Terceirizados podem aparecer na Programação Semanal quando a batelada tiver data. */
weeklyBatches=function(week){
  let set=new Set(isoWeekDates(week));
  return (MPS.batches||[]).filter(b=>b.date&&set.has(b.date)&&b.status!=='A fazer')
};

/* Mas nunca entram no MRP de matérias-primas. */
mrpBatchSelection=function(){
  let mode=$('mrpBatchFilter')?.value||'OPEN';
  return (MPS.batches||[]).filter(b=>{
    let kg=effectiveBatchKg(b);
    if(kg===null||kg<=0||b.status==='Finalizada')return false;
    if(v47IsThirdProduct(b.produto))return false;
    if(mode==='CONFIRM')return b.status==='Programada'||b.status==='Em produção';
    if(mode==='PROGRAMADA')return b.status==='Programada';
    if(mode==='PRODUCAO')return b.status==='Em produção';
    return true
  })
};

renderBatches=function(){
  if(!$('batchList'))return;
  populateBatchSectorFilter();

  let f=$('batchStatusFilter')?.value||'',
      sector=$('batchSectorFilter')?.value||'',
      q=($('batchNameFilter')?.value||'').trim().toUpperCase();

  let arr=(MPS.batches||[])
    .map((b,idx)=>({...b,_sector:batchSectorName(b.produto),_order:Number(b.createdAt||0)||idx}))
    .filter(b=>
      (!f||b.status===f) &&
      (!sector||b._sector===sector) &&
      (!q||`${b.produto||''} ${b.obs||''}`.toUpperCase().includes(q))
    )
    .sort((a,b)=>b._order-a._order);

  if(!arr.length){
    $('batchList').innerHTML='<div class=mps-empty>Nenhuma batelada cadastrada.</div>';
    return
  }

  let groups={};
  arr.forEach(b=>(groups[b._sector]||(groups[b._sector]=[])).push(b));

  $('batchList').innerHTML=Object.keys(groups).sort((a,b)=>a.localeCompare(b,'pt-BR')).map(sec=>
    `<div class=v41-sector>
      <div class=v41-sector-head>
        <b>${escHtml(sec)}</b>
        <span>${groups[sec].length} batelada(s)</span>
      </div>
      ${groups[sec].map(b=>{
        let c=batchCounts(b),
            qtxt=['1','5','20','50','200','150']
              .filter(k=>Number(c[k]||0)>0)
              .map(k=>`${k==='150'?'Amostra':k+'L'} ${c[k]}`)
              .join(' • '),
            demandProduct=D.some(x=>norm(x.produto)===norm(b.produto)&&x.sobDemanda),
            third=v47IsThirdProduct(b.produto);

        return `<div class=v41-batch-row>
          <div class=namecell>
            <div class=product>
              ${escHtml(b.produto)}
              ${b.pmpSource?`<span class=v41-batch-origin>PMP ${escHtml(b.planMonth||'')}</span>`:''}
              ${demandProduct&&!third?'<span class=v46-demand-tag>SOB DEMANDA</span>':''}
              ${third?'<span class=v47-third-tag>TERCEIRIZADO</span>':''}
            </div>
            <div class=v41-queue-note>${qtxt||'Quantidades ainda não definidas'}${b.lot?` • Lote ${escHtml(b.lot)}`:''}</div>
            <div class=v41-queue-note>criada em <b>${escHtml(b.created||'registro antigo')}</b></div>
          </div>
          <div><small>Data produção</small><b>${b.date?b.date.split('-').reverse().join('/'):'A definir'}</b></div>
          <div><small>Peso</small><b>${fmtKg(effectiveBatchKg(b))}</b></div>
          <div class=hide-md><small>S&amp;OP</small><b>${escHtml(sopOfBatch(b))}</b></div>
          <div class=hide-md><small>Situação</small><b>${escHtml(b.status||'A fazer')}</b><div class=v41-queue-note>${escHtml(stageOfBatch(b))}</div></div>
          <div class=actions>
            <button class="smallbtn primary" onclick="openBatch('${b.id}')">${b.status==='A fazer'?'Programar':'Editar'}</button>
            <button class="smallbtn secondary" onclick="deleteBatch('${b.id}')">Excluir</button>
          </div>
          ${b.obs?`<div class=v46-batch-obs title="${escHtml(b.obs)}"><b>Obs.</b>${escHtml(b.obs)}</div>`:''}
        </div>`
      }).join('')}
    </div>`
  ).join('')
};

renderBatches();
renderWeekly();
renderMRP();

})();

// ============================================================================
// Patch Block #10 [id="v48-patch"]
// ============================================================================
(function(){
'use strict';

/*
V48 — REGRA CORRIGIDA
"Terceirizado" no cadastro significa MARCA TERCEIRIZADA / PRODUÇÃO PARA TERCEIRO.
A fabricação é INTERNA na C-TEC.
Portanto:
- entra no PMP quando houver pedido ativo;
- pode gerar batelada;
- entra na Programação Semanal;
- entra no MRP e consome matérias-primas pela fórmula vinculada;
- usa tanque, embalagem e indicadores normalmente;
- a identificação "terceirizado" serve apenas para distinguir a marca/cliente.
*/

// Captura a classificação antiga antes de corrigi-la.
const V48_CONTRACT_PRODUCTS = new Set(
  (TANK_MASTER||[])
    .filter(t=>norm(t.manufacturing||'')==='TERCEIRIZADO')
    .map(t=>norm(t.product))
);

window.v48IsContractProduct = v48IsContractProduct;
function v48IsContractProduct(product){
  let n=norm(product);
  if(V48_CONTRACT_PRODUCTS.has(n))return true;
  return D.some(x=>norm(x.produto)===n && isThird(x))
}

window.v48HasActiveOrder = v48HasActiveOrder;
function v48HasActiveOrder(product){
  let rows=D.filter(x=>norm(x.produto)===norm(product)&&!isSampleSku(x));
  if(!v48IsContractProduct(product))return true;
  return rows.some(x=>x.pedidoAtivo===true && x.semPedido!==true)
}

// Separa definitivamente "marca" de "fabricação".
(TANK_MASTER||[]).forEach(t=>{
  if(V48_CONTRACT_PRODUCTS.has(norm(t.product))){
    t.brandType='Terceirizada';
    t.manufacturing='Interna';
  }else if(!t.brandType){
    t.brandType='Própria';
  }
});

D.forEach(x=>{
  if(V48_CONTRACT_PRODUCTS.has(norm(x.produto)) || isThird(x)){
    x.tipo='Terceirizado';          // tipo da MARCA
    x.marca='Terceirizada';
    x.fabricacao='Interna';
  }else{
    x.marca=x.marca||'Própria';
    x.fabricacao=x.fabricacao||'Interna';
  }
});

// Os itens DORUM reconhecidos por código também são fabricação interna.
if(typeof V42_THIRD_ORDERS!=='undefined'){
  V42_THIRD_ORDERS.forEach(r=>{
    D.filter(x=>norm(x.produto)===norm(r.product)).forEach(x=>{
      x.tipo='Terceirizado';
      x.marca='Terceirizada';
      x.fabricacao='Interna';
      x.terceiroPedido=true;
    })
  })
}

// Reativa fórmulas que a V42 havia desativado por uma interpretação anterior incorreta.
(PROD_FORMULA||[]).forEach(p=>{
  if(v48IsContractProduct(p.product) || (typeof v42IsThirdOrderProduct==='function' && v42IsThirdOrderProduct(p.product))){
    p.active=true;
    p.note=String(p.note||'')
      .replace(/\s*•?\s*Terceirizado — não fabricar internamente\.?/gi,'')
      .trim();
  }
});

// "isThird" continua significando MARCA terceirizada; não fabricação externa.
productIsThird=function(product){
  return v48IsContractProduct(product)
};

// Necessidade de estoque também vale para marcas terceirizadas produzidas internamente.
mpsCalc=function(x){
  let e=N(x.est),r=N(x.ref);
  if(e===null)e=0;
  if(r===null)r=0;
  let mto=Math.max(0,-e),
      after=e+mto,
      mts=Math.max(0,r-after);
  return{mto,mts,total:mto+mts}
};

// PMP: próprios sempre disponíveis; marca terceirizada quando houver pedido ativo.
batchProductOptions=function(){
  let names=[...new Set(D.filter(x=>!isSampleSku(x)).map(x=>x.produto).filter(Boolean))];
  return names.filter(product=>{
    if(!v48IsContractProduct(product))return true;
    return v48HasActiveOrder(product)
  }).sort((a,b)=>a.localeCompare(b,'pt-BR'))
};

// A tela de criação segue a mesma regra do PMP.
v47CreationProductOptions=function(){
  return batchProductOptions()
};

v47IsThirdProduct=function(product){
  return v48IsContractProduct(product)
};

v47HasActiveThirdOrder=function(product){
  return v48HasActiveOrder(product)
};

v47OptionLabel=function(product){
  if(v48IsContractProduct(product) && v48HasActiveOrder(product))
    return `${product} — MARCA TERCEIRIZADA / PEDIDO`;
  let demand=D.some(x=>norm(x.produto)===norm(product)&&x.sobDemanda);
  return demand?`${product} — SOB DEMANDA`:product
};

// MRP: inclui todas as bateladas fabricadas internamente, inclusive marcas terceirizadas.
mrpBatchSelection=function(){
  let mode=$('mrpBatchFilter')?.value||'OPEN';
  return (MPS.batches||[]).filter(b=>{
    let kg=effectiveBatchKg(b);
    if(kg===null||kg<=0||b.status==='Finalizada')return false;
    if(mode==='CONFIRM')return b.status==='Programada'||b.status==='Em produção';
    if(mode==='PROGRAMADA')return b.status==='Programada';
    if(mode==='PRODUCAO')return b.status==='Em produção';
    return true
  })
};

// Programação semanal: todos os produtos fabricados/programados, independente da marca.
weeklyBatches=function(week){
  let set=new Set(isoWeekDates(week));
  return (MPS.batches||[]).filter(b=>b.date&&set.has(b.date)&&b.status!=='A fazer')
};

// Corrige o texto/status visual sem alterar a lógica de pedido ativo.
const v48BadgePrev=badge;
badge=function(s){
  if(s==='PEDIDO TERCEIRIZADO')
    return '<span class="badge terceiro">MARCA TERCEIRIZADA — PEDIDO</span>';
  return v48BadgePrev(s)
};

// Corrige o quadro da aba Estoque criado nas versões anteriores.
function v48RenderContractOrders(){
  let host=$('v42ThirdOrders');
  if(!host || typeof V42_THIRD_ORDERS==='undefined')return;

  let rows=V42_THIRD_ORDERS.map(r=>{
    let x=D.find(z=>String(z.cod||'').replace(/^0+/,'')===String(r.code||'').replace(/^0+/,''));
    let e=x?N(x.est):null;
    return{...r,x,e,status:x?stat(x):'PEDIDO TERCEIRIZADO'}
  });

  host.innerHTML=`<div class=v42-third-panel>
    <div class=head>
      <div>
        <h3>Marcas terceirizadas — pedidos para produção interna</h3>
        <div class=v42-note>
          A marca é do cliente/terceiro, mas a fabricação é realizada internamente.
          Quando houver pedido, estes itens entram no PMP, nas bateladas, na Programação Semanal e no MRP.
        </div>
      </div>
      <span>${rows.length} itens cadastrados</span>
    </div>
    <div class=tablewrap>
      <table class=v42-third-table>
        <thead><tr><th>Código CIGAM</th><th>Produto / marca</th><th>Apresentação</th><th>Pedido / estoque</th><th>Fabricação</th><th>Situação</th></tr></thead>
        <tbody>${rows.map(r=>`<tr>
          <td><b>${r.code}</b></td>
          <td>${escHtml(r.report)}</td>
          <td>${r.ap}L</td>
          <td class="${r.e!==null&&r.e<0?'neg':r.e===null?'blank':''}">${r.e===null?'Aguardando valor':r.e.toLocaleString('pt-BR')}</td>
          <td><b>INTERNA</b></td>
          <td>${badge(r.status)}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>
  </div>`
}

// Lista de bateladas: identifica como MARCA TERCEIRIZADA, sem sugerir fabricação externa.
renderBatches=function(){
  if(!$('batchList'))return;
  populateBatchSectorFilter();

  let f=$('batchStatusFilter')?.value||'',
      sector=$('batchSectorFilter')?.value||'',
      q=($('batchNameFilter')?.value||'').trim().toUpperCase();

  let arr=(MPS.batches||[])
    .map((b,idx)=>({...b,_sector:batchSectorName(b.produto),_order:Number(b.createdAt||0)||idx}))
    .filter(b=>
      (!f||b.status===f) &&
      (!sector||b._sector===sector) &&
      (!q||`${b.produto||''} ${b.obs||''}`.toUpperCase().includes(q))
    )
    .sort((a,b)=>b._order-a._order);

  if(!arr.length){
    $('batchList').innerHTML='<div class=mps-empty>Nenhuma batelada cadastrada.</div>';
    return
  }

  let groups={};
  arr.forEach(b=>(groups[b._sector]||(groups[b._sector]=[])).push(b));

  $('batchList').innerHTML=Object.keys(groups).sort((a,b)=>a.localeCompare(b,'pt-BR')).map(sec=>
    `<div class=v41-sector>
      <div class=v41-sector-head>
        <b>${escHtml(sec)}</b>
        <span>${groups[sec].length} batelada(s)</span>
      </div>
      ${groups[sec].map(b=>{
        let c=batchCounts(b),
            qtxt=['1','5','20','50','200','150']
              .filter(k=>Number(c[k]||0)>0)
              .map(k=>`${k==='150'?'Amostra':k+'L'} ${c[k]}`)
              .join(' • '),
            demandProduct=D.some(x=>norm(x.produto)===norm(b.produto)&&x.sobDemanda),
            contract=v48IsContractProduct(b.produto);

        return `<div class=v41-batch-row>
          <div class=namecell>
            <div class=product>
              ${escHtml(b.produto)}
              ${b.pmpSource?`<span class=v41-batch-origin>PMP ${escHtml(b.planMonth||'')}</span>`:''}
              ${demandProduct&&!contract?'<span class=v46-demand-tag>SOB DEMANDA</span>':''}
              ${contract?'<span class=v48-contract-tag>MARCA TERCEIRIZADA</span>':''}
            </div>
            <div class=v41-queue-note>${qtxt||'Quantidades ainda não definidas'}${b.lot?` • Lote ${escHtml(b.lot)}`:''}</div>
            <div class=v41-queue-note>criada em <b>${escHtml(b.created||'registro antigo')}</b></div>
          </div>
          <div><small>Data produção</small><b>${b.date?b.date.split('-').reverse().join('/'):'A definir'}</b></div>
          <div><small>Peso</small><b>${fmtKg(effectiveBatchKg(b))}</b></div>
          <div class=hide-md><small>S&amp;OP</small><b>${escHtml(sopOfBatch(b))}</b></div>
          <div class=hide-md><small>Situação</small><b>${escHtml(b.status||'A fazer')}</b><div class=v41-queue-note>${escHtml(stageOfBatch(b))}</div></div>
          <div class=actions>
            <button class="smallbtn primary" onclick="openBatch('${b.id}')">${b.status==='A fazer'?'Programar':'Editar'}</button>
            <button class="smallbtn secondary" onclick="deleteBatch('${b.id}')">Excluir</button>
          </div>
          ${b.obs?`<div class=v46-batch-obs title="${escHtml(b.obs)}"><b>Obs.</b>${escHtml(b.obs)}</div>`:''}
        </div>`
      }).join('')}
    </div>`
  ).join('')
};

// Ajusta a mensagem no diálogo quando a marca for terceirizada.
const v48OpenPrev=openBatch;
openBatch=function(id=null){
  v48OpenPrev(id);
  let prod=$('batchProduct').value,
      contract=v48IsContractProduct(prod),
      meta=$('batchCreatedMeta');

  if(meta && contract){
    let current=meta.innerHTML||'';
    meta.innerHTML=current + `<div class=v48-contract-note><b>Marca terceirizada • fabricação interna.</b> Esta batelada entra normalmente no PMP/MRP e consome matérias-primas pela fórmula vinculada.</div>`
  }
};

// Mantém o aviso correto também ao trocar o produto.
if($('batchProduct'))$('batchProduct').addEventListener('change',()=>{
  let prod=$('batchProduct').value,meta=$('batchCreatedMeta');
  if(meta && v48IsContractProduct(prod)){
    meta.insertAdjacentHTML('beforeend','<div class=v48-contract-note><b>Marca terceirizada • fabricação interna.</b> Entra normalmente no PMP/MRP.</div>')
  }
});

save();
v48RenderContractOrders();
renderMPS();
renderBatches();
renderWeekly();
renderMRP();
renderEngineering();

})();

// ============================================================================
// Patch Block #11 [id="v49-patch"]
// ============================================================================
(function(){
'use strict';

/*
V49
- Amostras reais importadas do CIGAM passam a obedecer ao mesmo princípio de pedido ativo:
  se estavam no relatório anterior e não aparecem no relatório mais recente, são encerradas,
  ocultadas das visões operacionais e preservadas apenas no histórico.
- Isso atende casos como amostras de exportação/Bolívia que foram canceladas.
- Adicionada legenda explícita no gráfico "Risco por linha de produto":
  C = Crítico, A = Atenção, R = Abaixo da referência.
*/

function v49IsRealSample(x){
  return isSampleSku(x) && x.virtualSample!==true && !!String(x.cod||'').trim()
}
function v49SampleInactive(x){
  return v49IsRealSample(x) && (x.semPedido===true || x.pedidoAtivo===false || x.sampleCancelled===true)
}

/* Amostra encerrada não aparece mais no estoque/dashboard operacional.
   Histórico permanece dentro do cadastro. */
vis=function(){
  return D.filter(x=>{
    if(v49SampleInactive(x))return false;
    if(isThird(x)&&x.semPedido&&!showThirdClosed)return false;

    let e=N(x.est);
    if(e!==null&&e<0)return true;
    if(!demand(x))return true;
    return !!x.pedidoAtivo||showDemand
  })
};

const v49PendingPrev=pendingReasons;
pendingReasons=function(x){
  if(v49SampleInactive(x))return [];
  return v49PendingPrev(x)
};

/* Importação revisada: amostras reais são zeradas como "não vistas" antes da leitura.
   Se reaparecerem no arquivo, voltam a ficar ativas automaticamente. */
importPDF=async function(file){
  $('msg').textContent=' Lendo relatório...';
  R=[];I=[];

  D.forEach(x=>{
    if(demand(x)||isThird(x)||v49IsRealSample(x))x.pedidoAtivo=false
  });

  let rec=parse(await linesPDF(file)),
      upd=0,rev=0,ign=0,marcaEnc=0,amostraEnc=0,
      dt=new Date().toLocaleString('pt-BR');

  for(let r of rec){
    if(ignore(r.nome,r.cod)){
      I.push({cod:r.cod,nome:r.nome,est:r.est});
      ign++;
      continue
    }

    let x=find(r.cod,r.nome)||sample(r.nome,r.cod,r.est);

    if(!x){
      R.push({cod:r.cod,nome:r.nome,est:r.est});
      rev++;
      continue
    }

    x.cod=r.cod;
    x.est=r.est;
    x.atual=dt;
    x.semPedido=false;
    x.sampleCancelled=false;

    if(demand(x)||isThird(x)||v49IsRealSample(x))x.pedidoAtivo=true;

    x.hist=x.hist||[];
    x.hist.push({data:dt,estoque:r.est,rel:file.name});
    upd++
  }

  D.forEach(x=>{
    /* Marcas terceirizadas sem pedido no relatório atual. */
    if(isThird(x) && !x.pedidoAtivo){
      let old=N(x.est);
      if(!x.semPedido){
        if(old!==null)x.ultimoSaldoEncerrado=old;
        x.hist=x.hist||[];
        x.hist.push({
          data:dt,
          estoque:old!==null?old:'',
          rel:file.name,
          evento:'PEDIDO ENCERRADO — marca terceirizada não consta no relatório atual'
        });
        marcaEnc++
      }
      x.est='';
      x.semPedido=true;
      x.atual=dt
    }

    /* Amostras reais que sumiram do relatório = pedido cancelado/encerrado. */
    if(v49IsRealSample(x) && !x.pedidoAtivo){
      let old=N(x.est);
      if(!x.sampleCancelled){
        x.hist=x.hist||[];
        x.hist.push({
          data:dt,
          estoque:old!==null?old:'',
          rel:file.name,
          evento:'AMOSTRA ENCERRADA/CANCELADA — não consta no relatório atual'
        });
        amostraEnc++
      }
      x.est='';
      x.semPedido=true;
      x.sampleCancelled=true;
      x.atual=dt
    }
  });

  H.push({
    file:file.name,
    data:dt,
    items:rec.length,
    upd,
    rev,
    ign,
    marcaEnc,
    amostraEnc,
    ignorados:I.slice()
  });

  save();
  render();
  renderMPS();
  renderBatches();

  $('msg').textContent=
    ` Importado: ${rec.length} itens, ${upd} atualizados, ${rev} revisar, ${ign} ignorados, `+
    `${marcaEnc} pedidos de marca terceirizada encerrados, ${amostraEnc} amostras encerradas/canceladas.`
};

/* Gráfico de risco com legenda clara. */
renderDashboardCharts=function(rows){
  rows=Array.isArray(rows)?rows.filter(x=>!v49SampleInactive(x)):[];

  let statusBox=$('statusOverviewChart'),
      riskBox=$('lineRiskOverviewChart');

  if(!statusBox||!riskBox)return;

  const total=Math.max(rows.length,1),
        groups=[
          ['NORMAL','Normal','fill-normal'],
          ['ABAIXO DA REFERÊNCIA','Abaixo da referência','fill-abaixo'],
          ['ATENÇÃO','Atenção','fill-atencao'],
          ['CRÍTICO','Crítico','fill-critico'],
          ['PEDIDO TERCEIRIZADO','Marca terceirizada / pedido','fill-outros'],
          ['AGUARDANDO ESTOQUE','Aguardando','fill-outros'],
          ['SOB DEMANDA','Sob demanda','fill-outros']
        ];

  statusBox.innerHTML=
    `<div class=hbar-list>${
      groups.map(([key,label,cls])=>{
        let n=rows.filter(x=>stat(x)===key).length,
            p=n*100/total;
        return `<div class=hbar-row>
          <div class=hbar-label>${label}</div>
          <div class=hbar-track><div class="hbar-fill ${cls}" style="width:${p}%"></div></div>
          <div class=hbar-value>${n}</div>
        </div>`
      }).join('')
    }</div>`;

  let map=new Map();

  rows.forEach(x=>{
    let k=x.linha||'Sem linha',
        s=stat(x),
        r=map.get(k)||{name:k,crit:0,att:0,below:0};

    if(s==='CRÍTICO')r.crit++;
    if(s==='ATENÇÃO')r.att++;
    if(s==='ABAIXO DA REFERÊNCIA')r.below++;

    map.set(k,r)
  });

  let arr=[...map.values()]
    .filter(r=>r.crit+r.att+r.below>0)
    .sort((a,b)=>(b.crit*4+b.att*2+b.below)-(a.crit*4+a.att*2+a.below));

  const legend=`<div class=v49-risk-legend>
    <span><i class="v49-risk-dot c"></i><b>C</b> = Crítico</span>
    <span><i class="v49-risk-dot a"></i><b>A</b> = Atenção</span>
    <span><i class="v49-risk-dot r"></i><b>R</b> = Abaixo da referência</span>
  </div>`;

  if(!arr.length){
    riskBox.innerHTML=legend+'<div class=chartempty>Nenhum item em risco nos filtros atuais.</div>';
    return
  }

  let max=Math.max(...arr.map(r=>r.crit+r.att+r.below),1);

  riskBox.innerHTML=legend+
    `<div class=risk-line-list>${
      arr.map(r=>`<div class=risk-line-row>
        <div class=risk-line-name title="${escHtml(r.name)}">${escHtml(r.name)}</div>
        <div class=risk-line-track>
          <span class=crit style="width:${r.crit/max*100}%"></span>
          <span class=att style="width:${r.att/max*100}%"></span>
          <span class=below style="width:${r.below/max*100}%"></span>
        </div>
        <div class=risk-line-val>${r.crit} C • ${r.att} A • ${r.below} R</div>
      </div>`).join('')
    }</div>`
};

/* Limpa imediatamente da visão operacional amostras que já estavam
   marcadas como encerradas em alguma importação anterior. */
D.forEach(x=>{
  if(v49IsRealSample(x) && x.semPedido===true){
    x.sampleCancelled=true;
    x.pedidoAtivo=false
  }
});

save();
render();

})();

// ============================================================================
// Patch Block #12 [id="v50-patch"]
// ============================================================================
(function(){
'use strict';

/*
V50 — vínculo correto dos nomes do relatório com o cadastro mestre.

No CIGAM:
DORUM CLOR PREMIUM  -> Clor Premium Dorum
DORUM ACID          -> Acid Dorum
DORUM POS GREEN     -> Dorum Pos Green

Os códigos abaixo passam a apontar sempre para o produto mestre correto,
sem criar um segundo produto com o nome invertido do relatório.
*/

const V50_DORUM_LINKS=[
  {code:'001086',report:'DORUM CLOR PREMIUM',product:'Clor Premium Dorum',ap:'5'},
  {code:'001087',report:'DORUM CLOR PREMIUM',product:'Clor Premium Dorum',ap:'20'},
  {code:'001088',report:'DORUM CLOR PREMIUM',product:'Clor Premium Dorum',ap:'50'},
  {code:'001090',report:'DORUM ACID',product:'Acid Dorum',ap:'5'},
  {code:'001091',report:'DORUM ACID',product:'Acid Dorum',ap:'20'},
  {code:'001092',report:'DORUM ACID',product:'Acid Dorum',ap:'50'},
  {code:'001110',report:'DORUM POS GREEN',product:'Dorum Pos Green',ap:'5'},
  {code:'001111',report:'DORUM POS GREEN',product:'Dorum Pos Green',ap:'20'},
  {code:'001112',report:'DORUM POS GREEN',product:'Dorum Pos Green',ap:'50'}
];

function v50Code(v){return String(v||'').replace(/\D/g,'').replace(/^0+/,'')}
function v50Ap(x){
  let a=apInfo(x?.ap||x?.item||'');
  return a.kind==='L'?String(a.liters):a.kind==='KG'?String(a.kg):String(x?.ap||'').trim()
}
function v50RuleByCode(c){
  let k=v50Code(c);
  return V50_DORUM_LINKS.find(r=>v50Code(r.code)===k)||null
}
function v50RuleByName(n){
  let s=norm(n),
      size=(s.match(/\b(5|20|50)\s*L\b/)||[])[1];

  if(!size)return null;

  return V50_DORUM_LINKS.find(r=>
    r.ap===size &&
    (s.includes(norm(r.report)) || s.includes(norm(r.product)))
  )||null
}
function v50Rule(c,n){
  return v50RuleByCode(c)||v50RuleByName(n)
}

/* Migração dos dados já existentes no navegador:
   une eventuais registros duplicados ao cadastro mestre correto. */
function v50MigrateLinks(){
  V50_DORUM_LINKS.forEach(r=>{
    let candidates=D.filter(x=>{
      let codeMatch=v50Code(x.cod)===v50Code(r.code),
          sameAp=v50Ap(x)===String(r.ap),
          nameMatch=norm(x.produto)===norm(r.product) ||
                    norm(x.produto)===norm(r.report) ||
                    norm(x.item||'').startsWith(norm(r.product)+' ') ||
                    norm(x.item||'').startsWith(norm(r.report)+' ');
      return codeMatch || (sameAp && nameMatch)
    });

    let target=candidates.find(x=>norm(x.produto)===norm(r.product) && v50Ap(x)===String(r.ap));

    if(!target){
      target={
        linha:'ANVISA',
        produto:r.product,
        ap:r.ap,
        item:`${r.product} ${r.ap}L`,
        cod:r.code,
        ref:0,
        att:0,
        est:'',
        atual:'',
        pedidoAtivo:false,
        semPedido:false,
        hist:[],
        tipo:'Terceirizado',
        marca:'Terceirizada',
        fabricacao:'Interna',
        terceiroPedido:true
      };
      D.push(target)
    }

    candidates.forEach(src=>{
      if(src===target)return;

      // Mantém o dado operacional mais atual/útil.
      if(v50Code(src.cod)===v50Code(r.code))target.cod=r.code;
      if(src.est!==undefined && src.est!==null && String(src.est)!=='')target.est=src.est;
      if(src.atual)target.atual=src.atual;
      if(src.pedidoAtivo===true)target.pedidoAtivo=true;
      if(src.semPedido===true && target.pedidoAtivo!==true)target.semPedido=true;
      if(src.ultimoSaldoEncerrado!==undefined)target.ultimoSaldoEncerrado=src.ultimoSaldoEncerrado;

      target.hist=[...(target.hist||[]),...(src.hist||[])];
      src.__v50Remove=true
    });

    target.produto=r.product;
    target.ap=r.ap;
    target.item=`${r.product} ${r.ap}L`;
    target.cod=r.code;
    target.tipo='Terceirizado';
    target.marca='Terceirizada';
    target.fabricacao='Interna';
    target.terceiroPedido=true;
    target.nomeRelatorio=r.report;
    target.ref=0;
    target.att=0;

    // Remove históricos idênticos repetidos.
    let seen=new Set();
    target.hist=(target.hist||[]).filter(h=>{
      let k=JSON.stringify([h.data,h.estoque,h.rel,h.evento]);
      if(seen.has(k))return false;
      seen.add(k);
      return true
    })
  });

  D=D.filter(x=>!x.__v50Remove);

  // Mantém o vínculo de fórmula existente para os dois produtos já cadastrados.
  (PROD_FORMULA||[]).forEach(p=>{
    if(norm(p.product)===norm('Clor Premium Dorum') || norm(p.product)===norm('Acid Dorum')){
      p.active=true
    }
  });

  save()
}

v50MigrateLinks();

/* O importador sempre procura primeiro o vínculo canônico. */
const v50FindPrev=find;
find=function(c,n){
  let r=v50Rule(c,n);
  if(r){
    let x=D.find(z=>
      norm(z.produto)===norm(r.product) &&
      v50Ap(z)===String(r.ap)
    );

    if(x){
      x.cod=r.code;
      x.nomeRelatorio=r.report;
      x.tipo='Terceirizado';
      x.marca='Terceirizada';
      x.fabricacao='Interna';
      x.terceiroPedido=true;
      return x
    }
  }

  return v50FindPrev(c,n)
};

/* Corrige também a tabela especial de pedidos para mostrar
   o produto mestre vinculado, não apenas o nome bruto do relatório. */
function v50RenderDorumOrders(){
  let host=$('v42ThirdOrders');
  if(!host)return;

  let rows=V50_DORUM_LINKS.map(r=>{
    let x=D.find(z=>
      norm(z.produto)===norm(r.product) &&
      v50Ap(z)===String(r.ap)
    );
    let e=x?N(x.est):null;

    return{...r,x,e,status:x?stat(x):'PEDIDO TERCEIRIZADO'}
  });

  host.innerHTML=`<div class=v42-third-panel>
    <div class=head>
      <div>
        <h3>Marcas terceirizadas — pedidos para produção interna</h3>
        <div class=v42-note>
          O nome do relatório é vinculado ao cadastro mestre do produto.
          Estes itens são fabricados internamente e entram normalmente no PMP, bateladas e MRP quando houver pedido.
        </div>
      </div>
      <span>${rows.length} itens vinculados</span>
    </div>

    <div class=tablewrap>
      <table class=v42-third-table>
        <thead>
          <tr>
            <th>Código CIGAM</th>
            <th>Produto vinculado</th>
            <th>Nome no relatório</th>
            <th>Apresentação</th>
            <th>Estoque / pedido</th>
            <th>Fabricação</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r=>`<tr>
            <td><b>${r.code}</b></td>
            <td><span class=v50-link-name>${escHtml(r.product)}</span></td>
            <td><span class=v50-report-name>${escHtml(r.report)}</span></td>
            <td>${r.ap}L</td>
            <td class="${r.e!==null&&r.e<0?'neg':r.e===null?'blank':''}">
              ${r.e===null?'Aguardando valor':r.e.toLocaleString('pt-BR')}
            </td>
            <td><b>INTERNA</b></td>
            <td>${badge(r.status)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`
}

/* Garante que o nome correto seja usado nas opções de batelada/PMP. */
window.v50CanonicalProductName = v50CanonicalProductName;
function v50CanonicalProductName(product){
  let n=norm(product);

  if(n===norm('DORUM CLOR PREMIUM'))return 'Clor Premium Dorum';
  if(n===norm('DORUM ACID'))return 'Acid Dorum';
  if(n===norm('DORUM POS GREEN'))return 'Dorum Pos Green';

  return product
}

const v50BatchOptionsPrev=batchProductOptions;
batchProductOptions=function(){
  return [...new Set(
    v50BatchOptionsPrev()
      .map(v50CanonicalProductName)
      .filter(Boolean)
  )].sort((a,b)=>a.localeCompare(b,'pt-BR'))
};

save();
v50RenderDorumOrders();
render();
renderMPS();
renderBatches();
renderWeekly();
renderMRP();

})();

// ============================================================================
// Patch Block #13 [id="v51-patch"]
// ============================================================================
(function(){
'use strict';

/*
V51
A condição "Terceirizado" identifica apenas o tipo da marca.
Ela NÃO deve substituir o status operacional do estoque.

Exemplo:
Marca terceirizada + estoque -560 = CRÍTICO
e não "PEDIDO TERCEIRIZADO".

A indicação de marca terceirizada continua disponível no cadastro/tipo do produto.
*/

// Retorna ao fluxo normal de classificação do estoque.
stat=function(x){
  let e=N(x.est),
      r=N(x.ref),
      a=N(x.att);

  if(isThird(x) && x.semPedido)return 'SEM PEDIDO';
  if(e!==null && e<0)return 'CRÍTICO';
  if(demand(x))return 'SOB DEMANDA';
  if(e===null)return 'AGUARDANDO ESTOQUE';
  if(a!==null && e<=a)return 'ATENÇÃO';
  if(r!==null && e<r)return 'ABAIXO DA REFERÊNCIA';
  return 'NORMAL'
};

// Remove qualquer badge roxo especial de terceirizado.
badge=function(s){
  let c=
    s==='NORMAL'?'normal':
    s==='ABAIXO DA REFERÊNCIA'?'abaixo':
    s==='ATENÇÃO'?'atencao':
    s==='CRÍTICO'?'critico':
    s==='SOB DEMANDA'?'demanda':
    s==='SEM PEDIDO'?'sempedido':
    'aguardando';

  return `<span class="badge ${c}">${escHtml(s)}</span>`
};

// Remove o filtro antigo "Pedido terceirizado", pois não é mais um status de estoque.
['st','stockStatus'].forEach(id=>{
  let el=$(id);
  if(!el)return;

  [...el.options].forEach(o=>{
    if(o.value==='PEDIDO TERCEIRIZADO' || /pedido terceirizado/i.test(o.textContent||'')){
      o.remove()
    }
  });

  if(el.value==='PEDIDO TERCEIRIZADO')el.value=''
});

// Mantém a legenda do gráfico de risco e retira a categoria roxa.
renderDashboardCharts=function(rows){
  rows=Array.isArray(rows)
    ?rows.filter(x=>typeof v49SampleInactive!=='function' || !v49SampleInactive(x))
    :[];

  let statusBox=$('statusOverviewChart'),
      riskBox=$('lineRiskOverviewChart');

  if(!statusBox||!riskBox)return;

  let curSt=$('st')?.value||'',curLine=$('linha')?.value||'';
  const total=Math.max(rows.length,1),
        groups=[
          ['NORMAL','Normal','fill-normal','dot-normal'],
          ['ABAIXO DA REFERÊNCIA','Abaixo da referência','fill-abaixo','dot-abaixo'],
          ['ATENÇÃO','Atenção','fill-atencao','dot-atencao'],
          ['CRÍTICO','Crítico','fill-critico','dot-critico'],
          ['AGUARDANDO ESTOQUE','Aguardando','fill-outros','dot-outros'],
          ['SOB DEMANDA','Sob demanda','fill-outros','dot-outros']
        ];

  statusBox.innerHTML=
    `<div class="hbar-list interactive-chart-list">${
      groups.map(([key,label,cls,dotCls])=>{
        let n=rows.filter(x=>stat(x)===key).length,
            p=rows.length?(n*100/total):0,
            pctTxt=Math.round(p)+'%',
            isAct=curSt===key;
        return `<div class="hbar-row clickable-row ${isAct?'active-chart-row':''}" onclick="if(typeof filterDashByStatus==='function')filterDashByStatus('${escHtml(key)}')" title="Clique para filtrar por ${escHtml(label)}">
          <div class=hbar-label><span class="status-dot ${dotCls}"></span><span>${label}</span></div>
          <div class=hbar-track>
            <div class="hbar-fill ${cls}" style="width:${Math.max(n>0?3:0,p)}%"></div>
          </div>
          <div class=hbar-value><b class="hbar-num">${n}</b><span class="hbar-pct">${pctTxt}</span></div>
        </div>`
      }).join('')
    }</div>`;

  let map=new Map();

  rows.forEach(x=>{
    let k=x.linha||'Sem linha',
        s=stat(x),
        r=map.get(k)||{name:k,crit:0,att:0,below:0};

    if(s==='CRÍTICO')r.crit++;
    if(s==='ATENÇÃO')r.att++;
    if(s==='ABAIXO DA REFERÊNCIA')r.below++;

    map.set(k,r)
  });

  let arr=[...map.values()]
    .filter(r=>r.crit+r.att+r.below>0)
    .sort((a,b)=>(b.crit*4+b.att*2+b.below)-(a.crit*4+a.att*2+a.below));

  const legend=`<div class=v49-risk-legend>
    <span><i class="v49-risk-dot c"></i><b>C</b> = Crítico</span>
    <span><i class="v49-risk-dot a"></i><b>A</b> = Atenção</span>
    <span><i class="v49-risk-dot r"></i><b>R</b> = Abaixo da referência</span>
  </div>`;

  if(!arr.length){
    riskBox.innerHTML=legend+'<div class=chartempty>Nenhum item em risco nos filtros atuais.</div>';
    return
  }

  let max=Math.max(...arr.map(r=>r.crit+r.att+r.below),1);

  riskBox.innerHTML=legend+
    `<div class="risk-line-list interactive-chart-list">${
      arr.map(r=>{
        let isAct=curLine===r.name;
        return `<div class="risk-line-row clickable-row ${isAct?'active-chart-row':''}" onclick="if(typeof filterDashByLine==='function')filterDashByLine('${escHtml(r.name)}')" title="Clique para filtrar a linha ${escHtml(r.name)}">
        <div class=risk-line-name title="${escHtml(r.name)}">${typeof dashLineBadge==='function'?dashLineBadge(r.name):escHtml(r.name)}</div>
        <div class=risk-line-track>
          <span class=crit style="width:${r.crit/max*100}%"></span>
          <span class=att style="width:${r.att/max*100}%"></span>
          <span class=below style="width:${r.below/max*100}%"></span>
        </div>
        <div class=risk-line-val>
          <span class="risk-pill crit ${r.crit===0?'zero':''}">${r.crit} C</span>
          <span class="risk-pill att ${r.att===0?'zero':''}">${r.att} A</span>
          <span class="risk-pill below ${r.below===0?'zero':''}">${r.below} R</span>
        </div>
      </div>`}).join('')
    }</div>`
};

// Reconstrói o quadro de pedidos de marca terceirizada sem o status roxo.
const V51_DORUM_LINKS=[
  {code:'001086',report:'DORUM CLOR PREMIUM',product:'Clor Premium Dorum',ap:'5'},
  {code:'001087',report:'DORUM CLOR PREMIUM',product:'Clor Premium Dorum',ap:'20'},
  {code:'001088',report:'DORUM CLOR PREMIUM',product:'Clor Premium Dorum',ap:'50'},
  {code:'001090',report:'DORUM ACID',product:'Acid Dorum',ap:'5'},
  {code:'001091',report:'DORUM ACID',product:'Acid Dorum',ap:'20'},
  {code:'001092',report:'DORUM ACID',product:'Acid Dorum',ap:'50'},
  {code:'001110',report:'DORUM POS GREEN',product:'Dorum Pos Green',ap:'5'},
  {code:'001111',report:'DORUM POS GREEN',product:'Dorum Pos Green',ap:'20'},
  {code:'001112',report:'DORUM POS GREEN',product:'Dorum Pos Green',ap:'50'}
];

function v51Ap(x){
  let a=apInfo(x?.ap||x?.item||'');
  return a.kind==='L'?String(a.liters):String(x?.ap||'').trim()
}

function v51RenderContractPanel(){
  let host=$('v42ThirdOrders');
  if(!host)return;

  let rows=V51_DORUM_LINKS.map(r=>{
    let x=D.find(z=>
      norm(z.produto)===norm(r.product) &&
      v51Ap(z)===String(r.ap)
    );

    return{
      ...r,
      x,
      e:x?N(x.est):null,
      status:x?stat(x):'AGUARDANDO ESTOQUE'
    }
  });

  host.innerHTML=`<div class=v42-third-panel>
    <div class=head>
      <div>
        <h3>Marcas terceirizadas — pedidos para produção interna</h3>
        <div class=v42-note>
          A marca é terceirizada, mas o status do estoque segue a classificação normal.
          Estoque negativo é exibido como <b>CRÍTICO</b>.
        </div>
      </div>
      <span>${rows.length} itens vinculados</span>
    </div>

    <div class=tablewrap>
      <table class=v42-third-table>
        <thead>
          <tr>
            <th>Código CIGAM</th>
            <th>Produto vinculado</th>
            <th>Nome no relatório</th>
            <th>Apresentação</th>
            <th>Estoque / pedido</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r=>`<tr>
            <td><b>${r.code}</b></td>
            <td><b>${escHtml(r.product)}</b></td>
            <td>${escHtml(r.report)}</td>
            <td>${r.ap}L</td>
            <td class="${r.e!==null&&r.e<0?'neg':r.e===null?'blank':''}">
              ${r.e===null?'Aguardando valor':r.e.toLocaleString('pt-BR')}
            </td>
            <td>${badge(r.status)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`
}

// Garante que renderizações futuras também não restaurem o ponto roxo.
const v51RenderPrev=render;
render=function(){
  v51RenderPrev();
  v51RenderContractPanel()
};

save();
render();

})();

// ============================================================================
// Patch Block #14 [id="v52-patch"]
// ============================================================================
(function(){
'use strict';

/*
V52
O quadro "Marcas terceirizadas — pedidos para produção interna"
não precisa existir na tela de estoque.

A classificação de marca terceirizada continua salva no cadastro,
e os produtos seguem normalmente no PMP, bateladas, MRP e programação.
Apenas o painel redundante foi removido da interface.
*/

function v52RemoveContractPanel(){
  let host=document.getElementById('v42ThirdOrders');
  if(host)host.remove()
}

v52RemoveContractPanel();

// Caso alguma rotina antiga tente redesenhar a tela, remove novamente o painel.
const v52RenderPrev=render;
render=function(){
  v52RenderPrev();
  v52RemoveContractPanel()
};

render();

})();
