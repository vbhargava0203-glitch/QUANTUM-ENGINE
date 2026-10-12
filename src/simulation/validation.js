(() => {
  const { Vector:V,Matrix:M }=QG;
  QG.validateSimulation=(initial,params)=>{
    const n=V.norm(initial),segments=Array.isArray(params.segments)&&params.segments.length?params.segments:[params],total=segments.reduce((sum,s)=>sum+Number(s.duration),0),first=segments[0],issues=[];
    if(Math.abs(n-1)>1e-8)issues.push('Input Bloch vector is not normalized.');if(!segments.every(s=>Number.isFinite(s.amplitude)&&Number.isFinite(s.frequency)&&Number.isFinite(s.phase)&&Number.isFinite(s.duration)&&s.duration>0))issues.push('Control parameters are invalid.');if(total>50)issues.push('Long duration may reduce display resolution.');
    return { ok:issues.length===0, issues, normalizationError:Math.abs(n-1), hermitian:M.isHermitian([[new QG.Complex(first.frequency/2),new QG.Complex(first.amplitude*Math.cos(first.phase)/2,-first.amplitude*Math.sin(first.phase)/2)],[new QG.Complex(first.amplitude*Math.cos(first.phase)/2,first.amplitude*Math.sin(first.phase)/2),new QG.Complex(-first.frequency/2)]]) };
  };
})();
