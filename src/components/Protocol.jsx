import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── 01: Wireframe Animation ─── */
const WireframeAnim = () => {
    const blocksRef = useRef(null)

    useEffect(() => {
        if (!blocksRef.current) return
        const blocks = blocksRef.current.children
        const anim = gsap.fromTo(blocks,
            { opacity: 0, y: 10, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.3,
                ease: 'back.out(1.5)',
                repeat: -1,
                repeatDelay: 2,
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

/* ─── 02: Design System Animation ─── */
const DesignSystemAnim = () => {
    const sliderRef = useRef(null)

    useEffect(() => {
        if (!sliderRef.current) return
        const anim = gsap.to(sliderRef.current, {
            x: '100%',
            duration: 1.5,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: -1,
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

/* ─── 03: Performance Animation ─── */
const PerformanceAnim = () => {
    const valueRef = useRef(null)
    const strokeRef = useRef(null)

    useEffect(() => {
        if (!valueRef.current || !strokeRef.current) return
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })

        // The circumference for r=45 is ~283 
        tl.fromTo(strokeRef.current,
            { strokeDashoffset: 283 },
            { strokeDashoffset: 0, duration: 2, ease: 'power3.out' }
        )

        tl.fromTo(valueRef.current,
            { innerHTML: 0 },
            {
                innerHTML: 100,
                duration: 2,
                ease: 'power3.out',
                snap: { innerHTML: 1 },
            },
            '<'
        )

        return () => tl.kill()
    }, [])

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="relative w-[140px] h-[140px] flex items-center justify-center">
                {/* Background Circle */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                        cx="70"
                        cy="70"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="8"
                    />
                    {/* Progress Circle */}
                    <circle
                        ref={strokeRef}
                        cx="70"
                        cy="70"
                        r="45"
                        fill="none"
                        stroke="#C9A84C"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                        className="plasma-glow-sm"
                    />
                </svg>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-start">
                        <span ref={valueRef} className="font-heading font-extrabold text-3xl text-white">100</span>
                    </div>
                </div>
                <div className="absolute -bottom-2 font-mono text-[10px] text-muted tracking-widest uppercase">Performance</div>
            </div>
        </div>
    )
}

/* ─── PROTOCOL SECTION ─── */
const steps = [
    {
        number: '01',
        title: 'Ukázka zdarma',
        desc: 'Připravíme návrh přímo pro Váš web. Uvidíte konkrétní představu ještě předtím, než se rozhodnete pro spolupráci.',
        anim: <WireframeAnim />,
        bg: 'from-[#0A0A14] to-[#10102A]',
    },
    {
        number: '02',
        title: 'Doladění',
        desc: 'Společně upravíme obsah a design podle Vašich představ. Doladíme barvy, texty a rozložení prvků do dokonalosti.',
        anim: <DesignSystemAnim />,
        bg: 'from-[#0D0D1E] to-[#130D26]',
    },
    {
        number: '03',
        title: 'Spuštění',
        desc: 'Web nasadíme, napojíme na Vaši doménu a předáme Vám ho plně funkční. Včetně SEO základů a kontaktního formuláře.',
        anim: <PerformanceAnim />,
        bg: 'from-[#0A0A14] to-[#0D1020]',
    },
]

const Protocol = () => {
    const sectionRef = useRef(null)
    const cardsRef = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            cardsRef.current.forEach((card, i) => {
                if (!card) return

                if (i < steps.length - 1) {
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
            <div className="px-6 md:px-16 pt-24 pb-12 max-w-7xl mx-auto">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-accent/30 bg-accent/5">
                    <span className="font-mono text-xs text-accent tracking-widest uppercase">Proces</span>
                </div>
                <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-background leading-tight tracking-tight">
                    Tři kroky k Vašemu<br />
                    <span className="text-gradient-plasma">novému webu</span>
                </h2>
            </div>

            {/* Stacking Cards */}
            {steps.map((step, i) => (
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

                            {/* Mini badge */}
                            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-surface border border-accent/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
                                <span className="font-mono text-xs text-muted">
                                    {i === 0 ? 'Bez závazků' : i === 1 ? 'Podle vizí' : 'Online do 14 dnů'}
                                </span>
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

export default Protocol
