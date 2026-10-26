import {validateRecords} from './evidence.mjs';

export function validateKB(kb, base) {
 if(!kb||!Array.isArray(kb.faults)||kb.faults.length!==base.faults.length||JSON.stringify(kb.symptoms)!==JSON.stringify(base.symptoms))throw Error('Invalid knowledge base structure.');
 const ids=new Set();
 for(const f of kb.faults){if(!base.faults.some(x=>x.id===f.id)||ids.has(f.id))throw Error('Unknown or duplicate rule ID.');ids.add(f.id);
 for(const key of ['name','component','cause','action','provenance'])if(typeof f[key]!=='string'||!f[key].trim()||f[key].length>3000)throw Error('Missing or invalid rule text.');
 if(!['Critical','High','Medium'].includes(f.severity)||!['Low','Medium','High'].includes(f.cost)||!['Short','Medium','Long'].includes(f.downtime))throw Error('Invalid priority values.');
 if(!Array.isArray(f.conditions)||!f.conditions.length||new Set(f.conditions).size!==f.conditions.length||f.conditions.some(k=>!(k in base.symptoms)))throw Error('Select at least one unique known condition.');}
 return kb;
}
export function validateEvidence(e,base){if(!e||Array.isArray(e)||typeof e!=='object')throw Error('Invalid evidence');for(const [k,v] of Object.entries(e))if(!(k in base.symptoms)||!['unknown','yes','no','conflict'].includes(v))throw Error('Invalid evidence state');return e;}
export function validateWorkspace(w,base){
 if(!w||w.format!=='arm-insight-v2'||!Array.isArray(w.cases)||!Array.isArray(w.tickets)||w.cases.length>500||w.tickets.length>1000)throw Error('Not a valid ARM / INSIGHT backup.');
 validateKB(w.kb,base);const ids=new Set();
 for(const c of w.cases){if(typeof c.id!=='string'||ids.has(c.id)||typeof c.name!=='string'||typeof c.asset!=='string'||typeof c.notes!=='string'||!Number.isFinite(Date.parse(c.created))||!['Safety first','Lower cost','Less downtime'].includes(c.policy))throw Error('Invalid saved investigation.');ids.add(c.id);validateKB(c.kb,base);validateEvidence(c.evidence,base);validateRecords(c.records||{},base.symptoms);}
 const tickets=new Set();for(const t of w.tickets){if(typeof t.id!=='string'||tickets.has(t.id)||!['Open','In progress','Completed'].includes(t.status)||!['Critical','High','Medium'].includes(t.severity)||['name','action','asset'].some(k=>typeof t[k]!=='string'))throw Error('Invalid maintenance task.');tickets.add(t.id);}
 if(w.draft){validateEvidence(w.draft.evidence,base);validateRecords(w.draft.records||{},base.symptoms);if(['name','asset','notes'].some(k=>typeof w.draft[k]!=='string')||!['Safety first','Lower cost','Less downtime'].includes(w.draft.policy))throw Error('Invalid draft.');}
 return w;
}
