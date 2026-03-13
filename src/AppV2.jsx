import { useState, useEffect, useRef, useCallback } from 'react'
import { Palette, Code, Layout, Zap, Target, BarChart, ChevronDown, ArrowRight, Menu, X, ExternalLink, Globe } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Intersection Observer for scroll-reveal (replaces heavy GSAP usage)
// ─────────────────────────────────────────────────────────────────────────────
const useReveal = (threshold = 0.15) => {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
            { threshold }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [threshold])
    return [ref, visible]
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
// Global mouse position shared between canvas and custom cursor
const globalMouse = { x: -9999, y: -9999, clientX: -9999, clientY: -9999, visible: false }

// Custom cursor component
const CustomCursor = () => {
    const dotRef = useRef(null)
    const ringRef = useRef(null)

    useEffect(() => {
        let raf
        let ringX = -9999, ringY = -9999

        const move = (e) => {
            globalMouse.clientX = e.clientX
            globalMouse.clientY = e.clientY
            globalMouse.visible = true
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
            }
        }
        const leave = () => { globalMouse.visible = false }
        const enter = () => { globalMouse.visible = true }

        const animateRing = () => {
            ringX += (globalMouse.clientX - ringX) * 0.15
            ringY += (globalMouse.clientY - ringY) * 0.15
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`
                ringRef.current.style.opacity = globalMouse.visible ? '1' : '0'
            }
            if (dotRef.current) {
                dotRef.current.style.opacity = globalMouse.visible ? '1' : '0'
            }
            raf = requestAnimationFrame(animateRing)
        }

        document.addEventListener('mousemove', move)
        document.addEventListener('mouseleave', leave)
        document.addEventListener('mouseenter', enter)
        raf = requestAnimationFrame(animateRing)

        return () => {
            document.removeEventListener('mousemove', move)
            document.removeEventListener('mouseleave', leave)
            document.removeEventListener('mouseenter', enter)
            cancelAnimationFrame(raf)
        }
    }, [])

    return (
        <>
            <div ref={dotRef} className="pointer-events-none fixed top-0 left-0 z-[9999] opacity-0" style={{ marginLeft: -4, marginTop: -4 }}>
                <div className="w-2 h-2 rounded-full bg-accent" />
            </div>
            <div ref={ringRef} className="pointer-events-none fixed top-0 left-0 z-[9999] opacity-0 transition-[width,height] duration-200" style={{ marginLeft: -20, marginTop: -20 }}>
                <div className="w-10 h-10 rounded-full border border-accent/50" />
            </div>
        </>
    )
}

// Animated gold particle wave canvas with mouse interaction
const HeroCanvas = () => {
    const canvasRef = useRef(null)
    const mouse = useRef({ x: -9999, y: -9999 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animId
        let cols, rows, dots
        const MOUSE_RADIUS = 150
        const MOUSE_PUSH = 40

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = canvas.offsetWidth * dpr
            canvas.height = canvas.offsetHeight * dpr
            ctx.scale(dpr, dpr)
            const spacing = 28
            cols = Math.ceil(canvas.offsetWidth / spacing) + 1
            rows = Math.ceil(canvas.offsetHeight / spacing) + 1
            dots = []
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    dots.push({ x: c * spacing, y: r * spacing, baseX: c * spacing, baseY: r * spacing })
                }
            }
        }

        resize()
        window.addEventListener('resize', resize)

        const draw = (t) => {
            const w = canvas.offsetWidth
            const h = canvas.offsetHeight
            ctx.clearRect(0, 0, w, h)

            // Read mouse from global (works through overlapping content)
            const rect = canvas.getBoundingClientRect()
            const mx = globalMouse.clientX - rect.left
            const my = globalMouse.clientY - rect.top

            for (let i = 0; i < dots.length; i++) {
                const d = dots[i]
                // Wave displacement
                const wave1 = Math.sin(d.baseX * 0.008 + t * 0.0006) * 12
                const wave2 = Math.cos(d.baseY * 0.006 + t * 0.0004) * 8
                const wave3 = Math.sin((d.baseX + d.baseY) * 0.005 + t * 0.0005) * 6
                let dy = d.baseY + wave1 + wave2 + wave3
                let dx = d.baseX

                // Mouse repulsion
                const ddx = dx - mx
                const ddy = dy - my
                const dist = Math.sqrt(ddx * ddx + ddy * ddy)
                let mouseBoost = 0
                if (dist < MOUSE_RADIUS && dist > 0) {
                    const force = (1 - dist / MOUSE_RADIUS) * MOUSE_PUSH
                    dx += (ddx / dist) * force
                    dy += (ddy / dist) * force
                    mouseBoost = (1 - dist / MOUSE_RADIUS)
                }

                d.x = dx
                d.y = dy

                // Distance-based intensity (brighter toward top-right)
                const nx = d.baseX / w
                const ny = d.baseY / h
                const intensity = Math.max(0, nx * 0.7 + (1 - ny) * 0.3)

                // Gold color — mouse proximity makes particles glow brighter
                const alpha = 0.08 + intensity * 0.45 + mouseBoost * 0.4
                const size = 1 + intensity * 1.8 + mouseBoost * 2

                ctx.beginPath()
                ctx.arc(dx, dy, size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(212, 175, 55, ${Math.min(alpha, 1)})`
                ctx.fill()

                // Draw faint connection lines near mouse
                if (mouseBoost > 0.3) {
                    ctx.strokeStyle = `rgba(212, 175, 55, ${mouseBoost * 0.15})`
                    ctx.lineWidth = 0.5
                    // Connect to nearby dots
                    for (let j = i + 1; j < Math.min(i + cols + 2, dots.length); j++) {
                        const other = dots[j]
                        const ox = other.x || other.baseX
                        const oy = other.y || other.baseY
                        const odx = ox - mx
                        const ody = oy - my
                        const odist = Math.sqrt(odx * odx + ody * ody)
                        if (odist < MOUSE_RADIUS) {
                            const ldx = dx - ox
                            const ldy = dy - oy
                            const ldist = Math.sqrt(ldx * ldx + ldy * ldy)
                            if (ldist < 50) {
                                ctx.beginPath()
                                ctx.moveTo(dx, dy)
                                ctx.lineTo(ox, oy)
                                ctx.stroke()
                            }
                        }
                    }
                }
            }

            animId = requestAnimationFrame(draw)
        }

        animId = requestAnimationFrame(draw)
        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.85 }} />
}


