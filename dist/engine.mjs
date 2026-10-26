export function diagnose(kb, evidence, policy='Safety first') {
 const states=['unknown','yes','no','conflict'];
 for(const [k,v] of Object.entries(evidence)) if(!(k in kb.symptoms)||!states.includes(v)) throw Error('Invalid observation');
 const trace=[];
 const facts=Object.fromEntries(Object.keys(kb.symptoms).map(k=>[k,evidence[k]||'unknown']));
 for(const [k,v] of Object.entries(facts)) if(v==='yes')trace.push(`OBS: ${k}=yes → observed:${k}`);
 const results=kb.faults.map(f=>{
  const groups=Object.fromEntries(states.map(s=>[s,f.conditions.filter(k=>facts[k]===s)]));
  const status=groups.no.length?'Contradicted':groups.conflict.length?'Conflicted':groups.yes.length===f.conditions.length?'Supported':groups.yes.length?'Possible':'Unassessed';
  if(status==='Supported')trace.push(`RULE ${f.id}: ${f.conditions.join(' AND ')} → fault:${f.id}`);
  return {...f,groups,status,coverage:Math.round(groups.yes.length/f.conditions.length*100)};
 });
 for(const f of results)if(f.status==='Supported')trace.push(`ACTION ${f.id}: ${f.action}`);
 const sr={Supported:0,Possible:1,Conflicted:2,Contradicted:3,Unassessed:4}, sev={Critical:0,High:1,Medium:2}, cost={Low:0,Medium:1,High:2}, time={Short:0,Medium:1,Long:2};
 results.sort((a,b)=>sr[a.status]-sr[b.status]||sev[a.severity]-sev[b.severity]||(policy==='Lower cost'?cost[a.cost]-cost[b.cost]:policy==='Less downtime'?time[a.downtime]-time[b.downtime]:0)||b.coverage-a.coverage||a.id.localeCompare(b.id));
 return {facts,results,trace,policy,alerts:['smoke','unexpected_motion','joint_droop','grip_loss'].filter(k=>['yes','conflict'].includes(facts[k])),conflicts:Object.keys(facts).filter(k=>facts[k]==='conflict'),questions:[...new Set(results.filter(f=>['Possible','Conflicted'].includes(f.status)).flatMap(f=>[...f.groups.unknown,...f.groups.conflict]))]};
}
