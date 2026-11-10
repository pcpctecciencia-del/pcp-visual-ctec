/**
 * Camada de Regras V99-V106: Cadastro de Embalagens, Migracao Ultra Premium, Ficha de Engenharia e Alias Protevet
 */

// ============================================================================
// Patch Block #43 [id="v99-packaging-registry-script"]
// ============================================================================
(function(){
'use strict';
const V99_PACK_KEY='pcp_ctec_pack_custom_v99';
let V99_PACK={};
try{V99_PACK=JSON.parse(localStorage.getItem(V99_PACK_KEY)||'{}')||{}}catch(e){V99_PACK={}}
function v99Key(product){return norm(String(product||''))}
function v99ApKey(ap){const a=apInfo(ap);return a.kind==='L'&&[5,20,50,200].includes(Number(a.liters))?String(Number(a.liters))+'L':''}
function v99Custom(product,ap){const pk=v99Key(product),ak=v99ApKey(ap);return ak?(V99_PACK[pk]?.[ak]||null):null}
function v99Save(){localStorage.setItem(V99_PACK_KEY,JSON.stringify(V99_PACK));try{renderBombonas()}catch(e){}try{renderWeekly()}catch(e){}try{if(typeof save==='function')save()}catch(e){}}
function v99Set(product,ap,data){const pk=v99Key(product),ak=v99ApKey(ap);if(!ak)return;if(!V99_PACK[pk])V99_PACK[pk]={};if(!data){delete V99_PACK[pk][ak];if(!Object.keys(V99_PACK[pk]).length)delete V99_PACK[pk]}else V99_PACK[pk][ak]=data;v99Save()}
const v99PackagingSpecPrev=packagingSpec;
packagingSpec=function(product,ap){const c=v99Custom(product,ap);if(c){if(c.none)return null;if(c.color)return{size:apInfo(ap).liters,color:c.color,model:c.model||'C',brand:'CADASTRO MANUAL',note:'Cadastro manual V99'}}return v99PackagingSpecPrev(product,ap)};
const v99BoxSpecPrev=boxSpec;
boxSpec=function(product){const c=v99Custom(product,'5');if(c){if(c.none)return null;if(c.box)return{type:c.box,units:BOX_RULE.units}}return v99BoxSpecPrev(product)};
function v99Products(){const map=new Map();(D||[]).forEach(x=>{if(isSampleSku(x))return;const ak=v99ApKey(x.ap);if(!ak)return;const key=v99Key(x.produto)+'|'+ak;if(!map.has(key))map.set(key,{line:x.linha||'',product:x.produto||'',ap:ak,code:x.cod||''});else if(!map.get(key).code&&x.cod)map.get(key).code=x.cod});return[...map.values()].sort((a,b)=>String(a.line).localeCompare(String(b.line),'pt-BR')||String(a.product).localeCompare(String(b.product),'pt-BR')||Number(a.ap.replace('L',''))-Number(b.ap.replace('L','')))}
function v99BaseRec(row){const custom=v99Custom(row.product,row.ap);if(custom?.none)return{none:true,color:'',model:'',box:'',custom:true};let spec=null,bx=null;try{spec=packagingSpec(row.product,row.ap)}catch(e){}if(row.ap==='5L'){try{bx=boxSpec(row.product)}catch(e){}}return{none:false,color:spec?.color||'',model:spec?.model||'',box:row.ap==='5L'?(bx?.type||''):'',custom:!!custom}}
function v99State(row){const c=v99Custom(row.product,row.ap);if(c?.none)return'NA';let spec=null;try{spec=packagingSpec(row.product,row.ap)}catch(e){}if(!spec)return'PENDING';if(row.ap==='5L'){let bx=null;try{bx=boxSpec(row.product)}catch(e){}if(!bx)return'PENDING'}return'OK'}
function v99Opt(vals,current,label='Selecione'){return`<option value="">${label}</option>`+vals.map(v=>`<option value="${v}"${String(v)===String(current)?' selected':''}>${v}</option>`).join('')}
function v99Render(){const body=document.getElementById('v99PackBody');if(!body)return;const q=(document.getElementById('v99PackQ')?.value||'').trim().toUpperCase();const filter=document.getElementById('v99PackFilter')?.value||'ALL';let rows=v99Products().map(r=>({...r,state:v99State(r)}));if(q)rows=rows.filter(r=>`${r.line} ${r.product} ${r.ap} ${r.code}`.toUpperCase().includes(q));if(filter==='PENDING')rows=rows.filter(r=>r.state==='PENDING');if(filter==='OK')rows=rows.filter(r=>r.state==='OK');if(filter==='NA')rows=rows.filter(r=>r.state==='NA');body.innerHTML=rows.map(r=>{const rec=v99BaseRec(r),st=r.state;const colorVal=rec.none?'NÃO USA':rec.color;const status=st==='OK'?'<span class="v99-pack-status ok">CADASTRADO</span>':st==='NA'?'<span class="v99-pack-status na">NÃO USA</span>':'<span class="v99-pack-status pending">SEM CADASTRO</span>';const boxCell=r.ap==='5L'?`<select class=v99-box data-product="${encodeURIComponent(r.product)}" data-ap="${r.ap}">${v99Opt(['C-TEC','GLOBO VAC','CROP','SEM EMBLEMA','OUTRA'],rec.box,'—')}</select>`:'—';return`<tr class="${st==='PENDING'?'v99-pending-row':''}"><td>${escHtml(r.line||'—')}</td><td class=v99-prod>${escHtml(r.product)}</td><td><b>${r.ap}</b></td><td class=v99-code>${escHtml(r.code||'—')}</td><td><select class=v99-color data-product="${encodeURIComponent(r.product)}" data-ap="${r.ap}">${v99Opt(['BRANCA','PRATA','AZUL','PRETA','OUTRA','NÃO USA'],colorVal,'—')}</select></td><td><select class=v99-model data-product="${encodeURIComponent(r.product)}" data-ap="${r.ap}" ${rec.none?'disabled':''}>${v99Opt(['B','C','OUTRO'],rec.model,'—')}</select></td><td>${boxCell}</td><td>${status}</td></tr>`}).join('')||'<tr><td colspan=8 class=muted>Nenhum item encontrado.</td></tr>';const all=v99Products();const pending=all.filter(r=>v99State(r)==='PENDING').length;const ok=all.filter(r=>v99State(r)==='OK').length;const na=all.filter(r=>v99State(r)==='NA').length;if(document.getElementById('v99PackTotal'))document.getElementById('v99PackTotal').textContent=all.length;if(document.getElementById('v99PackPending'))document.getElementById('v99PackPending').textContent=pending;if(document.getElementById('v99PackOk'))document.getElementById('v99PackOk').textContent=ok+' / '+na;body.querySelectorAll('.v99-color').forEach(sel=>sel.onchange=()=>{const product=decodeURIComponent(sel.dataset.product),ap=sel.dataset.ap;const old=v99Custom(product,ap)||{};if(sel.value==='')v99Set(product,ap,null);else if(sel.value==='NÃO USA')v99Set(product,ap,{none:true});else v99Set(product,ap,{...old,none:false,color:sel.value,model:old.model||'C',box:old.box||''});v99Render()});body.querySelectorAll('.v99-model').forEach(sel=>sel.onchange=()=>{const product=decodeURIComponent(sel.dataset.product),ap=sel.dataset.ap;let old=v99Custom(product,ap);if(!old){let cur=v99BaseRec({product,ap});old={none:false,color:cur.color||'',model:cur.model||'',box:cur.box||''}}if(!old.color){alert('Selecione primeiro a bombona/cor.');v99Render();return}v99Set(product,ap,{...old,model:sel.value||'C'});v99Render()});body.querySelectorAll('.v99-box').forEach(sel=>sel.onchange=()=>{const product=decodeURIComponent(sel.dataset.product),ap=sel.dataset.ap;let old=v99Custom(product,ap);if(!old){let cur=v99BaseRec({product,ap});old={none:false,color:cur.color||'',model:cur.model||'C',box:cur.box||''}}if(!old.color){alert('Cadastre primeiro a bombona de 5L.');v99Render();return}v99Set(product,ap,{...old,box:sel.value||''});v99Render()})}
function v99Export(){const rows=v99Products().map(r=>{const rec=v99BaseRec(r),state=v99State(r);return[r.line,r.product,r.ap,r.code,rec.none?'NÃO USA':rec.color,rec.none?'':rec.model,r.ap==='5L'?(rec.box||''):'',state]});const csv=[['Linha','Produto','Apresentação','Código CIGAM','Bombona/Cor','Modelo','Caixa 5L','Status'],...rows].map(r=>r.map(escCsv).join(';')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));a.download='PCP_CTEC_Cadastro_Embalagens.csv';a.click()}
function v99Setup(){const host=document.getElementById('eng_embalagens');if(!host)return;if(!host.dataset.v99){host.dataset.v99='1';host.innerHTML=`<div class=notice><b>Cadastro de embalagens:</b> cada apresentação precisa ter a bombona correta. Para 5L, também é necessário informar a caixa. Itens sem cadastro ficam destacados e <b>não entram na necessidade de bombonas/caixas</b> até serem preenchidos. Use <b>NÃO USA</b> quando a apresentação não utilizar bombona.</div><div class=v99-pack-summary><div class=v99-pack-kpi><small>Apresentações</small><b id=v99PackTotal>0</b></div><div class=v99-pack-kpi><small>Sem cadastro</small><b id=v99PackPending>0</b></div><div class=v99-pack-kpi><small>Cadastradas / não usam</small><b id=v99PackOk>0</b></div></div><div class=toolbar><input id=v99PackQ placeholder="Buscar produto, código ou apresentação"><select id=v99PackFilter><option value=ALL>Todos</option><option value=PENDING>Somente sem cadastro</option><option value=OK>Somente cadastrados</option><option value=NA>Somente não usa</option></select><button id=v99PackExport class=secondary>Exportar cadastro CSV</button></div><div class=tablewrap><table class=v99-pack-table><thead><tr><th>Linha</th><th>Produto</th><th>Apres.</th><th>Código</th><th>Bombona / cor</th><th>Modelo</th><th>Caixa 5L</th><th>Status</th></tr></thead><tbody id=v99PackBody></tbody></table></div><div class=v99-help>As alterações são salvas automaticamente neste navegador e passam a valer na Programação Semanal e em Pedidos de Bombonas.</div>`;document.getElementById('v99PackQ').oninput=v99Render;document.getElementById('v99PackFilter').onchange=v99Render;document.getElementById('v99PackExport').onclick=v99Export}v99Render()}
const v99RenderEngineeringPrev=renderEngineering;
renderEngineering=function(){const r=v99RenderEngineeringPrev.apply(this,arguments);v99Setup();return r};
function v99Wire(){v99Setup();const tab=document.querySelector('[data-engview="embalagens"]');if(tab)tab.addEventListener('click',()=>setTimeout(v99Setup,0))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v99Wire);else v99Wire();setTimeout(v99Wire,100);
})();

