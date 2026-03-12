import { useEffect, useRef, useState } from 'react'

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const navRef = useRef(null)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 80)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { label: 'Proces', href: '#process' },
        { label: 'Co nabízíme', href: '#services' },
        { label: 'Výsledky', href: '#results' },
        { label: 'Ceník', href: '#pricing' },
    ]

    return (
        <>
            {/* Desktop Navbar */}
            <nav
                ref={navRef}
                id="navbar"
                className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-magnetic hidden md:flex
          ${scrolled
                        ? 'px-6 py-3 glass-surface rounded-full plasma-glow-sm'
                        : 'px-8 py-4 bg-transparent'
                    }`}
                style={{ width: scrolled ? 'auto' : '90%', maxWidth: '900px' }}
            >
                <div className="flex items-center justify-between w-full gap-8">
                    {/* Logo */}
                    <a href="#" className="link-lift group">
                        <span className={`font-heading font-700 text-sm tracking-tight transition-colors duration-300 ${scrolled ? 'text-background' : 'text-background'}`}>
                            weby.Automilly
                        </span>
                    </a>

                    {/* Nav Links */}
                    <div className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className={`font-body text-sm font-medium link-lift transition-colors duration-300
                  ${scrolled ? 'text-muted hover:text-background' : 'text-background/70 hover:text-background'}`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA */}
                    <a
                        href="#contact"
                        id="navbar-cta"
                        className="relative overflow-hidden px-5 py-2.5 rounded-full bg-accent text-primary font-heading font-semibold text-sm magnetic-btn group"
                    >
                        <span className="absolute inset-0 bg-accentLight translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-magnetic rounded-full" />
                        <span className="relative z-10">Napište nám →</span>
                    </a>
                </div>
            </nav>

            {/* Mobile Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 md:hidden px-4 py-4">
                <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'glass-surface rounded-2xl px-4 py-3' : ''}`}>
                    <a href="#" className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-background">weby.Automilly</span>
                    </a>
                    <button
                        id="mobile-menu-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-background p-2"
                        aria-label="Toggle menu"
                    >
                        <div className={`w-5 h-0.5 bg-current mb-1 transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                        <div className={`w-5 h-0.5 bg-current mb-1 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                        <div className={`w-5 h-0.5 bg-current transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="mt-2 glass-surface rounded-3xl p-6 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="font-body text-background/80 hover:text-background text-base link-lift"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            onClick={() => setMenuOpen(false)}
                            className="mt-2 block text-center px-5 py-3 rounded-full bg-accent text-primary font-heading font-semibold text-sm magnetic-btn"
                        >
                            Napište nám →
                        </a>
                    </div>
                )}
            </nav>
        </>
    )
}

export default Navbar
