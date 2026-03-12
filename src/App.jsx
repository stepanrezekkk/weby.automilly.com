import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Philosophy from './components/Philosophy'
import Protocol from './components/Protocol'
import Footer from './components/Footer'

// ─── TESTIMONIALS ───────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "Kluci umíš naslouchat a co řeknou, to platí. Web udělali přesně podle našich představ a to rychle. Doporučuju!",
    name: "Petr Novák",
    company: "Real Estate Partners",
    initials: "PN",
  },
  {
    quote: "Rychlá domluva, profesionální přístup. Měli jsme web hotový do 14 dnů a hned nám začali chodit poptávky.",
    name: "Jana Dvořáková",
    company: "Kadeřnictví Styl",
    initials: "JD",
  },
  {
    quote: "Automatizace a web nám ušetřily spoustu času s administrativou. Skvělá spolupráce, určitě využijeme znovu.",
    name: "Tomáš Svoboda",
    company: "Autoservis Svoboda",
    initials: "TS",
  },
  {
    quote: "Moderní design a hlavně funkční weby. Ceníme si hlavně toho že se o web starají i po spuštění.",
    name: "Michaela Kovářová",
    company: "Zubařská ordinace M&K",
    initials: "MK",
  },
  {
    quote: "Hledali jsme někoho spolehlivého na předělání starého webu. Tým Automilly splnil očekávání na jedničku.",
    name: "David Černý",
    company: "Stavebniny Černý",
    initials: "DČ",
  },
  {
    quote: "Od prvotního návrhu až po spuštění byla komunikace bezchybná. Výsledný web nám všichni chválí.",
    name: "Lucie Procházková",
    company: "Cukrárna U Lucie",
    initials: "LP",
  },
]

// ─── PRICING ─────────────────────────────────────────────────────────────────
const pricingTiers = [
  {
    name: 'Základní',
    price: '9 900',
    period: 'Kč',
    desc: 'Základní webová prezentace pro Váš byznys.',
    features: ['Jednostránkový web', 'Desktop i mobilní verze', 'Kontaktní formulář', 'Základní SEO', 'Podpora 7 dní po spuštění'],
    featured: false,
    cta: 'Mám zájem',
  },
  {
    name: 'Standardní',
    price: '14 900',
    period: 'Kč',
    desc: 'Kvalitní firemní web pro získávání poptávek.',
    features: ['Do 4 podstránek', 'CMS systém (Wordpress/Webflow)', 'Google Analytics', 'Propracovanější design', 'Podpora 14 dní po spuštění'],
    featured: true,
    cta: 'Mám zájem',
  },
  {
    name: 'Prémiový',
    price: '24 900',
    period: 'Kč',
    desc: 'Kompletní online řešení na míru vašim potřebám.',
    features: ['Do 8 podstránek', 'CMS systém', 'Blog nebo aktuality', 'Pokročilé SEO & Analytics', 'Podpora 30 dní po spuštění'],
    featured: false,
    cta: 'Mám zájem',
  },
]

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faqs = [
  { q: "Jak dlouho trvá vytvoření webu?", a: "Jednostránkový web obvykle spustíme do 7–14 dní od schválení obsahu a designu." },
  { q: "Budu moci web sám upravovat?", a: "Ano, u Standardního a Prémiového balíčku dostanete přístup do redakčního systému, kde si sami upravíte texty a obrázky bez technických znalostí." },
  { q: "Co potřebuji připravit?", a: "Prakticky nic — obsah, texty i strukturu navrhneme společně. Stačí mi říct, co děláte a pro koho." },
  { q: "Zajistíte i hosting a doménu?", a: "Hosting je součástí dodávky a je v ceně. Doménu si buď přenesete svou stávající, nebo vám pomůžu s registrací nové." },
  { q: "Co zahrnuje základní SEO?", a: "Správné nadpisy, meta popisky, rychlost načítání a propojení s Google Search Console. Základ pro vyhledávače bude v pořádku." },
  { q: "Co když nebudu spokojený s návrhem?", a: "Před spuštěním projdeme web společně a zapracujeme Vaše připomínky. Platíte až za výsledek, který Vás uspokojí." },
  { q: "Poskytujete podporu i po spuštění?", a: "Ano, každý balíček zahrnuje podporu po spuštění — 7, 14 nebo 30 dní podle zvoleného plánu." },
]

