/**
 * Modulo PMP (Plano Mestre de Producao), Calculo de Tanques e Gestao de Bateladas
 */
function mpsCalc(x){if(isThird(x)&&x.semPedido)return{mto:0,mts:0,total:0};let e=N(x.est),r=N(x.ref);if(e===null)e=0;if(r===null)r=0;let mto=Math.max(0,-e),after=e+mto,mts=Math.max(0,r-after);return{mto,mts,total:mto+mts}}
function pmpDefaultMonth(){let d=new Date(),m=String(d.getMonth()+1).padStart(2,'0');return `${d.getFullYear()}-${m}`}
function pmpMonth(){return $('pmpMonth')?.value||pmpDefaultMonth()}
function pmpMonthState(month=pmpMonth()){MPS.plans=MPS.plans||{};if(!MPS.plans[month])MPS.plans[month]={};return MPS.plans[month]}
function pmpItemState(item,month=pmpMonth()){let base=pmpMonthState(month);if(!base[item])base[item]={qty:0,note:''};return base[item]}
function batchQtyForItemMonth(item,month){return (MPS.batches||[]).filter(b=>b.date&&b.date.startsWith(month)).reduce((sum,b)=>{let d=(b.dist||{})[item];return sum+(N(d?.mto)||0)+(N(d?.mts)||0)},0)}
function pmpRemaining(item,month=pmpMonth()){let s=pmpItemState(item,month),plan=Math.max(0,N(s.qty)||0),done=batchQtyForItemMonth(item,month);return{plan,done,remaining:plan-done}}
function mpsItemState(item){if(!MPS.items[item])MPS.items[item]={plannedDate:'',note:'',cigamDate:''};return MPS.items[item]}
function mpsPriority(x){let c=mpsCalc(x),s=mpsItemState(x.item),today=new Date();today.setHours(0,0,0,0);if(c.mto>0)return'Urgente';if(s.plannedDate){let d=new Date(s.plannedDate+'T00:00:00'),days=Math.round((d-today)/86400000);if(days<=1&&c.total>0)return'Urgente';if(days<=3&&c.total>0)return'Alta'}if(c.mts>0){if(stat(x)==='ATENÇÃO')return'Alta';return'Média'}return'Normal'}
function priorityHtml(p){let c=p.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');return `<span class="priority ${c}">${p}</span>`}
function renderMPS(){if(!$('mpsBody'))return;let month=pmpMonth();if($('pmpMonth')&&!$('pmpMonth').value)$('pmpMonth').value=month;let rows=D.filter(x=>!isSampleSku(x)&&!(isThird(x)&&x.semPedido)),q=($('mpsQ')?.value||'').toUpperCase(),l=$('mpsLinha')?.value||'',f=$('mpsNeedFilter')?.value||'';rows=rows.filter(x=>{let r=pmpRemaining(x.item,month),ok=(!q||`${x.produto} ${x.item} ${x.cod} ${x.ap}`.toUpperCase().includes(q))&&(!l||x.linha===l);if(f==='COM PLANO')ok=ok&&r.plan>0;if(f==='A PROGRAMAR')ok=ok&&r.remaining>0;return ok});$('mpsBody').innerHTML=rows.map(x=>{let s=pmpItemState(x.item,month),r=pmpRemaining(x.item,month),cls=r.remaining>0?'pos':r.remaining<0?'over':'done';return `<tr><td>${escHtml(x.linha||'')}</td><td><b>${escHtml(x.produto||'')}</b></td><td>${escHtml(x.ap||'')}</td><td>${escHtml(x.cod||'')}</td><td>${x.est??'—'}</td><td><input class="mpsnum pmp-plan-input" data-item="${encodeURIComponent(x.item)}" type=number min=0 step=1 value="${N(s.qty)||0}"></td><td>${r.done.toLocaleString('pt-BR')}</td><td class="pmp-remain ${cls}">${r.remaining.toLocaleString('pt-BR')}</td><td><input class="mpsnote pmp-plan-note" data-item="${encodeURIComponent(x.item)}" value="${String(s.note||'').replaceAll('"','&quot;')}" placeholder="Observação do mês"></td></tr>`}).join('');$('mpsBody').querySelectorAll('.pmp-plan-input').forEach(el=>el.onchange=()=>{let s=pmpItemState(decodeURIComponent(el.dataset.item),month);s.qty=Math.max(0,N(el.value)||0);save();renderMPS();renderMRP()});$('mpsBody').querySelectorAll('.pmp-plan-note').forEach(el=>el.onchange=()=>{pmpItemState(decodeURIComponent(el.dataset.item),month).note=el.value;save()});let all=D.filter(x=>!isSampleSku(x)&&!(isThird(x)&&x.semPedido)).map(x=>pmpRemaining(x.item,month)),planned=all.reduce((a,r)=>a+r.plan,0),programmed=all.reduce((a,r)=>a+r.done,0),remain=all.reduce((a,r)=>a+Math.max(0,r.remaining),0);$('mpsNeedCount').textContent=all.filter(r=>r.plan>0).length;$('mpsMtoTotal').textContent=planned.toLocaleString('pt-BR');$('mpsMtsTotal').textContent=programmed.toLocaleString('pt-BR');$('mpsBatchCount').textContent=remain.toLocaleString('pt-BR');renderBatches()}
function copyPreviousPmpMonth(){let cur=pmpMonth(),[y,m]=cur.split('-').map(Number),d=new Date(y,m-2,1),prev=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`,src=MPS.plans?.[prev]||{};if(!Object.keys(src).length){alert('O mês anterior não possui plano salvo.');return}if(!confirm(`Copiar o plano de ${prev} para ${cur}? Os valores atuais do mês serão substituídos.`))return;MPS.plans[cur]=structuredClone(src);save();renderMPS()}
function exportMpsCsv(){let month=pmpMonth(),h=['Mês','Setor','Produto','Apresentação','Código','Estoque atual','Plano mensal','Programado em bateladas','Saldo a programar','Observação'],rows=D.filter(x=>!isSampleSku(x)&&!(isThird(x)&&x.semPedido)),csv=[h.join(';'),...rows.map(x=>{let s=pmpItemState(x.item,month),r=pmpRemaining(x.item,month);return[month,x.linha,x.produto,x.ap,x.cod,x.est,r.plan,r.done,r.remaining,s.note].map(escCsv).join(';')})].join('\n'),a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));a.download=`PCP_CTEC_PMP_${month}.csv`;a.click()}

function packMaster(product){return PACKAGING_MASTER.find(p=>norm(p.product)===norm(product))||null}
function tankMaster(product){return TANK_MASTER.find(p=>norm(p.product)===norm(product))||null}
function formulaDensityForProduct(product){
  let link=typeof productFormulaLink==='function'?productFormulaLink(product):null;
  if(link&&link.formula&&FORMULA_DENSITY[link.formula]!==undefined)return FORMULA_DENSITY[link.formula];
  return null
}
function productDensity(product,batch=null){
  let bn=batch&&N(batch.density);if(bn!==null&&bn>0)return bn;
  let ov=N(OPS.density[norm(product)]);if(ov!==null&&ov>0)return ov;
  let seed=N(DENSITY_SEED[norm(product)]);if(seed!==null&&seed>0)return seed;
  let fd=N(formulaDensityForProduct(product));return fd!==null&&fd>0?fd:null
}
function densityNote(product){return DENSITY_NOTES[norm(product)]||''}
function apInfo(ap){
  let s=String(ap||'').toUpperCase().replace(',','.').trim();
  if(/150\s*ML|AMOSTRA/.test(s))return{kind:'L',liters:.15,key:'150ML',label:'150ML'};
  let kg=s.match(/([\d.]+)\s*KG/);if(kg)return{kind:'KG',kg:Number(kg[1]),key:kg[1]+'KG',label:kg[1]+'KG'};
  let gr=s.match(/([\d.]+)\s*GR?\b/);if(gr)return{kind:'KG',kg:Number(gr[1])/1000,key:gr[1]+'GR',label:gr[1]+'GR'};
  let l=s.match(/([\d.]+)\s*L/);if(l)return{kind:'L',liters:Number(l[1]),key:String(Number(l[1]))+'L',label:String(Number(l[1]))+'L'};
  let n=Number(s);if(Number.isFinite(n))return{kind:'L',liters:n,key:String(n)+'L',label:String(n)+'L'};
  return{kind:'OTHER',key:s,label:s}
}
function itemQtyKg(item,qty,density){
  let x=D.find(z=>z.item===item),a=apInfo(x?.ap||item),q=N(qty)||0;
  if(a.kind==='KG')return q*a.kg;
  if(a.kind==='L'&&density!==null)return q*density*a.liters;
  return null
}
function distKg(product,dist,density){
  let total=0,mto=0,mts=0,unknown=0;
  Object.entries(dist||{}).forEach(([item,d])=>{
    let a=itemQtyKg(item,N(d.mto)||0,density),b=itemQtyKg(item,N(d.mts)||0,density);
    if(a===null&&N(d.mto)>0)unknown++;else mto+=a||0;
    if(b===null&&N(d.mts)>0)unknown++;else mts+=b||0;
  });
  total=mto+mts;return{total,mto,mts,unknown}
}
function calculatedBatchKg(b){
  let dens=productDensity(b.produto,b),c=distKg(b.produto,b.dist||{},dens);
  return c.unknown===0&&c.total>0?c.total:(N(b.calcKg)||0)
}
function tankStandardFullKg(product,tank=''){
  let br=N(BATCH_REFS[product]);if(br!==null&&br>0)return br;
  let t=tankMaster(product);
  if(t){
    let sel=norm(tank||''),alts=String(t.altTank||'').split(',').map(x=>norm(x.trim())).filter(Boolean),alt=N(t.altKg),full=N(t.fullKg);
    if(sel&&alts.includes(sel)&&alt!==null&&alt>0)return alt;
    if(full!==null&&full>0)return full;
  }
  return null
}
function tankStandardHalfKg(product,tank=''){
  let t=tankMaster(product),full=tankStandardFullKg(product,tank);if(!t)return full?full/2:null;
  let sel=norm(tank||''),alts=String(t.altTank||'').split(',').map(x=>norm(x.trim())).filter(Boolean);
  if(sel&&alts.includes(sel)&&full)return full/2;
  let half=N(t.halfKg);return half!==null&&half>0?half:(full?full/2:null)
}
function operationalBatchKg(b){
  let calc=calculatedBatchKg(b),t=tankMaster(b.produto),full=tankStandardFullKg(b.produto,b.tank||''),half=tankStandardHalfKg(b.produto,b.tank||'');
  if(!full)return calc>0?calc:(N(b.kg)||0);
  if(calc<=0)return N(b.kg)||0;
  let rule=norm(t?.rule||'');
  if(rule.includes('CHEIA/MEIA')){
    let targets=[half,full].filter(v=>v&&v>0);return targets.length?targets.reduce((best,v)=>Math.abs(v-calc)<Math.abs(best-calc)?v:best,targets[0]):full
  }
  // Em produtos flexíveis, só ajusta para cheia/meia quando as embalagens estiverem próximas do padrão.
  if(full&&Math.abs(calc-full)/full<=0.05)return full;
  if(half&&Math.abs(calc-half)/half<=0.05)return half;
  return calc
}
function effectiveBatchKg(b){return operationalBatchKg(b)}
function operationalSplitKg(b){
  let dens=productDensity(b.produto,b),c=distKg(b.produto,b.dist||{},dens),op=effectiveBatchKg(b);
  if(c.total>0&&op>0){let f=op/c.total;return{total:op,mto:c.mto*f,mts:c.mts*f}}
  return{total:op,mto:0,mts:0}
}
function tankOptions(product){
  let t=tankMaster(product);if(!t||!t.mainTank||norm(t.mainTank)==='NAO HA')return[];
  let vals=String(t.mainTank).split(',').map(x=>x.trim()).filter(Boolean);
  if(t.altTank)vals.push(...String(t.altTank).split(',').map(x=>x.trim()).filter(Boolean));
  return[...new Set(vals)]
}
function packagingSpec(product,ap){
  let p=packMaster(product),a=apInfo(ap);if(!p||a.kind!=='L')return null;
  let k=a.key,rec=p.packs?.[k];if(!rec||rec.color==='-'||!rec.color)return null;
  return{size:a.liters,color:rec.color,model:rec.model||'C',brand:p.brand||'',note:p.note||''}
}
function packKey(spec){return`${spec.size}|${spec.color}|${spec.model}`}
function packLabelKey(k){let [s,c,m]=String(k).split('|');return`${s}L ${c} • Modelo ${m}`}
function lineClass(line){let s=norm(line);if(s==='ANVISA')return'anvisa';if(s.includes('VETERINARIO'))return'mapa';if(s.includes('AGRICOLA'))return'crop';return''}
function lineTag(line){let c=lineClass(line),txt=c==='anvisa'?'ANVISA':c==='mapa'?'MAPA':'CROP';return`<span class="line-tag ${c}">${txt}</span>`}
function fmtKg(v){return (N(v)||0).toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:2})+' kg'}
function fmtM3(v){return (N(v)||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+' m³'}
function sopOfBatch(b){
  if(b.sop&&b.sop!=='AUTO')return b.sop;
  let mto=Object.values(b.dist||{}).reduce((a,d)=>a+(N(d.mto)||0),0),mts=Object.values(b.dist||{}).reduce((a,d)=>a+(N(d.mts)||0),0);
  return mto&&mts?'MTO+MTS':mto?'MTO':mts?'MTS':'—'
}
function stageOfBatch(b){return b.stage|| (b.status==='Em produção'?'Produção':b.status==='Finalizada'?'Apontamento':'Em Fila')}
function currentIsoWeek(){
  let d=new Date(),x=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));x.setUTCDate(x.getUTCDate()+4-(x.getUTCDay()||7));let y=new Date(Date.UTC(x.getUTCFullYear(),0,1)),w=Math.ceil((((x-y)/86400000)+1)/7);return`${x.getUTCFullYear()}-W${String(w).padStart(2,'0')}`
}
function isoWeekDates(v){
  let m=String(v||'').match(/^(\d{4})-W(\d{2})$/);if(!m)return[];
  let y=+m[1],w=+m[2],jan4=new Date(Date.UTC(y,0,4)),day=jan4.getUTCDay()||7,mon=new Date(jan4);mon.setUTCDate(jan4.getUTCDate()-day+1+(w-1)*7);
  return Array.from({length:5},(_,i)=>{let d=new Date(mon);d.setUTCDate(mon.getUTCDate()+i);return d.toISOString().slice(0,10)})
}
function batchCounts(b){
  let out={'1':0,'5':0,'20':0,'50':0,'200':0,'150':0,other:[]};
  Object.entries(b.dist||{}).forEach(([item,d])=>{let x=D.find(z=>z.item===item),a=apInfo(x?.ap||item),q=(N(d.mto)||0)+(N(d.mts)||0);if(!q)return;
    if(a.key==='150ML')out['150']+=q;else if(a.kind==='L'&&['1','5','20','50','200'].includes(String(a.liters)))out[String(a.liters)]+=q;else out.other.push(`${a.label}: ${q}`)
  });
  ['1','5','20','50','200','150'].forEach(k=>out[k]=Number.isFinite(N(out[k]))?N(out[k]):0);
  return out
}
function batchPackaging(b){
  let rows={};Object.entries(b.dist||{}).forEach(([item,d])=>{let x=D.find(z=>z.item===item),q=(N(d.mto)||0)+(N(d.mts)||0);if(!x||q<=0)return;let s=packagingSpec(b.produto,x.ap);if(!s||![5,20,50,200].includes(s.size))return;let k=packKey(s);if(!rows[k])rows[k]={key:k,...s,qty:0};rows[k].qty+=q});return Object.values(rows)
}
function productIsThird(product){
  let xs=D.filter(x=>norm(x.produto)===norm(product));if(xs.some(isThird))return true;let t=tankMaster(product);return norm(t?.manufacturing||'')==='TERCEIRIZADO'
}
function boxSpec(product){
  let p=packMaster(product),ps=packagingSpec(product,'5');if(!ps)return null;let brand=norm(p?.brand||'');
  if(productIsThird(product))return{type:'SEM EMBLEMA',units:BOX_RULE.units};
  if(brand.includes('GLOBO VAC'))return{type:'GLOBO VAC',units:BOX_RULE.units};
  if(brand.includes('C-TEC CROP'))return{type:'CROP',units:BOX_RULE.units};
  return{type:'C-TEC',units:BOX_RULE.units}
}
function boxAggregate(batches){
  let perProduct={};(batches||[]).forEach(b=>{let c=batchCounts(b),q=N(c['5'])||0;if(q<=0)return;let sp=boxSpec(b.produto);if(!sp)return;let k=norm(b.produto);if(!perProduct[k])perProduct[k]={product:b.produto,type:sp.type,qty:0};perProduct[k].qty+=q});
  let grouped={};Object.values(perProduct).forEach(r=>{let boxes=Math.ceil(r.qty/BOX_RULE.units-1e-12),k=r.type;if(!grouped[k])grouped[k]={type:k,units:0,boxes:0};grouped[k].units+=r.qty;grouped[k].boxes+=boxes});return Object.values(grouped).sort((a,b)=>a.type.localeCompare(b.type,'pt-BR'))
}

function logisticsRef(ap,total){let s=String(ap||'').toUpperCase().replace(/\s/g,''),n=N(total)||0;if(s==='5'||s==='5L')return`${(n/160).toFixed(2)} palete(s)`;if(s==='20'||s==='20L')return`${(n/48).toFixed(2)} palete(s)`;if(s==='50'||s==='50L')return`${(n/18).toFixed(2)} palete(s)`;if(s==='200'||s==='200L')return`${(n/4).toFixed(2)} palete(s)`;if(s==='1000'||s==='1000L')return`${n} IBC(s)`;if(/KG/.test(s))return'Conforme embalagem';return'Conforme pedido'}
function isSampleSku(x){return norm(x?.linha||'')==='AMOSTRAS'||apInfo(x?.ap||x?.item||'').key==='150ML'}
function sampleItemName(prod){return `Amostra - ${prod} 150ML`}
function sampleSkuForProduct(prod){
  let x=D.find(z=>norm(z.produto)===norm(prod)&&isSampleSku(z));
  return x||{linha:'AMOSTRAS',produto:prod,ap:'150 ML',item:sampleItemName(prod),cod:'',ref:'',att:'',est:'',atual:'',pedidoAtivo:false,hist:[],virtualSample:true}
}
function isSampleItem(item){let x=D.find(z=>z.item===item);return x?isSampleSku(x):(/AMOSTRA/i.test(String(item||''))||apInfo(item).key==='150ML')}
function productSkus(prod){
  let rows=D.filter(x=>norm(x.produto)===norm(prod)&&!(isThird(x)&&x.semPedido));
  if(!rows.some(isSampleSku))rows.push(sampleSkuForProduct(prod));
  return rows.sort((a,b)=>{
    let sa=isSampleSku(a)?1:0,sb=isSampleSku(b)?1:0;if(sa!==sb)return sa-sb;
    let aa=apInfo(a.ap),bb=apInfo(b.ap),va=aa.kind==='L'?aa.liters:(aa.kind==='KG'?aa.kg:9999),vb=bb.kind==='L'?bb.liters:(bb.kind==='KG'?bb.kg:9999);return va-vb
  })
}
function batchProductOptions(){
  return [...new Set(D.filter(x=>!isSampleSku(x)).map(x=>x.produto).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'))
}
function openBatch(id=null){editingBatchId=id;let prods=batchProductOptions();$('batchProduct').innerHTML=prods.map(p=>`<option>${escHtml(p)}</option>`).join('');let b=id?MPS.batches.find(z=>z.id===id):null,today=new Date().toISOString().slice(0,10);$('batchTitle').textContent=b?'Editar batelada':'Nova batelada';$('batchProduct').disabled=!!b;$('batchProduct').value=b?.produto||prods[0]||'';$('batchDate').value=b?.date||today;$('batchStatus').value=b?.status||'Programada';$('batchStage').value=b?.stage||'Em Fila';$('batchSop').value=b?.sop||'AUTO';$('batchLot').value=b?.lot||'';$('batchPriority').value=b?.priority||'Normal';$('batchObs').value=b?.obs||'';let dens=productDensity($('batchProduct').value,b);$('batchDensity').value=dens??'';$('batchKg').value=b?.kg??'';updateBatchTankOptions(b?.tank||'');renderBatchDist(b);$('batchDlg').showModal()}
function updateBatchTankOptions(selected=''){
  let prod=$('batchProduct').value,ops=tankOptions(prod),t=tankMaster(prod);$('batchTank').innerHTML=ops.length?ops.map(v=>`<option>${escHtml(v)}</option>`).join(''):'<option value="">Sem tanque cadastrado</option>';
  if(selected&&ops.includes(selected))$('batchTank').value=selected;else if(ops.length)$('batchTank').value=ops[0];
  let full=tankStandardFullKg(prod,$('batchTank').value||''),half=tankStandardHalfKg(prod,$('batchTank').value||'');
  if(t)$('batchTankMeta').textContent=`${t.capacityL?`${t.capacityL.toLocaleString('pt-BR')} L físico • `:''}${t.rule||'regra não informada'}${full?` • padrão cheio ${full.toLocaleString('pt-BR')} kg`:''}${half?` • padrão meia ${half.toLocaleString('pt-BR')} kg`:''}`;
  else $('batchTankMeta').textContent='Padrão de tanque/batelada não cadastrado.'
}
function renderBatchDist(b=null){let prod=$('batchProduct').value,skus=productSkus(prod),dist=b?.dist||{},dens=N($('batchDensity').value),month=($('batchDate').value||'').slice(0,7)||pmpMonth();if(dens===null)dens=productDensity(prod,b);$('batchDistBody').innerHTML=skus.map(x=>{let d=dist[x.item]||{mto:0,mts:0},tot=(N(d.mto)||0)+(N(d.mts)||0),kg=itemQtyKg(x.item,tot,dens),ps=packagingSpec(prod,x.ap),rem=isSampleSku(x)?0:pmpRemaining(x.item,month).remaining,pk=ps&&[5,20,50,200].includes(ps.size)?`${ps.size}L ${ps.color} • Mod. ${ps.model}`:'—',bx=ps&&ps.size===5?boxSpec(prod):null,bxTxt=bx?`${bx.type} • 4 un.`:'—',sample=isSampleSku(x),apTxt=sample?`${escHtml(x.ap||'')} <span class=eng-status style="background:#e0f2fe;color:#075985">AMOSTRA</span>`:escHtml(x.ap||'');return `<tr data-item="${encodeURIComponent(x.item)}" class="${sample?'sample-linked-row':''}"><td>${apTxt}</td><td><b>${sample?'—':Math.max(0,rem).toLocaleString('pt-BR')}</b></td><td><input class="mpsnum bd-mto" type=number min=0 step=1 value="${d.mto||0}"></td><td><input class="mpsnum bd-mts" type=number min=0 step=1 value="${d.mts||0}"></td><td class=bd-total><b>${tot}</b></td><td class=bd-kg>${kg===null?'—':fmtKg(kg)}</td><td class=bd-pack>${sample?'Frasco de amostra':escHtml(pk)}</td><td>${escHtml(bxTxt)}</td></tr>`}).join('');$('batchDistBody').querySelectorAll('input').forEach(inp=>inp.oninput=()=>refreshBatchCalc());refreshBatchCalc()}
function currentDialogDist(){
  let dist={};$('batchDistBody').querySelectorAll('tr').forEach(tr=>{let item=decodeURIComponent(tr.dataset.item),mto=N(tr.querySelector('.bd-mto').value)||0,mts=N(tr.querySelector('.bd-mts').value)||0;if(mto||mts)dist[item]={mto,mts}});return dist
}
function refreshBatchCalc(){
  let prod=$('batchProduct').value,dens=N($('batchDensity').value),dist=currentDialogDist();$('batchDistBody').querySelectorAll('tr').forEach(tr=>{let item=decodeURIComponent(tr.dataset.item),mto=N(tr.querySelector('.bd-mto').value)||0,mts=N(tr.querySelector('.bd-mts').value)||0,tot=mto+mts,kg=itemQtyKg(item,tot,dens);tr.querySelector('.bd-total').innerHTML=`<b>${tot}</b>`;tr.querySelector('.bd-kg').textContent=kg===null?'—':fmtKg(kg)});
  let calc=distKg(prod,dist,dens),calcKg=(calc.unknown===0&&calc.total>0)?calc.total:null,tank=$('batchTank').value||'',tmp={produto:prod,dist,density:dens,tank,calcKg:calcKg||0,kg:N($('batchKg').value)||0},opKg=calcKg===null?null:operationalBatchKg(tmp),full=tankStandardFullKg(prod,tank),half=tankStandardHalfKg(prod,tank);
  $('batchCalcKg').textContent=calcKg===null?'Densidade pendente':fmtKg(calcKg);$('batchDensityMsg').textContent=dens===null?(densityNote(prod)||'Informe a densidade para calcular os kg das embalagens.'):'Kg equivalente das embalagens = quantidade × densidade × litragem';
  if(opKg!==null&&opKg>0){$('batchKg').value=Number(opKg.toFixed(3));$('batchKg').readOnly=true}else{$('batchKg').value='';$('batchKg').readOnly=false}
  $('batchTankKg').textContent=full===null?'—':fmtKg(full);let rem=(full!==null&&calcKg!==null)?full-calcKg:null,pct=(full&&calcKg!==null)?calcKg/full*100:null;
  $('batchRemainKg').textContent=rem===null?'—':fmtKg(rem);$('batchTankPct').textContent=pct===null?'—':pct.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';let meter=$('batchTankMeter'),w=pct===null?0:Math.min(100,pct);meter.style.width=w+'%';meter.className=pct>100?'over':pct>=95?'warn':'';
  let diff=(calcKg!==null&&opKg!==null)?opKg-calcKg:null,rule=tankMaster(prod)?.rule||'';
  $('batchTankAlert').innerHTML=opKg===null?'':pct>100?'<span class=calc-warn>As embalagens programadas ultrapassam o padrão operacional cadastrado.</span>':`<span class=calc-ok>Ocupação real pelas embalagens: ${pct===null?'—':pct.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%'} • Batelada operacional: ${fmtKg(opKg)}${diff!==null&&Math.abs(diff)>0.001?` • diferença de ${fmtKg(diff)} para fechamento do padrão`:''}</span>`;
  updateBatchTankMetaOnly(prod,tank,full,half)
}
function updateBatchTankMetaOnly(prod,tank,full,half){let t=tankMaster(prod);if(!$('batchTankMeta'))return;if(t)$('batchTankMeta').textContent=`${t.capacityL?`${t.capacityL.toLocaleString('pt-BR')} L físico • `:''}${t.rule||'regra não informada'}${full?` • padrão cheio ${full.toLocaleString('pt-BR')} kg`:''}${half?` • padrão meia ${half.toLocaleString('pt-BR')} kg`:''}`;else $('batchTankMeta').textContent='Padrão de tanque/batelada não cadastrado.'}
function fillBatchNeeds(){let dist={},month=($('batchDate').value||'').slice(0,7)||pmpMonth();$('batchDistBody').querySelectorAll('tr').forEach(tr=>{let item=decodeURIComponent(tr.dataset.item),x=D.find(z=>z.item===item);if(!x||isSampleItem(item))return;let rem=Math.max(0,pmpRemaining(item,month).remaining),stockNeed=mpsCalc(x),mto=Math.min(rem,stockNeed.mto),mts=Math.max(0,rem-mto);if(rem>0)dist[item]={mto,mts}});renderBatchDist({dist})}
function saveBatch(){let dist=currentDialogDist(),prod=$('batchProduct').value,dens=N($('batchDensity').value),tank=$('batchTank').value||'',date=$('batchDate').value;if(!prod){alert('Selecione um produto.');return}if(!date){alert('Informe a data planejada.');return}let sampleQty=0,mainQty=0;Object.entries(dist).forEach(([item,d])=>{let q=(N(d.mto)||0)+(N(d.mts)||0);if(isSampleItem(item))sampleQty+=q;else mainQty+=q});if(mainQty<=0){alert('Informe a quantidade de pelo menos uma apresentação principal.');return}if(sampleQty>0&&!tank){alert('Amostras 150ML devem estar vinculadas a um tanque da batelada principal.');return}let calc=distKg(prod,dist,dens),calcKg=(calc.unknown===0&&calc.total>0)?calc.total:null,tmp={produto:prod,dist,density:dens,tank,calcKg:calcKg||0,kg:N($('batchKg').value)||0},kg=calcKg===null?N($('batchKg').value):operationalBatchKg(tmp);if(dens!==null&&dens>0)OPS.density[norm(prod)]=dens;let status=$('batchStatus').value||'Programada',stage=$('batchStage').value||'Em Fila';if(status==='Finalizada')stage='Apontamento';let old=editingBatchId?MPS.batches.find(z=>z.id===editingBatchId):null,now=Date.now(),obj={id:editingBatchId||('B'+now),produto:prod,date,kg:kg===null?'':Number(kg.toFixed(3)),calcKg:calcKg===null?'':Number(calcKg.toFixed(3)),density:dens===null?'':dens,tank,status,stage,sop:$('batchSop').value||'AUTO',lot:$('batchLot').value.trim(),priority:$('batchPriority').value||'Normal',obs:$('batchObs').value,dist,createdAt:old?.createdAt||now,updatedAt:now,created:old?.created||new Date().toLocaleString('pt-BR')};if(editingBatchId){let i=MPS.batches.findIndex(z=>z.id===editingBatchId);if(i>=0)MPS.batches[i]={...MPS.batches[i],...obj}}else MPS.batches.push(obj);save();$('batchDlg').close();renderMPS();renderWeekly();renderBombonas();renderProduction();renderMRP()}
function deleteBatch(id){if(!confirm('Excluir esta batelada do PMP?'))return;MPS.batches=MPS.batches.filter(b=>b.id!==id);save();renderMPS();renderWeekly();renderBombonas();renderProduction()}
function batchSectorName(prod){
  let x=D.find(z=>norm(z.produto)===norm(prod)&&!isSampleSku(z));
  let line=String(x?.linha||'SEM SETOR').trim();
  if(line==='MAPA AGRÍCOLA FERTILIZANTES')return'FERTILIZANTES';
  if(line==='MAPA AGRÍCOLA ADJUVANTES')return'ADJUVANTES';
  return line||'SEM SETOR'
}
function populateBatchSectorFilter(){
  let el=$('batchSectorFilter');if(!el)return;
  let current=el.value,sectors=[...new Set(MPS.batches.map(b=>batchSectorName(b.produto)))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
  el.innerHTML='<option value="">Todos os setores</option>'+sectors.map(s=>`<option>${escHtml(s)}</option>`).join('');
  if(sectors.includes(current))el.value=current
}
function renderBatches(){if(!$('batchList'))return;populateBatchSectorFilter();let f=$('batchStatusFilter')?.value||'',sector=$('batchSectorFilter')?.value||'',q=($('batchNameFilter')?.value||'').trim().toUpperCase(),arr=(MPS.batches||[]).map((b,idx)=>({...b,_idx:idx,_sector:batchSectorName(b.produto),_order:Number(b.createdAt||0)||idx})).filter(b=>(!f||b.status===f)&&(!sector||b._sector===sector)&&(!q||String(b.produto||'').toUpperCase().includes(q))).sort((a,b)=>b._order-a._order);if(!arr.length){$('batchList').innerHTML='<div class=mps-empty>Nenhuma batelada encontrada. Crie uma nova batelada ou restaure um backup anterior.</div>';return}let groups={};arr.forEach(b=>(groups[b._sector]||(groups[b._sector]=[])).push(b));$('batchList').innerHTML=Object.keys(groups).sort((a,b)=>a.localeCompare(b,'pt-BR')).map(sec=>`<div class=batch-sector-block><div class=batch-sector-title><b>${escHtml(sec)}</b><span>${groups[sec].length} batelada(s)</span></div><div class=batch-list-simple>${groups[sec].map(b=>{let c=batchCounts(b),qtxt=['1','5','20','50','200','150'].filter(k=>Number(c[k]||0)>0).map(k=>`${k==='150'?'Amostra':k+'L'} ${Number(c[k]).toLocaleString('pt-BR')}`).join(' • ');return `<div class=batch-row-simple><div class=namewrap><div class=name>${escHtml(b.produto)}</div><div class=sub>${qtxt||'Sem distribuição'}${b.lot?` • Lote ${escHtml(b.lot)}`:''}</div></div><div class=cell><small>Data</small><b>${b.date?b.date.split('-').reverse().join('/'):'—'}</b></div><div class=cell><small>Kg</small><b>${fmtKg(effectiveBatchKg(b))}</b></div><div class=cell><small>S&amp;OP</small><b>${escHtml(sopOfBatch(b))}</b></div><div class="cell stagecell"><small>Etapa</small><b>${escHtml(stageOfBatch(b))}</b></div><div class=actions><button class="secondary smallbtn" onclick="openBatch('${b.id}')">Editar</button><button class="secondary smallbtn" onclick="deleteBatch('${b.id}')">Excluir</button></div></div>`}).join('')}</div></div>`).join('')}