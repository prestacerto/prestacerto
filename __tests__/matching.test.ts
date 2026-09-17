import test from 'node:test';
import assert from 'node:assert/strict';
import {skillCompatibility,rankProjectMatches} from '../src/lib/matching/skills';
test('aliases match exactly without treating Java as JavaScript',()=>{
 assert.equal(skillCompatibility(['Java'],['JavaScript']).score,0);
 assert.equal(skillCompatibility(['Node.js','React'],['nodejs','React.js']).score,100);
});
test('duplicate skills do not inflate the score and absent requirements have no score',()=>{
 assert.equal(skillCompatibility(['React','React','SQL'],['React']).score,50);
 assert.equal(skillCompatibility([],['React']).score,null);
});
test('recommendations exclude prior proposals and are limited to five',()=>{
 const projects=Array.from({length:10},(_,i)=>({id:String(i),skills:['React'],created_at:'2026-09-08'}));
 const ranked=rankProjectMatches(projects,['React'],['0']);
 assert.equal(ranked.length,5);assert.equal(ranked.some(m=>m.project.id==='0'),false);
});