// ─── PRICING CARD ─────────────────────────────────────────────────────────────
const PricingCard = ({ tier }) => (
  <div className={`rounded-[2rem] p-7 flex flex-col gap-5 transition-transform duration-300 hover:-translate-y-1
    ${tier.featured
      ? 'bg-accent plasma-glow relative'
      : 'glass-surface'
    }`}>
    {tier.featured && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accentLight text-white font-mono text-[10px] tracking-widest uppercase whitespace-nowrap">
        Most Popular
      </div>
    )}
    <div>
      <div className={`font-mono text-xs uppercase tracking-widest mb-2 ${tier.featured ? 'text-white/60' : 'text-muted'}`}>{tier.name}</div>
      <div className={`font-heading font-extrabold text-4xl ${tier.featured ? 'text-white' : 'text-background'}`}>
        {tier.price}
        <span className={`font-body font-normal text-sm ml-1 ${tier.featured ? 'text-white/60' : 'text-muted'}`}>{tier.period}</span>
      </div>
    </div>
    <p className={`font-body text-sm ${tier.featured ? 'text-white/80' : 'text-muted'}`}>{tier.desc}</p>
    <ul className="flex flex-col gap-2.5 flex-1">
      {tier.features.map(f => (
        <li key={f} className={`flex items-center gap-2 font-body text-sm ${tier.featured ? 'text-white/90' : 'text-background/70'}`}>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${tier.featured ? 'bg-white/20' : 'bg-accent/20'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${tier.featured ? 'bg-white' : 'bg-accent'}`} />
          </div>
          {f}
        </li>
      ))}
    </ul>
    <a
      href="https://cal.com/automilly/growth-mapping-call"
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-2 block text-center px-6 py-3 rounded-full font-heading font-semibold text-sm magnetic-btn transition-colors duration-300
        ${tier.featured
          ? 'bg-primary text-accent hover:bg-primary/90'
          : 'border border-accent/40 text-accent hover:bg-accent/10'
        }`}
    >
      {tier.cta}
    </a>
  </div>
)

// ─── FAQ ACCORDION ────────────────────────────────────────────────────────────
const FaqAccordion = () => {
  const [active, setActive] = useState(null)
  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => (
        <div key={i} className={`glass-surface rounded-3xl overflow-hidden border transition-all duration-300 ${active === i ? 'border-accent/30' : 'border-transparent'}`}>
          <button
            id={`faq-toggle-${i}`}
            onClick={() => setActive(active === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
          >
            <span className="font-heading font-semibold text-base text-background">{faq.q}</span>
            <div className={`w-6 h-6 rounded-full border border-accent/40 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${active === i ? 'rotate-45' : ''}`}>
              <span className="text-accent text-sm leading-none">+</span>
            </div>
          </button>
          {active === i && (
            <div className="px-6 pb-5">
              <p className="font-body text-muted text-sm leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── APP ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <div className="bg-primary min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Philosophy />
      <Protocol />

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 px-6 md:px-16 bg-primary" id="testimonials">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-accent/30 bg-accent/5">
              <span className="font-mono text-xs text-accent tracking-widest uppercase">Reference</span>
            </div>
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-background leading-tight tracking-tight">
              Co o nás <span className="text-gradient-plasma">říkají klienti</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-surface rounded-[2rem] p-7 flex flex-col gap-5 hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, s) => <span key={s} className="text-accent text-sm">★</span>)}
                </div>
                <p className="font-body text-background/80 text-sm leading-relaxed italic flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-surfaceBorder">
                  <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center font-heading font-bold text-xs">{t.initials}</div>
                  <div>
                    <div className="font-heading font-semibold text-sm text-background">{t.name}</div>
                    <div className="font-mono text-xs text-muted">{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-24 px-6 md:px-16 bg-textDark" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-accent/30 bg-accent/5">
              <span className="font-mono text-xs text-accent tracking-widest uppercase">Ceník</span>
            </div>
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-background leading-tight tracking-tight mb-4">
              Vyberte si <span className="text-gradient-plasma">řešení pro Vás</span>
            </h2>
            <p className="font-body text-muted text-base max-w-md mx-auto">Ceny jsou uvedeny bez DPH. Všechny balíčky zahrnují úvodní konzultaci zdarma.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-24">
            {pricingTiers.map(tier => <PricingCard key={tier.name} tier={tier} />)}
          </div>

          {/* ─── INDIVIDUAL OFFER FORM ─── */}
          <div className="max-w-4xl mx-auto bg-surface/50 border border-surfaceBorder rounded-[3rem] p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-accent/30 bg-accent/5">
                  <span className="font-mono text-xs text-accent tracking-widest uppercase">Individuální nabídka</span>
                </div>
                <h3 className="font-heading font-extrabold text-3xl text-background leading-tight mb-4">
                  Není Vám žádný balíček přesně na míru?<br />
                  <span className="text-gradient-plasma">Připravím Vám individuální nabídku.</span>
                </h3>
                <p className="font-body text-muted text-sm leading-relaxed mb-6">
                  Každá firma je jiná. Pokud potřebujete něco specifického — víc stránek, vícejazyčný web, napojení na rezervační systém nebo cokoli jiného — napište mi a připravím nabídku přesně pro Vás.
                </p>
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-accent/10 w-fit">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                  <span className="font-mono text-[10px] text-accent font-semibold tracking-widest uppercase">Odpovím do 24 hodin</span>
                </div>
              </div>

              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Jméno"
                    className="w-full bg-primary border border-surfaceBorder rounded-2xl px-4 py-3 font-body text-sm text-background placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-primary border border-surfaceBorder rounded-2xl px-4 py-3 font-body text-sm text-background placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <input
                  type="url"
                  placeholder="Webová stránka (volitelné)"
                  className="w-full bg-primary border border-surfaceBorder rounded-2xl px-4 py-3 font-body text-sm text-background placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                />
                <textarea
                  placeholder="Co potřebujete?"
                  rows={4}
                  className="w-full bg-primary border border-surfaceBorder rounded-2xl px-4 py-3 font-body text-sm text-background placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-primary text-accent border border-accent/40 rounded-2xl px-6 py-4 font-heading font-semibold hover:bg-accent/10 transition-colors magnetic-btn mt-2"
                >
                  Odeslat poptávku
                </button>
                <p className="text-center font-mono text-[10px] text-muted uppercase tracking-widest mt-1">
                  Bez závazků
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 px-6 md:px-16 bg-primary" id="faq">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-accent/30 bg-accent/5">
              <span className="font-mono text-xs text-accent tracking-widest uppercase">FAQs</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-background leading-tight">
              Časté <span className="text-gradient-plasma">dotazy</span>
            </h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* ─── FINAL CTA + CONTACT FORM ─── */}
      <section className="py-24 px-6 md:px-16 bg-textDark border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading font-extrabold text-4xl md:text-6xl text-background leading-tight tracking-tight mb-4">
            Chcete vidět, jak by<br />
            <span className="font-drama italic text-accent">Váš web mohl vypadat?</span>
          </h2>
          <p className="font-body text-muted text-base max-w-md mx-auto mb-12">
            Připravíme Vám ukázku zdarma. Bez závazků a bez prodejního tlaku.
          </p>

          <form className="flex flex-col gap-4 text-left" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Jméno"
                className="w-full bg-primary border border-surfaceBorder rounded-2xl px-4 py-3 font-body text-sm text-background placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-primary border border-surfaceBorder rounded-2xl px-4 py-3 font-body text-sm text-background placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <input
              type="url"
              placeholder="Webová stránka (volitelné)"
              className="w-full bg-primary border border-surfaceBorder rounded-2xl px-4 py-3 font-body text-sm text-background placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
            <textarea
              placeholder="Co potřebujete?"
              rows={4}
              className="w-full bg-primary border border-surfaceBorder rounded-2xl px-4 py-3 font-body text-sm text-background placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full bg-accent text-primary rounded-2xl px-6 py-4 font-heading font-semibold hover:bg-accentLight transition-colors magnetic-btn mt-2"
            >
              Odeslat poptávku
            </button>
            <p className="text-center font-mono text-[10px] text-muted uppercase tracking-widest mt-1">
              Bez závazků · Odpovím do 24 hodin
            </p>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default App
