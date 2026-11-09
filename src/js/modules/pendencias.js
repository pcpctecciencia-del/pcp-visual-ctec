/**
 * Modulo de Pendencias Cadastrais e Grafico SVG de Historico de Estoque (Ultimos 20 Pontos)
 */
function pendingReasons(x){
  if(isThird(x)&&x.semPedido)return [];
  let a=[];
  if(!String(x.cod||'').trim())a.push('SEM CÓDIGO');
  let refBlank=x.ref===null||x.ref===undefined||String(x.ref).trim()==='',attBlank=x.att===null||x.att===undefined||String(x.att).trim()==='';
  if(refBlank||attBlank)a.push('PARÂMETRO');
  if(String(x.cod||'').trim()&&(x.est===null||x.est===undefined||String(x.est).trim()===''))a.push('SEM ESTOQUE');
  return a;
}
function pendingRows(){
  let out=[];
  D.forEach(x=>{let rs=pendingReasons(x);if(rs.length)out.push({kind:'produto',x,reasons:rs})});
  R.forEach(r=>out.push({kind:'revisar',x:{linha:'',item:r.nome,cod:r.cod,est:r.est,atual:''},reasons:['REVISAR']}));
  return out;
}
function renderPendencias(){
  let all=pendingRows(),q=($('pq')?.value||'').toUpperCase(),t=$('ptype')?.value||'';
  let f=all.filter(r=>(!q||`${r.x.linha||''} ${r.x.item||''} ${r.x.cod||''}`.toUpperCase().includes(q))&&(!t||r.reasons.includes(t)));
  let prod=D.filter(x=>pendingReasons(x).length);
  $('ptotal').textContent=all.length;
  $('pcod').textContent=D.filter(x=>pendingReasons(x).includes('SEM CÓDIGO')).length;
  $('pparam').textContent=D.filter(x=>pendingReasons(x).includes('PARÂMETRO')).length;
  $('pstock').textContent=D.filter(x=>pendingReasons(x).includes('SEM ESTOQUE')).length;
  $('pbody').innerHTML=f.map((r,idx)=>`<tr class="${r.kind==='produto'?'pendrow':''}" data-i="${r.kind==='produto'?encodeURIComponent(r.x.item):''}"><td>${r.x.linha||''}</td><td>${r.x.item||''}</td><td>${r.x.cod||''}</td><td>${r.x.est??''}</td><td><div class=reason>${r.reasons.map(z=>`<span class=pill>${z}</span>`).join('')}</div></td><td>${r.x.atual||''}</td></tr>`).join('');
  $('pbody').querySelectorAll('tr.pendrow').forEach(tr=>tr.onclick=()=>openItem(decodeURIComponent(tr.dataset.i)));
}
function escCsv(v){return `"${String(v??'').replaceAll('"','""')}"`}
function exportPendencias(){
  let rows=pendingRows(),q=($('pq')?.value||'').toUpperCase(),t=$('ptype')?.value||'';
  rows=rows.filter(r=>(!q||`${r.x.linha||''} ${r.x.item||''} ${r.x.cod||''}`.toUpperCase().includes(q))&&(!t||r.reasons.includes(t)));
  let csv=[['Linha','Item','Código','Estoque','Pendência','Atualização'].join(';'),...rows.map(r=>[r.x.linha,r.x.item,r.x.cod,r.x.est,r.reasons.join(' + '),r.x.atual].map(escCsv).join(';'))].join('\n');
  let a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));a.download='PCP_CTEC_Pendencias.csv';a.click();
}
function svgStockChart(x){
  let allPts=(x.hist||[]).map(h=>({label:h.data||'',rel:h.rel||'',v:N(h.estoque)})).filter(p=>p.v!==null);
  if(!allPts.length&&N(x.est)!==null)allPts=[{label:x.atual||'Atual',rel:'Saldo atual',v:N(x.est)}];
  // Limita estritamente aos ultimos 20 pontos para visualizacao limpa e didatica
  let raw=allPts.slice(-20);
  let kpiBox=$('stockChartKpis');
  if(raw.length<2){
    if(kpiBox)kpiBox.innerHTML='';
    return `<div class=chartempty>${raw.length===1?'Ainda há somente 1 leitura de estoque. O gráfico ficará disponível após novas importações.':'Sem histórico de estoque disponível para este item.'}</div>`;
  }
  let ref=N(x.ref),att=N(x.att);
  let stockVals=raw.map(p=>p.v);
  let minStock=Math.min(...stockVals),maxStock=Math.max(...stockVals);
  let lastVal=raw.at(-1).v,prevVal=raw.length>1?raw.at(-2).v:lastVal,delta=lastVal-prevVal;
  let firstVal=raw[0].v,periodDelta=lastVal-firstVal;
  if(kpiBox){
    let dCls=delta>0?'pos':delta<0?'neg':'neutral';
    let pCls=periodDelta>0?'pos':periodDelta<0?'neg':'neutral';
    kpiBox.innerHTML=`
      <div class="sc-kpi"><span>Pontos exibidos</span><b>${raw.length}${allPts.length>20?` <small>de ${allPts.length}</small>`:''}</b></div>
      <div class="sc-kpi"><span>Menor / Maior (últ. ${raw.length})</span><b>${minStock.toLocaleString('pt-BR')} / ${maxStock.toLocaleString('pt-BR')}</b></div>
      <div class="sc-kpi"><span>Última movimentação</span><b class="${dCls}">${delta>0?'+':''}${delta.toLocaleString('pt-BR')} <small>(${prevVal} → ${lastVal})</small></b></div>
      <div class="sc-kpi"><span>Saldo no período (${raw.length} leit.)</span><b class="${pCls}">${periodDelta>0?'+':''}${periodDelta.toLocaleString('pt-BR')} <small>(${firstVal} → ${lastVal})</small></b></div>
    `;
  }
  let vals=stockVals.concat([ref,att].filter(v=>v!==null&&v>0));
  let min=Math.min(...vals),max=Math.max(...vals);
  if(min>=0)min=0; else min=Math.floor(min*1.15);
  max=Math.ceil(Math.max(max*1.15,min+4));
  const W=820,H=255,L=48,R=22,T=26,B=46;
  const px=i=>L+(W-L-R)*(raw.length===1?0.5:i/(raw.length-1));
  const py=v=>T+(H-T-B)*(max-v)/Math.max(1,max-min);
  let mid=Math.round((max+min)/2);
  let ticks=[max,mid,min];
  let lines=ticks.map(v=>`<line x1="${L}" y1="${py(v).toFixed(1)}" x2="${W-R}" y2="${py(v).toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/><text x="${L-8}" y="${(py(v)+4).toFixed(1)}" text-anchor="end" font-size="11" font-weight="600" fill="#64748b">${v.toLocaleString('pt-BR')}</text>`).join('');
  let threshold=(v,cls,label)=>{
    if(v===null||v===undefined||v===''|| (v===0&&ref===0&&att===0))return '';
    let y=py(v).toFixed(1),col=cls==='att'?'#d97706':'#2563eb',bg=cls==='att'?'#fef3c7':'#dbeafe',fg=cls==='att'?'#92400e':'#1e40af';
    return `<line x1="${L}" y1="${y}" x2="${W-R}" y2="${y}" stroke="${col}" stroke-width="1.5" stroke-dasharray="6 4"/><rect x="${W-R-78}" y="${(py(v)-17).toFixed(1)}" width="76" height="15" rx="4" fill="${bg}"/><text x="${W-R-40}" y="${(py(v)-6).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="800" fill="${fg}">${label}: ${v}</text>`;
  };
  let path=raw.map((p,i)=>`${i?'L':'M'} ${px(i).toFixed(1)} ${py(p.v).toFixed(1)}`).join(' ');
  let areaPath=`${path} L ${px(raw.length-1).toFixed(1)} ${(H-B).toFixed(1)} L ${px(0).toFixed(1)} ${(H-B).toFixed(1)} Z`;
  let shortDate=s=>{let m=String(s||'').match(/(\d{2}\/\d{2})/);return m?m[1]:String(s||'').slice(0,10)};
  let stepX=raw.length<=10?1:raw.length<=15?2:3;
  let xLabels=raw.map((p,i)=>{
    if(i!==0&&i!==raw.length-1&&i%stepX!==0)return '';
    return `<text x="${px(i).toFixed(1)}" y="${H-14}" text-anchor="${i===0?'start':i===raw.length-1?'end':'middle'}" font-size="10" font-weight="600" fill="#64748b">${escHtml(shortDate(p.label))}</text>`;
  }).join('');
  let dots=raw.map((p,i)=>{
    let cx=px(i).toFixed(1),cy=py(p.v).toFixed(1);
    let isLast=i===raw.length-1,prev=i>0?raw[i-1].v:null;
    let showVal=i===0||isLast||p.v!==prev||raw.length<=12;
    let dotCol=p.v<0?'#dc2626':(att!==null&&att>0&&p.v<=att)?'#ea580c':(ref!==null&&ref>0&&p.v<ref)?'#ca8a04':'#16a34a';
    if(ref===0&&att===0)dotCol='#2563eb';
    let valLbl=showVal?`<text x="${cx}" y="${(py(p.v)-9).toFixed(1)}" text-anchor="middle" font-size="${isLast?'11':'10'}" font-weight="800" fill="${isLast?'#0f172a':'#334155'}">${p.v}</text>`:'';
    return `${valLbl}<circle cx="${cx}" cy="${cy}" r="${isLast?5.5:4}" fill="${dotCol}" stroke="#ffffff" stroke-width="1.8"><title>${escHtml(p.label)}${p.rel?' ('+escHtml(p.rel)+')':''} • Estoque: ${p.v}</title></circle>`;
  }).join('');
  return `<svg class=stockchart viewBox="0 0 ${W} ${H}" role=img aria-label="Evolução do estoque (últimos 20 pontos)"><defs><linearGradient id="stockAreaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#dc2626" stop-opacity="0.16"/><stop offset="100%" stop-color="#dc2626" stop-opacity="0.01"/></linearGradient></defs><rect width="${W}" height="${H}" fill="white"/>${lines}${threshold(ref,'ref','Ref.')}${threshold(att,'att','Atenção')}<path d="${areaPath}" fill="url(#stockAreaGrad)"/><path d="${path}" fill="none" stroke="#dc2626" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>${dots}${xLabels}</svg>`;
}
