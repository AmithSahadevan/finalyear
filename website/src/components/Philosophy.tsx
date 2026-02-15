import { motion } from 'framer-motion';

const Philosophy = () => {
    return (
        <section id="philosophy" className="py-24 md:py-32 relative">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass-panel p-12 rounded-3xl text-center backdrop-blur-md border border-white/5 bg-white/5"
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
