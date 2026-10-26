import assert from 'node:assert/strict';import fs from 'node:fs';import {validateKB,validateWorkspace} from './dist/state.mjs';
const base=JSON.parse(fs.readFileSync('dist/knowledge_base.json'));
const good={format:'arm-insight-v2',kb:base,cases:[],tickets:[],draft:{name:'Test',asset:'ARM-1',notes:'',evidence:{protective_stop:'yes'},policy:'Safety first'}};
assert.equal(validateWorkspace(good,base),good);
for(const change of [k=>k.faults[0].conditions=[],k=>k.faults[0].conditions=['bad'],k=>k.faults[0].severity='invalid',k=>k.faults[0].action='',k=>k.faults.push(k.faults[0])]){const k=structuredClone(base);change(k);assert.throws(()=>validateKB(k,base));}
const b=structuredClone(good);b.draft.evidence.smoke='maybe';assert.throws(()=>validateWorkspace(b,base));
const c=structuredClone(good);c.cases=[{id:'1',name:'c',asset:'a',notes:'',created:new Date().toISOString(),policy:'Safety first',kb:base,evidence:{}}];validateWorkspace(c,base);c.cases.push(c.cases[0]);assert.throws(()=>validateWorkspace(c,base));
console.log('9 workspace and rule validation checks passed.');
