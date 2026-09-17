const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const flush = () => new Promise(resolve => setImmediate(resolve));
const nodes = node => !node || typeof node !== 'object' ? [] : [node, ...[node.props?.children].flat(Infinity).flatMap(nodes)];
const text = node => typeof node === 'string' || typeof node === 'number' ? String(node) : !node || typeof node !== 'object' ? '' : [node.props?.children].flat(Infinity).map(text).join('');
const id = '00000000-0000-4000-8000-000000000019';
function mount(journey, response, handoffStored = true) {
  const slots=[],effects=[],cleanups=[],requests=[],events=[],handoffs=[],timers=new Map(),cache={};
  let cursor=0,timerId=0,unmounted=false,writesAfterUnmount=0;
  const dependencies={
    'react/jsx-runtime':{jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})},
    'next/link':{default:'a'},
    '@/lib/landing-tracking':{trackLandingEvent:(...args)=>events.push(args)},
    '@/lib/landing-handoff':{saveLandingHandoff:(...args)=>{handoffs.push(args);return handoffStored;}},
    react:{
      useState(initial){const i=cursor++;if(!(i in slots))slots[i]=initial;return [slots[i],value=>{if(unmounted)writesAfterUnmount++;slots[i]=typeof value==='function'?value(slots[i]):value;}];},
      useRef(initial){const i=cursor++;if(!(i in slots))slots[i]={current:initial};return slots[i];},
      useEffect(callback,deps){const i=cursor++;if(!slots[i]||deps.some((dep,j)=>slots[i][j]!==dep))effects.push(callback);slots[i]=deps;},
    },
  };
  function load(name){
    if(dependencies[name])return dependencies[name];if(!name.startsWith('@/'))return require(name);if(cache[name])return cache[name];
    const module={exports:{}};const file='src/'+name.slice(2)+(name.includes('components/')?'.tsx':'.ts');
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText,{
      module,exports:module.exports,require:load,URL,AbortController,crypto:{randomUUID:()=>id},console,
      setTimeout:(callback,ms)=>{const key=++timerId;timers.set(key,{callback,ms});return key;},clearTimeout:key=>timers.delete(key),
      fetch:(url,init)=>{requests.push({url,init});return response(url,init);},
    });return cache[name]=module.exports;
  }
  const Form=load('@/components/landing/landing-lead-form').LandingLeadForm;
  const app={requests,events,handoffs,timers,openedDetails:false,focused:null,
    render(){cursor=0;const tree=nodes(Form({journey,categories:[{id:1,name:'Design',slug:'design'}]}));
      const focusTarget=node=>node?{focus:()=>{app.focused=node.props.id||node.props.role;},closest:()=>['categoryId','deadline','portfolio','experience'].some(field=>node.props.id?.endsWith('-'+field))?{setAttribute:()=>{app.openedDetails=true;}}:null}:null;
      const form=tree.find(node=>node.type==='form');if(form?.props.ref)form.props.ref.current={querySelector:selector=>focusTarget(selector.includes('aria-invalid')?tree.find(node=>node.props['aria-invalid']===true):selector.includes('data-request-error')?tree.find(node=>'data-request-error' in node.props):tree.find(node=>['input','select','textarea','button'].includes(node.type)))};
      const success=tree.find(node=>node.props.role==='status');if(success?.props.ref)success.props.ref.current=focusTarget(success);
      for(const effect of effects.splice(0)){const cleanup=effect();if(cleanup)cleanups.push(cleanup);}return tree;},
    field(field,value){const element=app.render().find(node=>node.props.id===`${journey}-lead-${field}`);assert.ok(element,field);element.props.onChange({target:{value,checked:value}});},
    async submit(){return app.render().find(node=>node.type==='form').props.onSubmit({preventDefault(){}});},
    expire(){for(const timer of [...timers.values()])timer.callback();},
    unmount(){unmounted=true;for(const cleanup of cleanups)cleanup();},
    writesAfterUnmount:()=>writesAfterUnmount,
  };app.render();return app;
}
async function contact(app){app.field('name','Maria Silva');app.field('email','maria@example.com');await app.submit();}
async function prepare(app,journey='client'){
  await contact(app);app.field('service','Criar site');app.render().find(node=>node.type==='button'&&node.props['aria-pressed']!==undefined).props.onClick();
  if(journey==='client')app.field('description','Site com cinco páginas para a minha empresa.');app.field('privacyAccepted',true);
}
test('essential fields stay visible, optional details remain available, and remote shortcut keeps location collection',async()=>{
  for(const journey of ['client','provider']){
    const app=mount(journey,()=>Response.json({success:true}));await prepare(app,journey);const tree=app.render();
    const details=tree.find(node=>node.type==='details');assert.ok(details);assert.equal(details.props.open,undefined);
    const optional=nodes(details);assert.ok(optional.some(node=>node.props.id===`${journey}-lead-categoryId`));
    assert.ok(!optional.some(node=>node.props.required));assert.equal(tree.find(node=>node.props.id===`${journey}-lead-location`).props.value,'Remoto');
    app.field('categoryId','1');if(journey==='client')app.field('deadline','Em duas semanas');else{app.field('portfolio','https://example.com/work');app.field('experience','Sites e conteúdo.');}
    await app.submit();const data=JSON.parse(app.requests[0].init.body);assert.equal(data.categoryId,1);assert.equal(data.location,'Remoto');assert.equal(data.privacyAccepted,true);
    if(journey==='client')assert.equal(data.deadline,'Em duas semanas');else assert.equal(data.portfolio,'https://example.com/work');
    assert.equal(app.handoffs.length,1);assert.equal(app.handoffs[0][1],'design');assert.equal(app.events.filter(event=>event[0]==='presta_certo_lead_success').length,1);
    assert.ok(app.render().some(node=>node.type==='a'&&node.props.href.includes(journey==='client'?'role=client':'role=freelancer')));
  }
});
test('consent remains required and invalid optional fields open before focus instead of hiding the error',async()=>{
  const app=mount('provider',()=>Response.json({success:true}));await prepare(app,'provider');app.field('privacyAccepted',false);await app.submit();assert.equal(app.requests.length,0);assert.equal(app.render().find(node=>node.props.id==='provider-lead-privacyAccepted').props['aria-invalid'],true);
  app.field('privacyAccepted',true);app.field('portfolio','not a URL');await app.submit();app.render();assert.equal(app.requests.length,0);assert.equal(app.openedDetails,true);assert.equal(app.focused,'provider-lead-portfolio');
});
test('draft and UUID survive a failed send; malformed success never triggers handoff or conversion',async()=>{
  for(const response of [()=>Response.json({success:'true'}),()=>Response.json({success:1}),()=>Response.json(null),()=>new Response('<html>error</html>'),()=>Response.json({error:'Tente novamente.'},{status:503}),()=>Promise.reject(new Error('offline'))]){
    const app=mount('client',response);await prepare(app);await app.submit();const tree=app.render();assert.ok(tree.some(node=>node.props.role==='alert'));
    assert.equal(tree.find(node=>node.props.id==='client-lead-service').props.value,'Criar site');assert.equal(tree.find(node=>node.type==='fieldset').props.disabled,false);
    assert.equal(app.handoffs.length,0);assert.equal(app.events.filter(event=>event[0]==='presta_certo_lead_success').length,0);
    await app.submit();assert.equal(JSON.parse(app.requests[0].init.body).id,JSON.parse(app.requests[1].init.body).id);
  }
});
test('back navigation preserves contact and project fields without submitting',async()=>{
  const app=mount('client',()=>Response.json({success:true}));await prepare(app);
  app.render().find(node=>node.type==='button'&&text(node).includes('Voltar aos dados')).props.onClick();
  assert.equal(app.render().find(node=>node.props.id==='client-lead-email').props.value,'maria@example.com');await app.submit();
  assert.equal(app.render().find(node=>node.props.id==='client-lead-service').props.value,'Criar site');assert.equal(app.requests.length,0);
});
const pending=(_,init)=>new Promise((resolve,reject)=>init.signal.addEventListener('abort',()=>reject(new Error('aborted')),{once:true}));
test('duplicate submission is blocked; timeout recovers and leaving the page cancels pending work safely',async()=>{
  const app=mount('client',pending);await prepare(app);app.submit();app.submit();assert.equal(app.requests.length,1);assert.equal([...app.timers.values()][0].ms,25000);
  app.expire();await flush();assert.equal(app.render().find(node=>node.type==='fieldset').props.disabled,false);assert.ok(app.render().some(node=>node.props.role==='alert'));
  const removed=mount('provider',pending);await prepare(removed,'provider');removed.submit();removed.unmount();await flush();assert.equal(removed.requests[0].init.signal.aborted,true);assert.equal(removed.writesAfterUnmount(),0);assert.equal(removed.handoffs.length,0);
});
