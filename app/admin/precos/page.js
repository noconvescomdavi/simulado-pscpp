import {redirect} from "next/navigation";
import {getAdmin} from "../../../lib/admin";
import {getPlatformPricing} from "../../../lib/pricing";
import PricingForm from "./PricingForm";
import styles from "./pricing.module.css";

export const dynamic="force-dynamic";

export default async function PricingPage(){
  if(!(await getAdmin("admin.manage")))redirect("/admin");
  const pricing=await getPlatformPricing();

  return <main className="wrap admin-wrap">
    <div className="eyebrow">ADMINISTRAÇÃO</div>
    <h1>Preços da Plataforma</h1>
    <p>Altere os valores comerciais em um único lugar. Ao salvar, o novo preço passa a ser usado na página de compra, Minhas Assinaturas, CONTRAMESTRE e nos novos checkouts do Mercado Pago.</p>
    <PricingForm
      initialSubscriptionCents={pricing.subscriptionPriceCents}
      initialContramestreCents={pricing.contramestrePriceCents}
      subscriptionUpdatedAt={pricing.subscriptionUpdatedAt}
      contramestreUpdatedAt={pricing.contramestreUpdatedAt}
    />
  </main>;
}
