"""Generate the ExtendScript that builds the null rig on the liquid text preset from keys.json.

    python build_rig_jsx.py keys.json build.jsx

Then paste build.jsx into the bridge's `execute-script` in an open session or run it headless
with a headless AfterFX.exe -r run. The script:

  1. refuses to run twice (a backup comp named "... (backup avant nulls)" already exists),
  2. duplicates "créer un texte Comp 2" as that backup,
  3. strips the text layer's own keys/expressions (it will ride the nulls),
  4. builds TXT pos X -> TXT pos Y -> TXT rot -> TXT scale -> TXT drift -> text layer, plus
     WARP 1 centre / WARP 2 centre parented to the text layer,
  5. writes every key as BEZIER with KeyframeEase(slope, 33.333) on both sides,
  6. wires CC Scale Wipe Center to the warp nulls, Turbulent Displace Evolution to time,
     switches Displacement to Turbulent Smoother, turns motion blur on in "2. RENDU ICI",
  7. returns key counts, a non-bezier count (must be 0), expression errors (must be []), and
     pre-expression samples of every channel every 0.1 s.
"""
import json, sys

TEMPLATE = r'''
var KEYS = %s;
function findComp(n){for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it instanceof CompItem&&it.name==n)return it;}return null;}
function clearKeys(p){while(p.numKeys>0)p.removeKey(1);}
function writeKeys(prop, keys, dims, zfill){
  clearKeys(prop);
  for(var i=0;i<keys.length;i++){var v=keys[i][1];var val=(dims==1)?v:(dims==2?[v,v]:[v,v,zfill]);prop.setValueAtTime(keys[i][0],val);}
  for(var i=1;i<=prop.numKeys;i++){var s=keys[i-1][2];
    prop.setInterpolationTypeAtKey(i,KeyframeInterpolationType.BEZIER,KeyframeInterpolationType.BEZIER);
    var ease=[];for(var q=0;q<dims;q++)ease.push(new KeyframeEase((dims==3&&q==2)?0:s,33.333));
    prop.setTemporalEaseAtKey(i,ease,ease);}
  return prop.numKeys;
}
function offsetKeys(keys, off){var o=[];for(var i=0;i<keys.length;i++)o.push([keys[i][0],keys[i][1]+off,keys[i][2]]);return o;}
var comp=findComp("créer un texte Comp 2");
if(findComp("créer un texte Comp 2 (backup avant nulls)")) throw new Error("backup already exists - rig was already built?");
var bak=comp.duplicate(); bak.name="créer un texte Comp 2 (backup avant nulls)";
var txt=comp.layer("créer un texte Comp 1");
// strip the layer's own animation - it will ride the nulls
clearKeys(txt.scale); clearKeys(txt.rotation);
txt.position.expression=""; txt.rotation.expression="";
txt.scale.setValue([100,100,100]); txt.rotation.setValue(0);
var sw=txt.effect("CC Scale Wipe"), sw2=txt.effect("CC Scale Wipe 2"), td=txt.effect("Turbulent Displace");
clearKeys(sw.property("Center")); clearKeys(sw2.property("Center")); clearKeys(td.property("Amount")); clearKeys(td.property("Evolution"));
sw.property("Stretch").setValue(100); sw2.property("Stretch").setValue(100);
// nulls, one channel each: anchor 0, position 0, scale 100, rotation 0
function mkNull(name,label){var n=comp.layers.addNull();n.name=name;n.anchorPoint.setValue([0,0]);n.position.setValue([0,0]);n.scale.setValue([100,100,100]);n.rotation.setValue(0);n.label=label;return n;}
var posX=mkNull("TXT pos X",9), posY=mkNull("TXT pos Y",9), rot=mkNull("TXT rot",10), scl=mkNull("TXT scale",10), drift=mkNull("TXT drift",11), w1=mkNull("WARP 1 centre",14), w2=mkNull("WARP 2 centre",14);
posY.setParentWithJump(posX); rot.setParentWithJump(posY); scl.setParentWithJump(rot); drift.setParentWithJump(scl); txt.setParentWithJump(drift); w1.setParentWithJump(txt); w2.setParentWithJump(txt);
posX.position.setValue([1004,540]); posY.position.setValue([0,0]); rot.position.setValue([0,0]); scl.position.setValue([0,0]); drift.position.setValue([0,0]); txt.position.setValue([0,0]);
var TG="ADBE Transform Group";
function sep(n){n.position.dimensionsSeparated=true;return {x:n.property(TG).property("ADBE Position_0"), y:n.property(TG).property("ADBE Position_1")};}
var pX=sep(posX), pY=sep(posY), W1=sep(w1), W2=sep(w2);
var counts={};
counts["TXT pos X"]=writeKeys(pX.x, offsetKeys(KEYS["TXT pos X"],1004),1); pX.y.setValue(540);
counts["TXT pos Y"]=writeKeys(pY.y, KEYS["TXT pos Y"],1); pY.x.setValue(0);
counts["TXT rot"]=writeKeys(rot.rotation, KEYS["TXT rot"],1);
counts["TXT scale"]=writeKeys(scl.scale, KEYS["TXT scale"],3,100);
counts["WARP 1 centre/X"]=writeKeys(W1.x, KEYS["WARP 1 centre/X"],1);
counts["WARP 1 centre/Y"]=writeKeys(W1.y, KEYS["WARP 1 centre/Y"],1);
counts["WARP 2 centre/X"]=writeKeys(W2.x, KEYS["WARP 2 centre/X"],1);
counts["WARP 2 centre/Y"]=writeKeys(W2.y, KEYS["WARP 2 centre/Y"],1);
counts["Turbulent/Amount"]=writeKeys(td.property("Amount"), KEYS["Turbulent/Amount"],1);
counts["Turbulent/Size"]=writeKeys(td.property("Size"), KEYS["Turbulent/Size"],1);
// continuous drift on its own null (was wiggle(1,15) / wiggle(1,0.8) on the layer)
drift.position.expression="wiggle(0.5, 10) + wiggle(1.3, 5) - value;";
drift.rotation.expression="wiggle(0.6, 0.7);";
// liquid sway on the warper centres, fading out as the streak lands
var sway="var a = linear(time, 1.8, 2.6, 1, 0);\nvalue + (wiggle(0.8, 6) - value) * a;";
W1.x.expression=sway; W1.y.expression=sway; W2.x.expression=sway; W2.y.expression=sway;
sw.property("Center").expression='thisComp.layer("WARP 1 centre").position;';
sw2.property("Center").expression='thisComp.layer("WARP 2 centre").position;';
td.property("Evolution").expression="time * 300;";
td.property("Displacement").setValue(4);   // Turbulent Smoother
// render comp: motion blur actually on, adaptive limit sane
var rc=findComp("2. RENDU ICI"); rc.motionBlur=true; rc.motionBlurAdaptiveSampleLimit=32;
// verify: bezier everywhere, and pre-expression samples per channel
var props={"TXT pos X":[pX.x,-1004],"TXT pos Y":[pY.y,0],"TXT rot":[rot.rotation,0],"TXT scale":[scl.scale,0],"WARP 1 centre/X":[W1.x,0],"WARP 1 centre/Y":[W1.y,0],"WARP 2 centre/X":[W2.x,0],"WARP 2 centre/Y":[W2.y,0],"Turbulent/Amount":[td.property("Amount"),0],"Turbulent/Size":[td.property("Size"),0]};
var nonBez=0, samples={};
for(var k in props){var p=props[k][0],off=props[k][1];
  for(var i=1;i<=p.numKeys;i++){if(p.keyInInterpolationType(i)!=KeyframeInterpolationType.BEZIER||p.keyOutInterpolationType(i)!=KeyframeInterpolationType.BEZIER)nonBez++;}
  var s=[];for(var t=0;t<=5.3001;t+=0.1){var v=p.valueAtTime(t,true);if(v instanceof Array)v=v[0];s.push([Math.round(t*100)/100,v+off]);}samples[k]=s;}
var exprErr=[];
var chk=[sw.property("Center"),sw2.property("Center"),td.property("Evolution"),drift.position,drift.rotation,W1.x,W1.y,W2.x,W2.y];
for(var i=0;i<chk.length;i++){if(chk[i].expressionError)exprErr.push(chk[i].name+": "+chk[i].expressionError);}
return {counts:counts,nonBezier:nonBez,exprErrors:exprErr,txtParent:txt.parent.name,numLayers:comp.numLayers,samples:samples};
'''

if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    d = json.load(open(src, encoding="utf-8"))
    keys = {k: v["keys"] for k, v in d.items()}
    open(dst, "w", encoding="utf-8").write(TEMPLATE % json.dumps(keys))
    print(dst, "-", sum(len(v) for v in keys.values()), "keys across", len(keys), "channels")
