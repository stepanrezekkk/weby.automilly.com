import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Hero image: dark marble, gold accents, luxury interiors — Midnight Luxe mood
const HERO_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop'

const Hero = () => {
    const heroRef = useRef(null)
    const taglineRef = useRef(null)
    const headlineTopRef = useRef(null)
    const headlineBotRef = useRef(null)
    const subRef = useRef(null)
    const ctaRef = useRef(null)
    const badgeRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

            tl.fromTo(badgeRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6 }
            )
                .fromTo(headlineTopRef.current,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.8 },
                    '-=0.3'
                )
                .fromTo(headlineBotRef.current,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.9 },
                    '-=0.5'
                )
                .fromTo(subRef.current,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.7 },
                    '-=0.4'
                )
                .fromTo(ctaRef.current,
                    { opacity: 0, y: 20, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)' },
                    '-=0.3'
                )

            // Floating particles
            const particles = heroRef.current.querySelectorAll('.hero-particle')
            particles.forEach((p, i) => {
                gsap.to(p, {
                    y: `${-30 + Math.random() * 60}px`,
                    x: `${-20 + Math.random() * 40}px`,
                    opacity: `${0.1 + Math.random() * 0.4}`,
                    duration: 3 + Math.random() * 3,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: i * 0.3,
                })
            })
        }, heroRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative w-full min-h-[100dvh] flex items-end overflow-hidden"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={HERO_IMAGE}
                    alt="AI-powered digital circuits — Automilly"
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                />
                {/* Heavy gradient overlay — bottom to top */}
                <div className="absolute inset-0 hero-gradient" />
                {/* Purple tint */}
                <div className="absolute inset-0 bg-accent/10 mix-blend-screen" />
            </div>

            {/* Floating Particles */}
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className="hero-particle absolute w-1 h-1 rounded-full bg-accent opacity-30 pointer-events-none"
                    style={{
                        left: `${10 + i * 11}%`,
                        top: `${20 + (i % 3) * 25}%`,
                    }}
                />
            ))}

            {/* Content — bottom left */}
            <div className="relative z-10 w-full px-6 md:px-16 pb-16 md:pb-24 max-w-5xl">
                {/* Badge */}
                <div
                    ref={badgeRef}
                    className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass-surface border border-accent/30"
                >
                    <span className="w-2 h-2 rounded-full bg-accent pulse-dot" />
                    <span className="font-mono text-xs text-accent tracking-widest uppercase">Webové Studio</span>
                </div>

                {/* Headline */}
                <div className="mb-6">
                    <h1
                        ref={headlineTopRef}
                        className="font-heading font-extrabold text-5xl md:text-7xl lg:text-8xl text-background leading-[0.9] tracking-tight mb-2"
                    >
                        Moderní web pro Vaši
                    </h1>
                    <div
                        ref={headlineBotRef}
                        className="font-drama italic text-6xl md:text-8xl lg:text-[7rem] text-accent leading-[0.85]"
                    >
                        firmu.
                    </div>
                </div>

                {/* Subtitle */}
                <p
                    ref={subRef}
                    className="font-body text-background/60 text-base md:text-lg max-w-lg mb-8 leading-relaxed"
                >
                    Váš web je první dojem, který uděláte. Navrhneme Vám ho na míru — rychle, přehledně a bez komplikací.
                </p>

                {/* CTA Group */}
                <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 items-start">
                    <a
                        href="https://cal.com/automilly/growth-mapping-call"
                        target="_blank"
                        rel="noopener noreferrer"
                        id="hero-cta-primary"
                        className="relative overflow-hidden inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-white font-heading font-semibold text-base magnetic-btn group plasma-glow"
                    >
                        <span className="absolute inset-0 bg-accentLight translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-400 ease-magnetic rounded-full" />
                        <span className="relative z-10">Zobrazit ukázku →</span>
                    </a>
                    <a
                        href="#services"
                        id="hero-cta-secondary"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-background/20 text-background/80 font-heading font-medium text-base magnetic-btn hover:border-accent/50 hover:text-background transition-colors duration-300"
                    >
                        Co nabízíme
                    </a>
                </div>

                {/* Stats strip */}
                <div className="mt-12 flex flex-wrap gap-8">
                    {[
                        { value: '3x', label: 'Rychlejší web' },
                        { value: '14 dnů', label: 'Dodání projektu' },
                        { value: '100%', label: 'Mobilní optimalizace' },
                    ].map((stat) => (
                        <div key={stat.label} className="flex flex-col">
                            <span className="font-mono text-accent text-xl font-medium">{stat.value}</span>
                            <span className="font-body text-muted text-xs mt-0.5">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Hero
