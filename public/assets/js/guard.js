
import {session,entitlement,configured} from "./auth.js";
(async()=>{
 const C=window.PSCPP_CONFIG||{};
 if(!configured){
   if(C.DEMO_MODE){document.documentElement.dataset.demoAccess="true";return;}
   location.replace("/login/?next="+encodeURIComponent(location.pathname));return;
 }
 const s=await session();
 if(!s){location.replace("/login/?next="+encodeURIComponent(location.pathname));return;}
 if(!(await entitlement(s.user.id))){location.replace("/comprar/?locked=1");}
})();
