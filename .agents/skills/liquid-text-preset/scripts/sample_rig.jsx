// Sample every rig channel of the liquid text preset, pre-expression, every 0.01 s, to a TSV.
// Paste into the bridge's execute-script (or run headless). Edit OUT first.
// Then:  python compare_samples.py <out_dir>   (needs keys.json from design_keys.py in the same dir)
var OUT = Folder.temp.fsName + "/ae_samples.tsv";
function findComp(n){for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==n)return it;}return null;}
var comp=findComp("créer un texte Comp 2");var TG="ADBE Transform Group";
function P(n,m){return comp.layer(n).property(TG).property(m);}
var txt=comp.layer("créer un texte Comp 1");var td=txt.effect("Turbulent Displace");
var props={"TXT pos X":[P("TXT pos X","ADBE Position_0"),-1004],"TXT pos Y":[P("TXT pos Y","ADBE Position_1"),0],
  "TXT rot":[comp.layer("TXT rot").rotation,0],"TXT scale":[comp.layer("TXT scale").scale,0],
  "WARP 1 centre/X":[P("WARP 1 centre","ADBE Position_0"),0],"WARP 1 centre/Y":[P("WARP 1 centre","ADBE Position_1"),0],
  "WARP 2 centre/X":[P("WARP 2 centre","ADBE Position_0"),0],"WARP 2 centre/Y":[P("WARP 2 centre","ADBE Position_1"),0],
  "Turbulent/Amount":[td.property("Amount"),0],"Turbulent/Size":[td.property("Size"),0]};
var lines=[];
for(var k in props){var p=props[k][0],off=props[k][1];
  for(var i=0;i<=540;i++){var t=i*0.01;var v=p.valueAtTime(t,true);if(v instanceof Array)v=v[0];lines.push(k+"\t"+t.toFixed(2)+"\t"+(v+off));}}
var f=new File(OUT);f.encoding="UTF-8";f.open("w");f.write(lines.join("\n"));f.close();
return {lines:lines.length,path:f.fsName};
