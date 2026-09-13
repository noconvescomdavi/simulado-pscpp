import fs from "node:fs";import assert from "node:assert/strict";
const cad=fs.readFileSync("app/cadastro/page.js","utf8"),login=fs.readFileSync("app/login/page.js","utf8"),reg=fs.readFileSync("app/api/auth/register/route.js","utf8"),lr=fs.readFileSync("app/api/auth/login/route.js","utf8");
assert.ok(cad.includes("RecaptchaWidget")&&login.includes("RecaptchaWidget"));
assert.ok(!cad.includes("enable_2fa")&&!cad.includes("TurnstileWidget"));
assert.ok(!login.includes("requiresMfaSetup")&&!login.includes('j.requiresMfa?'));
assert.ok(reg.includes("verifyRecaptcha")&&!reg.includes("verifyTurnstile"));
assert.ok(lr.includes("verifyRecaptcha")&&!lr.includes("beginStudentMfaChallenge"));
assert.ok(lr.includes("requiresAdminMfa"),"2FA administrativo deve permanecer preservado");
console.log("reCAPTCHA auth invariants: OK");