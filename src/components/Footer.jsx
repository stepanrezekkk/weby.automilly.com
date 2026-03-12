const Footer = () => {
    const navColumns = [
        {
            title: 'Sekce',
            links: [
                { label: 'Proces', href: '#process' },
                { label: 'Služby', href: '#services' },
                { label: 'Výsledky', href: '#results' },
                { label: 'Ceník', href: '#pricing' },
            ],
        },
        {
            title: 'Společnost',
            links: [
                { label: 'Sjednat schůzku', href: 'https://cal.com/automilly/growth-mapping-call', external: true },
                { label: 'automilly.com', href: 'https://automilly.com', external: true },
            ],
        },
        {
            title: 'Právní informace',
            links: [
                { label: 'Ochrana osobních údajů', href: '#' },
                { label: 'Obchodní podmínky', href: '#' },
            ],
        },
    ]

    return (
        <footer className="bg-primary rounded-t-[4rem] border-t border-white/5">
            {/* Main footer grid */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 pt-16 pb-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center plasma-glow-sm">
                                <span className="font-mono text-xs font-bold text-white">A</span>
                            </div>
                            <span className="font-heading font-bold text-background text-base">Automilly</span>
                        </div>
                        <p className="font-body text-muted text-sm leading-relaxed max-w-[200px]">
                            Váš spolehlivý partner pro moderní a funkční weby na míru.
                        </p>
                    </div>

                    {/* Nav columns */}
                    {navColumns.map((col) => (
                        <div key={col.title}>
                            <div className="font-mono text-muted text-[10px] uppercase tracking-widest mb-4">{col.title}</div>
                            <div className="flex flex-col gap-2.5">
                                {col.links.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target={link.external ? '_blank' : undefined}
                                        rel={link.external ? 'noopener noreferrer' : undefined}
                                        className="font-body text-sm text-muted hover:text-background link-lift transition-colors duration-200"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-mono text-muted text-xs">
                        © {new Date().getFullYear()} Automilly. Všechna práva vyhrazena.
                    </p>

                    {/* System status indicator */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-surface">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                        <span className="font-mono text-xs text-muted">SYSTÉM V PROVOZU</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
