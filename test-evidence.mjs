import assert from 'node:assert/strict';import fs from 'node:fs';import {resolveClaims,validateRecords} from './dist/evidence.mjs';
const kb=JSON.parse(fs.readFileSync('dist/knowledge_base.json'));
const claim=s=>({source:'Operator observation',state:s,note:'test',at:'2026-10-23T00:00:00Z'});
assert.equal(resolveClaims([]),'unknown');assert.equal(resolveClaims([claim('yes')]),'yes');assert.equal(resolveClaims([claim('no')]),'no');assert.equal(resolveClaims([claim('yes'),claim('no')]),'conflict');
validateRecords({protective_stop:[claim('yes')]},kb.symptoms);
assert.throws(()=>validateRecords({invalid:[claim('yes')]},kb.symptoms));assert.throws(()=>validateRecords({protective_stop:[{...claim('yes'),source:'untrusted'}]},kb.symptoms));
console.log('7 evidence-source tests passed');