// ============================================================================
// Patch Block #44 [id="v102-ultra-premium-clean-migration"]
// ============================================================================
(function(){
'use strict';
const V102_PAIRS=[
  {old:'Acid Ultra',name:'Acid Ultra Premium',formula:'TEC CID',codes:{'5':'002322','20':'002200','50':'002201'}},
  {old:'Alca Ultra',name:'Alca Ultra Premium',formula:'TEC CLOR PREMIUM',codes:{'5':'002202','20':'002203','50':'002204'}}
];
const v102N=v=>norm(String(v||''));
const v102Ap=x=>String(apInfo(x?.ap).liters||String(x?.ap||'').match(/\d+/)?.[0]||'');
function v102MergeData(){
  V102_PAIRS.forEach(p=>{
    D.forEach(x=>{
      if(v102N(x.produto)===v102N(p.old)){
        x.produto=p.name;
        if(x.item)x.item=String(x.item).replace(new RegExp(p.old,'ig'),p.name);
      }
    });
    ['5','20','50','200'].forEach(ap=>{
      const rows=D.filter(x=>v102N(x.produto)===v102N(p.name)&&v102Ap(x)===ap&&!isSampleSku(x));
      if(!rows.length)return;
      const expected=p.codes[ap]||'';
      let target=rows.find(x=>expected&&String(x.cod||'').replace(/^0+/,'')===expected.replace(/^0+/,''))||rows.find(x=>String(x.cod||'').trim())||rows[0];
      rows.forEach(x=>{
        if(x===target)return;
        if((target.est===''||target.est===null||target.est===undefined) && x.est!==''&&x.est!==null&&x.est!==undefined)target.est=x.est;
        if(!target.atual&&x.atual)target.atual=x.atual;
        if(Array.isArray(x.hist)&&x.hist.length)target.hist=[...(target.hist||[]),...x.hist];
        if(x.pedidoAtivo===true)target.pedidoAtivo=true;
        if(x.semPedido===false)target.semPedido=false;
      });
      target.linha='ANVISA';target.produto=p.name;target.tipo='Terceirizado';target.marca='Terceirizada';target.fabricacao='Interna';target.terceiroPedido=true;
      target.ap=ap;target.item=p.name+' '+ap+'L';if(expected)target.cod=expected;
      for(let i=D.length-1;i>=0;i--)if(D[i]!==target&&rows.includes(D[i]))D.splice(i,1);
    });
  });
}
function v102MigratePlans(){
  if(typeof MPS==='undefined'||!MPS)return;
  (MPS.batches||[]).forEach(b=>V102_PAIRS.forEach(p=>{if(v102N(b.produto)===v102N(p.old))b.produto=p.name}));
  const containers=[];
  if(MPS.masterPlans&&typeof MPS.masterPlans==='object')containers.push(...Object.values(MPS.masterPlans));
  if(MPS.plans&&typeof MPS.plans==='object')containers.push(...Object.values(MPS.plans));
  containers.forEach(obj=>{
    if(!obj||typeof obj!=='object')return;
    V102_PAIRS.forEach(p=>{
      Object.keys(obj).forEach(k=>{
        if(v102N(k).includes(v102N(p.old))&&!v102N(k).includes(v102N(p.name))){
          const nk=k.replace(new RegExp(p.old,'ig'),p.name);
          if(!(nk in obj))obj[nk]=obj[k];
          delete obj[k];
        }
      });
    });
  });
}
function v102MigrateOverrides(){
  if(typeof OPS!=='undefined'&&OPS){
    OPS.formulaLinks=OPS.formulaLinks||{};
    V102_PAIRS.forEach(p=>{
      const ok=v102N(p.old),nk=v102N(p.name);
      if(OPS.formulaLinks[ok]&&!OPS.formulaLinks[nk])OPS.formulaLinks[nk]={...OPS.formulaLinks[ok],product:p.name,formula:p.formula,relation:'IGUAL',active:true,line:'ANVISA'};
      delete OPS.formulaLinks[ok];
    });
  }
  try{
    const key='pcp_ctec_pack_custom_v99',o=JSON.parse(localStorage.getItem(key)||'{}')||{};let changed=false;
    V102_PAIRS.forEach(p=>{const ok=v102N(p.old),nk=v102N(p.name);if(o[ok]){o[nk]={...(o[ok]||{}),...(o[nk]||{})};delete o[ok];changed=true}});
    if(changed)localStorage.setItem(key,JSON.stringify(o));
  }catch(e){}
}
function v102Run(){
  try{v102MergeData();v102MigratePlans();v102MigrateOverrides();save()}catch(e){console.error('V102 migração',e)}
  try{render()}catch(e){}
  try{renderEngineering()}catch(e){}
  try{renderMPS()}catch(e){}
  try{renderBatches()}catch(e){}
  try{renderWeekly()}catch(e){}
  try{renderBombonas()}catch(e){}
  try{renderMRP()}catch(e){}
}
window.v102Run=v102Run;
v102Run();
setTimeout(v102Run,100);
})();

