import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Zap, Target, BarChart } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// Philosophy background — dark abstract gold/luxury texture
const BG_IMAGE = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop'

const Philosophy = () => {
    const sectionRef = useRef(null)
    const line1Ref = useRef(null)
    const line2Ref = useRef(null)
    const accentRef = useRef(null)
    const wordsRef = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Fade in background
            gsap.fromTo(sectionRef.current.querySelector('.philosophy-bg'),
                { scale: 1.05 },
                {
                    scale: 1,
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    }
                }
            )

            // Line 1 reveal
            gsap.fromTo(line1Ref.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: line1Ref.current,
                        start: 'top 85%',
                    }
                }
            )

            // Line 2 word-by-word reveal
            const words = line2Ref.current?.querySelectorAll('.reveal-word')
            if (words) {
                gsap.fromTo(words,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.08,
                        duration: 0.6,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: line2Ref.current,
                            start: 'top 80%',
                        }
                    }
                )
            }

            // Accent highlight pulse
            if (accentRef.current) {
                gsap.fromTo(accentRef.current,
                    { opacity: 0, scale: 0.95 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        ease: 'back.out(1.4)',
                        scrollTrigger: {
                            trigger: accentRef.current,
                            start: 'top 85%',
                        }
                    }
                )
            }
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    const line2Words = [
        'My', 'nabízíme:', 'rychlý', 'web', 'na', 'míru', 'do', '14'
    ]

    return (
        <section
            ref={sectionRef}
            id="results"
            className="relative py-28 md:py-40 px-6 md:px-16 overflow-hidden bg-textDark"
        >
            {/* Parallax BG texture */}
            <div className="philosophy-bg absolute inset-0 z-0 overflow-hidden">
                <img
                    src={BG_IMAGE}
                    alt="Neon microscopy texture"
                    className="w-full h-full object-cover opacity-10"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-textDark via-textDark/80 to-textDark" />
            </div>

            {/* Purple radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Contrast line 1 — neutral small */}
                <p
                    ref={line1Ref}
                    className="font-body text-muted text-base md:text-lg mb-8 leading-relaxed max-w-xl"
                >
                    Většina agentur nabízí:{' '}
                    <span className="text-background/50 italic">
                        pomalé šablony, zdlouhavé schůzky a weby, o které se musíte starat sami.
                    </span>
                </p>

                {/* Line 2 — massive drama serif */}
                <div ref={line2Ref} className="mb-6">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 items-baseline mb-3">
                        {line2Words.map((word, i) => (
                            <span
                                key={i}
                                className="reveal-word font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl text-background leading-tight inline-block"
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                    <div
                        ref={accentRef}
                        className="font-drama italic text-5xl md:text-7xl lg:text-[6rem] text-accent leading-[0.85] block"
                    >
                        dní.
                    </div>
                </div>

                {/* Manifesto lines */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: <Zap size={20} />,
                            title: 'Rychlost na prvním místě',
                            desc: 'Váš nový web bude online do 14 dnů. Žádné zbytečné čekání a protahování.',
                        },
                        {
                            icon: <Target size={20} />,
                            title: 'Přesně to, co potřebujete',
                            desc: 'Neděláme šablony. Každý web je navržen přímo pro Váš byznys a Vaše zákazníky.',
                        },
                        {
                            icon: <BarChart size={20} />,
                            title: 'Měřitelné výsledky',
                            desc: 'Naše weby nejsou jen hezké. Jsou dělané tak, aby přiváděly nové poptávky a rostly s vámi.',
                        },
                    ].map(({ icon, title, desc }) => (
                        <div key={title} className="flex gap-4 p-5 rounded-3xl border border-white/5 bg-white/3 hover:bg-white/5 transition-colors duration-300">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-lg flex-shrink-0">
                                {icon}
                            </div>
                            <div>
                                <div className="font-heading font-semibold text-background text-sm mb-1">{title}</div>
                                <div className="font-body text-muted text-sm leading-relaxed">{desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Philosophy
