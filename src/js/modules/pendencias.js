/**
 * Modulo de Pendencias Cadastrais e Grafico SVG de Historico de Estoque
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
  let raw=(x.hist||[]).map(h=>({label:h.data||'',v:N(h.estoque)})).filter(p=>p.v!==null);
  if(!raw.length&&N(x.est)!==null)raw=[{label:x.atual||'Atual',v:N(x.est)}];
  if(raw.length<2)return `<div class=chartempty>${raw.length===1?'Ainda há somente 1 leitura de estoque. O gráfico ficará disponível após novas importações.':'Sem histórico de estoque disponível para este item.'}</div>`;
  let ref=N(x.ref),att=N(x.att),vals=raw.map(p=>p.v).concat([ref,att].filter(v=>v!==null));
  let min=Math.min(...vals),max=Math.max(...vals);if(min===max){min-=1;max+=1}
  let pad=(max-min)*.12||1;min-=pad;max+=pad;
  const W=760,H=245,L=58,R=18,T=18,B=42,px=i=>L+(W-L-R)*(raw.length===1?0.5:i/(raw.length-1)),py=v=>T+(H-T-B)*(max-v)/(max-min);
  let path=raw.map((p,i)=>`${i?'L':'M'} ${px(i).toFixed(1)} ${py(p.v).toFixed(1)}`).join(' ');
  let ticks=[max,(max+min)/2,min];
  let lines=ticks.map(v=>`<line x1="${L}" y1="${py(v)}" x2="${W-R}" y2="${py(v)}" stroke="#e5e7eb"/><text x="${L-8}" y="${py(v)+4}" text-anchor="end" font-size="11" fill="#6b7280">${Math.round(v*100)/100}</text>`).join('');
  let threshold=(v,cls,label)=>v===null?'':`<line x1="${L}" y1="${py(v)}" x2="${W-R}" y2="${py(v)}" stroke="${cls==='att'?'#d97706':'#6b7280'}" stroke-dasharray="6 5"/><text x="${W-R-2}" y="${py(v)-5}" text-anchor="end" font-size="10" fill="${cls==='att'?'#b45309':'#4b5563'}">${label}: ${v}</text>`;
  let dots=raw.map((p,i)=>`<circle cx="${px(i)}" cy="${py(p.v)}" r="4" fill="#b91c1c"><title>${p.label} • Estoque ${p.v}</title></circle>`).join('');
  let first=raw[0].label||'',last=raw.at(-1).label||'';
  return `<svg class=stockchart viewBox="0 0 ${W} ${H}" role=img aria-label="Evolução do estoque"><rect width="${W}" height="${H}" fill="white"/>${lines}${threshold(ref,'ref','Ref.')}${threshold(att,'att','Atenção')}<path d="${path}" fill="none" stroke="#b91c1c" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${dots}<text x="${L}" y="${H-12}" font-size="11" fill="#6b7280">${first}</text><text x="${W-R}" y="${H-12}" text-anchor="end" font-size="11" fill="#6b7280">${last}</text></svg>`;
}
