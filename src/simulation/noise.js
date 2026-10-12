(() => {
  const { Vector:V }=QG;
  // p is the total channel strength over the complete simulated interval.
  function applyNoise(r,model,p) {
    const q=V.clamp(p,0,1); if(model==='none'||q===0)return [...r];
    if(model==='bit-flip') return [r[0],(1-2*q)*r[1],(1-2*q)*r[2]];
    if(model==='phase-flip') return [(1-2*q)*r[0],(1-2*q)*r[1],r[2]];
    if(model==='depolarizing') { const f=Math.max(0,1-4*q/3);return V.scale(r,f); }
    if(model==='dephasing') { const f=Math.exp(-q);return [f*r[0],f*r[1],r[2]]; }
    return [...r];
  }
  QG.applyNoise=applyNoise;
})();
