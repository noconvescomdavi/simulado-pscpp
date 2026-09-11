export const RIPEAM_ASSET_HASHES={
  "/models/ripeam/Tugboat.glb": "70956a63da5e5239",
  "/models/ripeam/barge.glb": "7893fab8b2da78e2",
  "/models/ripeam/bulk_carrier.glb": "9965c51d3b9fa997",
  "/models/ripeam/dredger.glb": "1d04ba74c2c2bf93",
  "/models/ripeam/fishing.glb": "40c55a260274d8a3",
  "/models/ripeam/hidroavião.glb": "5de88814e95005fc",
  "/models/ripeam/navy_remoção_de_minas.glb": "3c145961043ecae9",
  "/models/ripeam/offshore.glb": "a6a7cc9926dcf11c",
  "/models/ripeam/pilot_boat.glb": "7107aa89f8174811",
  "/models/ripeam/sailboat.glb": "10ae43ce4a56da90"
};

export function versionRipeamAssetUrl(url){
  const value=String(url||"");
  const base=value.split("?")[0];
  const hash=RIPEAM_ASSET_HASHES[base];
  if(!hash)return value;
  return base+"?v="+hash;
}