// ============================================================================
// Patch Block #45 [id="v104-pro-formula-links"]
// ============================================================================
(function(){
'use strict';
function v104ApplyProFormulaLinks(){
  if(!window.OPS || typeof v61Key!=='function' || typeof save!=='function'){
    setTimeout(v104ApplyProFormulaLinks,100);return;
  }
  OPS.formulaLinks=OPS.formulaLinks||{};
  const defs=[
    {product:'Acid Pro',formula:'TEC CID'},
    {product:'Alca Pro',formula:'TEC CLOR PREMIUM'}
  ];
  let changed=false;
  defs.forEach(d=>{
    const k=v61Key(d.product);
    const cur=OPS.formulaLinks[k]||{};
    if(cur.product!==d.product || cur.formula!==d.formula || cur.relation!=='IGUAL' || cur.active===false || cur.line!=='ANVISA'){
      OPS.formulaLinks[k]={...cur,product:d.product,formula:d.formula,relation:'IGUAL',note:'Produto terceirizado ANVISA com fabricação interna.',active:true,line:'ANVISA',updatedAt:Date.now()};
      changed=true;
    }
  });
  if(changed){
    save();
    try{renderEngineering()}catch(e){}
    try{renderMRP()}catch(e){}
  }
}
window.v104ApplyProFormulaLinks=v104ApplyProFormulaLinks;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v104ApplyProFormulaLinks);else v104ApplyProFormulaLinks();
})();

