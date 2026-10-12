(() => {
  const { Complex } = QG;
  const V = {
    add: (a,b) => a.map((x,i) => x + b[i]),
    sub: (a,b) => a.map((x,i) => x - b[i]),
    scale: (a,s) => a.map(x => x * s),
    dot: (a,b) => a.reduce((s,x,i) => s + x * b[i], 0),
    cross: (a,b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]],
    norm: a => Math.hypot(...a),
    normalize: a => { const n = Math.hypot(...a); return n < 1e-14 ? [0,0,0] : a.map(x => x/n); },
    clamp: (x,min,max) => Math.max(min,Math.min(max,x)),
    lerp: (a,b,t) => a.map((x,i) => x + (b[i]-x)*t),
    complexInner: (a,b) => a.reduce((s,x,i) => s.add(x.conj().mul(b[i])), new Complex()),
    complexNorm: a => Math.sqrt(a.reduce((s,x) => s + x.abs2(),0))
  };
  QG.Vector = V;
})();
