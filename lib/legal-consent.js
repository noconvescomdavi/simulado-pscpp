import {query} from "./db";
import {TERMS_VERSION,PRIVACY_VERSION} from "./legal";

export async function hasCurrentLegalConsent(userId){
  const result=await query(
    "select 1 from user_consents where user_id=$1 and terms_version=$2 and privacy_version=$3 limit 1",
    [userId,TERMS_VERSION,PRIVACY_VERSION]
  );
  return result.rowCount>0;
}
