"use client";

import {useEffect} from "react";
import {purgeOfflinePrivateData} from "../../lib/offline-store";

export default function LogoutCleanup(){
  useEffect(()=>{
    purgeOfflinePrivateData().catch(()=>{});
  },[]);
  return null;
}
