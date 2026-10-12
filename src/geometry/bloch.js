(() => {
  const { Vector: V } = QG;
  const B = {
    fromAngles: (theta,phi) => { const t=theta*Math.PI/180,p=phi*Math.PI/180; return [Math.sin(t)*Math.cos(p),Math.sin(t)*Math.sin(p),Math.cos(t)]; },
    toAngles: r => ({ theta:Math.acos(V.clamp(r[2],-1,1))*180/Math.PI, phi:Math.atan2(r[1],r[0])*180/Math.PI }),
    rotate: (r, axis, angle) => { // Rodrigues' formula, exact SO(3) action of a constant qubit Hamiltonian
      const n=V.normalize(axis), c=Math.cos(angle), s=Math.sin(angle);
      return V.add(V.add(V.scale(r,c),V.scale(V.cross(n,r),s)),V.scale(n,V.dot(n,r)*(1-c)));
    },
    geodesic: (from,to,steps=80) => {
      const d=V.clamp(V.dot(from,to),-1,1), omega=Math.acos(d); if(omega<1e-9) return Array.from({length:steps+1},()=>[...from]);
      const sin=Math.sin(omega); return Array.from({length:steps+1},(_,i)=>V.normalize(V.add(V.scale(from,Math.sin((1-i/steps)*omega)/sin),V.scale(to,Math.sin((i/steps)*omega)/sin))));
    }
  }; QG.Bloch=B;
})();