// ============================================================================
// Patch Block #46 [id="v105-product-sheet-script"]
// ============================================================================
(function(){
'use strict';
const $105=id=>document.getElementById(id);
function v105Rows(product){return (D||[]).filter(x=>norm(x.produto)===norm(product)).sort((a,b)=>{let aa=apInfo(a.ap||''),bb=apInfo(b.ap||'');return Number(aa.liters||aa.kg||999)-Number(bb.liters||bb.kg||999)})}
function v105Manufacturing(product){let t=typeof tankMaster==='function'?tankMaster(product):null;if(t?.manufacturing)return t.manufacturing;let rows=v105Rows(product);if(rows.length&&typeof isThird==='function')return rows.some(x=>isThird(x))?'Terceirizado • fabricação interna':'Próprio';return '—'}
function v105TankReference(product,link){let own=typeof tankMaster==='function'?tankMaster(product):null;if(own)return {tank:own,source:'Cadastro do produto'};if(link?.formula){let candidates=(TANK_MASTER||[]).filter(t=>{try{let l=productFormulaLink(t.product);return l?.formula===link.formula&&t.mainTank&&norm(t.mainTank)!=='NAO HA'}catch(e){return false}});if(candidates.length){let base=candidates.find(t=>norm(t.product)===norm(link.formula))||candidates[0];return {tank:base,source:'Referência pela mesma fórmula — confirmar para este produto'}}}return {tank:null,source:'Sem tanque cadastrado'}}
function v105PackStatus(product,ap){let spec=null,bx=null;try{spec=packagingSpec(product,ap)}catch(e){}let info=apInfo(ap||'');if(info.kind!=='L'||![5,20,50,200].includes(Number(info.liters)))return {spec:null,bx:null,status:'N/A'};if(Number(info.liters)===5){try{bx=boxSpec(product)}catch(e){}}let ok=!!spec&&(Number(info.liters)!==5||!!bx);return {spec,bx,status:ok?'OK':'PENDENTE'}}
function v105PresentationTable(product){
  let rows=v105Rows(product);if(!rows.length)return '<div class=v105-note>Sem apresentações cadastradas na base de produtos.</div>';
  let out=rows.map(x=>{let p=v105PackStatus(product,x.ap),spec=p.spec,bx=p.bx,st=p.status==='OK'?'<span class="v105-status v105-ok">OK</span>':p.status==='PENDENTE'?'<span class="v105-status v105-miss">SEM DEFINIÇÃO</span>':'<span class="v105-status v105-na">N/A</span>';let stock=x.est===null||x.est===undefined||x.est===''?'—':Number(x.est).toLocaleString('pt-BR');let bomb=spec?escHtml(spec.color||'—'):(p.status==='PENDENTE'?'<b style="color:#b91c1c">SEM DEFINIÇÃO</b>':'—');let model=spec?escHtml(spec.model||'—'):'—';let caixa=bx?escHtml((bx.type||'')+(bx.units?' • '+bx.units+' un.':'')):(apInfo(x.ap).liters===5&&p.status==='PENDENTE'?'<b style="color:#b91c1c">SEM DEFINIÇÃO</b>':'—');return '<tr><td><b>'+escHtml(x.ap||'—')+'</b></td><td>'+escHtml(x.cod||'—')+'</td><td>'+stock+'</td><td>'+bomb+'</td><td>'+model+'</td><td>'+caixa+'</td><td>'+st+'</td></tr>'}).join('');
  return '<table class=v105-sheet-table><thead><tr><th>Apresentação</th><th>Código CIGAM</th><th>Estoque</th><th>Bombona</th><th>Modelo</th><th>Caixa</th><th>Status embalagem</th></tr></thead><tbody>'+out+'</tbody></table>';
}
function v105FormulaTable(link){if(!link?.formula)return '<div class=v105-note><b style="color:#b91c1c">Produto sem fórmula vinculada.</b></div>';let f=formulaGet(link.formula);if(!f||f.pending)return '<div class=v105-note><b style="color:#b91c1c">Fórmula '+escHtml(link.formula)+' pendente ou não encontrada.</b></div>';let comps=(f.components||[]).filter(c=>Number(c.pct)>0);return '<table class=v105-sheet-table><thead><tr><th>Matéria-prima</th><th>% na fórmula</th></tr></thead><tbody>'+comps.map(c=>'<tr><td>'+escHtml(c.material)+'</td><td><b>'+Number(c.pct).toLocaleString('pt-BR',{maximumFractionDigits:5})+'%</b></td></tr>').join('')+'</tbody></table>'}
function v105Open(product){
  product=decodeURIComponent(product||'');let link=productFormulaLink(product)||{},f=link.formula?formulaGet(link.formula):null,ref=v105TankReference(product,link),t=ref.tank,rows=v105Rows(product),dens=typeof productDensity==='function'?productDensity(product):null,br=BATCH_REFS?.[product];let packPending=rows.filter(x=>v105PackStatus(product,x.ap).status==='PENDENTE').length;
  $105('v105SheetTitle').textContent=product;$105('v105SheetSub').textContent='Ficha completa de engenharia do produto';
  let tankWarn=ref.source.startsWith('Referência')?'<div class=v105-note><b>Atenção:</b> o tanque exibido foi localizado por produto com a mesma fórmula e ainda deve ser confirmado para este produto.</div>':'';
  $105('v105SheetBody').innerHTML=`<div class=v105-kpis>
    <div class=v105-kpi><small>Linha</small><b>${escHtml(link.line||rows[0]?.linha||'—')}</b></div><div class=v105-kpi><small>Fabricação</small><b>${escHtml(v105Manufacturing(product))}</b></div><div class=v105-kpi><small>Fórmula</small><b>${escHtml(link.formula||'SEM FÓRMULA')}</b></div><div class=v105-kpi><small>Relação</small><b>${escHtml(link.relation||'—')}</b></div><div class=v105-kpi><small>Densidade</small><b>${dens?Number(dens).toLocaleString('pt-BR',{maximumFractionDigits:4})+' kg/L':'—'}</b></div><div class=v105-kpi><small>Embalagens pendentes</small><b style="${packPending?'color:#b91c1c':''}">${packPending}</b></div></div>
    <div class=v105-two><div class=v105-section><div class=v105-section-head><h4>Produção / tanque</h4><span>${escHtml(ref.source)}</span></div><table class=v105-sheet-table><tbody><tr><td>Tanque principal</td><td><b>${escHtml(t?.mainTank||'SEM DEFINIÇÃO')}</b></td></tr><tr><td>Tanque alternativo</td><td>${escHtml(t?.altTank||'—')}</td></tr><tr><td>Capacidade</td><td>${t?.capacityL?Number(t.capacityL).toLocaleString('pt-BR')+' L':'—'}</td></tr><tr><td>Batelada cheia</td><td>${t?.fullKg?Number(t.fullKg).toLocaleString('pt-BR')+' kg':'—'}</td></tr><tr><td>Meia batelada</td><td>${t?.halfKg?Number(t.halfKg).toLocaleString('pt-BR')+' kg':'—'}</td></tr><tr><td>Mínimo operacional</td><td>${t?.minKg?Number(t.minKg).toLocaleString('pt-BR')+' kg':'—'}</td></tr><tr><td>Referência cadastrada</td><td>${br!==undefined&&br!==''?Number(br).toLocaleString('pt-BR')+' kg':'—'}</td></tr></tbody></table>${tankWarn}</div>
    <div class=v105-section><div class=v105-section-head><h4>Resumo da fórmula</h4><span>${f&&!f.pending?(f.components||[]).filter(c=>Number(c.pct)>0).length+' componentes':'—'}</span></div><table class=v105-sheet-table><tbody><tr><td>Fórmula utilizada</td><td><b>${escHtml(link.formula||'SEM FÓRMULA')}</b></td></tr><tr><td>Tipo</td><td>${escHtml(link.relation||'—')}</td></tr><tr><td>Base da variação</td><td>${escHtml(f?.base||'—')}</td></tr><tr><td>Soma da fórmula</td><td>${f&&!f.pending?formulaSum(f).toLocaleString('pt-BR',{maximumFractionDigits:5})+'%':'—'}</td></tr><tr><td>Observação</td><td>${escHtml(link.note||f?.note||'—')}</td></tr></tbody></table></div></div>
    <div class=v105-section><div class=v105-section-head><h4>Apresentações, códigos e embalagens utilizadas</h4><div class=v105-actions><button class=primary id=v105GoPack>Editar embalagens</button></div></div>${v105PresentationTable(product)}</div><div class=v105-section><div class=v105-section-head><h4>Matérias-primas da fórmula</h4><span>${escHtml(link.formula||'')}</span></div>${v105FormulaTable(link)}</div>`;
  $105('v105GoPack').onclick=()=>{$105('v105ProductSheet').close();let tab=document.querySelector('[data-engview="embalagens"]');if(tab)tab.click();setTimeout(()=>{let q=$105('v99PackQ')||$105('engPackQ');if(q){q.value=product;q.dispatchEvent(new Event('input',{bubbles:true}));q.focus()}},80)};
  $105('v105ProductSheet').showModal();
}
window.v105OpenProductSheet=v105Open;
function v105AddButtons(){let body=$105('engProductBody');if(!body)return;body.querySelectorAll('tr').forEach(tr=>{let sel=tr.querySelector('.v61-formula-select');if(!sel)return;let td=tr.lastElementChild;if(!td||td.querySelector('.v105-sheet-btn'))return;let b=document.createElement('button');b.className='smallbtn primary v105-sheet-btn';b.textContent='Ficha';b.dataset.product=sel.dataset.product;b.onclick=e=>{e.stopPropagation();v105Open(b.dataset.product)};td.appendChild(b)})}
const v105RenderEngineeringPrev=renderEngineering;renderEngineering=function(){let r=v105RenderEngineeringPrev.apply(this,arguments);setTimeout(v105AddButtons,0);return r};
$105('v105SheetClose').onclick=()=>$105('v105ProductSheet').close();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(v105AddButtons,100));else setTimeout(v105AddButtons,100);
})();

