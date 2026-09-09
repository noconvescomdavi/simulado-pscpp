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
  ]],
  ["Webdesigner Pro",[
    ["features","Grade de recursos","✦"],["pricing","Tabela de preços","$"],["faq","FAQ / Accordion","?"],["testimonial","Depoimento","“"],["timeline","Linha do tempo","⋮"],["divider","Divisor","—"],["spacer","Espaçador","↕"]
  ]]
];

export default function EditorToolbox({open,onClose,onAdd,onAction,pageSettings,onPageSettings,media,onUploadMedia,designSystem,onDesignSystem,components,onApplyComponent,onDeleteComponent,versions,onRestoreVersion}){
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
        <section><h4>Design System global</h4>
          <div className="ev-token-presets"><button type="button" onClick={()=>onDesignSystem({primary:"#c8102e",accent:"#55a7e6",surface:"#ffffff",text:"#071b2b",radius:"12px",fontFamily:"Arial"})}>ESTIBORDO</button><button type="button" onClick={()=>onDesignSystem({primary:"#111827",accent:"#7c3aed",surface:"#ffffff",text:"#111827",radius:"16px",fontFamily:"Arial"})}>Modern</button><button type="button" onClick={()=>onDesignSystem({primary:"#0b3b5b",accent:"#18c98a",surface:"#f7fbff",text:"#071b2b",radius:"20px",fontFamily:"Georgia"})}>Editorial</button></div>
          <label className="ev-mini-field"><span>Cor primária</span><input type="color" value={designSystem.primary||"#c8102e"} onChange={e=>onDesignSystem({primary:e.target.value})}/></label>
          <label className="ev-mini-field"><span>Cor de destaque</span><input type="color" value={designSystem.accent||"#55a7e6"} onChange={e=>onDesignSystem({accent:e.target.value})}/></label>
          <label className="ev-mini-field"><span>Superfície</span><input type="color" value={designSystem.surface||"#ffffff"} onChange={e=>onDesignSystem({surface:e.target.value})}/></label>
          <label className="ev-mini-field"><span>Texto</span><input type="color" value={designSystem.text||"#071b2b"} onChange={e=>onDesignSystem({text:e.target.value})}/></label>
          <label className="ev-mini-field"><span>Raio padrão</span><input value={designSystem.radius||"12px"} onChange={e=>onDesignSystem({radius:e.target.value})}/></label>
          <label className="ev-mini-field"><span>Fonte global</span><select value={designSystem.fontFamily||"Arial"} onChange={e=>onDesignSystem({fontFamily:e.target.value})}><option>Arial</option><option>Montserrat</option><option>Poppins</option><option>Georgia</option></select></label>
          <label className="ev-mini-field"><span>Largura máxima de conteúdo</span><input value={designSystem.maxContentWidth||"1320px"} onChange={e=>onDesignSystem({maxContentWidth:e.target.value})}/></label>
        </section>
        <section><h4>Componentes reutilizáveis</h4>
          <div className="ev-component-list">{(components||[]).length?(components||[]).slice().reverse().map(c=><div key={c.id}><button type="button" onClick={()=>onApplyComponent(c)}><b>{c.name}</b><small>Aplicar à seleção</small></button><button type="button" className="danger" onClick={()=>onDeleteComponent(c.id)}>×</button></div>):<p className="ev-drawer-empty">Selecione um elemento e use “＋ Componente” para salvá-lo.</p>}</div>
        </section>
        <section><h4>Checkpoints de publicação</h4>
          <div className="ev-version-list">{(versions||[]).length?(versions||[]).slice().reverse().map(v=><button type="button" key={v.id} onClick={()=>onRestoreVersion(v)}><b>{v.label||v.page}</b><small>{new Date(v.createdAt).toLocaleString("pt-BR")}</small></button>):<p className="ev-drawer-empty">Os checkpoints aparecem aqui após cada publicação.</p>}</div>
        </section>
        <section><h4>Aparência da página</h4>
          <label className="ev-mini-field"><span>Layout mestre</span><select value={pageSettings.layoutPreset||"fluid"} onChange={e=>onPageSettings({layoutPreset:e.target.value})}><option value="fluid">Fluido responsivo</option><option value="contained">Conteúdo centralizado</option><option value="immersive">Imersivo / full bleed</option><option value="editorial">Editorial</option></select></label>
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
