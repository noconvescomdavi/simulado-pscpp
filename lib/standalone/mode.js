export function isStandaloneBuild(){return process.env.NEXT_PUBLIC_ESTIBORDO_STANDALONE==="1"}
export function isStandaloneRuntime(){return typeof window!=="undefined"&&window.__ESTIBORDO_STANDALONE__===true}
export function isStandalone(){return isStandaloneBuild()||isStandaloneRuntime()}
