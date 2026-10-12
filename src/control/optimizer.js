(() => {
  const { LocalSimulator,Vector:V }=QG;
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  // A transparent coordinate search: evaluates a fixed neighborhood around one coordinate at a time.
  function optimize(config,onProgress){
    const seed=LocalSimulator.geometrySeed(config.initial,config.target,config.objective);
    let best={...seed}, bestResult=LocalSimulator.simulate({...config,params:best}), bestCost=bestResult.objectiveCost;
    const history=[bestCost]; const fields=[['amplitude',.5,0,8],['frequency',.5,-8,8],['phase',Math.PI/10,-Math.PI,Math.PI],['duration',.25,.1,12]];
    for(let iteration=1;iteration<=40;iteration++){
      const scale=Math.pow(.86,Math.floor(iteration/8));
      for(const [key,step,min,max] of fields){
        const candidates=[best[key]-step*scale,best[key]+step*scale].map(value=>({...best,[key]:clamp(value,min,max)}));
        for(const candidate of candidates){ const result=LocalSimulator.simulate({...config,params:candidate}); if(result.objectiveCost<bestCost){best=candidate;bestResult=result;bestCost=result.objectiveCost;} }
      }
      history.push(bestCost); if(onProgress)onProgress({iteration,bestCost,currentCost:bestCost,best:{...best},result:bestResult,history:[...history]});
    }
    return {params:best,result:bestResult,history,seed};
  }
  QG.optimizeControl=optimize;
})();