const pricingTiers = [
    {
        name: 'Základní', price: '9 900', period: 'Kč',
        desc: 'Základní webová prezentace pro Váš byznys.',
        features: ['Jednostránkový web', 'Desktop i mobilní verze', 'Kontaktní formulář', 'Základní SEO', 'Podpora 7 dní po spuštění'],
        featured: false,
    },
    {
        name: 'Standardní', price: '14 900', period: 'Kč',
        desc: 'Kvalitní firemní web pro získávání poptávek.',
        features: ['Do 4 podstránek', 'CMS systém', 'Google Analytics', 'Propracovanější design', 'Podpora 14 dní po spuštění'],
        featured: true,
    },
    {
        name: 'Prémiový', price: '24 900', period: 'Kč',
        desc: 'Kompletní online řešení na míru vašim potřebám.',
        features: ['Do 8 podstránek', 'CMS systém', 'Blog nebo aktuality', 'Pokročilé SEO & Analytics', 'Podpora 30 dní po spuštění'],
        featured: false,
    },
]

const faqs = [
    { q: "Jak dlouho trvá vytvoření webu?", a: "Jednostránkový web obvykle spustíme do 7–14 dní od schválení obsahu a designu." },
    { q: "Budu moci web sám upravovat?", a: "Ano, u Standardního a Prémiového balíčku dostanete přístup do redakčního systému, kde si sami upravíte texty a obrázky bez technických znalostí." },
    { q: "Co potřebuji připravit?", a: "Prakticky nic. Obsah, texty i strukturu navrhneme společně. Stačí nám říct, co děláte a pro koho." },
    { q: "Zajistíte i hosting a doménu?", a: "S výběrem hostingu i domény Vám rádi poradíme a pomůžeme s nastavením. Hosting a doména nejsou součástí ceny webu." },
    { q: "Co zahrnuje základní SEO?", a: "Správné nadpisy, meta popisky, rychlost načítání a propojení s Google Search Console. Základ pro vyhledávače bude v pořádku." },
    { q: "Co když nebudu spokojený s návrhem?", a: "Před spuštěním projdeme web společně a zapracujeme Vaše připomínky. Platíte až za výsledek, se kterým budete naprosto spokojeni." },
    { q: "Poskytujete podporu i po spuštění?", a: "Ano, každý balíček zahrnuje podporu po spuštění. 7, 14 nebo 30 dní podle zvoleného plánu." },
]

const processSteps = [
    {
        number: '01', title: 'Ukázka zdarma',
        desc: 'Připravíme návrh přímo pro Váš web. Uvidíte konkrétní představu ještě předtím, než se rozhodnete pro spolupráci.',
        badge: 'Bez závazků',
    },
    {
        number: '02', title: 'Doladění',
        desc: 'Společně upravíme obsah a design podle Vašich představ. Doladíme barvy, texty a rozložení prvků do dokonalosti.',
        badge: 'Podle Vaší vize',
    },
    {
        number: '03', title: 'Spuštění',
        desc: 'Web nasadíme, napojíme na Vaši doménu a předáme Vám ho plně funkční. Včetně SEO základů a kontaktního formuláře.',
        badge: 'Online do 14 dnů',
    },
]

const portfolioProjects = [
    {
        title: 'RB Place',
        desc: 'Realitní platforma pro prodej nemovitostí v Costa Blanca a Costa Cálida ve Španělsku.',
        image: '/portfolio-rbplace.png',
        tags: ['Reality', 'Vyhledávání', 'SEO', 'CMS'],
        color: 'from-blue-500/20 to-accent/10',
        url: 'https://rbplace.com',
    },
    {
        title: 'Casa Di Marmo',
        desc: 'E-shop s luxusním architektonickým kováním z přírodního kamene, mramoru a travertinu.',
        image: '/portfolio-casadimarmo.png',
        tags: ['E-commerce', 'Design', 'Luxus', 'SEO'],
        color: 'from-pink-500/20 to-accent/10',
        url: 'https://www.casadimarmo.pl',
    },
    {
        title: 'R+ Capital',
        desc: 'Investiční fond zaměřený na autonomii, dual-use technologie a pokročilou výrobu v regionu CEE.',
        image: '/portfolio-rplus.png',
        imagePosition: '35% 20%',
        tags: ['Investice', 'Web na míru', 'CMS', 'SEO'],
        color: 'from-emerald-500/20 to-accent/10',
        url: 'https://rplus.capital',
    },
]

