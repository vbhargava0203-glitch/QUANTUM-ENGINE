(() => {
  window.QG = window.QG || {};
  class Complex {
    constructor(re = 0, im = 0) { this.re = Number(re); this.im = Number(im); }
    add(z) { return new Complex(this.re + z.re, this.im + z.im); }
    sub(z) { return new Complex(this.re - z.re, this.im - z.im); }
    mul(z) { return new Complex(this.re * z.re - this.im * z.im, this.re * z.im + this.im * z.re); }
    scale(x) { return new Complex(this.re * x, this.im * x); }
    div(z) { const d = z.re * z.re + z.im * z.im; if (d < 1e-16) throw new Error('Complex division by zero'); return new Complex((this.re * z.re + this.im * z.im) / d, (this.im * z.re - this.re * z.im) / d); }
    conj() { return new Complex(this.re, -this.im); }
    abs2() { return this.re * this.re + this.im * this.im; }
    abs() { return Math.hypot(this.re, this.im); }
    phase() { return Math.atan2(this.im, this.re); }
    toString(digits = 4) { const r = Math.abs(this.re) < 1e-12 ? 0 : this.re; const i = Math.abs(this.im) < 1e-12 ? 0 : this.im; return `${r.toFixed(digits)} ${i < 0 ? '−' : '+'} ${Math.abs(i).toFixed(digits)}i`; }
    static polar(r, phase) { return new Complex(r * Math.cos(phase), r * Math.sin(phase)); }
    static get I() { return new Complex(0, 1); }
  }
  QG.Complex = Complex;
})();
