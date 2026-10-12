(() => {
  const { Vector: V, Complex } = QG;
  const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
  // ρ = ½(I + r·σ). A noisy single-qubit state stays inside the Bloch ball.
  class DensityQubit {
    constructor(bloch) { this.r = [...bloch]; const n=V.norm(this.r); if(!Number.isFinite(n)) throw new Error('Invalid Bloch vector'); if(n>1+1e-9) this.r=V.scale(this.r,1/n); }
    matrix() { const [x,y,z]=this.r; return [[new Complex((1+z)/2),new Complex(x/2,-y/2)],[new Complex(x/2,y/2),new Complex((1-z)/2)]]; }
    eigenvalues() { const n=clamp(V.norm(this.r),0,1); return [(1+n)/2,(1-n)/2]; }
    purity() { return (1+V.dot(this.r,this.r))/2; }
    entropyBits() { return this.eigenvalues().reduce((s,p)=>s+(p>1e-14 ? -p*Math.log2(p):0),0); }
    measurementProbability(axis) { const axes={x:[1,0,0],y:[0,1,0],z:[0,0,1]}; return clamp((1+V.dot(this.r,axes[axis]||axes.z))/2,0,1); }
    sample(axis,shots,random=Math.random) { const p=this.measurementProbability(axis),n=Math.max(1,Math.floor(shots)); let plus=0;for(let i=0;i<n;i++)if(random()<p)plus++;return {shots:n,plus,minus:n-plus,probability:p}; }
  }
  QG.DensityQubit=DensityQubit;
})();
