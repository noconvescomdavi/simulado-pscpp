import {Nav,Footer} from "./components";
import home from "../data/site/home.json";

export default function Home(){
  const features = home.knowledge.features;
  return (
    <>
      <Nav/>
      <main>
        <section className="hero heroEstibordo">
          <div className="heroChart"></div>
          <div className="heroCompass"></div>
          <div className="heroCopy">
            <div className="eyebrow">{home.hero.eyebrow}</div>
            <h1><span>{home.hero.titleLine1}</span><br/><span>{home.hero.titleLine2}</span></h1>
            <p>{home.hero.description}</p>
            <div className="heroActions">
              <a className="btn primary" href={home.hero.primaryButton.href}>{home.hero.primaryButton.label}</a>
              <a className="btn btnDark" href={home.hero.secondaryButton.href}>{home.hero.secondaryButton.label}</a>
            </div>
            <div className="heroStats">
              {home.hero.stats.map((item) => <div key={item.label}><b>{item.value}</b><span>{item.label}</span></div>)}
            </div>
          </div>
          <div className="heroVisual">
            <div className="hotelFlag"><span></span><span></span></div>
            <img className="heroPortPhoto" src={home.hero.image.src} alt={home.hero.image.alt}/>
          </div>
        </section>

        <section className="homeDark">
          <div className="homeContainer">
            <div className="sectionIntro">
              <div className="eyebrow">{home.knowledge.eyebrow}</div>
              <h2>{home.knowledge.title}</h2>
              <p>{home.knowledge.description}</p>
            </div>
            <div className="featureGrid">
              {features.map((item) => (
                <article className="featureCard" key={item.title}>
                  <img src={`/estibordo/icones/${item.icon}.svg`} alt=""/>
                  <h3>{item.title}</h3><p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboardPreview">
          <div className="homeContainer previewGrid">
            <div className="previewCopy">
              <div className="eyebrow">{home.dashboardPreview.eyebrow}</div>
              <h2>{home.dashboardPreview.title}</h2>
              <p>{home.dashboardPreview.description}</p>
              <a className="btn primary" href={home.dashboardPreview.button.href}>{home.dashboardPreview.button.label}</a>
            </div>
            <div className="dashboardMock">
              <div className="mockTop">
                <img src="/estibordo/logos/estibordo-logo-final.png" alt="ESTIBORDO"/>
                <span>{home.dashboardPreview.profileLabel}</span>
              </div>
              <div className="mockBody">
                <div className="readiness">
                  <div className="ring"><b>{home.dashboardPreview.readinessScore}</b><small>{home.dashboardPreview.readinessScale}</small></div>
                  <p>{home.dashboardPreview.readinessText}</p>
                </div>
                <div className="performance">
                  <h4>{home.dashboardPreview.performanceTitle}</h4>
                  {home.dashboardPreview.performance.map(({name,value}) =>
                    <div className="perf" key={name}>
                      <span>{name}</span><i><b style={{width:value}}></b></i><strong>{value}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bannerCta">
          <div className="bannerInner">
            <div>
              <div className="eyebrow">{home.cta.eyebrow}</div>
              <h2><span>{home.cta.titleLine1}</span><br/><span>{home.cta.titleLine2}</span></h2>
            </div>
            <img src={home.cta.image.src} alt={home.cta.image.alt}/>
            <a className="btn primary" href={home.cta.button.href}>{home.cta.button.label}</a>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  )
}
