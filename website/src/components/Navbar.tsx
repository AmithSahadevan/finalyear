import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    const navLinks = [
        { name: 'Philosophy', id: 'philosophy' },
        { name: 'Features', id: 'features' },
        { name: 'How It Works', id: 'how-it-works' },
        { name: 'Pricing', id: 'pricing' },
        { name: 'FAQ', id: 'faq' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
            >
                <div className={`w-full max-w-5xl rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-lg shadow-black/20 px-6 py-3 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-black/80 border-emerald-500/20' : ''}`}>

                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse group-hover:scale-125 transition-transform" />
                        <span className="text-xl font-serif text-white tracking-tight">Voca</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.id)}
                                className="text-sm font-medium text-text-muted hover:text-white transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
                            </button>
                        ))}
                    </div>

                    {/* CTA & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <button className="hidden md:block px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-emerald-50 transition-colors shadow-lg shadow-white/5">
                            Get Started
                        </button>
                        <button
                            className="md:hidden text-white p-1"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="fixed top-24 left-4 right-4 z-40 p-6 rounded-2xl bg-black/90 backdrop-blur-3xl border border-white/10 shadow-2xl shadow-black/50 md:hidden"
                    >
                        <div className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => scrollToSection(link.id)}
                                    className="text-lg font-medium text-text-muted hover:text-white text-left py-3 border-b border-white/5 last:border-0 hover:pl-2 transition-all"
                                >
                                    {link.name}
                                </button>
                            ))}
                            <button className="w-full py-4 rounded-full bg-white text-black font-medium mt-4">
                                Get Started
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