// ─────────────────────────────────────────────────────────────────────────────
// SECTION BADGE — reusable
// ─────────────────────────────────────────────────────────────────────────────
const Badge = ({ children }) => (
    <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full border border-accent/30 bg-accent/5">
        <span className="font-mono text-xs text-accent tracking-widest uppercase">{children}</span>
    </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR — V2: cleaner, tighter
// ─────────────────────────────────────────────────────────────────────────────
const NavbarV2 = () => {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const links = [
        { label: 'Služby', href: '#services' },
        { label: 'Proces', href: '#process' },
        { label: 'Portfolio', href: '#portfolio' },
        { label: 'Ceník', href: '#pricing' },
    ]

    return (
        <>
            {/* Desktop */}
            <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-magnetic hidden md:flex
                ${scrolled
                    ? 'px-5 py-2.5 glass-surface rounded-full plasma-glow-sm'
                    : 'px-8 py-4 bg-transparent'}`}
                style={{ width: scrolled ? 'auto' : '90%', maxWidth: '860px' }}
            >
                <div className="flex items-center justify-between w-full gap-8">
                    <a href="#" className="link-lift">
                        <span className="font-heading font-bold text-sm text-background tracking-tight">weby.Automilly</span>
                    </a>
                    <div className="flex items-center gap-5">
                        {links.map(l => (
                            <a key={l.label} href={l.href}
                                className={`font-body text-sm font-medium link-lift transition-colors duration-300 ${scrolled ? 'text-muted hover:text-background' : 'text-background/70 hover:text-background'}`}>
                                {l.label}
                            </a>
                        ))}
                    </div>
                    <a href="#contact"
                        className="relative overflow-hidden px-5 py-2.5 rounded-full bg-accent text-primary font-heading font-semibold text-sm magnetic-btn group">
                        <span className="absolute inset-0 bg-accentLight translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-magnetic rounded-full" />
                        <span className="relative z-10">Napište nám →</span>
                    </a>
                </div>
            </nav>

            {/* Mobile */}
            <nav className="fixed top-0 left-0 right-0 z-50 md:hidden px-4 py-3">
                <div className="flex items-center justify-between glass-surface rounded-2xl px-4 py-3">
                    <a href="#" className="flex items-center">
                        <span className="font-heading font-bold text-sm text-background">weby.Automilly</span>
                    </a>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-background p-2 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors" aria-label="Menu">
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                {menuOpen && (
                    <div className="mt-2 glass-surface rounded-3xl p-6 flex flex-col gap-4 animate-in">
                        {links.map(l => (
                            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                                className="font-body text-background/80 hover:text-background text-base link-lift py-2 border-b border-white/5 last:border-0">{l.label}</a>
                        ))}
                        <a href="#contact" onClick={() => setMenuOpen(false)}
                            className="mt-2 block text-center px-5 py-3 rounded-full bg-accent text-primary font-heading font-semibold text-sm">
                            Napište nám →
                        </a>
                    </div>
                )}
            </nav>
        </>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO — V2: heavier gradient, visible subtitle + buttons, CSS animation
// ─────────────────────────────────────────────────────────────────────────────
const HeroV2 = () => {
    const [loaded, setLoaded] = useState(false)
    useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t) }, [])

    return (
        <section id="hero" className="relative w-full min-h-[100dvh] flex items-end overflow-hidden">
            {/* Background — animated particle wave */}
            <div className="absolute inset-0 z-0 bg-primary">
                <HeroCanvas />
                {/* Bottom fade to blend into next section */}
                <div className="absolute inset-x-0 bottom-0 h-40" style={{
                    background: 'linear-gradient(to top, #0D0D12 0%, transparent 100%)'
                }} />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full px-6 md:px-16 pb-12 md:pb-20">
              <div className="max-w-7xl mx-auto">
                {/* Badge */}
                <div className={`inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass-surface border border-accent/30
                    transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <span className="w-2 h-2 rounded-full bg-accent pulse-dot" />
                    <span className="font-mono text-xs text-accent tracking-widest uppercase">Webové Studio</span>
                </div>

                {/* Headline — V2: slightly larger, tighter leading */}
                <div className={`mb-5 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <h1 className="font-heading font-extrabold text-5xl md:text-7xl lg:text-[5.5rem] text-background leading-[0.92] tracking-tight">
                        Moderní web i pro
                    </h1>
                    <div className="font-drama italic text-6xl md:text-8xl lg:text-[7rem] text-accent leading-[0.85] mt-1">
                        Vaši firmu.
                    </div>
                </div>

                {/* V2: Subtitle — always visible, stronger contrast */}
                <p className={`font-body text-background/70 text-base md:text-lg max-w-lg mb-8 leading-relaxed
                    transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    Váš web je první dojem, který uděláte. Navrhneme Vám ho na míru. Rychle, přehledně a bez komplikací.
                </p>

                {/* V2: CTAs — more visible, stronger border on secondary */}
                <div className={`flex flex-col sm:flex-row gap-4 items-start
                    transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <a href="#contact"
                        className="relative overflow-hidden inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-primary font-heading font-semibold text-base magnetic-btn group plasma-glow">
                        <span className="absolute inset-0 bg-accentLight translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-400 ease-magnetic rounded-full" />
                        <span className="relative z-10">Chci ukázku zdarma →</span>
                    </a>
                    <a href="#portfolio"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-background/40 text-background/90 font-heading font-medium text-base magnetic-btn hover:border-accent/60 hover:text-background transition-colors duration-300">
                        Naše portfolio
                    </a>
                </div>

                {/* Stats strip — glass bar */}
                <div className={`mt-10 inline-flex flex-wrap gap-6 md:gap-10 px-6 py-4 rounded-2xl glass-surface border border-white/10
                    transition-all duration-700 delay-[400ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {[
                        { value: '3x', label: 'Rychlejší web' },
                        { value: '14 dnů', label: 'Dodání projektu' },
                        { value: '100%', label: 'Mobilní optimalizace' },
                    ].map((s, i, arr) => (
                        <div key={s.label} className={`flex flex-col ${i < arr.length - 1 ? 'pr-6 md:pr-10 border-r border-white/10' : ''}`}>
                            <span className="font-heading font-bold text-accent text-xl md:text-2xl">{s.value}</span>
                            <span className="font-body text-muted text-xs mt-0.5">{s.label}</span>
                        </div>
                    ))}
                </div>
              </div>
            </div>
        </section>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURES — V2: cleaner cards, no heavy GSAP
// ─────────────────────────────────────────────────────────────────────────────

// Card 1: Shuffler — animated stack (V1 animation + V2 visuals + Czech fix)
const ShufflerCardV2 = () => {
    const items = [
        { icon: <Palette size={16} />, label: 'Návrh UI & UX', status: 'Dokončen', color: 'text-emerald-400', progress: 100 },
        { icon: <Code size={16} />, label: 'Programování', status: 'Zpracovává se', color: 'text-accent', progress: 65 },
        { icon: <Layout size={16} />, label: 'Responzivita', status: 'Optimalizována', color: 'text-emerald-400', progress: 100 },
    ]

    const [stack, setStack] = useState(items)
    const [animating, setAnimating] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimating(true)
            setTimeout(() => {
                setStack(prev => { const n = [...prev]; n.unshift(n.pop()); return n })
                setAnimating(false)
            }, 200)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative rounded-3xl p-6 md:p-7 flex flex-col h-full overflow-hidden group
            bg-gradient-to-br from-surface via-surface to-accent/[0.04] border border-surfaceBorder hover:border-accent/30 transition-all duration-500">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-accent/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-heading font-bold text-lg text-background">Profesionální design</h3>
                    <p className="font-body text-muted text-sm mt-1">Žádné šablony, weby na míru</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                    <Palette size={18} />
                </div>
            </div>

            {/* Animated shuffling stack */}
            <div className="relative flex-1 min-h-[220px]">
                {stack.map((item, i) => (
                    <div key={item.label}
                        className={`absolute w-full ${animating && i === 0 ? 'opacity-0 -translate-y-2' : 'opacity-100'}`}
                        style={{
                            top: 0, zIndex: 3 - i,
                            transform: `scale(${1 - i * 0.04}) translateY(${i * 72}px)`,
                            opacity: 1 - i * 0.2,
                            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}>
                        <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-primary/60 border border-surfaceBorder">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                                {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-heading font-semibold text-sm text-background truncate">{item.label}</span>
                                    <span className={`font-mono text-[11px] ${item.color}`}>{item.status}</span>
                                </div>
                                <div className="w-full h-1 rounded-full bg-surfaceBorder overflow-hidden">
                                    <div className={`h-full rounded-full ${item.progress === 100 ? 'bg-emerald-400' : 'bg-accent'}`}
                                        style={{ width: `${item.progress}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative mt-auto pt-4 border-t border-surfaceBorder flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                    <span className="font-mono text-xs text-muted">2 ze 3 dokončeny</span>
                </div>
                <span className="font-mono text-xs text-accent">88%</span>
            </div>
        </div>
    )
}

// Card 2: Typewriter — terminal animation (V1 animation + V2 visuals + Czech fix)
const TypewriterCardV2 = () => {
    const messages = [
        '→ Validace CSS: Úspěšná',
        '→ Mobilní responzivita: 100%',
        '→ Test tabletu: Dokončen',
        '→ Rychlost načítání: 0.8s',
        '→ Přístupnost: A+',
        '→ Kontaktní formulář: Připojen',
        '→ Animace načteny...',
        '→ Systém plně funkční.',
    ]

    const [lines, setLines] = useState([''])
    const [lineIdx, setLineIdx] = useState(0)
    const [charIdx, setCharIdx] = useState(0)
    const containerRef = useRef(null)

    useEffect(() => {
        const currentMsg = messages[lineIdx % messages.length]
        if (charIdx < currentMsg.length) {
            const t = setTimeout(() => {
                setLines(prev => { const n = [...prev]; n[n.length - 1] = currentMsg.slice(0, charIdx + 1); return n })
                setCharIdx(c => c + 1)
            }, 35)
            return () => clearTimeout(t)
        } else {
            const t = setTimeout(() => {
                setLines(prev => [...prev, ''].slice(-6))
                setLineIdx(i => i + 1)
                setCharIdx(0)
            }, 1200)
            return () => clearTimeout(t)
        }
    }, [charIdx, lineIdx])

    useEffect(() => {
        if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight
    }, [lines])

    return (
        <div className="relative rounded-3xl p-6 md:p-7 flex flex-col h-full overflow-hidden group
            bg-gradient-to-br from-surface via-surface to-emerald-500/[0.03] border border-surfaceBorder hover:border-accent/30 transition-all duration-500">
            <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-emerald-400/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-heading font-bold text-lg text-background">Desktop i mobilní verze</h3>
                    <p className="font-body text-muted text-sm mt-1">Funguje na všech zařízeních</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                    <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">Aktivní</span>
                </div>
            </div>

            {/* Typewriter terminal */}
            <div ref={containerRef}
                className="relative flex-1 bg-primary/60 rounded-2xl p-4 overflow-hidden hide-scrollbar min-h-[180px] flex flex-col justify-end border border-surfaceBorder">
                <div className="flex flex-col gap-1.5">
                    {lines.map((line, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <span className="font-mono text-xs text-background/70 leading-5">
                                {line}
                                {i === lines.length - 1 && (
                                    <span className="inline-block w-2 h-4 bg-accent ml-0.5 align-middle blink-cursor" />
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative mt-4 grid grid-cols-3 gap-2">
                {[
                    { label: 'Výkon', val: '100%' },
                    { label: 'Velikost', val: '<1MB' },
                    { label: 'Dostupnost', val: '99.9%' },
                ].map(s => (
                    <div key={s.label} className="bg-primary/60 rounded-xl px-3 py-2.5 text-center border border-surfaceBorder">
                        <div className="font-mono text-accent text-base font-medium">{s.val}</div>
                        <div className="font-body text-muted text-[10px] mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Card 3: Cursor Scheduler — animated cursor (V1 animation + V2 visuals + Czech days)
const SchedulerCardV2 = () => {
    const days = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']
    const [activeDay, setActiveDay] = useState(null)
    const [cursorPos, setCursorPos] = useState({ x: -40, y: -40 })
    const [clicking, setClicking] = useState(false)
    const [savedDay, setSavedDay] = useState(null)
    const [phase, setPhase] = useState('idle')
    const dayRefs = useRef([])
    const containerRef = useRef(null)

    useEffect(() => {
        const runSequence = () => {
            const targetIdx = 4 // Friday — launch day
            const cRect = containerRef.current?.getBoundingClientRect()
            const dRef = dayRefs.current[targetIdx]
            if (!dRef || !cRect) return

            const dRect = dRef.getBoundingClientRect()
            const relX = dRect.left - cRect.left + dRect.width / 2
            const relY = dRect.top - cRect.top + dRect.height / 2

            setPhase('moving')
            setCursorPos({ x: 20, y: 10 })
            setTimeout(() => setCursorPos({ x: relX - 8, y: relY - 8 }), 300)
            setTimeout(() => { setClicking(true); setActiveDay(targetIdx) }, 1200)
            setTimeout(() => { setClicking(false); setPhase('done') }, 1500)
            setTimeout(() => setCursorPos({ x: 80, y: 150 }), 1800)
            setTimeout(() => { setClicking(true); setSavedDay(targetIdx) }, 2200)
            setTimeout(() => { setClicking(false); setPhase('idle') }, 2500)
            setTimeout(() => { setActiveDay(null); setSavedDay(null); setCursorPos({ x: -40, y: -40 }) }, 4000)
        }

        const interval = setInterval(runSequence, 5000)
        const initial = setTimeout(runSequence, 800)
        return () => { clearInterval(interval); clearTimeout(initial) }
    }, [])

    return (
        <div className="relative rounded-3xl p-6 md:p-7 flex flex-col h-full overflow-hidden group
            bg-gradient-to-br from-surface via-surface to-accent/[0.04] border border-surfaceBorder hover:border-accent/30 transition-all duration-500">
            <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-accent/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-heading font-bold text-lg text-background">Výsledky a rychlost</h3>
                    <p className="font-body text-muted text-sm mt-1">Spuštění webu do 14 dní</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                    <Zap size={18} />
                </div>
            </div>

            {/* Interactive calendar with animated cursor */}
            <div ref={containerRef} className="relative flex-1 bg-primary/60 rounded-2xl p-4 min-h-[180px] border border-surfaceBorder">
                <div className="mb-3">
                    <div className="font-mono text-[10px] text-muted mb-3 uppercase tracking-widest">Týden dodání</div>
                    <div className="grid grid-cols-7 gap-1.5">
                        {days.map((day, i) => (
                            <div key={i} ref={el => dayRefs.current[i] = el}
                                className={`aspect-square rounded-lg flex items-center justify-center font-mono text-[11px] font-medium transition-all duration-300
                                    ${savedDay === i ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-110'
                                        : activeDay === i ? 'bg-accent/40 text-accent border border-accent scale-95'
                                        : i < 4 ? 'bg-accent/10 text-accent/60' : 'bg-surfaceBorder text-muted'}`}>
                                {day}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-3 p-3 rounded-xl border border-surfaceBorder">
                    <div className="font-heading text-xs text-background font-semibold mb-0.5">Spuštění webu</div>
                    <div className="font-mono text-[10px] text-muted">Den 14 · Pátek · SEO optimalizováno</div>
                </div>

                <div className={`mt-3 w-full py-2.5 rounded-xl border text-center font-heading text-xs font-semibold transition-all duration-200
                    ${savedDay !== null ? 'bg-accent text-primary border-accent shadow-md shadow-accent/20' : 'border-surfaceBorder text-muted'}`}>
                    {savedDay !== null ? '✓ Spuštěno' : 'Naplánovat start'}
                </div>

                {/* Animated cursor */}
                <div className={`absolute pointer-events-none z-10 ${clicking ? 'scale-75' : 'scale-100'}`}
                    style={{
                        left: `${cursorPos.x}px`, top: `${cursorPos.y}px`,
                        opacity: phase === 'idle' && cursorPos.x < 0 ? 0 : 1,
                        transition: 'left 0.5s cubic-bezier(0.25,0.46,0.45,0.94), top 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.3s, transform 0.15s',
                    }}>
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                        <path d="M0 0L0 16L4.5 11.5L7.5 19L9.5 18L6.5 10.5L12 10.5L0 0Z" fill="#C9A84C" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

const FeaturesV2 = () => {
    const [ref, visible] = useReveal()
    return (
        <section id="services" className="py-20 md:py-28 px-6 md:px-16 bg-primary">
            <div ref={ref} className={`max-w-7xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="mb-14 max-w-2xl">
                    <Badge>Co nabízíme</Badge>
                    <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-background leading-tight tracking-tight mb-4">
                        Navrhneme přesně to,<br />
                        <span className="text-gradient-plasma">co Vaše firma potřebuje</span>
                    </h2>
                    <p className="font-body text-muted text-base leading-relaxed">
                        Moderní přístup k tvorbě webů. Spojujeme atraktivní design, bleskovou rychlost a bezproblémové fungování na všech zařízeních.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <ShufflerCardV2 />
                    <TypewriterCardV2 />
                    <SchedulerCardV2 />
                </div>
            </div>
        </section>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// PHILOSOPHY — V2: tighter, no external image, stronger hierarchy
// ─────────────────────────────────────────────────────────────────────────────
const PhilosophyV2 = () => {
    const sectionRef = useRef(null)
    const line1Ref = useRef(null)
    const headlineRef = useRef(null)
    const bigNumberRef = useRef(null)
    const cardsRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Fade-in the contrast line
            gsap.fromTo(line1Ref.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: line1Ref.current, start: 'top 85%' }
                }
            )

            // Headline reveal
            if (headlineRef.current) {
                gsap.fromTo(headlineRef.current,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1, y: 0,
                        duration: 0.7,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: headlineRef.current, start: 'top 82%' }
                    }
                )
            }

            // Giant "14 dní." — dramatic scale-up entrance
            if (bigNumberRef.current) {
                gsap.fromTo(bigNumberRef.current,
                    { opacity: 0, y: 40, scale: 0.85 },
                    {
                        opacity: 1, y: 0, scale: 1,
                        duration: 1.2,
                        ease: 'back.out(1.2)',
                        scrollTrigger: { trigger: bigNumberRef.current, start: 'top 85%' }
                    }
                )
            }

            // Value prop cards stagger
            if (cardsRef.current) {
                const cards = cardsRef.current.children
                gsap.fromTo(cards,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1, y: 0,
                        stagger: 0.12,
                        duration: 0.7,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: cardsRef.current, start: 'top 85%' }
                    }
                )
            }
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="results"
            className="relative py-28 md:py-40 px-6 md:px-16 overflow-hidden bg-textDark"
        >
            {/* Radial glow behind the big number */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-accent/[0.04] blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Contrast intro line */}
                <p ref={line1Ref} className="font-body text-muted text-base md:text-lg mb-6 leading-relaxed max-w-xl opacity-0">
                    Většina agentur nabízí:{' '}
                    <span className="text-background/40 italic">
                        pomalé šablony, zdlouhavé schůzky a weby, o které se musíte starat sami.
                    </span>
                </p>

                {/* Subheadline */}
                <h2 ref={headlineRef} className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-background leading-tight tracking-tight mb-4 opacity-0">
                    Rychlý web na míru do
                </h2>

                {/* Giant "14 dní." — the hero element */}
                <div ref={bigNumberRef} className="relative mb-14 opacity-0">
                    <div className="flex items-baseline gap-x-3 md:gap-x-5">
                        <span className="font-heading font-extrabold text-[7rem] md:text-[10rem] lg:text-[13rem] text-accent leading-none tracking-tighter">
                            14
                        </span>
                        <span className="font-drama italic text-5xl md:text-7xl lg:text-8xl text-accent/70 leading-none">
                            dní.
                        </span>
                    </div>
                    {/* Decorative underline accent */}
                    <div className="mt-3 h-1 w-32 md:w-48 rounded-full bg-gradient-to-r from-accent via-accent/60 to-transparent" />
                </div>

                {/* Value props — upgraded cards */}
                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { icon: <Zap size={22} />, title: 'Rychlost na prvním místě', desc: 'Váš nový web bude online do 14 dnů. Žádné zbytečné čekání.' },
                        { icon: <Target size={22} />, title: 'Přesně to, co potřebujete', desc: 'Neděláme šablony. Každý web je navržen přímo pro Váš byznys.' },
                        { icon: <BarChart size={22} />, title: 'Měřitelné výsledky', desc: 'Weby, které přiváděly nové poptávky a rostly s vámi.' },
                    ].map(item => (
                        <div key={item.title} className="group flex gap-4 p-5 rounded-2xl border-l-2 border-l-accent/40 border border-white/10 bg-white/[0.04] backdrop-blur-sm hover:border-accent/30 hover:bg-white/[0.07] hover:-translate-y-0.5 transition-all duration-300 opacity-0">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                                {item.icon}
                            </div>
                            <div>
                                <div className="font-heading font-bold text-background text-[15px] mb-1">{item.title}</div>
                                <div className="font-body text-muted text-sm leading-relaxed">{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS — V2: Full-screen stacking pinned cards with GSAP ScrollTrigger
// ─────────────────────────────────────────────────────────────────────────────

/* Animated Illustration 01: Wireframe Builder */
const WireframeAnimV2 = () => {
    const blocksRef = useRef(null)

    useEffect(() => {
        if (!blocksRef.current) return
        const blocks = blocksRef.current.children
        const anim = gsap.fromTo(blocks,
            { opacity: 0, y: 10, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.6, stagger: 0.3,
                ease: 'back.out(1.5)',
                repeat: -1, repeatDelay: 2,
            }
        )
        return () => anim.kill()
    }, [])

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-[200px] aspect-[4/3] rounded-xl border border-accent/20 bg-surface/30 p-3 flex flex-col gap-2 shadow-xl">
                {/* Navbar Wireframe */}
                <div className="w-full flex justify-between items-center border-b border-accent/10 pb-2">
                    <div className="w-5 h-5 rounded-full bg-accent/40 pulse-dot" />
                    <div className="flex gap-2">
                        <div className="w-8 h-1.5 rounded-full bg-muted/40" />
                        <div className="w-6 h-1.5 rounded-full bg-muted/40" />
                    </div>
                </div>
                {/* Animated Blocks */}
                <div ref={blocksRef} className="flex flex-col gap-2 flex-1">
                    <div className="w-full h-12 rounded bg-accent/10 border border-accent/20 flex flex-col justify-center px-3 gap-1.5">
                        <div className="w-1/2 h-2 rounded-full bg-accent/50" />
                        <div className="w-1/3 h-1.5 rounded-full bg-accent/30" />
                    </div>
                    <div className="flex gap-2 flex-1">
                        <div className="flex-1 rounded bg-muted/10 border border-surfaceBorder" />
                        <div className="flex-1 rounded bg-muted/10 border border-surfaceBorder" />
                        <div className="flex-1 rounded bg-muted/10 border border-surfaceBorder" />
                    </div>
                </div>
                <div className="absolute top-2 right-2 font-mono text-[10px] text-muted opacity-50">wireframe.ui</div>
            </div>
        </div>
    )
}

/* Animated Illustration 02: Design System */
const DesignSystemAnimV2 = () => {
    const sliderRef = useRef(null)

    useEffect(() => {
        if (!sliderRef.current) return
        const anim = gsap.to(sliderRef.current, {
            x: '100%', duration: 1.5,
            ease: 'power2.inOut',
            yoyo: true, repeat: -1,
        })
        return () => anim.kill()
    }, [])

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-[200px] flex flex-col gap-6 p-5 rounded-2xl glass-surface border border-accent/10">
                {/* Typography */}
                <div className="flex items-end gap-4">
                    <div className="font-drama italic text-5xl text-accent leading-none">Ag</div>
                    <div className="font-heading font-extrabold text-2xl text-background leading-none">Bb</div>
                    <div className="font-mono text-sm text-muted leading-none">Cc</div>
                </div>
                {/* Color Palette */}
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent relative">
                        <div className="absolute inset-0 rounded-full border-2 border-accent pulse-dot" style={{ animationDuration: '2s' }} />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-background border border-surfaceBorder" />
                    <div className="w-8 h-8 rounded-full bg-textDark border border-surfaceBorder" />
                </div>
                {/* CSS sync loader */}
                <div className="flex flex-col gap-2 w-full mt-2">
                    <div className="w-full h-1.5 rounded-full bg-surface border border-surfaceBorder overflow-hidden relative">
                        <div ref={sliderRef} className="absolute top-0 left-[-50%] w-1/2 h-full bg-accent/70 rounded-full" />
                    </div>
                    <div className="font-mono text-[10px] text-muted flex justify-between">
                        <span>tokens.css</span>
                        <span className="text-accent">syncing</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* Animated Illustration 03: Performance Gauge */
const PerformanceAnimV2 = () => {
    const valueRef = useRef(null)
    const strokeRef = useRef(null)

    useEffect(() => {
        if (!valueRef.current || !strokeRef.current) return
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
        tl.fromTo(strokeRef.current,
            { strokeDashoffset: 283 },
            { strokeDashoffset: 0, duration: 2, ease: 'power3.out' }
        )
        tl.fromTo(valueRef.current,
            { innerHTML: 0 },
            { innerHTML: 100, duration: 2, ease: 'power3.out', snap: { innerHTML: 1 } },
            '<'
        )
        return () => tl.kill()
    }, [])

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="relative w-[140px] h-[140px] flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="70" cy="70" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                        ref={strokeRef} cx="70" cy="70" r="45" fill="none"
                        stroke="#C9A84C" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray="283" strokeDashoffset="283"
                        className="plasma-glow-sm"
                    />
                </svg>
                <div className="flex flex-col items-center justify-center">
                    <span ref={valueRef} className="font-heading font-extrabold text-3xl text-white">100</span>
                </div>
                <div className="absolute -bottom-2 font-mono text-[10px] text-muted tracking-widest uppercase">Performance</div>
            </div>
        </div>
    )
}

const processStepsV2 = [
    {
        number: '01', title: 'Ukázka zdarma',
        desc: 'Připravíme návrh přímo pro Váš web. Uvidíte konkrétní představu ještě předtím, než se rozhodnete pro spolupráci.',
        anim: <WireframeAnimV2 />,
        bg: 'from-[#0A0A14] to-[#10102A]',
        badge: 'Bez závazků',
    },
    {
        number: '02', title: 'Doladění',
        desc: 'Společně upravíme obsah a design podle Vašich představ. Doladíme barvy, texty a rozložení prvků do dokonalosti.',
        anim: <DesignSystemAnimV2 />,
        bg: 'from-[#0D0D1E] to-[#130D26]',
        badge: 'Podle Vaší vize',
    },
    {
        number: '03', title: 'Spuštění',
        desc: 'Web nasadíme, napojíme na Vaši doménu a předáme Vám ho plně funkční. Včetně SEO základů a kontaktního formuláře.',
        anim: <PerformanceAnimV2 />,
        bg: 'from-[#0A0A14] to-[#0D1020]',
        badge: 'Online do 14 dnů',
    },
]

const ProcessV2 = () => {
    const sectionRef = useRef(null)
    const cardsRef = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            cardsRef.current.forEach((card, i) => {
                if (!card) return

                if (i < processStepsV2.length - 1) {
                    ScrollTrigger.create({
                        trigger: card,
                        start: 'top top',
                        end: 'bottom top',
                        pin: true,
                        pinSpacing: false,
                        onUpdate: (self) => {
                            const progress = self.progress
                            gsap.set(card, {
                                scale: 1 - progress * 0.08,
                                filter: `blur(${progress * 8}px)`,
                                opacity: 1 - progress * 0.5,
                            })
                        },
                    })
                }
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} id="process" className="relative bg-primary">
            {/* Section header */}
            <div className="px-6 md:px-16 pt-24 pb-12">
              <div className="max-w-7xl mx-auto">
                <Badge>Proces</Badge>
                <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-background leading-tight tracking-tight">
                    Tři kroky k Vašemu<br />
                    <span className="text-gradient-plasma">novému webu</span>
                </h2>
              </div>
            </div>

            {/* Stacking Cards */}
            {processStepsV2.map((step, i) => (
                <div
                    key={step.number}
                    ref={el => cardsRef.current[i] = el}
                    className={`protocol-card relative min-h-screen flex items-center px-6 md:px-16 bg-gradient-to-br ${step.bg}`}
                    style={{ zIndex: i + 1 }}
                >
                    {/* Top border accent */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

                    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center py-20">
                        {/* Text */}
                        <div>
                            <div className="font-mono text-accent text-xs tracking-widest uppercase mb-4">Krok {step.number}</div>
                            <h3 className="font-heading font-extrabold text-3xl md:text-5xl text-background leading-tight mb-6">
                                {step.title}
                            </h3>
                            <p className="font-body text-muted text-base leading-relaxed max-w-md">
                                {step.desc}
                            </p>
                            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-surface border border-accent/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
                                <span className="font-mono text-xs text-muted">{step.badge}</span>
                            </div>
                        </div>

                        {/* Animation Panel */}
                        <div className="w-full aspect-square max-w-sm mx-auto md:mx-0 glass-surface rounded-4xl plasma-glow overflow-hidden">
                            {step.anim}
                        </div>
                    </div>
                </div>
            ))}
        </section>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO — V2: project showcase with browser-frame cards
// ─────────────────────────────────────────────────────────────────────────────
const PortfolioCardV2 = ({ project, index }) => {
    const [ref, visible] = useReveal(0.1)

    return (
        <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            ref={ref}
            className={`group relative rounded-3xl overflow-hidden border border-surfaceBorder hover:border-accent/30 transition-all duration-500 hover:-translate-y-1 block
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${index * 120}ms` }}
        >
            {/* Browser frame top bar */}
            <div className="flex items-center gap-2 px-5 py-3 bg-surface/80 border-b border-surfaceBorder">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                </div>
                <div className="flex-1 flex items-center gap-2 mx-3 px-3 py-1 rounded-lg bg-primary/60 border border-surfaceBorder">
                    <Globe size={10} className="text-muted flex-shrink-0" />
                    <span className="font-mono text-[10px] text-muted truncate">{project.url.replace('https://', '').replace('http://', '')}</span>
                </div>
            </div>

            {/* Project image */}
            <div className="relative aspect-[16/10] overflow-hidden">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: project.imagePosition || 'center top' }}
                    loading="lazy"
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-40 mix-blend-multiply`} />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />

                {/* Hover overlay with link icon */}
                <div className="absolute inset-0 bg-accent/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl glass-surface border border-accent/30 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                        <ExternalLink size={18} className="text-accent" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative p-6 bg-surface/40">
                <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 font-mono text-[10px] text-accent uppercase tracking-wider">
                            {tag}
                        </span>
                    ))}
                </div>
                <h3 className="font-heading font-bold text-lg text-background mb-2 group-hover:text-accent transition-colors duration-300">
                    {project.title}
                </h3>
                <p className="font-body text-muted text-sm leading-relaxed">
                    {project.desc}
                </p>
            </div>
        </a>
    )
}

const PortfolioV2 = () => {
    const [ref, visible] = useReveal()

    return (
        <section id="portfolio" className="py-20 md:py-28 px-6 md:px-16 bg-primary">
            <div ref={ref} className={`max-w-7xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                    <div>
                        <Badge>Portfolio</Badge>
                        <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-background leading-tight tracking-tight mb-4">
                            Ukázky naší <span className="text-gradient-plasma">práce</span>
                        </h2>
                        <p className="font-body text-muted text-base leading-relaxed max-w-lg">
                            Každý projekt je unikátní. Podívejte se, jak pomáháme firmám získat moderní web, který přináší výsledky.
                        </p>
                    </div>
                    <a href="#contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-accent/40 text-accent font-heading font-semibold text-sm hover:bg-accent/10 transition-all duration-300 magnetic-btn flex-shrink-0">
                        Chci podobný web
                        <ArrowRight size={14} />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {portfolioProjects.map((project, i) => (
                        <PortfolioCardV2 key={project.title} project={project} index={i} />
                    ))}
                </div>
            </div>
        </section>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING — V2: featured card uses border accent instead of full gold bg
// ─────────────────────────────────────────────────────────────────────────────
const PricingCardV2 = ({ tier }) => (
    <div className={`rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 relative
        ${tier.featured
            ? 'bg-surface border-2 border-accent md:scale-105 md:-my-4 shadow-2xl shadow-accent/10 z-10'
            : 'glass-surface hover:border-accent/20'
        }`}>
        {tier.featured && (
            <>
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-accent text-primary font-mono text-[10px] font-bold tracking-widest uppercase whitespace-nowrap shadow-lg shadow-accent/20">
                    Nejoblíbenější
                </div>
                {/* Subtle glow behind featured card */}
                <div className="absolute -inset-px rounded-2xl bg-accent/5 blur-xl -z-10" />
            </>
        )}
        <div>
            <div className={`font-mono text-xs uppercase tracking-widest mb-2 ${tier.featured ? 'text-accent' : 'text-muted'}`}>{tier.name}</div>
            <div className="font-heading font-extrabold text-4xl text-background">
                {tier.price}
                <span className="font-body font-normal text-sm ml-1 text-muted">{tier.period}</span>
            </div>
        </div>
        <p className="font-body text-sm text-muted">{tier.desc}</p>
        <ul className="flex flex-col gap-2.5 flex-1">
            {tier.features.map(f => (
                <li key={f} className="flex items-center gap-2.5 font-body text-sm text-background/70">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${tier.featured ? 'bg-accent/20' : 'bg-accent/15'}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    </div>
                    {f}
                </li>
            ))}
        </ul>
        <a href="#contact"
            className={`mt-2 block text-center px-6 py-3.5 rounded-full font-heading font-semibold text-sm magnetic-btn transition-all duration-300
                ${tier.featured
                    ? 'bg-accent text-primary hover:bg-accentLight shadow-lg shadow-accent/20'
                    : 'border border-accent/40 text-accent hover:bg-accent/10'
                }`}>
            Mám zájem
        </a>
    </div>
)

const PricingV2 = () => {
    const [ref, visible] = useReveal()

    return (
        <section id="pricing" className="py-20 md:py-28 px-6 md:px-16 bg-textDark">
            <div ref={ref} className={`max-w-7xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="text-center mb-14">
                    <Badge>Ceník</Badge>
                    <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-background leading-tight tracking-tight mb-4">
                        Vyberte si <span className="text-gradient-plasma">řešení pro Vás</span>
                    </h2>
                    <p className="font-body text-muted text-base max-w-md mx-auto">
                        Ceny jsou uvedeny bez DPH. Všechny balíčky zahrnují úvodní konzultaci zdarma.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4 items-start md:items-center">
                    {pricingTiers.map(tier => <PricingCardV2 key={tier.name} tier={tier} />)}
                </div>

                {/* Custom offer teaser */}
                <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 rounded-2xl border border-accent/15 bg-white/[0.02]">
                    <div className="flex-1">
                        <h3 className="font-heading font-bold text-xl md:text-2xl text-background mb-2">
                            Není Vám žádný balíček přesně na míru?
                        </h3>
                        <p className="font-body text-muted text-sm leading-relaxed max-w-lg">
                            Každá firma je jiná. Připravíme Vám individuální nabídku přesně podle Vašich potřeb.
                        </p>
                    </div>
                    <a href="#contact"
                        className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-accent/40 text-accent font-heading font-semibold text-sm hover:bg-accent/10 transition-all duration-300 magnetic-btn">
                        Napište nám
                        <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ — V2: minor cleanup
// ─────────────────────────────────────────────────────────────────────────────
const FaqAccordionV2 = () => {
    const [active, setActive] = useState(null)

    return (
        <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden border transition-all duration-300 hover:border-accent/20
                    ${active === i ? 'border-accent/30 bg-surface/60' : 'border-white/5 bg-surface/30 hover:bg-surface/40'}`}>
                    <button onClick={() => setActive(active === i ? null : i)}
                        className="w-full flex items-center justify-between px-6 md:px-8 py-5 md:py-6 text-left gap-4 group">
                        <span className="font-heading font-semibold text-base md:text-lg text-background group-hover:text-accent transition-colors duration-200">{faq.q}</span>
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300
                            ${active === i ? 'rotate-45 border-accent bg-accent/10' : 'border-accent/30 group-hover:border-accent/60'}`}>
                            <span className="text-accent text-base leading-none font-light">+</span>
                        </div>
                    </button>
                    <div className={`grid transition-all duration-400 ease-magnetic ${active === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="px-6 md:px-8 pb-6 pt-0">
                                <div className="h-px w-full bg-gradient-to-r from-accent/20 via-accent/10 to-transparent mb-4" />
                                <p className="font-body text-muted text-base leading-relaxed">{faq.a}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const FaqSectionV2 = () => {
    const [ref, visible] = useReveal()

    return (
        <section id="faq" className="py-24 md:py-36 px-6 md:px-16 bg-primary">
            <div ref={ref} className={`max-w-7xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="mb-14 text-center">
                    <Badge>FAQs</Badge>
                    <h2 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-background leading-tight tracking-tight">
                        Časté <span className="text-gradient-plasma">dotazy</span>
                    </h2>
                </div>
                <FaqAccordionV2 />
            </div>
        </section>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL CTA + CONTACT FORM — V2 (merged)
// ─────────────────────────────────────────────────────────────────────────────
const FinalCtaV2 = () => {
    const [ref, visible] = useReveal()
    const [submitted, setSubmitted] = useState(false)
    const [sending, setSending] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', website: '', message: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
        setSending(true)
        // Simulate submission delay — replace with real API endpoint
        await new Promise(r => setTimeout(r, 1200))
        setSending(false)
        setSubmitted(true)
    }

    return (
        <section id="contact" className="relative py-24 md:py-36 px-6 md:px-16 bg-textDark border-t border-white/5 overflow-hidden">
            {/* Radial glows */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-accent/[0.07] blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/[0.03] blur-[100px] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

            <div ref={ref} className={`relative z-10 max-w-2xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="text-center mb-12">
                    <h2 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-background leading-tight tracking-tight mb-3">
                        Chcete vidět, jak by<br />
                        <span className="font-drama italic text-accent">Váš web mohl vypadat?</span>
                    </h2>
                    <p className="font-body text-muted text-base max-w-md mx-auto">
                        Připravíme Vám ukázku zdarma. Bez závazků a bez prodejního tlaku.
                    </p>
                </div>

                {submitted ? (
                    <div className="bg-surface/50 border border-accent/30 rounded-3xl p-8 md:p-10 text-center">
                        <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-5">
                            <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="font-heading font-bold text-2xl text-background mb-2">Poptávka odeslána</h3>
                        <p className="font-body text-muted text-sm">Děkujeme! Ozveme se Vám do 24 hodin.</p>
                    </div>
                ) : (
                    <form className="flex flex-col gap-3.5 bg-surface/50 border border-surfaceBorder rounded-3xl p-8 md:p-10" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-3.5">
                            <input type="text" placeholder="Jméno" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                className="w-full bg-primary border border-surfaceBorder rounded-xl px-4 py-3 font-body text-sm text-background placeholder:text-muted focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all" />
                            <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                className="w-full bg-primary border border-surfaceBorder rounded-xl px-4 py-3 font-body text-sm text-background placeholder:text-muted focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all" />
                        </div>
                        <input type="url" placeholder="Webová stránka (volitelné)" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                            className="w-full bg-primary border border-surfaceBorder rounded-xl px-4 py-3 font-body text-sm text-background placeholder:text-muted focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all" />
                        <textarea placeholder="Co potřebujete?" rows={4} required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                            className="w-full bg-primary border border-surfaceBorder rounded-xl px-4 py-3 font-body text-sm text-background placeholder:text-muted focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all resize-none" />
                        <button type="submit" disabled={sending}
                            className="relative overflow-hidden w-full bg-accent text-primary rounded-xl px-6 py-3.5 font-heading font-semibold text-sm magnetic-btn mt-1 group disabled:opacity-70">
                            <span className="absolute inset-0 bg-accentLight translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-magnetic rounded-xl" />
                            <span className="relative z-10">{sending ? 'Odesílání...' : 'Odeslat poptávku'}</span>
                        </button>
                        <p className="text-center font-mono text-[10px] text-muted uppercase tracking-widest mt-1">Bez závazků · Odpovíme do 24 hodin</p>
                    </form>
                )}
            </div>
        </section>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER — V2: tighter
// ─────────────────────────────────────────────────────────────────────────────
const FooterV2 = () => (
    <footer className="bg-primary relative">
        {/* Top gradient separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 md:px-16 pt-16 pb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14">
                <div className="col-span-2 md:col-span-1">
                    <div className="mb-4">
                        <span className="font-heading font-bold text-background text-base">weby.Automilly</span>
                    </div>
                    <p className="font-body text-muted text-sm leading-relaxed max-w-[220px]">
                        Váš spolehlivý partner pro moderní a funkční weby na míru.
                    </p>
                </div>
                {[
                    { title: 'Sekce', links: [{ l: 'Služby', h: '#services' }, { l: 'Proces', h: '#process' }, { l: 'Portfolio', h: '#portfolio' }, { l: 'Ceník', h: '#pricing' }] },
                    { title: 'Společnost', links: [{ l: 'Sjednat schůzku', h: '#contact' }, { l: 'automilly.com', h: 'https://automilly.com', ext: true }] },
                    { title: 'Právní', links: [{ l: 'Ochrana osobních údajů', h: '#' }, { l: 'Obchodní podmínky', h: '#' }] },
                ].map(col => (
                    <div key={col.title}>
                        <div className="font-mono text-accent/60 text-[10px] uppercase tracking-widest mb-4">{col.title}</div>
                        <div className="flex flex-col gap-2.5">
                            {col.links.map(link => (
                                <a key={link.l} href={link.h} target={link.ext ? '_blank' : undefined} rel={link.ext ? 'noopener noreferrer' : undefined}
                                    className="font-body text-sm text-muted hover:text-background hover:translate-x-0.5 transition-all duration-200">
                                    {link.l}
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="pt-6 border-t border-white/5 flex justify-center">
                <p className="font-mono text-muted/60 text-xs">© {new Date().getFullYear()} Štěpán Rezek · DIČ 0312110722</p>
            </div>
        </div>
    </footer>
)

// ─────────────────────────────────────────────────────────────────────────────
// APP V2 — Full redesigned page
// ─────────────────────────────────────────────────────────────────────────────
function AppV2() {
    return (
        <div className="bg-primary min-h-screen cursor-none">
            <CustomCursor />
            <NavbarV2 />
            <HeroV2 />
            <FeaturesV2 />
            <PhilosophyV2 />
            <ProcessV2 />
            <PortfolioV2 />
            <PricingV2 />
            <FaqSectionV2 />
            <FinalCtaV2 />
            <FooterV2 />
        </div>
    )
}

export default AppV2