// ============================================================================
// Patch Block #47 [id="v106-protevet-desincrustante-alias"]
// ============================================================================
(function(){
'use strict';
const V106_PROTEVET=[
  {code:'899',report:'PROTEVET ALCALINO DESINCRUSTANTE',product:'Protevet Alcalino',ap:'5',stock:-48},
  {code:'900',report:'PROTEVET ALCALINO DESINCRUSTANTE',product:'Protevet Alcalino',ap:'20',stock:-80},
  {code:'901',report:'PROTEVET ALCALINO DESINCRUSTANTE',product:'Protevet Alcalino',ap:'50',stock:-29},
  {code:'903',report:'PROTEVET ACIDO DESINCRUSTANTE',product:'Protevet Ácido',ap:'5',stock:-48},
  {code:'904',report:'PROTEVET ACIDO DESINCRUSTANTE',product:'Protevet Ácido',ap:'20',stock:-68},
  {code:'905',report:'PROTEVET ACIDO DESINCRUSTANTE',product:'Protevet Ácido',ap:'50',stock:-24}
];
function v106Code(v){return String(v||'').replace(/\D/g,'').replace(/^0+/,'')||'0'}
function v106RuleByCode(c){const k=v106Code(c);return V106_PROTEVET.find(r=>v106Code(r.code)===k)||null}
function v106RuleByName(n){
  const s=norm(n||'');
  const size=(s.match(/\b(5|20|50)\s*L\b/)||[])[1];
  if(!size)return null;
  return V106_PROTEVET.find(r=>r.ap===size && (s.includes(norm(r.report))||s.includes(norm(r.product))))||null;
}
function v106CanonicalRow(rule){
  let x=(D||[]).find(z=>norm(z.produto)===norm(rule.product) && apInfo(z.ap||z.item||'').kind==='L' && Number(apInfo(z.ap||z.item||'').liters)===Number(rule.ap));
  if(!x){
    x={linha:'ANVISA',produto:rule.product,ap:rule.ap,item:`${rule.product} ${rule.ap}L`,cod:'',ref:0,att:0,est:'',atual:'',pedidoAtivo:false,hist:[]};
    D.push(x);
  }
  return x;
}
function v106MergeAliases(){
  const first=!OPS.protevetDesincrustanteV106;
  const now=new Date().toLocaleString('pt-BR');
  V106_PROTEVET.forEach(rule=>{
    const target=v106CanonicalRow(rule);
    const aliases=(D||[]).filter(z=>z!==target && (
      v106Code(z.cod)===v106Code(rule.code) ||
      (norm(z.produto||'').includes(norm(rule.report)) && Number(apInfo(z.ap||z.item||'').liters)===Number(rule.ap)) ||
      (norm(z.item||'').includes(norm(rule.report)) && Number(apInfo(z.ap||z.item||'').liters)===Number(rule.ap))
    ));
    aliases.forEach(a=>{
      if((target.est===''||target.est===null||target.est===undefined) && a.est!==''&&a.est!==null&&a.est!==undefined)target.est=a.est;
      if(a.atual && (!target.atual || String(a.atual)>String(target.atual)))target.atual=a.atual;
      target.hist=target.hist||[];
      (Array.isArray(a.hist)?a.hist:[]).forEach(h=>target.hist.push(h));
    });
    target.linha='ANVISA';
    target.produto=rule.product;
    target.ap=rule.ap;
    target.item=`${rule.product} ${rule.ap}L`;
    target.cod=rule.code;
    target.tipo='Terceirizado';
    target.terceiroPedido=true;
    target.nomeRelatorio=rule.report;
    target.ref=target.ref||0;
    target.att=target.att||0;
    if(first){
      target.est=rule.stock;
      target.atual=now;
      target.pedidoAtivo=true;
      target.semPedido=false;
      target.hist=target.hist||[];
      target.hist.push({data:now,estoque:rule.stock,rel:'Cadastro V106',evento:'Alias DESINCRUSTANTE consolidado no PROTEVET'});
    }
  });
  for(let i=D.length-1;i>=0;i--){
    const z=D[i],r=v106RuleByCode(z.cod)||v106RuleByName(z.item||z.produto||'');
    if(!r)continue;
    const canonical=norm(z.produto)===norm(r.product) && Number(apInfo(z.ap||z.item||'').liters)===Number(r.ap);
    if(!canonical && (norm(z.produto||'').includes('DESINCRUSTANTE')||norm(z.item||'').includes('DESINCRUSTANTE')))D.splice(i,1);
  }
  OPS.protevetDesincrustanteV106=true;

  // V108: Unificacao definitiva de Tablet Clor (5L/20L/50L/200L) + 001256 TABLETE CLOR 150GR em Tablete Clor 150GR
  try{
    [typeof PACKAGING_MASTER!=='undefined'?PACKAGING_MASTER:null,typeof TANK_MASTER!=='undefined'?TANK_MASTER:null,typeof PROD_FORMULA!=='undefined'?PROD_FORMULA:null].forEach(arr=>{
      if(Array.isArray(arr))arr.forEach(o=>{if(o&&norm(o.product)==='TABLET CLOR')o.product='Tablete Clor'});
    });
    const isTc=z=>{
      if(!z)return false;
      const p=norm(z.produto||''),it=norm(z.item||''),cd=v106Code(z.cod);
      return p==='TABLET CLOR'||p==='TABLETE CLOR'||it.includes('TABLET CLOR')||it.includes('TABLETE CLOR')||cd==='1256';
    };
    const tcRows=(D||[]).filter(isTc);
    let tcTarget=tcRows.find(z=>String(z.ap||'').toUpperCase().includes('150GR'))||tcRows.find(z=>Number(z.ref)>0)||tcRows[0];
    if(!tcTarget){
      tcTarget={linha:'ANVISA',produto:'Tablete Clor',ap:'150GR',item:'Tablete Clor 150GR',cod:'001256',ref:24,att:10,est:-24,atual:now,pedidoAtivo:false,hist:[],tipo:'Próprio',semPedido:false};
      D.push(tcTarget);
    }
    tcRows.forEach(r=>{
      if(r===tcTarget)return;
      if((tcTarget.est===''||tcTarget.est===null||tcTarget.est===undefined)&&r.est!==''&&r.est!==null&&r.est!==undefined)tcTarget.est=r.est;
      if((!tcTarget.ref||Number(tcTarget.ref)===0)&&Number(r.ref)>0)tcTarget.ref=r.ref;
      if((!tcTarget.att||Number(tcTarget.att)===0)&&Number(r.att)>0)tcTarget.att=r.att;
      if(r.atual&&(!tcTarget.atual||String(r.atual)>String(tcTarget.atual)))tcTarget.atual=r.atual;
      if(Array.isArray(r.hist)&&r.hist.length)tcTarget.hist=[...(tcTarget.hist||[]),...r.hist];
    });
    if(Array.isArray(R)&&R.length){
      const revIdx=R.findIndex(r=>v106Code(r.cod)==='1256'||/\bTABLETE?\s+CLOR\b/i.test(norm(r.nome||'')));
      if(revIdx>=0){
        const rev=R[revIdx];
        if(rev.est!==undefined&&rev.est!==null&&rev.est!==''){tcTarget.est=rev.est;tcTarget.atual=now;}
        R.splice(revIdx,1);
      }
    }
    tcTarget.linha=tcTarget.linha&&norm(tcTarget.linha)!=='AMOSTRAS'?tcTarget.linha:'ANVISA';
    tcTarget.produto='Tablete Clor';
    tcTarget.ap='150GR';
    tcTarget.item='Tablete Clor 150GR';
    tcTarget.cod='001256';
    tcTarget.tipo='Próprio';
    tcTarget.semPedido=false;
    if(tcTarget.ref===''||tcTarget.ref===null||tcTarget.ref===undefined||Number(tcTarget.ref)===0)tcTarget.ref=24;
    if(tcTarget.att===''||tcTarget.att===null||tcTarget.att===undefined||Number(tcTarget.att)===0)tcTarget.att=10;
    if(!OPS.tableteClorUnificadoV108 || tcTarget.est==='' || tcTarget.est===null || tcTarget.est===undefined){
      if(tcTarget.est===''||tcTarget.est===null||tcTarget.est===undefined)tcTarget.est=-24;
      if(!tcTarget.atual)tcTarget.atual=now;
      tcTarget.hist=tcTarget.hist||[];
      if(!tcTarget.hist.some(h=>String(h.evento||'').includes('150GR'))){
        tcTarget.hist.push({data:now,estoque:tcTarget.est,rel:'001256 — TABLETE CLOR 150GR',evento:'Unificado Tablet Clor + 001256 TABLETE CLOR 150GR (apresentação única 150GR)'});
      }
      OPS.tableteClorUnificadoV108=true;
    }
    for(let i=D.length-1;i>=0;i--){
      if(D[i]!==tcTarget && isTc(D[i]))D.splice(i,1);
    }
    if(typeof MPS!=='undefined'&&MPS){
      (MPS.batches||[]).forEach(b=>{
        if(norm(b.produto)==='TABLET CLOR')b.produto='Tablete Clor';
        if(b.dist&&typeof b.dist==='object'){
          ['Tablet Clor 5L','Tablet Clor 20L','Tablet Clor 50L','Tablet Clor 200L','Tablete Clor 5L'].forEach(oldK=>{
            if(b.dist[oldK]){
              if(!b.dist['Tablete Clor 150GR'])b.dist['Tablete Clor 150GR']=b.dist[oldK];
              delete b.dist[oldK];
            }
          });
        }
      });
      [MPS.plans,MPS.masterPlans].filter(Boolean).forEach(group=>{
        Object.values(group).forEach(monthObj=>{
          if(!monthObj||typeof monthObj!=='object')return;
          if(monthObj['Tablet Clor 5L']&&!monthObj['Tablete Clor 150GR'])monthObj['Tablete Clor 150GR']=monthObj['Tablet Clor 5L'];
          ['Tablet Clor 5L','Tablet Clor 20L','Tablet Clor 50L','Tablet Clor 200L'].forEach(k=>delete monthObj[k]);
          if(monthObj['Tablet Clor']&&!monthObj['Tablete Clor'])monthObj['Tablete Clor']=monthObj['Tablet Clor'];
          delete monthObj['Tablet Clor'];
        });
      });
    }
  }catch(e){console.error('V108 Tablete Clor merge',e)}

  try{save()}catch(e){console.error('V106 save',e)}
}

window.v106MergeAliases=v106MergeAliases;
v106MergeAliases();
const v106FindPrev=find;
find=function(c,n){
  if(v106Code(c)==='1256' || /\bTABLETE?\s+CLOR\b/i.test(norm(n||''))){
    let x=(D||[]).find(z=>norm(z.produto)==='TABLETE CLOR'||v106Code(z.cod)==='1256');
    if(!x){
      x={linha:'ANVISA',produto:'Tablete Clor',ap:'150GR',item:'Tablete Clor 150GR',cod:'001256',ref:24,att:10,est:'',atual:'',pedidoAtivo:false,hist:[],tipo:'Próprio',semPedido:false};
      D.push(x);
    }
    x.produto='Tablete Clor';x.ap='150GR';x.item='Tablete Clor 150GR';x.cod='001256';
    return x;
  }
  const rule=v106RuleByCode(c)||v106RuleByName(n);
  if(rule){
    const x=v106CanonicalRow(rule);
    x.cod=rule.code;x.nomeRelatorio=rule.report;x.tipo='Terceirizado';x.terceiroPedido=true;
    return x;
  }
  return v106FindPrev(c,n);
};
try{render();renderEngineering();}catch(e){console.error('V106 render',e)}
})();
