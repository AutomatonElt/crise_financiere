// on-screen speed of the text per frame: centre x motion (px) + scale motion (x 400 px half-width)
var c; for(var j=1;j<=app.project.numItems;j++){var it=app.project.item(j); if(it.name=="TEXTE - 3 lignes (pro)") c=it;}
var fps=c.frameRate, cx=c.width/2;
var nS=c.layer("MOTION - Shake"), nM=c.layer("MOTION - Momentum"), nE=c.layer("MOTION - Echelle");
var incShake = $.global.__SHAKE_IN !== false;
function linePos(L){ return L.property("ADBE Text Properties").property("ADBE Text Animators").property("Line - Position").property("ADBE Text Animator Properties").property("ADBE Text Position 3D"); }
function active(t){ for(var i=1;i<=3;i++){var L=c.layer("LIGNE "+i); if(t>=L.inPoint && t<L.outPoint) return L;} return null; }
function state(t){ var L=active(t); var ax=0, ls=100; if(L){ ax=linePos(L).valueAtTime(t,false)[0]; ls=L.scale.valueAtTime(t,false)[0]; }
  var se=nE.scale.valueAtTime(t,false)[0]/100, ss=incShake ? nS.scale.valueAtTime(t,false)[0]/100 : 1;
  var x = (incShake ? nS.position.valueAtTime(t,false)[0]-cx : 0) + nM.position.valueAtTime(t,false)[0]-cx + se*ls/100*ax;
  return {x:x, s:se*ss*ls/100}; }
var out=[]; var p=state($.global.__F0/fps);
for(var f=$.global.__F0+1;f<=$.global.__F1;f++){ var q=state(f/fps); var v=Math.abs(q.x-p.x)+Math.abs(q.s-p.s)*400; out.push(f+":"+Math.round(v*100)/100); p=q; }
return out.join(" ");
