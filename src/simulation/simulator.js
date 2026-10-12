(() => {
  const { Vector:V,Bloch,Distance,applyNoise,validateSimulation,DensityQubit }=QG;
  function fieldFromParams(p){ return [p.amplitude*Math.cos(p.phase),p.amplitude*Math.sin(p.phase),p.frequency]; }
  function programFromParams(p){
    const segments=Array.isArray(p.segments)&&p.segments.length?p.segments:[p];
    return segments.map(segment=>({amplitude:Number(segment.amplitude),frequency:Number(segment.frequency),phase:Number(segment.phase),duration:Number(segment.duration)}));
  }
  function programDuration(p){return programFromParams(p).reduce((sum,segment)=>sum+segment.duration,0);}
  function controlCost(p){return programFromParams(p).reduce((sum,segment)=>sum+(segment.amplitude**2+segment.frequency**2)*segment.duration,0);}
  function evolveProgram(initial,program,time){
    let r=[...initial],remaining=time;for(const segment of program){const dt=Math.min(Math.max(remaining,0),segment.duration);if(dt>0){const h=fieldFromParams(segment),m=V.norm(h);if(m>1e-13)r=Bloch.rotate(r,h,m*dt);}remaining-=segment.duration;if(remaining<=0)break;}return r;
  }
  function activeSegment(program,time){let elapsed=0;for(const segment of program){elapsed+=segment.duration;if(time<=elapsed+1e-12)return segment;}return program[program.length-1];}
  function score(result,p,objective){
    const infidelity=1-result.finalFidelity,energy=controlCost(p),duration=programDuration(p),robustness=1-result.robustness;
    if(objective==='time')return infidelity*100+duration*.08+energy*.002;
    if(objective==='energy')return infidelity*100+energy*.035+duration*.002;
    if(objective==='robustness')return infidelity*100+robustness*8+energy*.004;
    if(objective==='balanced')return infidelity*100+energy*.01+duration*.05;
    return infidelity*100+energy*.003;
  }
  function simulate(config){
    const p=config.params,initial=[...config.initial],target=[...config.target],steps=Math.max(20,Math.min(500,Math.round(config.steps||160))),program=programFromParams(p),duration=programDuration(p),check=validateSimulation(initial,p);
    if(!check.ok)return {valid:false,validation:check,points:[],final:[...initial],finalFidelity:0,cost:NaN,robustness:0,purity:NaN,entropy:NaN};
    const raw=[];for(let i=0;i<=steps;i++){const t=duration*i/steps,pure=evolveProgram(initial,program,t),noisy=applyNoise(pure,config.noiseModel||'none',(config.noiseStrength||0)*i/steps),active=activeSegment(program,t);raw.push({t,vector:noisy,pure,fidelity:Distance.targetFidelity(noisy,target),distance:Distance.endpointDistance(noisy,target),amplitude:active.amplitude,frequency:active.frequency,phase:active.phase});}
    const final=raw.at(-1).vector,finalFidelity=Distance.targetFidelity(final,target),density=new DensityQubit(final);
    // Deterministic sensitivity probe (±3% transverse field, ±0.03 longitudinal field), not a hardware-noise average.
    const perturb=sign=>program.map(segment=>({...segment,amplitude:Math.max(0,segment.amplitude*(1+sign*.03)),frequency:segment.frequency+sign*.03}));
    const perturbed=[-1,1].map(sign=>{const clean=evolveProgram(initial,perturb(sign),duration);return Distance.targetFidelity(applyNoise(clean,config.noiseModel||'none',config.noiseStrength||0),target);});
    const robustness=Math.max(0,Math.min(1,(perturbed[0]+perturbed[1])/2)),firstField=fieldFromParams(program[0]),result={valid:true,validation:check,initial,target,params:{...p},program,programDuration:duration,field:firstField,fieldMagnitude:V.norm(firstField),points:raw,final,finalFidelity,cost:controlCost(p),robustness,purity:density.purity(),entropy:density.entropyBits(),density};result.objectiveCost=score(result,p,config.objective||'fidelity');return result;
  }
  function geometrySeed(initial,target,objective){
    let axis=V.cross(initial,target),angle=Math.acos(V.clamp(V.dot(initial,target),-1,1));if(V.norm(axis)<1e-9){axis=Math.abs(initial[2])<.9?V.normalize(V.cross(initial,[0,0,1])):[1,0,0];if(V.dot(initial,target)>0)angle=0;}axis=V.normalize(axis);let duration;
    if(objective==='time')duration=Math.max(.35,angle/6.5);else if(objective==='energy')duration=Math.min(8,Math.max(1.5,angle*2.2));else if(objective==='robustness')duration=Math.min(6,Math.max(1.2,angle*1.15));else duration=Math.max(.6,angle/2.2);const magnitude=duration>0?angle/duration:0,h=V.scale(axis,magnitude);return {amplitude:Math.hypot(h[0],h[1]),frequency:h[2],phase:Math.atan2(h[1],h[0]),duration};
  }
  QG.LocalSimulator={simulate,fieldFromParams,programFromParams,programDuration,controlCost,score,geometrySeed,evolveProgram};QG.QuantumBackend={LocalSimulator:QG.LocalSimulator};
})();
