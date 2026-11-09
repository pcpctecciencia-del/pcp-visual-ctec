/**
 * Modulo de Engenharia (Formulas), Graficos Gerenciais e Importacao PDF de Materias-Primas
 */
function formulaSum(f){return (f.components||[]).reduce((a,c)=>a+(Number(c.pct)||0),0)}
function sumClass(v){let d=Math.abs(v-100);return d<=0.00001?'ok':d<=0.05?'round':'bad'}
function pctFmt(v){let n=Number(v)||0;return n.toLocaleString('pt-BR',{minimumFractionDigits:n===0?0:Math.min(2,Math.max(0,(String(v).split('.')[1]||'').length)),maximumFractionDigits:6})+'%'}
function renderEngineering(){try{if(!$('engFormulaBody'))return;let q=($('engQ')?.value||'').trim().toUpperCase(),typ=$('engType')?.value||'',fs=(FORMULAS||[]).filter(f=>(!typ||f.status===typ)&&(!q||`${f.name} ${f.base||''} ${(f.components||[]).map(c=>c.material).join(' ')}`.toUpperCase().includes(q)));$('engFormulaBody').innerHTML=fs.length?fs.map(f=>{let sum=formulaSum(f),linked=(PROD_FORMULA||[]).filter(p=>p.formula===f.name&&p.active!==false),filled=linked.filter(p=>BATCH_REFS[p.product]!==undefined&&BATCH_REFS[p.product]!=='').length;return `<tr data-formula="${encodeURIComponent(f.name)}"><td><b>${escHtml(f.name)}</b></td><td>${engBadge(f.status)}</td><td>${escHtml(f.base||'—')}</td><td>${f.pending?'—':(f.components||[]).length}</td><td><span class="formula-sum ${sumClass(sum)}">${f.pending?'—':sum.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:5})+'%'}</span></td><td>${linked.length?`${filled}/${linked.length}`:'—'}</td><td>${escHtml(f.note||'')}</td></tr>`}).join(''):'<tr><td colspan=7 class=muted>Nenhuma fórmula encontrada.</td></tr>';$('engFormulaBody').querySelectorAll('tr[data-formula]').forEach(tr=>tr.onclick=()=>openFormula(decodeURIComponent(tr.dataset.formula)));let pq=($('engProdQ')?.value||'').trim().toUpperCase(),rel=$('engProdRel')?.value||'',ps=(PROD_FORMULA||[]).filter(p=>(!rel||p.relation===rel)&&(!pq||`${p.product} ${p.formula||''} ${p.line||''}`.toUpperCase().includes(pq)));$('engProductBody').innerHTML=ps.length?ps.map(p=>{let f=formulaGet(p.formula),base=f?.base||'',br=BATCH_REFS[p.product]??'',pack5='—',box5='—';try{let z=packagingSpec(p.product,'5'),bx=boxSpec(p.product);pack5=z?`${z.color} • Mod. ${z.model}`:'—';box5=bx?`${bx.type} • ${bx.units} un.`:'—'}catch(e){}return `<tr${p.formula?` data-formula="${encodeURIComponent(p.formula)}"`:''}><td>${escHtml(p.line||'')}</td><td><b>${escHtml(p.product)}</b></td><td>${engBadge(p.relation)}</td><td>${escHtml(p.formula||'—')}</td><td>${escHtml(base||'—')}</td><td>${escHtml(pack5)}</td><td>${escHtml(box5)}</td><td>${p.active===false?'—':`<input class=batch-ref-inline data-product="${encodeURIComponent(p.product)}" type=number min=0 step=any value="${escHtml(br)}" placeholder="kg">`}</td><td>${escHtml(p.note||'')}</td></tr>`}).join(''):'<tr><td colspan=9 class=muted>Nenhum produto encontrado.</td></tr>';$('engProductBody').querySelectorAll('.batch-ref-inline').forEach(inp=>{inp.onclick=e=>e.stopPropagation();inp.onchange=e=>{e.stopPropagation();let p=decodeURIComponent(inp.dataset.product),v=inp.value.trim();BATCH_REFS[p]=v===''?'':Number(v);save()}});$('engProductBody').querySelectorAll('tr[data-formula]').forEach(tr=>tr.onclick=()=>openFormula(decodeURIComponent(tr.dataset.formula)));if($('engPackBody')){let eq=($('engPackQ')?.value||'').trim().toUpperCase(),packs=[];(PACKAGING_MASTER||[]).forEach(p=>{try{let ps5=packagingSpec(p.product,'5'),bx=boxSpec(p.product),hay=`${p.line} ${p.product} ${p.brand} ${ps5?.color||''} ${bx?.type||''}`.toUpperCase();if(ps5&&(!eq||hay.includes(eq)))packs.push({p,ps5,bx})}catch(e){}});$('engPackBody').innerHTML=packs.length?packs.map(({p,ps5,bx})=>`<tr><td>${escHtml(p.line||'')}</td><td><b>${escHtml(p.product)}</b></td><td>${escHtml(p.brand||'—')}</td><td>${escHtml(ps5?.color||'—')}</td><td>${escHtml(ps5?.model||'C')}</td><td><b>${escHtml(bx?.type||'—')}</b></td><td>${bx?.units||'—'}</td></tr>`).join(''):'<tr><td colspan=7 class=muted>Nenhum cadastro de embalagem 5L encontrado.</td></tr>'}$('engFormulaCount').textContent=(FORMULAS||[]).filter(f=>!f.pending).length;$('engProductCount').textContent=(PROD_FORMULA||[]).filter(p=>p.active!==false&&p.formula).length;$('engVariationCount').textContent=(FORMULAS||[]).filter(f=>f.status==='VARIAÇÃO').length;$('engPendingCount').textContent=(FORMULAS||[]).filter(f=>f.pending||f.status==='PENDENTE').length}catch(err){console.error('Engenharia:',err);if($('engFormulaBody'))$('engFormulaBody').innerHTML='<tr><td colspan=7><div class=safe-error>Erro ao carregar Engenharia. Os demais módulos continuam funcionando.</div></td></tr>'}}
function mpStock(name){return Object.prototype.hasOwnProperty.call(MP.stock||{},name)?N(MP.stock[name]):null}
function materialRows(){
  let m=new Map();
  FORMULAS.filter(f=>!f.pending).forEach(f=>(f.components||[]).forEach(c=>{
    let k=c.material,rec=m.get(k)||{material:k,formulas:new Set(),vals:[],zero:0};
    rec.formulas.add(f.name);let p=Number(c.pct)||0;rec.vals.push(p);if(p===0)rec.zero++;m.set(k,rec)
  }));
  Object.keys(MP.stock||{}).forEach(k=>{if(!m.has(k))m.set(k,{material:k,formulas:new Set(),vals:[],zero:0})});
  return [...m.values()].map(r=>({material:r.material,formulas:[...r.formulas].sort((a,b)=>a.localeCompare(b,'pt-BR')),count:r.formulas.size,
    max:r.vals.length?Math.max(...r.vals):0,min:(r.vals.filter(v=>v>0).length?Math.min(...r.vals.filter(v=>v>0)):0),zero:r.zero,
    stock:mpStock(r.material),code:(MP.codes||{})[r.material]||MATERIAL_CIGAM_BY_NAME[r.material]||''})).sort((a,b)=>b.count-a.count||a.material.localeCompare(b.material,'pt-BR'))
}
function stockFmt(v){if(v===null||v===undefined)return '—';let n=Number(v)||0;return n.toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:3})}
function renderMpHistory(){
  if(!$('mpHistory'))return;
  $('mpSource').textContent=`Posição atual: ${MP.updated||'—'} • ${MP.source||'sem origem informada'}`;
  let h=(MP.history||[]).slice().reverse().slice(0,8);
  $('mpHistory').innerHTML=h.length?h.map(x=>`<div style="padding:7px 0;border-bottom:1px solid #eee"><b>${escHtml(x.date||'')}</b><br>${escHtml(x.file||'')} • ${x.items||0} materiais</div>`).join(''):'Nenhuma atualização diária importada ainda.';
}
function renderMaterials(){
  if(!$('matBody'))return;
  let rows=materialRows(),q=($('matQ')?.value||'').trim().toUpperCase(),f=Number($('matFreq')?.value||0),cad=$('matCadastro')?.value||'';
  let out=rows.filter(r=>(!f||r.count>=f)&&(!q||`${r.material} ${r.code} ${r.formulas.join(' ')}`.toUpperCase().includes(q))&&(!cad||(cad==='COM'?r.stock!==null:r.stock===null)));
  $('matBody').innerHTML=out.map(r=>`<tr><td>${escHtml(r.code||'—')}</td><td><b>${escHtml(r.material)}</b>${r.zero?` <span class="eng-status eng-none">${r.zero} zero/QSP</span>`:''}</td><td class=percent>${stockFmt(r.stock)}</td><td>${r.count}</td><td class=percent>${r.max?pctFmt(r.max):'—'}</td><td class=percent>${r.min?pctFmt(r.min):'—'}</td><td>${r.stock!==null?'<span class="eng-status eng-base">ATUALIZADO</span>':'<span class="eng-status eng-pend">SEM SALDO</span>'}</td><td>${r.formulas.slice(0,7).map(x=>`<span class=material-chip>${escHtml(x)}</span>`).join('')}${r.formulas.length>7?` <span class=muted>+${r.formulas.length-7}</span>`:''}</td></tr>`).join('');
  $('matCount').textContent=rows.length;$('matStocked').textContent=rows.filter(r=>r.stock!==null).length;$('matNoStock').textContent=rows.filter(r=>r.stock===null).length;$('matZero').textContent=rows.reduce((a,r)=>a+r.zero,0);
  renderMaterialTopChart(rows.filter(r=>r.count>0));renderMpHistory();
}
function openFormula(name){
  let f=formulaGet(name);if(!f||!$('formulaDlg'))return;
  $('formulaTitle').textContent=f.name;
  let sum=formulaSum(f),products=PROD_FORMULA.filter(p=>p.formula===f.name&&p.active!==false);
  let prodRefs=products.length?`<div class=detail-card><div class=detail-title><h3>Batelada de Referência por produto</h3><p>Campo operacional separado dos percentuais. Quando preenchido, este valor sobrescreve o padrão cheio cadastrado do produto/tanque; os kg das fichas de fórmula não são usados automaticamente.</p></div><div class=tablewrap style="margin-top:10px"><table><thead><tr><th>Produto</th><th>Relação</th><th>Batelada de Referência (kg)</th></tr></thead><tbody>${products.map(p=>`<tr><td>${escHtml(p.product)}</td><td>${engBadge(p.relation)}</td><td><input class=batch-ref-dialog data-product="${encodeURIComponent(p.product)}" type=number min=0 step=any value="${escHtml(BATCH_REFS[p.product]??'')}" placeholder="Não informado"></td></tr>`).join('')}</tbody></table></div></div>`:'';
  if(f.pending){
    $('formulaDetail').innerHTML=`<div class=pending-formula><b>Fórmula pendente</b><br>${escHtml(f.note||'A composição ainda não foi informada.')}</div>${prodRefs}`;
    bindBatchInputs();$('formulaDlg').showModal();return;
  }
  let comp=(f.components||[]).map(c=>`<tr><td>${escHtml(c.material)}</td><td class=percent>${pctFmt(c.pct)}</td><td class=needkg data-pct="${c.pct}">—</td></tr>`).join('');
  $('formulaDetail').innerHTML=`<div class=detail-card><div class=detail-head><div class=detail-title><h3>${escHtml(f.name)}</h3><p>${f.status==='VARIAÇÃO'?`Variação de ${escHtml(f.base)}`:'Fórmula em percentual'}</p></div><div>${engBadge(f.status)}</div></div>
    <div class=kpi-strip><span class=kpi-pill>Componentes: <b>${f.components.length}</b></span><span class=kpi-pill>Soma: <b class="formula-sum ${sumClass(sum)}">${sum.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:5})}%</b></span>${f.base?`<span class=kpi-pill>Base: <b>${escHtml(f.base)}</b></span>`:''}</div>
    ${f.note?`<div class=notice>${escHtml(f.note)}</div>`:''}
    <div class=formula-products>${products.length?products.map(p=>`<span>${escHtml(p.product)} • ${escHtml(p.relation)}</span>`).join(''):'<span>Nenhum produto vinculado diretamente</span>'}</div></div>
    ${prodRefs}
    <div class=detail-card><div class=detail-title><h3>Simulador da fórmula</h3><p>Digite qualquer quantidade planejada para calcular os kg de cada matéria-prima pelo percentual.</p></div>
      <div class=calcbar><label>Quantidade planejada (kg)<input id=formulaCalcKg type=number min=0 step=any placeholder="Ex.: 2500"></label><span class=calc-note>Necessidade = kg planejados × percentual ÷ 100</span></div>
      <div class=tablewrap><table><thead><tr><th>Matéria-prima</th><th>Fórmula %</th><th>Necessidade calculada (kg)</th></tr></thead><tbody id=formulaCompBody>${comp}</tbody></table></div></div>`;
  bindBatchInputs();
  let calc=$('formulaCalcKg');if(calc)calc.oninput=()=>{let kg=N(calc.value);$('formulaCompBody').querySelectorAll('.needkg').forEach(td=>{let p=Number(td.dataset.pct)||0;td.textContent=kg===null?'—':(kg*p/100).toLocaleString('pt-BR',{minimumFractionDigits:3,maximumFractionDigits:5})})};
  $('formulaDlg').showModal()
}
function bindBatchInputs(){
  document.querySelectorAll('.batch-ref-dialog').forEach(inp=>{inp.onchange=()=>{let p=decodeURIComponent(inp.dataset.product),v=inp.value.trim();BATCH_REFS[p]=v===''?'':Number(v);save();renderEngineering()}})
}


