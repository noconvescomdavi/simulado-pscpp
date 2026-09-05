import shared from "../data/site/shared.json";

export function Nav() {
  const nav = shared.nav;
  return (
    <nav className="nav">
      <div className="navin">
        <a className="brand" href="/" aria-label="ESTIBORDO">
          <img src={nav.logo.src} alt={nav.logo.alt} />
        </a>

        <div className="navmenu">
          {nav.items.map((item) => (
            <div className="navGroup" key={item.href}>
              <a href={item.href} className="navTopLink">
                {item.label}
                {item.children?.length ? <span className="navChevron">⌄</span> : null}
              </a>
              {item.children?.length ? (
                <div className="navDropdown">
                  {item.children.map((child) => (
                    <a href={child.href} key={child.href}>{child.label}</a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="links publicDesktopActions">
          <a className="loginLink" href={nav.login.href}>{nav.login.label}</a>
          <a className="primary" href={nav.profile.href}>{nav.profile.label}</a>
        </div>

        <details className="mobileMenu">
          <summary aria-label="Abrir menu">☰</summary>
          <div className="mobileMenuPanel">
            <a href={nav.login.href} className="mobileStudentArea">{nav.login.label}</a>
            <a href={nav.profile.href}>Cadastre-se</a>
            {nav.items.map((item) => (
              <div className="mobileMenuGroup" key={item.href}>
                <a href={item.href}>{item.label}</a>
                {item.children?.map((child) => (
                  <a className="mobileSubLink" href={child.href} key={child.href}>{child.label}</a>
                ))}
              </div>
            ))}
          </div>
        </details>
      </div>
    </nav>
  );
}

export function Footer() {
  const f = shared.footer, marks = ["◉", "✦", "⌖", "⊕"];
  return (
    <footer className="footer">
      <div className="footerMain">
        <div className="footerQuote">
          <div className="quoteMark">“</div>
          <strong><span>{f.quoteLine1}</span><br/><span>{f.quoteLine2}</span></strong>
          <div className="hotelFooter"><span></span><span></span></div>
          <small>{f.signature}</small>
        </div>
        <div className="footerAbout">
          <h4>{f.aboutTitle}</h4>
          <p>{f.aboutText}</p>
          <div className="footerValues">{f.values.map((v,i)=><span key={v}>{marks[i]||"•"}<small>{v}</small></span>)}</div>
        </div>
        <div className="footerLinks">
          <h4>{f.disciplinesTitle}</h4>
          {f.disciplines.map(d=><a href={d.href} key={d.href}>⚓ {d.label}</a>)}
        </div>
        <div className="footerContact">
          <h4>{f.contactTitle}</h4>
          <p>{f.contactText}</p>
          <a href={f.login.href}>{f.login.label}</a>
          <a href={f.register.href}>{f.register.label}</a>
        </div>
      </div>
      <div className="footerBottom">{f.bottom}</div>
    </footer>
  );
}
