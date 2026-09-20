export const IALA_REGION="B";
export const AtoNTypes={PORT:{side:"port",colour:"green"},STARBOARD:{side:"starboard",colour:"red"},SAFE_WATER:{colour:"red/white"},SPECIAL:{colour:"yellow"},ISOLATED_DANGER:{colour:"black/red"}};
export function validateAtoN(a){return Boolean(a&&Number.isFinite(a.lat)&&Number.isFinite(a.lon)&&a.name&&a.type)}
// Populate only from validated DH2/DH18/chart records. Empty by design until source extraction is complete.
export const GUANABARA_ATON=[];
