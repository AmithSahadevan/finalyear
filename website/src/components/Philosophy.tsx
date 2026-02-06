import { motion } from 'framer-motion';

const Philosophy = () => {
    return (
        <section id="philosophy" className="py-24 md:py-32 bg-bg-900 border-t border-white/5">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
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
