const COMMON = new Set([
  "1234567890","12345678910","password123","qwerty12345","senha123456",
  "estibordo123","admin123456","praticagem123","pscpp123456"
]);

export function passwordPolicyError(password, identity="") {
  const value=String(password||"");
  if(value.length<10) return "A senha precisa ter ao menos 10 caracteres.";
  if(value.length>128) return "A senha deve ter no máximo 128 caracteres.";
  const lower=value.toLowerCase();
  if(COMMON.has(lower)) return "Escolha uma senha menos previsível.";
  if(/^(.)\1{9,}$/.test(value)) return "Escolha uma senha menos previsível.";
  const local=String(identity||"").trim().toLowerCase().split("@")[0];
  if(local && local.length>=5 && lower.includes(local)) return "A senha não deve conter seu e-mail.";
  return null;
}
