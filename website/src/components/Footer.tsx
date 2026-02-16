const Footer = () => {
    return (
        <footer className="border-t border-white/5 py-12 bg-black/20 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <span className="text-2xl font-serif text-white tracking-tight">Voca.</span>
                    <p className="text-sm text-text-muted mt-2">© 2026 Voca AI. All rights reserved.</p>
                </div>

                <div className="flex space-x-8 text-sm text-text-muted">
                    <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
