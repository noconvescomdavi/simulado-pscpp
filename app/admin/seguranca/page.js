import {getAdmin} from "../../../lib/admin";
import {getAdminMfaSecret,otpauthUri} from "../../../lib/admin-mfa";
import MfaSetupClient from "./MfaSetupClient";

export const dynamic="force-dynamic";

export default async function Page(){
  const admin=await getAdmin();
  const data=admin&&!admin.admin_mfa_enabled?await getAdminMfaSecret(admin.id):null;
  const secret=data?.secret||null;
  return <main className="wrap admin-wrap"><div className="eyebrow">SEGURANÇA</div><h1>Autenticação administrativa</h1><p>Proteja o painel administrativo com um segundo fator independente da senha.</p><MfaSetupClient enabled={Boolean(admin?.admin_mfa_enabled)} secret={secret} uri={secret?otpauthUri(admin.email,secret):null}/></main>;
}
