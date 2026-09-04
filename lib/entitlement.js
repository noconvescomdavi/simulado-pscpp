import {getUserAccess} from "./access";
export async function getEntitlement(userId){const access=await getUserAccess(userId),active=access?.active===true,status=String(access?.effective_status||access?.status||"inactive").toLowerCase();const trial=!active&&!['expired','revoked','cancelled','canceled'].includes(status);return{access,active,trial}}
