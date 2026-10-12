(() => {
  const { Complex, Vector: V } = QG;
  const deg = x => x * Math.PI / 180;
  class QubitState {
    constructor(alpha, beta) { this.alpha = alpha; this.beta = beta; this.normalize(); }
    normalize() { const n = Math.hypot(this.alpha.abs(),this.beta.abs()); if (!Number.isFinite(n) || n < 1e-14) throw new Error('Invalid state vector'); this.alpha=this.alpha.scale(1/n); this.beta=this.beta.scale(1/n); return this; }
    bloch() { const coherence = this.alpha.conj().mul(this.beta); return [2*coherence.re,2*coherence.im,this.alpha.abs2()-this.beta.abs2()]; }
    probabilities() { return [this.alpha.abs2(),this.beta.abs2()]; }
    vector() { return [this.alpha,this.beta]; }
    clone() { return new QubitState(this.alpha,this.beta); }
    static fromAngles(thetaDegrees, phiDegrees) { const theta=deg(thetaDegrees), phi=deg(phiDegrees); return new QubitState(new Complex(Math.cos(theta/2)),Complex.polar(Math.sin(theta/2),phi)); }
    static fromBloch(r) { const z=V.clamp(r[2],-1,1); const theta=Math.acos(z); const phi=Math.atan2(r[1],r[0]); return QubitState.fromAngles(theta*180/Math.PI,phi*180/Math.PI); }
    static preset(name) { const map={zero:[0,0],one:[180,0],plus:[90,0],minus:[90,180]}; return QubitState.fromAngles(...(map[name]||map.zero)); }
  }
  QG.QubitState=QubitState; QG.toRadians=deg;
})();
