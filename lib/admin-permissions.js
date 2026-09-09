export const ADMIN_PERMISSIONS=[
  ["users.manage","Usuários e acessos"],
  ["payments.view","Pagamentos"],
  ["content.manage","Conteúdo e questões"],
  ["support.manage","Suporte"],
  ["ripeam.manage","Editor RIPEAM 3D"],
  ["metrics.view","Métricas"],
  ["system.observe","Observabilidade"],
  ["admin.manage","Administradores e permissões"]
];

export function hasPermission(admin,permission){
  if(!admin)return false;
  if(admin.is_superadmin)return true;
  return Array.isArray(admin.permissions)&&admin.permissions.includes(permission);
}
