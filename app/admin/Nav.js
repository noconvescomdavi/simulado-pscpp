import {getAdmin} from "../../lib/admin";
import {hasPermission} from "../../lib/admin-permissions";
import styles from "./nav.module.css";

const LINKS=[
  ["Dashboard","/admin",null],
  ["Usuários","/admin/usuarios","users.manage"],
  ["Questões","/admin/questoes","content.manage"],
  ["Cobertura","/admin/cobertura","content.manage"],
  ["Simulados","/admin/simulados","content.manage"],
  ["Conteúdo","/admin/conteudo","content.manage"],
  ["Pagamentos","/admin/pagamentos","payments.view"],
  ["Métricas","/admin/metricas","metrics.view"],
  ["Contramestre","/admin/contramestre","content.manage"],
  ["Suporte","/admin/suporte","support.manage"],
  ["Editor","/admin/editor","content.manage"],
  ["Editor 3D","/admin/laboratorio-3d","ripeam.manage"],
  ["Observabilidade","/admin/observabilidade","system.observe"],
  ["Permissões","/admin/permissoes","admin.manage"],
  ["Segurança","/admin/seguranca",null],
  ["Configurações","/admin/configuracoes",null]
];

export default async function Nav(){
  const admin=await getAdmin();
  const links=LINKS.filter(([, ,permission])=>!permission||hasPermission(admin,permission));
  return <header className={styles.h}><div><a href="/area-do-aluno"><img src="/estibordo/logos/estibordo-logo-header.png" alt="ESTIBORDO"/></a><b>ADMINISTRAÇÃO</b></div><nav>{links.map(([label,href])=><a key={href} href={href}>{label}</a>)}</nav></header>;
}
