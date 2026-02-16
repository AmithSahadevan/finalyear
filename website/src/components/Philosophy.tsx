import { motion } from 'framer-motion';

const Philosophy = () => {
    return (
        <section id="philosophy" className="py-24 md:py-32 relative">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Empty space for Particles (Left) - matching pos2 waveform */}
                <div className="hidden md:block min-h-[400px]" />
                
                {/* Content aligned to Right */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass-panel p-12 rounded-3xl text-left backdrop-blur-md border border-white/5 bg-white/5"
                >
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-tight">
                        Hiring shouldn't be a guessing game.
                    </h2>
                    <p className="text-xl md:text-2xl text-text-muted font-light leading-relaxed">
                        Traditional interviews are unscalable, biased, and inconsistent. Voca standardizes the process, ensuring every candidate is evaluated on their actual ability to communicate and problem-solve, not just their resume.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Philosophy;
