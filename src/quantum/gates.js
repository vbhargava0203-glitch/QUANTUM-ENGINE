(() => {
  const { Complex, Matrix:M, QubitState } = QG; const c=(r,i=0)=>new Complex(r,i); const s=1/Math.sqrt(2);
  const gates={ X:[[c(0),c(1)],[c(1),c(0)]], Y:[[c(0),c(0,-1)],[c(0,1),c(0)]], Z:[[c(1),c(0)],[c(0),c(0,-1)]], H:[[c(s),c(s)],[c(s),c(-s)]] };
  QG.Gates=gates; QG.applyGate=(state,gate) => { const [a,b]=M.vectorMultiply(gates[gate],state.vector()); return new QubitState(a,b); };
})();
