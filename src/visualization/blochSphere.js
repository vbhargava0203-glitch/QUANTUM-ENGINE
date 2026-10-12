(() => {
  const { Vector:V }=QG;
  class BlochSphereView {
    constructor(canvas){
      this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.yaw=-.68; this.pitch=.30; this.zoom=1; this.auto=false; this.drag=null; this.data={};
      const resize=()=>this.resize(); new ResizeObserver(resize).observe(canvas); this.resize();
      canvas.addEventListener('pointerdown',e=>{this.drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
      canvas.addEventListener('pointermove',e=>{if(!this.drag)return;this.yaw+=(e.clientX-this.drag.x)*.009;this.pitch=V.clamp(this.pitch+(e.clientY-this.drag.y)*.009,-1.42,1.42);this.drag={x:e.clientX,y:e.clientY};this.draw();});
      canvas.addEventListener('pointerup',()=>this.drag=null); canvas.addEventListener('pointercancel',()=>this.drag=null);
      canvas.addEventListener('wheel',e=>{e.preventDefault();this.zoom=V.clamp(this.zoom*(e.deltaY>0?.91:1.1),.62,1.45);this.draw();},{passive:false});
      canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')this.yaw-=.1;if(e.key==='ArrowRight')this.yaw+=.1;if(e.key==='ArrowUp')this.pitch-=.1;if(e.key==='ArrowDown')this.pitch+=.1;this.draw();});
    }
    resize(){const r=this.canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.max(1,r.width*d);this.canvas.height=Math.max(1,r.height*d);this.ctx.setTransform(d,0,0,d,0,0);this.w=r.width;this.h=r.height;this.draw();}
    reset(){this.yaw=-.68;this.pitch=.30;this.zoom=1;this.draw();}
    project(p){const cy=Math.cos(this.yaw),sy=Math.sin(this.yaw),cx=Math.cos(this.pitch),sx=Math.sin(this.pitch);const x=cy*p[0]+sy*p[2],z=-sy*p[0]+cy*p[2],y=cx*p[1]-sx*z,depth=sx*p[1]+cx*z;const R=Math.min(this.w,this.h)*.365*this.zoom;return{x:this.w/2+x*R,y:this.h/2-y*R,z:depth};}
    line(a,b,color,width=1,dash=[]){const c=this.ctx,p=this.project(a),q=this.project(b);c.save();c.strokeStyle=color;c.lineWidth=width;c.setLineDash(dash);c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();c.restore();}
    curve(points,color,width=1,dash=[]){if(!points||points.length<2)return;const c=this.ctx;c.save();c.strokeStyle=color;c.lineWidth=width;c.setLineDash(dash);c.beginPath();points.forEach((v,i)=>{const p=this.project(v);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.stroke();c.restore();}
    dot(v,color,r=4,label){const c=this.ctx,p=this.project(v);c.save();c.shadowBlur=12;c.shadowColor=color;c.fillStyle=color;c.beginPath();c.arc(p.x,p.y,r,0,Math.PI*2);c.fill();c.shadowBlur=0;if(label){c.fillStyle='#c9d7e8';c.font='10px IBM Plex Mono, monospace';c.fillText(label,p.x+8,p.y-7)}c.restore();}
    text(v,label,color='#788aa3'){const c=this.ctx,p=this.project(v);c.fillStyle=color;c.font='10px IBM Plex Mono, monospace';c.fillText(label,p.x+4,p.y-4);}
    grid(){const c=this.ctx, circle=[...Array(128)].map((_,i)=>[Math.cos(i*Math.PI*2/127),Math.sin(i*Math.PI*2/127),0]);this.curve(circle,'#42536b',1);
      for(let lat=-60;lat<=60;lat+=30){const t=lat*Math.PI/180,rr=Math.cos(t);this.curve([...Array(80)].map((_,i)=>[rr*Math.cos(i*Math.PI*2/79),rr*Math.sin(i*Math.PI*2/79),Math.sin(t)]),'#26374e',.6);}
      for(let lon=0;lon<180;lon+=30){const p=lon*Math.PI/180;this.curve([...Array(80)].map((_,i)=>{const t=-Math.PI/2+i*Math.PI/79;return [Math.cos(t)*Math.cos(p),Math.cos(t)*Math.sin(p),Math.sin(t)];}),'#26374e',.6);}
      this.line([-1.12,0,0],[1.12,0,0],'#415a79',1);this.line([0,-1.12,0],[0,1.12,0],'#415a79',1);this.line([0,0,-1.12],[0,0,1.12],'#415a79',1);this.text([1.14,0,0],'x');this.text([0,1.14,0],'y');this.text([0,0,1.14],'z');this.text([0,0,1.05],'|0⟩','#99b3ce');this.text([0,0,-1.05],'|1⟩','#99b3ce');
    }
    draw(){if(!this.ctx||!this.w)return;const c=this.ctx;c.clearRect(0,0,this.w,this.h);const glow=c.createRadialGradient(this.w/2,this.h/2,10,this.w/2,this.h/2,Math.min(this.w,this.h)*.55);glow.addColorStop(0,'#2b5e8540');glow.addColorStop(1,'#05101a00');c.fillStyle=glow;c.fillRect(0,0,this.w,this.h);this.grid();const d=this.data;
      if(d.showBaseline!==false)this.curve(d.baseline?.map(x=>x.vector)||d.baseline,'#5d789966',1.2,[4,4]);if(d.showOptimized!==false)this.curve(d.optimized?.map(x=>x.vector)||d.optimized,'#f9c76d',2);
      if(d.initial){this.line([0,0,0],d.initial,'#62d9ef',1.5);this.dot(d.initial,'#62d9ef',4,'INITIAL');}if(d.target){this.line([0,0,0],d.target,'#aa8dff',1.5);this.dot(d.target,'#aa8dff',4,'TARGET');}if(d.current){this.line([0,0,0],d.current,'#81e1b0',2);this.dot(d.current,'#81e1b0',4,'CURRENT');}
    }
    update(data){this.data={...this.data,...data};this.draw();}
    tick(){if(this.auto&&!this.drag){this.yaw+=.002;this.draw();}requestAnimationFrame(()=>this.tick());}
  }
  QG.BlochSphereView=BlochSphereView;
})();
