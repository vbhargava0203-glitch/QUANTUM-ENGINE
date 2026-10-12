(() => {
  const { Complex } = QG;
  const M = {
    identity: n => Array.from({length:n},(_,r) => Array.from({length:n},(_,c) => new Complex(r===c ? 1 : 0))),
    multiply: (a,b) => a.map(row => b[0].map((_,c) => row.reduce((s,x,k) => s.add(x.mul(b[k][c])),new Complex()))),
    vectorMultiply: (a,v) => a.map(row => row.reduce((s,x,i) => s.add(x.mul(v[i])),new Complex())),
    dagger: a => a[0].map((_,c) => a.map(row => row[c].conj())),
    isHermitian: (a,eps=1e-10) => a.every((row,r) => row.every((x,c) => Math.abs(x.re-a[c][r].re)<eps && Math.abs(x.im+a[c][r].im)<eps)),
    // Stable closed form for a 2×2 Hermitian matrix. Useful for inspecting qubit Hamiltonians.
    hermitianEigen2: a => {
      if (a.length !== 2 || a[0].length !== 2 || !M.isHermitian(a)) throw new Error('Expected a 2×2 Hermitian matrix');
      const A=a[0][0].re,D=a[1][1].re,b=a[0][1],mean=(A+D)/2,delta=Math.hypot((A-D)/2,b.abs());
      const values=[mean+delta,mean-delta];
      const vectorFor=value=>{const v=[b,new Complex(value-A)];const n=Math.hypot(v[0].abs(),v[1].abs());return n<1e-13?[new Complex(1),new Complex(0)]:v.map(x=>x.scale(1/n));};
      return {values,vectors:values.map(vectorFor)};
    }
  };
  QG.Matrix = M;
})();
