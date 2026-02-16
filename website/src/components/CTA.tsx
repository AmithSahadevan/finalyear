import { motion } from 'framer-motion';

const CTA = () => {
    return (
        <section className="py-32 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-800/80 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.h2
                    className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Hire the best. <br />
                    <span className="text-emerald-500/80">Without the burnout.</span>
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <button className="px-10 py-4 rounded-full bg-white text-black font-medium text-lg hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
                        Start Free Trial
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
