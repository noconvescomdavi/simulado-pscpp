import fs from 'node:fs';import path from 'node:path';
const dir='public/models/ripeam';
function parseGlb(file){const b=fs.readFileSync(file);if(b.toString('utf8',0,4)!=='glTF')throw new Error('GLB inválido: '+file);let off=12,json=null;while(off+8<=b.length){const len=b.readUInt32LE(off),type=b.readUInt32LE(off+4);if(type===0x4E4F534A){json=JSON.parse(b.toString('utf8',off+8,off+8+len));break}off+=8+len}if(!json)throw new Error('JSON chunk ausente: '+file);return {materials:(json.materials||[]).length,textures:(json.textures||[]).length,images:(json.images||[]).length,meshes:(json.meshes||[]).length};}
const expected={
  'Tugboat.glb':{materials:1,textures:1},'barge.glb':{materials:1,textures:1},'bulk_carrier.glb':{materials:1,textures:1},'fishing.glb':{materials:1,textures:1},'hidroavião.glb':{materials:1,textures:1},'navy_remoção_de_minas.glb':{materials:1,textures:1},'pilot_boat.glb':{materials:1,textures:1},'sailboat.glb':{materials:1,textures:1}
};
let bad=0;for(const [name,min] of Object.entries(expected)){const f=path.join(dir,name);if(!fs.existsSync(f)){console.error('MISSING',name);bad++;continue}const x=parseGlb(f);console.log(name,x);if(x.materials<min.materials||x.textures<min.textures){console.error('REGRESSION: textures/materials lost in '+name);bad++;}}if(bad)process.exit(1);console.log('RIPEAM GLB regression guard OK');
