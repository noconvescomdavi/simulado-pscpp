import {Nav,Footer} from "../components";import styles from "../legal.module.css";export const metadata={title:"Política de Cookies"};
export default function Page(){return <><Nav/><main className={styles.page}><article className={styles.wrap}>
<span className={styles.eyebrow}>ESTIBORDO • COOKIES</span><h1>Política de Cookies</h1><p className={styles.updated}>Versão vigente: 08 de setembro de 2026.</p>
<p>A ESTIBORDO utiliza cookies e tecnologias semelhantes principalmente para permitir o funcionamento seguro da conta e manter a sessão do usuário.</p>
<h2>1. Cookie de sessão</h2><p>A plataforma utiliza um cookie de sessão para reconhecer o usuário autenticado e manter o acesso às áreas privadas. Esse cookie é necessário ao funcionamento do login e de recursos associados à conta.</p>
<h2>2. Preferências</h2><p>Algumas preferências do usuário também podem ser armazenadas no navegador para manter configurações e melhorar a utilização da plataforma.</p>
<h2>3. Serviços externos</h2><p>Serviços externos utilizados em funcionalidades específicas, como pagamento, podem empregar tecnologias próprias quando o usuário acessa seus ambientes, de acordo com as regras desses fornecedores.</p>
<h2>4. Controle pelo usuário</h2><p>O navegador permite apagar ou bloquear cookies. Entretanto, bloquear cookies necessários pode impedir o login ou o funcionamento adequado da plataforma.</p>
<h2>5. Novas tecnologias</h2><p>Se a ESTIBORDO passar a utilizar cookies opcionais de publicidade, rastreamento ou outras tecnologias que exijam escolha específica do usuário, esta Política e os controles correspondentes serão atualizados.</p>
<div className={styles.links}><a href="/termos-de-uso">Termos de Uso</a><a href="/politica-de-privacidade">Privacidade</a></div>
</article></main><Footer/></>;}