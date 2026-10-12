(() => {
  const { Vector: V }=QG;
  const D={
    pureFidelity:(a,b)=>Math.max(0,Math.min(1,(1+V.dot(a,b))/2)),
    pureDistance:(a,b)=>Math.acos(Math.sqrt(Math.max(0,Math.min(1,(1+V.dot(a,b))/2)))),
    blochAngle:(a,b)=>Math.acos(V.clamp(V.dot(V.normalize(a),V.normalize(b)),-1,1)),
    targetFidelity:(mixed,targetPure)=>Math.max(0,Math.min(1,(1+V.dot(mixed,targetPure))/2)),
    endpointDistance:(mixed,targetPure)=>Math.acos(Math.sqrt(Math.max(0,Math.min(1,(1+V.dot(mixed,targetPure))/2))))
  };QG.Distance=D;
})();
