import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
    {
        quote: "Stepan works extremely hard and always had great creative solutions to get the job done!",
        name: "Josh Andrews",
        company: "Copy Culture",
        initials: "JA",
    },
    {
        quote: "Stepan is diligent, a good communicator and knew how to accomplish everything he promised. I will seek him out again in the future.",
        name: "Scott Guild",
        company: "All Western Mortgage",
        initials: "SG",
    },
    {
        quote: "The automation Automilly built saved us 20+ hours per week immediately. The ROI was clear within the first month.",
        name: "Priya Sharma",
        company: "Growth Ventures",
        initials: "PS",
    },
]

const faqs = [
    {
        q: "What types of processes can be automated with AI?",
        a: "Lead generation & qualification, customer support chatbots, content creation pipelines, CRM data entry, appointment scheduling, email outreach sequences, and more.",
    },
    {
        q: "How fast can you deliver the first automation?",
        a: "We have the first live automation deployed within 48 hours of our onboarding call. No lengthy discovery phases — we move at founder speed.",
    },
    {
        q: "Will this disrupt my current operations?",
        a: "Never. All automations are tested in staging environments and layered on top of your existing stack — your operations keep running uninterrupted.",
    },
    {
        q: "How much does AI automation cost?",
        a: "It depends on the scope. We offer fixed-scope projects as well as ongoing retainers. Book a free Growth Mapping Call and we'll give you a clear quote within 24 hours.",
    },
    {
        q: "Do I need technical knowledge to use your systems?",
        a: "Zero. We build and hand over systems that are designed for non-technical founders. Everything is documented and trained so your team can manage it easily.",
    },
]

