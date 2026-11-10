/**
 * Gerenciamento de Estado Global (localStorage), Hidratacao Automatica do Backup Oficial (06/11/2026),
 * Sanitizacao e Utilitarios Base.
 */
const CTEC_BACKUP_SYNC_ID = '2026-11-06_063638_v106';

(function syncLatestBackupOnce() {
  try {
    if (localStorage.getItem('ctec_backup_sync_id') !== CTEC_BACKUP_SYNC_ID) {
      if (typeof SEED !== 'undefined') localStorage.setItem('ctec_v9', JSON.stringify(SEED));
      if (typeof IMPORT_SEED !== 'undefined') localStorage.setItem('ctec_hist_v9', JSON.stringify(IMPORT_SEED));
      if (typeof MPS_BACKUP_SEED !== 'undefined') localStorage.setItem('ctec_mps_v11', JSON.stringify(MPS_BACKUP_SEED));
      if (typeof BATCH_REFS_BACKUP_SEED !== 'undefined') localStorage.setItem('ctec_batch_refs_v14', JSON.stringify(BATCH_REFS_BACKUP_SEED));
      if (typeof MP_BACKUP_SEED !== 'undefined') localStorage.setItem('ctec_mp_v17', JSON.stringify(MP_BACKUP_SEED));
      if (typeof OPS_BACKUP_SEED !== 'undefined') localStorage.setItem('ctec_ops_v18', JSON.stringify(OPS_BACKUP_SEED));
      localStorage.setItem('ctec_backup_sync_id', CTEC_BACKUP_SYNC_ID);
    }
  } catch (e) {
    console.error('Erro ao sincronizar seed inicial do backup:', e);
  }
})();

let OPS;
try {
  OPS = JSON.parse(localStorage.getItem('ctec_ops_v18')) || (typeof OPS_BACKUP_SEED !== 'undefined' ? structuredClone(OPS_BACKUP_SEED) : {density:{},week:'',packStock:{},packUseStock:true,packComplete:'5L',packScope:'WEEK',prodDashboard:{},salesDashboard:{}});
} catch (e) {
  OPS = typeof OPS_BACKUP_SEED !== 'undefined' ? structuredClone(OPS_BACKUP_SEED) : {density:{},week:'',packStock:{},packUseStock:true,packComplete:'5L',packScope:'WEEK',prodDashboard:{},salesDashboard:{}};
}
if(!OPS.density)OPS.density={};if(!OPS.packStock)OPS.packStock={};
window.OPS = OPS;

function mpInitialState(){
  if (typeof MP_BACKUP_SEED !== 'undefined') return structuredClone(MP_BACKUP_SEED);
  return{stock:structuredClone(MATERIAL_STOCK_SEED),codes:structuredClone(MATERIAL_CIGAM_BY_NAME),updated:'03/11/2026',source:'MPS.pdf',history:[],unmatched:[]};
}
let MP;try{MP=JSON.parse(localStorage.getItem('ctec_mp_v17'))||mpInitialState()}catch(e){MP=mpInitialState()}
if(!MP||typeof MP!=='object')MP=mpInitialState();
if(!MP.stock||typeof MP.stock!=='object')MP.stock=structuredClone(MATERIAL_STOCK_SEED);
if(!MP.codes||typeof MP.codes!=='object')MP.codes={};
if(!Array.isArray(MP.history))MP.history=[];if(!Array.isArray(MP.unmatched))MP.unmatched=[];
/* V89: detecta o estado corrompido criado pelo leitor antigo (quase todos os saldos zerados e nomes contendo validade/lote). */
try{
  const _ks=Object.keys(MP.stock||{}),_zero=_ks.filter(k=>Math.abs(Number(MP.stock[k])||0)<1e-12).length,_bad=_ks.filter(k=>/\d{2}\/\d{2}\/\d{4}|LOTE|VALID/i.test(k)).length;
  if(_ks.length>20&&((_zero/_ks.length)>.75||_bad>5)){
    MP.stock=structuredClone(MATERIAL_STOCK_SEED);MP.updated='03/11/2026';MP.source='Base reparada automaticamente (V89)';MP.v89NeedsReimport=true;
  }
}catch(e){}
MP.codes={...MATERIAL_CIGAM_BY_NAME,...MP.codes};

let BATCH_REFS;try{BATCH_REFS=JSON.parse(localStorage.getItem('ctec_batch_refs_v14'))||(typeof BATCH_REFS_BACKUP_SEED!=='undefined'?structuredClone(BATCH_REFS_BACKUP_SEED):{})}catch(e){BATCH_REFS=typeof BATCH_REFS_BACKUP_SEED!=='undefined'?structuredClone(BATCH_REFS_BACKUP_SEED):{}}

