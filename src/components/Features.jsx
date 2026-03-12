import { useEffect, useRef, useState } from 'react'
import { Code, Layout, Palette, Zap } from 'lucide-react'

/* ─── CARD 1: Diagnostic Shuffler — Business Chatbot ─── */
const ShufflerCard = () => {
    const items = [
        { icon: <Palette size={18} />, label: 'Návrh UI & UX', status: 'Dokončen', color: 'text-emerald-400' },
        { icon: <Code size={18} />, label: 'Programování', status: 'Zpracovává se', color: 'text-accent' },
        { icon: <Layout size={18} />, label: 'Responzivita', status: 'Optimalizována', color: 'text-blue-400' },
    ]

    const [stack, setStack] = useState(items)
    const [animating, setAnimating] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimating(true)
            setTimeout(() => {
                setStack(prev => {
                    const next = [...prev]
                    next.unshift(next.pop())
                    return next
                })
                setAnimating(false)
            }, 200)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div id="feature-chatbot" className="glass-surface rounded-4xl p-6 md:p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-heading font-bold text-lg text-background">Profesionální design</h3>
                    <p className="font-body text-muted text-sm mt-1">Žádné šablony, weby na míru</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-accent/15 flex items-center justify-center text-accent">
                    <Palette size={20} />
                </div>
            </div>

            <div className="flex-1 relative flex flex-col gap-2 min-h-[220px]">
                {stack.map((item, i) => (
                    <div
                        key={item.label}
                        className={`absolute w-full transition-all duration-400 ${animating && i === 0 ? 'opacity-0 -translate-y-2' : 'opacity-100'}`}
                        style={{
                            top: 0,
                            zIndex: 3 - i,
                            transform: `scale(${1 - i * 0.05}) translateY(${i * 64}px)`,
                            opacity: 1 - i * 0.2,
                            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                    >
                        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface border border-surfaceBorder">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                                {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-heading font-semibold text-sm text-background truncate">{item.label}</div>
                                <div className={`font-mono text-xs mt-0.5 ${item.color}`}>{item.status}</div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot flex-shrink-0" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-surfaceBorder">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                    <span className="font-mono text-xs text-muted">Proces vizualizace aktivní</span>
                </div>
            </div>
        </div>
    )
}

/* ─── CARD 2: Telemetry Typewriter — Lead Generation ─── */
const TypewriterCard = () => {
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
                setLines(prev => {
                    const next = [...prev]
                    next[next.length - 1] = currentMsg.slice(0, charIdx + 1)
                    return next
                })
                setCharIdx(c => c + 1)
            }, 35)
            return () => clearTimeout(t)
        } else {
            const t = setTimeout(() => {
                setLines(prev => {
                    const next = [...prev, '']
                    return next.slice(-6) // keep last 6 lines
                })
                setLineIdx(i => i + 1)
                setCharIdx(0)
            }, 1200)
            return () => clearTimeout(t)
        }
    }, [charIdx, lineIdx])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [lines])

    return (
        <div id="feature-leads" className="glass-surface rounded-4xl p-6 md:p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-heading font-bold text-lg text-background">Desktop i mobilní verze</h3>
                    <p className="font-body text-muted text-sm mt-1">Funguje na všech zařízeních</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
                    <span className="font-mono text-[10px] text-accent uppercase tracking-widest">Aktivní build</span>
                </div>
            </div>

            <div
                ref={containerRef}
                className="flex-1 bg-surface rounded-3xl p-4 overflow-hidden hide-scrollbar min-h-[180px] flex flex-col justify-end"
            >
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

            <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                    { label: 'Výkon', val: '100%' },
                    { label: 'Velikost', val: '<1MB' },
                    { label: 'Uptime', val: '99.9%' },
                ].map(({ label, val }) => (
                    <div key={label} className="bg-surface rounded-2xl px-3 py-2 text-center">
                        <div className="font-mono text-accent text-base font-medium">{val}</div>
                        <div className="font-body text-muted text-[10px] mt-0.5">{label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ─── CARD 3: Cursor Protocol Scheduler — AI Consulting ─── */
const SchedulerCard = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const [activeDay, setActiveDay] = useState(null)
    const [cursorPos, setCursorPos] = useState({ x: -40, y: -40 })
    const [clicking, setClicking] = useState(false)
    const [savedDay, setSavedDay] = useState(null)
    const [phase, setPhase] = useState('idle') // idle → moving → clicking → done
    const dayRefs = useRef([])
    const containerRef = useRef(null)

    useEffect(() => {
        const runSequence = () => {
            const targetDayIndex = 3 // Wednesday — midweek strategy call
            const containerRect = containerRef.current?.getBoundingClientRect()
            const dayRef = dayRefs.current[targetDayIndex]

            if (!dayRef || !containerRect) return

            const dayRect = dayRef.getBoundingClientRect()
            const relX = dayRect.left - containerRect.left + dayRect.width / 2
            const relY = dayRect.top - containerRect.top + dayRect.height / 2

            // Phase 1: Cursor appears and moves to day
            setPhase('moving')
            setCursorPos({ x: 20, y: 10 })

            setTimeout(() => {
                setCursorPos({ x: relX - 8, y: relY - 8 })
            }, 300)

            // Phase 2: Click day
            setTimeout(() => {
                setClicking(true)
                setActiveDay(targetDayIndex)
            }, 1200)

            setTimeout(() => {
                setClicking(false)
                setPhase('done')
            }, 1500)

            // Phase 3: Move to "Save" button area
            setTimeout(() => {
                setCursorPos({ x: 80, y: 130 })
            }, 1800)

            // Phase 4: Click Save
            setTimeout(() => {
                setClicking(true)
                setSavedDay(targetDayIndex)
            }, 2200)

            setTimeout(() => {
                setClicking(false)
                setPhase('idle')
            }, 2500)

            // Reset
            setTimeout(() => {
                setActiveDay(null)
                setSavedDay(null)
                setCursorPos({ x: -40, y: -40 })
            }, 4000)
        }

        const interval = setInterval(runSequence, 5000)
        const initial = setTimeout(runSequence, 800)
        return () => { clearInterval(interval); clearTimeout(initial) }
    }, [])

    return (
        <div id="feature-consulting" className="glass-surface rounded-4xl p-6 md:p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-heading font-bold text-lg text-background">Výsledky a Rychlost</h3>
                    <p className="font-body text-muted text-sm mt-1">Spuštění webu do 14 dní</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-accent/15 flex items-center justify-center text-accent">
                    <Zap size={20} />
                </div>
            </div>

            <div ref={containerRef} className="flex-1 relative bg-surface rounded-3xl p-4 min-h-[180px]">
                {/* Week Grid */}
                <div className="mb-3">
                    <div className="font-mono text-xs text-muted mb-3 uppercase tracking-widest">Plán projektu</div>
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, i) => (
                            <div
                                key={i}
                                ref={el => dayRefs.current[i] = el}
                                className={`aspect-square rounded-xl flex items-center justify-center font-mono text-xs font-medium transition-all duration-300
                  ${savedDay === i
                                        ? 'bg-accent text-white plasma-glow-sm scale-110'
                                        : activeDay === i
                                            ? 'bg-accent/40 text-accent border border-accent scale-95'
                                            : 'bg-surfaceBorder text-muted hover:bg-accent/10'
                                    }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Session details */}
                <div className="mt-3 p-3 rounded-2xl border border-surfaceBorder">
                    <div className="font-heading text-xs text-background font-semibold mb-1">Spuštění webu</div>
                    <div className="font-mono text-[10px] text-muted">Den 14 · Středa 2:00 PM · Online</div>
                </div>

                {/* Save button */}
                <div className={`mt-3 w-full py-2 rounded-2xl border text-center font-heading text-xs font-semibold transition-all duration-200
          ${savedDay !== null
                        ? 'bg-accent text-white border-accent plasma-glow-sm'
                        : 'border-muted text-muted'
                    }`}>
                    {savedDay !== null ? '✓ Spuštěno' : 'Naplánovat start'}
                </div>

                {/* Animated cursor */}
                <div
                    className={`absolute pointer-events-none transition-all duration-500 ease-magnetic z-10
            ${clicking ? 'scale-75' : 'scale-100'}`}
                    style={{
                        left: `${cursorPos.x}px`,
                        top: `${cursorPos.y}px`,
                        opacity: phase === 'idle' && cursorPos.x < 0 ? 0 : 1,
                        transition: 'left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s, transform 0.15s',
                    }}
                >
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                        <path d="M0 0L0 16L4.5 11.5L7.5 19L9.5 18L6.5 10.5L12 10.5L0 0Z" fill="#C9A84C" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

/* ─── MAIN FEATURES SECTION ─── */
const Features = () => {
    return (
        <section id="services" className="py-24 md:py-32 px-6 md:px-16 bg-primary">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-16 max-w-2xl">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-accent/30 bg-accent/5">
                        <span className="font-mono text-xs text-accent tracking-widest uppercase">Co nabízíme</span>
                    </div>
                    <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-background leading-tight tracking-tight mb-4">
                        Navrhneme přesně to,<br />
                        <span className="text-gradient-plasma">co Vaše firma potřebuje</span>
                    </h2>
                    <p className="font-body text-muted text-base leading-relaxed">
                        Moderní přístup k tvorbě webů. Spojujeme atraktivní design, bleskovou rychlost a bezproblémové fungování na všech zařízeních.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ShufflerCard />
                    <TypewriterCard />
                    <SchedulerCard />
                </div>
            </div>
        </section>
    )
}

export default Features
