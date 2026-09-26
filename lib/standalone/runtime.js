"use client";
import {isStandalone} from "./mode";import {ensureStandaloneSeed} from "./seed";
let boot=null;export function standaloneEnabled(){return isStandalone()}
export function ensureStandaloneReady(){if(!standaloneEnabled())return Promise.resolve({standalone:false});if(!boot)boot=ensureStandaloneSeed();return boot}