function filterDashByStatus(st){
  let sel=document.getElementById('st');
  if(!sel)return;
  sel.value=sel.value===st?'':st;
  if(typeof render==='function')render();
}
function filterDashByLine(line){
  let sel=document.getElementById('linha');
  if(!sel)return;
  sel.value=sel.value===line?'':line;
  if(typeof render==='function')render();
}
function renderDashboardCharts(rows){
  rows=Array.isArray(rows)?rows:[];
  let statusBox=document.getElementById('statusOverviewChart'),riskBox=document.getElementById('lineRiskOverviewChart');
  if(!statusBox||!riskBox)return;
  const safeText=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const safeN=v=>{if(v===null||v===undefined||v==='')return null;if(typeof v==='number')return Number.isFinite(v)?v:null;let s=String(v).trim(),n=s.includes(',')?Number(s.replace(/\./g,'').replace(',','.')):Number(s);return Number.isFinite(n)?n:null};
  const safeStatus=x=>{
    let e=safeN(x?.est),r=safeN(x?.ref),a=safeN(x?.att),third=String(x?.tipo||'Próprio')==='Terceirizado';
    if(third&&x?.semPedido)return'SEM PEDIDO';
    if(e!==null&&e<0)return'CRÍTICO';
    if(r===0&&a===0)return'SOB DEMANDA';
    if(e===null)return'AGUARDANDO ESTOQUE';
    if(a!==null&&e<=a)return'ATENÇÃO';
    if(r!==null&&e<r)return'ABAIXO DA REFERÊNCIA';
    return'NORMAL'
  };
  const lineTone=name=>{
    let u=String(name||'').toUpperCase();
    if(u.includes('ANVISA'))return'sector-anvisa';
    if(u.includes('VETERIN'))return'sector-vet';
    if(u.includes('ADJUV'))return'sector-adj';
    if(u.includes('FERTIL'))return'sector-fert';
    if(u.includes('AMOSTRA'))return'sector-amostra';
    return'sector-default';
  };
  try{
    let curSt=document.getElementById('st')?.value||'',curLine=document.getElementById('linha')?.value||'';
    const total=Math.max(rows.length,1),groups=[
      ['NORMAL','Normal','fill-normal','dot-normal'],
      ['ABAIXO DA REFERÊNCIA','Abaixo da referência','fill-abaixo','dot-abaixo'],
      ['ATENÇÃO','Atenção','fill-atencao','dot-atencao'],
      ['CRÍTICO','Crítico','fill-critico','dot-critico'],
      ['AGUARDANDO ESTOQUE','Aguardando','fill-outros','dot-outros'],
      ['SOB DEMANDA','Sob demanda','fill-outros','dot-outros']
    ];
    statusBox.innerHTML=`<div class="hbar-list interactive-chart-list">${groups.map(([key,label,cls,dotCls])=>{
      let n=rows.filter(x=>safeStatus(x)===key).length,p=rows.length?(n*100/total):0,pctTxt=p.toFixed(1).replace('.',',')+'%',isAct=curSt===key;
      return `<div class="hbar-row clickable-row ${isAct?'active-chart-row':''}" onclick="filterDashByStatus('${safeText(key)}')" title="Clique para filtrar por ${safeText(label)}">
        <div class="hbar-label"><span class="status-dot ${dotCls}"></span><span>${label}</span></div>
        <div class="hbar-track"><div class="hbar-fill ${cls}" style="width:${Math.max(n>0?3:0,p)}%"></div></div>
        <div class="hbar-value"><b class="hbar-num">${n}</b><span class="hbar-pct">${pctTxt}</span></div>
      </div>`;
    }).join('')}</div>`;
    let map=new Map();
    rows.forEach(x=>{let k=String(x?.linha||'Sem linha'),s=safeStatus(x),r=map.get(k)||{name:k,crit:0,att:0,below:0,total:0};r.total++;if(s==='CRÍTICO')r.crit++;if(s==='ATENÇÃO')r.att++;if(s==='ABAIXO DA REFERÊNCIA')r.below++;map.set(k,r)});
    let arr=[...map.values()].filter(r=>r.crit+r.att+r.below>0).sort((a,b)=>(b.crit*4+b.att*2+b.below)-(a.crit*4+a.att*2+a.below));
    if(!arr.length){riskBox.innerHTML='<div class=chartempty>Nenhum item em risco nos filtros atuais.</div>';return}
    let max=Math.max(...arr.map(r=>r.crit+r.att+r.below),1);
    riskBox.innerHTML=`<div class="risk-line-list interactive-chart-list">${arr.map(r=>{
      let sumRisk=r.crit+r.att+r.below,isAct=curLine===r.name;
      return `<div class="risk-line-row clickable-row ${isAct?'active-chart-row':''}" onclick="filterDashByLine('${safeText(r.name)}')" title="Clique para filtrar a linha ${safeText(r.name)}">
        <div class="risk-line-name" title="${safeText(r.name)}"><span class="sector-pill ${lineTone(r.name)}">${safeText(r.name)}</span></div>
        <div class="risk-line-track"><span class="crit" style="width:${r.crit/max*100}%"></span><span class="att" style="width:${r.att/max*100}%"></span><span class="below" style="width:${r.below/max*100}%"></span></div>
        <div class="risk-line-val">
          <span class="risk-pill crit ${r.crit===0?'zero':''}" title="Críticos">${r.crit} Crít.</span>
          <span class="risk-pill att ${r.att===0?'zero':''}" title="Em atenção">${r.att} Aten.</span>
          <span class="risk-pill below ${r.below===0?'zero':''}" title="Abaixo da referência">${r.below} Abaixo</span>
          <span class="risk-total-tag" title="Total em risco na linha">${sumRisk} alertas</span>
        </div>
      </div>`;
    }).join('')}</div>`;
  }catch(err){
    console.error('Dashboard de risco:',err);
    riskBox.innerHTML='<div class=safe-error>Erro ao montar o risco por linha: '+safeText(err?.message||err)+'</div>'
  }
}
function renderMaterialTopChart(rows){
  let box=document.getElementById('matTopChart');if(!box)return;
  rows=Array.isArray(rows)?rows:[];
  let top=rows.slice(0,10),max=Math.max(...top.map(r=>Number(r.count)||0),1);
  if(!top.length){box.innerHTML='<div class=chartempty>Sem matérias-primas para exibir.</div>';return}
  box.innerHTML=`<div class=hbar-list>${top.map(r=>`<div class=hbar-row><div class=hbar-label title="${escHtml(r.material)}">${escHtml(r.material)}</div><div class=hbar-track><div class="hbar-fill fill-normal" style="width:${(Number(r.count)||0)/max*100}%"></div></div><div class=hbar-value>${Number(r.count)||0}</div></div>`).join('')}</div>`
}
function mpNorm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/ª/g,'A').replace(/[^A-Z0-9]+/g,' ').replace(/\s+/g,' ').trim()}
function ptNumber(s){let n=Number(String(s||'').replace(/\./g,'').replace(',','.'));return Number.isFinite(n)?n:null}
function mpOfficialNames(){return [...new Set([...Object.keys(MATERIAL_STOCK_SEED),...FORMULAS.flatMap(f=>(f.components||[]).map(c=>c.material))])]}
function canonicalMpName(desc){
  let raw=String(desc||'').trim(),n=mpNorm(raw),names=mpOfficialNames();
  let exact=names.find(x=>mpNorm(x)===n);if(exact)return exact;
  let cand=names.filter(x=>{let a=mpNorm(x);return n.length>=8&&a.length>=8&&(a.startsWith(n)||n.startsWith(a)||a.includes(n)||n.includes(a))});
  if(cand.length===1)return cand[0];
  if(/^CLORETO DE BENZALCONIO 80/.test(n)){let x=names.find(z=>mpNorm(z).startsWith('CLORETO DE BENZALCONIO 80'));if(x)return x}
  if(/^CLORETO DE ZINCO ANIDRO/.test(n)){let x=names.find(z=>mpNorm(z).includes('CLORETO DE ZINCO ANIDRO')&&mpNorm(z).includes('SOL 46'));if(x)return x}
  return raw.toUpperCase();
}
function parseMpPosition(ls){
  let map=new Map(),reportDate='';
  const rowRx=/^(\d{10})\s+(.+?)\s+(\d{2}\/\d{2}\/\d{4})\s+(?:(\d{4}\/\d{3})\s+)?01\s+(-?[\d.]+,\d+)\b/;
  const lotRx=/^(?:(\d{1,4}\/\d{4})\s+)?(\d{10})\s+(.+?)\s+(-?[\d.]+(?:,\d+)?)$/;
  for(let i=0;i<ls.length;i++){
    let l=String(ls[i]||'').replace(/\s+/g,' ').trim();
    if(!reportDate){let d=l.match(/Emitido em:\s*(\d{2}\/\d{2}\/\d{4})/i);if(d)reportDate=d[1]}
    let m=l.match(rowRx);
    if(m){
      let code=m[1],desc=MATERIAL_NAME_BY_CIGAM[code]||m[2].trim(),qty=ptNumber(m[5]);if(qty===null)continue;
      let r=map.get(code)||{code,desc,qty:0,lots:0};r.qty+=qty;r.lots++;if(desc.length>r.desc.length)r.desc=desc;map.set(code,r);continue
    }
    let n=l.match(lotRx);
    if(n){
      let code=n[2],desc=MATERIAL_NAME_BY_CIGAM[code]||n[3].trim(),qty=ptNumber(n[4]);if(qty===null)continue;
      let r=map.get(code)||{code,desc,qty:0,lots:0};r.qty+=qty;r.lots++;if(desc.length>r.desc.length)r.desc=desc;map.set(code,r)
    }
  }
  return{items:[...map.values()],reportDate,layout:'LINHAS_V89'}
}
async function parseMpPdfSmart(file){
  if(!window.pdfjsLib)throw Error('Leitor PDF não carregou. Verifique a internet.');
  let pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise,rows=[],reportDate='';
  let lastRow=null;
  for(let p=1;p<=pdf.numPages;p++){
    let pg=await pdf.getPage(p),content=await pg.getTextContent();
    let items=(content.items||[]).map(i=>({t:String(i.str||'').trim(),x:Number(i.transform?.[4]||0),y:Number(i.transform?.[5]||0)})).filter(i=>i.t);
    items.sort((a,b)=>Math.abs(b.y-a.y)>2?b.y-a.y:a.x-b.x);
    let groups=[],cur=null;
    for(let it of items){if(!cur||Math.abs(it.y-cur.y)>2){cur={y:it.y,items:[]};groups.push(cur)}cur.items.push(it)}
    for(let g of groups){
      g.items.sort((a,b)=>a.x-b.x);
      let line=g.items.map(i=>i.t).join(' ').replace(/\s+/g,' ').trim();
      if(!reportDate){let d=line.match(/Emitido em:\s*(\d{2}\/\d{2}\/\d{4})/i);if(d)reportDate=d[1]}
      let codeItem=g.items.find(i=>/^\d{10}$/.test(i.t)&&i.x<90);
      if(codeItem){
        let code=codeItem.t;
        let desc=g.items.filter(i=>i.x>=80&&i.x<245&&!/^\d{10}$/.test(i.t)).map(i=>i.t).join(' ').replace(/\s+/g,' ').trim();
        if(MATERIAL_NAME_BY_CIGAM[code])desc=MATERIAL_NAME_BY_CIGAM[code];
        let qtyRaw=g.items.filter(i=>i.x>=390&&i.x<490&&/^-?[\d.]+(?:,\d+)?$/.test(i.t)).map(i=>i.t).join('');
        lastRow={code,desc,qtyRaw,y:g.y,page:p};rows.push(lastRow);continue
      }
      /* Alguns valores muito longos (ex.: água) quebram os últimos decimais na linha seguinte. */
      if(lastRow&&lastRow.page===p&&Math.abs(lastRow.y-g.y)<=16){
        if(!MATERIAL_NAME_BY_CIGAM[lastRow.code]){
          let extraDesc=g.items.filter(i=>i.x>=80&&i.x<245&&!/^\d+$/.test(i.t)).map(i=>i.t).join(' ').trim();
          if(extraDesc)lastRow.desc=(lastRow.desc+' '+extraDesc).replace(/\s+/g,' ').trim();
        }
        let extraQty=g.items.filter(i=>i.x>=390&&i.x<490&&/^\d+$/.test(i.t)).map(i=>i.t).join('');
        if(extraQty&&lastRow.qtyRaw&&lastRow.qtyRaw.includes(','))lastRow.qtyRaw+=extraQty;
      }
    }
  }
  let map=new Map();
  rows.forEach(row=>{
    if(!/^\d{10}$/.test(row.code)||!row.desc||!row.qtyRaw)return;
    let qty=ptNumber(row.qtyRaw);if(qty===null)return;
    let desc=MATERIAL_NAME_BY_CIGAM[row.code]||canonicalMpName(row.desc);
    let r=map.get(row.code)||{code:row.code,desc,qty:0,lots:0};r.qty+=qty;r.lots++;if(desc.length>r.desc.length)r.desc=desc;map.set(row.code,r)
  });
  return{items:[...map.values()],reportDate,layout:'COLUNAS_V89'}
}
async function importMpPDF(file){
  $('mpMsg').textContent=' Lendo relatório de matérias-primas...';
  let parsed=await parseMpPdfSmart(file);
  if(parsed.items.length<5){
    parsed=parseMpPosition(await linesPDF(file));
  }
  if(parsed.items.length<5)throw Error('Não foi possível reconhecer o relatório. Use o PDF do CIGAM com Código_Material e Qtde.');
  let stock={},codes={...MATERIAL_CIGAM_BY_NAME},unmatched=[],official=mpOfficialNames();
  parsed.items.forEach(r=>{let name=canonicalMpName(r.desc);stock[name]=(stock[name]||0)+r.qty;codes[name]=r.code;if(!official.includes(name))unmatched.push({code:r.code,name})});
  let now=new Date().toLocaleString('pt-BR'),date=parsed.reportDate||now;MP.stock=stock;MP.codes=codes;MP.updated=date;MP.source=file.name;MP.unmatched=unmatched;MP.history=MP.history||[];MP.history.push({file:file.name,date,importedAt:now,items:parsed.items.length,layout:parsed.layout});if(MP.history.length>50)MP.history=MP.history.slice(-50);
  save();renderMaterials();renderMRP();$('mpMsg').textContent=` Atualizado: ${parsed.items.length} códigos consolidados${unmatched.length?`, ${unmatched.length} sem vínculo de engenharia`:''}. Lotes iguais foram somados.`;
}