let D;try{D=sanitizeData(JSON.parse(localStorage.getItem('ctec_v9'))||structuredClone(SEED))}catch(e){D=sanitizeData(structuredClone(SEED))}
let H;try{H=JSON.parse(localStorage.getItem('ctec_hist_v9'))||structuredClone(IMPORT_SEED)}catch(e){H=structuredClone(IMPORT_SEED)}let R=[],I=[];
let showDemand=localStorage.getItem('ctec_show_demand')==='1';let showThirdClosed=localStorage.getItem('ctec_show_third_closed')==='1';let editingItem=null;
function loadMpsCompat(){
  let merged=typeof MPS_BACKUP_SEED!=='undefined'?structuredClone(MPS_BACKUP_SEED):{items:{},plans:{},batches:[]};
  let seen=new Set((merged.batches||[]).map(b=>b.id));
  let keys=['ctec_mps_v11','ctec_mps_v10','ctec_mps_v12','ctec_mps_v13','ctec_mps_v14','ctec_mps_v15','ctec_mps_v16'];
  try{for(let i=0;i<localStorage.length;i++){let k=localStorage.key(i);if(k&&/^ctec_mps_v/i.test(k)&&!keys.includes(k))keys.push(k)}}catch(e){}
  keys.forEach(k=>{try{let x=JSON.parse(localStorage.getItem(k)||'null');if(!x)return;if(x.items&&typeof x.items==='object')Object.assign(merged.items,x.items);if(x.plans&&typeof x.plans==='object')Object.keys(x.plans).forEach(m=>merged.plans[m]={...(merged.plans[m]||{}),...x.plans[m]});if(x.masterPlans&&typeof x.masterPlans==='object'){merged.masterPlans=merged.masterPlans||{};Object.keys(x.masterPlans).forEach(m=>merged.masterPlans[m]={...(merged.masterPlans[m]||{}),...x.masterPlans[m]});}if(Array.isArray(x.batches))x.batches.forEach((b,idx)=>{let id=b.id||`${k}_${idx}_${b.produto||''}_${b.date||''}`;if(!seen.has(id)){seen.add(id);merged.batches.push({...b,id})}else{let exIdx=merged.batches.findIndex(eb=>eb.id===id);if(exIdx>=0)merged.batches[exIdx]={...merged.batches[exIdx],...b,id}}})}catch(e){}});
  return merged;
}
let MPS=loadMpsCompat();if(!MPS.items)MPS.items={};if(!MPS.plans)MPS.plans={};if(!Array.isArray(MPS.batches))MPS.batches=[];let editingBatchId=null;
function sanitizeData(arr){
  if(!Array.isArray(arr))return [];
  let out=arr.filter(x=>{
    let p=String(x.produto||'').trim().toUpperCase(),i=String(x.item||'').trim().toUpperCase();
    if(p.startsWith('TEC OXI')&&/\b(5|20|50|200)\s*L\b/.test(i))return false;
    if(p==='REMOBAC'&&/\b(5|20|50|200)\s*L\b/.test(i))return false;
    if(p==='PED CASCO PLUS')return false;
    if((p==='TABLET CLOR'||p==='TABLETE CLOR')&&(/\b(20|50|200)\s*L\b/.test(i)||/150\s*ML|AMOSTRA/.test(i)))return false;
    return true;
  });
  let tcRows=out.filter(x=>{
    let p=String(x.produto||'').trim().toUpperCase(),i=String(x.item||'').trim().toUpperCase(),c=String(x.cod||'').replace(/\D/g,'').replace(/^0+/,'');
    return p==='TABLET CLOR'||p==='TABLETE CLOR'||i.includes('TABLET CLOR')||i.includes('TABLETE CLOR')||c==='1256';
  });
  if(tcRows.length){
    let main=tcRows.find(x=>String(x.ap||'').toUpperCase().includes('150'))||tcRows.find(x=>Number(x.ref)>0)||tcRows[0];
    tcRows.forEach(r=>{
      if(r===main)return;
      if((main.est===''||main.est===null||main.est===undefined)&&r.est!==''&&r.est!==null&&r.est!==undefined)main.est=r.est;
      if(!Number(main.ref)&&Number(r.ref)>0)main.ref=r.ref;
      if(!Number(main.att)&&Number(r.att)>0)main.att=r.att;
      if(Array.isArray(r.hist)&&r.hist.length)main.hist=[...(main.hist||[]),...r.hist];
    });
    main.linha=main.linha||'ANVISA';
    main.produto='Tablete Clor';
    main.ap='150GR';
    main.item='Tablete Clor 150GR';
    main.cod='001256';
    if(main.ref===''||main.ref===null||main.ref===undefined||Number(main.ref)===0)main.ref=24;
    if(main.att===''||main.att===null||main.att===undefined||Number(main.att)===0)main.att=10;
    out=out.filter(x=>!tcRows.includes(x)||x===main);
  }else{
    out.push({linha:'ANVISA',produto:'Tablete Clor',ap:'150GR',item:'Tablete Clor 150GR',cod:'001256',ref:24,att:10,est:-24,atual:'10/11/2026',pedidoAtivo:false,hist:[],tipo:'Próprio',semPedido:false});
  }
  const ensure=(produto,kg,cod='')=>{
    let item=`${produto} ${kg}KG`,x=out.find(z=>String(z.item||'').trim().toUpperCase()===item.toUpperCase());
    if(x){x.ap=`${kg} KG`;if(cod&&!String(x.cod||'').trim())x.cod=cod;return}
    out.push({linha:'ANVISA',produto,ap:`${kg} KG`,item,cod,ref:0,att:0,est:'',atual:'',pedidoAtivo:false,hist:[]});
  };
  ensure('Tec Oxi',5,'112');ensure('Tec Oxi',20,'111');ensure('Tec Oxi',50,'126');ensure('Tec Oxi',200,'');
  ensure('Remobac',5,'');ensure('Remobac',20,'316');ensure('Remobac',50,'317');ensure('Remobac',200,'');
  out.forEach(x=>{
    if(!x.tipo)x.tipo=String(x.produto||'').trim().toUpperCase()==='FARMA GREEN PREMIUM'?'Terceirizado':'Próprio';
    if(x.semPedido===undefined)x.semPedido=false;
  });
  return out;
}
const $=id=>document.getElementById(id),N=v=>{if(v===null||v===undefined||v==='')return null;if(typeof v==='number')return Number.isFinite(v)?v:null;let s=String(v).trim(),n=s.includes(',')?Number(s.replace(/\./g,'').replace(',','.')):Number(s);return Number.isFinite(n)?n:null};
function escHtml(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function formulaGet(name){return (FORMULAS||[]).find(f=>f.name===name)}
function engBadge(rel){
  let c=rel==='BASE'?'eng-base':rel==='IGUAL'?'eng-equal':rel==='VARIAÇÃO'?'eng-var':rel==='PENDENTE'?'eng-pend':'eng-none';
  return `<span class="eng-status ${c}">${escHtml(rel||'—')}</span>`
}

function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,' ').trim().replace('10.000','10000').replace(/\bNEU TEC\b/g,'NEUTEC')}
function demand(x){return N(x.ref)===0&&N(x.att)===0}
function isThird(x){return String(x.tipo||'Próprio')==='Terceirizado'}
function stat(x){let e=N(x.est),r=N(x.ref),a=N(x.att);if(isThird(x)&&x.semPedido)return'SEM PEDIDO';if(e!==null&&e<0)return'CRÍTICO';if(demand(x))return'SOB DEMANDA';if(e===null)return'AGUARDANDO ESTOQUE';if(a!==null&&e<=a)return'ATENÇÃO';if(r!==null&&e<r)return'ABAIXO DA REFERÊNCIA';return'NORMAL'}
function badge(s){let c=s==='NORMAL'?'normal':s==='ABAIXO DA REFERÊNCIA'?'abaixo':s==='ATENÇÃO'?'atencao':s==='CRÍTICO'?'critico':s==='SOB DEMANDA'?'demanda':s==='SEM PEDIDO'?'sempedido':'aguardando';return`<span class="badge ${c}">${s}</span>`}
function vis(){return D.filter(x=>{if(isThird(x)&&x.semPedido&&!showThirdClosed)return false;let e=N(x.est);if(e!==null&&e<0)return true;if(!demand(x))return true;return !!x.pedidoAtivo||showDemand})}
function save(){localStorage.setItem('ctec_v9',JSON.stringify(D));localStorage.setItem('ctec_hist_v9',JSON.stringify(H));localStorage.setItem('ctec_mps_v11',JSON.stringify(MPS));localStorage.setItem('ctec_batch_refs_v14',JSON.stringify(BATCH_REFS));localStorage.setItem('ctec_mp_v17',JSON.stringify(MP));localStorage.setItem('ctec_ops_v18',JSON.stringify(OPS));localStorage.setItem('ctec_show_demand',showDemand?'1':'0');localStorage.setItem('ctec_show_third_closed',showThirdClosed?'1':'0')}
function setShowDemand(v){showDemand=!!v;$('showDemand').checked=showDemand;if($('showDemand2'))$('showDemand2').checked=showDemand;save();render()}
function setShowThirdClosed(v){showThirdClosed=!!v;$('showThirdClosed').checked=showThirdClosed;if($('showThirdClosed2'))$('showThirdClosed2').checked=showThirdClosed;save();render()}
function v55Qty(c,k){let v=N(c?.[k]);return Number.isFinite(v)?v:0}
window.v55Qty=v55Qty;