const CTA = () => {
    const sectionRef = useRef(null)
    const headlineRef = useRef(null)
    const [openFaq, setOpenFaq] = window.__useState ? window.__useState(null) : [null, () => { }]

    // simple local useState
    const [activeFaq, setActiveFaq] = [openFaq, setOpenFaq]

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(headlineRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: headlineRef.current,
                        start: 'top 80%',
                    }
                }
            )

            // Cards stagger
            gsap.fromTo('.cta-pricing-card',
                { opacity: 0, y: 60 },
                {
                    opacity: 1, y: 0,
                    stagger: 0.15,
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.cta-pricing-grid',
                        start: 'top 80%',
                    }
                }
            )
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={sectionRef}>
            {/* ─── TESTIMONIALS ─── */}
            <section className="py-24 px-6 md:px-16 bg-primary" id="testimonials">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-accent/30 bg-accent/5">
                            <span className="font-mono text-xs text-accent tracking-widest uppercase">Client Results</span>
                        </div>
                        <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-background leading-tight tracking-tight">
                            Trusted by <span className="text-gradient-plasma">satisfied founders</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className="glass-surface rounded-4xl p-7 flex flex-col gap-5 hover:border-accent/30 transition-colors duration-300 magnetic-btn"
                            >
                                {/* Stars */}
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, s) => (
                                        <div key={s} className="w-4 h-4 text-accent">★</div>
                                    ))}
                                </div>

                                <p className="font-body text-background/80 text-sm leading-relaxed italic flex-1">
                                    "{t.quote}"
                                </p>

                                <div className="flex items-center gap-3 pt-4 border-t border-surfaceBorder">
                                    <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center font-heading font-bold text-xs">
                                        {t.initials}
                                    </div>
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

            {/* ─── PRICING / GET STARTED ─── */}
            <section className="py-24 px-6 md:px-16 bg-textDark" id="pricing">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16" ref={headlineRef}>
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-accent/30 bg-accent/5">
                            <span className="font-mono text-xs text-accent tracking-widest uppercase">Plans</span>
                        </div>
                        <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-background leading-tight tracking-tight mb-4">
                            Choose your <span className="text-gradient-plasma">automation tier</span>
                        </h2>
                        <p className="font-body text-muted text-base max-w-md mx-auto">
                            Clear pricing. No hidden fees. Every plan includes a Growth Mapping Call.
                        </p>
                    </div>

                    <div className="cta-pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        {/* Essential */}
                        <div className="cta-pricing-card glass-surface rounded-4xl p-7 flex flex-col gap-5">
                            <div>
                                <div className="font-mono text-muted text-xs uppercase tracking-widest mb-2">Essential</div>
                                <div className="font-heading font-extrabold text-4xl text-background">
                                    $997
                                    <span className="text-muted font-body font-normal text-sm ml-1">/project</span>
                                </div>
                            </div>
                            <p className="font-body text-muted text-sm">Perfect for founders who need one key automation live fast.</p>
                            <ul className="flex flex-col gap-2.5 flex-1">
                                {['1 custom automation flow', 'Business chatbot or lead gen', 'Live in 48 hours', 'Documentation included', 'Email support'].map(f => (
                                    <li key={f} className="flex items-center gap-2 font-body text-sm text-background/70">
                                        <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://cal.com/automilly/growth-mapping-call"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block text-center px-6 py-3 rounded-full border border-accent/40 text-accent font-heading font-semibold text-sm magnetic-btn hover:bg-accent/10 transition-colors duration-300"
                            >
                                Book a Call
                            </a>
                        </div>

                        {/* Performance — FEATURED */}
                        <div className="cta-pricing-card rounded-4xl p-7 flex flex-col gap-5 bg-accent plasma-glow relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accentLight text-white font-mono text-[10px] tracking-widest uppercase">
                                Most Popular
                            </div>
                            <div>
                                <div className="font-mono text-white/60 text-xs uppercase tracking-widest mb-2">Performance</div>
                                <div className="font-heading font-extrabold text-4xl text-white">
                                    $2,497
                                    <span className="text-white/60 font-body font-normal text-sm ml-1">/month</span>
                                </div>
                            </div>
                            <p className="font-body text-white/80 text-sm">For serious operators who want complete automation coverage.</p>
                            <ul className="flex flex-col gap-2.5 flex-1">
                                {['3 custom automation flows', 'Chatbot + Lead Gen + Consulting', 'Bi-weekly strategy calls', 'Full CRM integration', 'Priority support', 'Monthly performance reports'].map(f => (
                                    <li key={f} className="flex items-center gap-2 font-body text-sm text-white/90">
                                        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://cal.com/automilly/growth-mapping-call"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block text-center px-6 py-3 rounded-full bg-white text-accent font-heading font-semibold text-sm magnetic-btn hover:bg-white/90 transition-colors duration-300"
                            >
                                Book a Call
                            </a>
                        </div>

                        {/* Enterprise */}
                        <div className="cta-pricing-card glass-surface rounded-4xl p-7 flex flex-col gap-5">
                            <div>
                                <div className="font-mono text-muted text-xs uppercase tracking-widest mb-2">Enterprise</div>
                                <div className="font-heading font-extrabold text-4xl text-background">
                                    Custom
                                    <span className="text-muted font-body font-normal text-sm ml-1">pricing</span>
                                </div>
                            </div>
                            <p className="font-body text-muted text-sm">Full-scale AI transformation for growing teams and organizations.</p>
                            <ul className="flex flex-col gap-2.5 flex-1">
                                {['Unlimited automation flows', 'Dedicated AI engineer', 'Weekly calls & check-ins', 'Custom AI model integration', 'Slack/Teams live support', 'Full analytics dashboard'].map(f => (
                                    <li key={f} className="flex items-center gap-2 font-body text-sm text-background/70">
                                        <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://cal.com/automilly/growth-mapping-call"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block text-center px-6 py-3 rounded-full border border-accent/40 text-accent font-heading font-semibold text-sm magnetic-btn hover:bg-accent/10 transition-colors duration-300"
                            >
                                Contact Us
                            </a>
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
                            We're <span className="text-gradient-plasma">here to help</span>
                        </h2>
                    </div>

                    <div className="flex flex-col gap-3">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className={`glass-surface rounded-3xl overflow-hidden border transition-all duration-300 ${activeFaq === i ? 'border-accent/30' : 'border-transparent'}`}
                            >
                                <button
                                    id={`faq-${i}`}
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                                >
                                    <span className="font-heading font-semibold text-base text-background">{faq.q}</span>
                                    <div className={`w-6 h-6 rounded-full border border-accent/40 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${activeFaq === i ? 'rotate-45' : ''}`}>
                                        <span className="text-accent text-sm">+</span>
                                    </div>
                                </button>
                                {activeFaq === i && (
                                    <div className="px-6 pb-5">
                                        <p className="font-body text-muted text-sm leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FINAL CTA BANNER ─── */}
            <section className="py-24 px-6 md:px-16 bg-textDark border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-heading font-extrabold text-4xl md:text-6xl text-background leading-tight tracking-tight mb-4">
                        Let's talk about your<br />
                        <span className="font-drama italic text-accent">next big move.</span>
                    </h2>
                    <p className="font-body text-muted text-base max-w-md mx-auto mb-10">
                        Hop on a free Growth Mapping Call and discover how we can eliminate operational drag from your business — in 48 hours.
                    </p>
                    <a
                        href="https://cal.com/automilly/growth-mapping-call"
                        target="_blank"
                        rel="noopener noreferrer"
                        id="final-cta"
                        className="relative overflow-hidden inline-flex items-center gap-3 px-10 py-5 rounded-full bg-accent text-white font-heading font-bold text-base magnetic-btn group plasma-glow"
                    >
                        <span className="absolute inset-0 bg-accentLight translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-400 ease-magnetic rounded-full" />
                        <span className="relative z-10">Book a Free Call</span>
                        <svg className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </section>
        </div>
    )
}

export default CTA
