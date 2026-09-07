"use client";

const GROUPS=[
  ["Básico",[
    ["text","Caixa de texto","T"],["button","Botão","▣"],["image","Imagem","▧"],["section","Seção / Faixa","═"],["box","Caixa","□"],["decorative","Decorativo","✦"]
  ]],
  ["Conteúdo",[
    ["gallery","Galeria","▦"],["menu","Menu e âncora","☰"],["form","Contato e formulários","✉"],["video","Vídeo e música","▶"],["interactive","Interativo","◎"],["list","Lista","☷"],["embed","Incorporar código","</>"],["social","Redes sociais","#"],["input","Entrada","⌨"]
  ]],
  ["Dados e apps",[
    ["widget","Widgets do app","◫"],["cms","CMS","◉"],["blog","Blog","B"],["app","Apps","◇"],["api","API","{}"]
  ]],
  ["Modelos",[
    ["hero","Hero pronto","H"],["cta","CTA pronto","→"],["stats","Gráfico / métricas","▥"],["socialbar","Ícones sociais","●"],["cards","Cards prontos","▤"]
  ]]
];

export default function EditorToolbox({open,onClose,onAdd,onAction,pageSettings,onPageSettings,media,onUploadMedia}){
  if(!open)return null;
  return <div className="ev-drawer-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <aside className="ev-drawer">
      <header><div><b>Ferramentas do Editor</b><span>Adicionar, configurar e estruturar a página</span></div><button onClick={onClose}>×</button></header>
      <div className="ev-drawer-tabs">
        <button onClick={()=>onAction("pages")}>Páginas & menu</button>
        <button onClick={()=>onAction("layers")}>Camadas</button>
        <button onClick={()=>onAction("section")}>Seções</button>
      </div>
      <div className="ev-drawer-scroll">
        {GROUPS.map(([title,items])=><section key={title}><h4>{title}</h4><div className="ev-add-grid">{items.map(([type,label,icon])=><button key={type} onClick={()=>onAdd(type)}><i>{icon}</i><span>{label}</span></button>)}</div></section>)}
        <section><h4>Aparência da página</h4>
          <label className="ev-mini-field"><span>Tema de cor</span><select value={pageSettings.colorTheme||"estibordo"} onChange={e=>onPageSettings({colorTheme:e.target.value})}><option value="estibordo">ESTIBORDO</option><option value="light">Claro</option><option value="dark">Escuro</option><option value="ocean">Oceano</option></select></label>
          <label className="ev-mini-field"><span>Tema de texto</span><select value={pageSettings.textTheme||"default"} onChange={e=>onPageSettings({textTheme:e.target.value})}><option value="default">Padrão</option><option value="editorial">Editorial</option><option value="compact">Compacto</option><option value="display">Display</option></select></label>
          <label className="ev-mini-field"><span>Background</span><input value={pageSettings.background||""} placeholder="#071b2b ou URL" onChange={e=>onPageSettings({background:e.target.value})}/></label>
          <label className="ev-mini-field"><span>Transição</span><select value={pageSettings.transition||"none"} onChange={e=>onPageSettings({transition:e.target.value})}><option value="none">Nenhuma</option><option value="fade">Fade</option><option value="slide">Slide</option><option value="scale">Scale</option></select></label>
        </section>
        <section><h4>Marketing & SEO</h4>
          <label className="ev-mini-field"><span>Título SEO</span><input value={pageSettings.seoTitle||""} onChange={e=>onPageSettings({seoTitle:e.target.value})}/></label>
          <label className="ev-mini-field"><span>Meta description</span><textarea rows="3" value={pageSettings.seoDescription||""} onChange={e=>onPageSettings({seoDescription:e.target.value})}/></label>
          <label className="ev-mini-field"><span>Google Ads ID</span><input value={pageSettings.googleAdsId||""} placeholder="AW-..." onChange={e=>onPageSettings({googleAdsId:e.target.value})}/></label>
          <label className="ev-mini-field"><span>Meta Pixel ID</span><input value={pageSettings.metaPixelId||""} placeholder="Pixel ID" onChange={e=>onPageSettings({metaPixelId:e.target.value})}/></label>
        </section>
        <section><h4>Biblioteca de mídia</h4><label className="ev-media-library-upload"><input type="file" accept="image/*,video/*,audio/*" onChange={e=>onUploadMedia(e.target.files?.[0])}/><span>＋ Enviar mídia</span></label>
          <div className="ev-media-list">{(media||[]).slice().reverse().slice(0,12).map((m,i)=><div key={(m.url||"")+i}><b>{m.name||"Arquivo"}</b><small>{m.url}</small></div>)}</div>
        </section>
      </div>
    </aside>
  </div>
}
