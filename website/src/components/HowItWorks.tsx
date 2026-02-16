import { motion } from 'framer-motion';
import { Mic, BarChart, Trophy, ArrowRight } from 'lucide-react';

const steps = [
    {
        icon: <Mic className="w-6 h-6 text-emerald-400" />,
        title: "Create Assessment",
        description: "Select from our role library or build custom scenarios."
    },
    {
        icon: <BarChart className="w-6 h-6 text-emerald-400" />,
        title: "Autonomous Screening",
        description: "Candidates interview with our AI voice agent in real-time."
    },
    {
        icon: <Trophy className="w-6 h-6 text-emerald-400" />,
        title: "Data-Driven Shortlist",
        description: "Receive instant, bias-free scores and transcripts."
    }
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">How It Works</h2>
                    <p className="text-text-muted text-lg">A unified platform for improvement.</p>
                </motion.div>

                {/* Pipeline Visualization */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col md:flex-row items-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="glass-panel p-8 rounded-2xl w-full md:w-80 h-64 flex flex-col items-center justify-center text-center bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300"
                            >
                                <div className="w-16 h-16 rounded-full bg-emerald-900/20 border border-emerald-500/20 flex items-center justify-center mb-6">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-serif text-white mb-3">{step.title}</h3>
                                <p className="text-sm text-text-muted leading-relaxed max-w-xs">{step.description}</p>
                            </motion.div>

                            {/* Animated Connector (Desktop only, skipping last item) */}
                            {index < steps.length - 1 && (
                                <motion.div
                                    className="hidden md:flex flex-col items-center justify-center mx-4 text-emerald-500/30"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 + index * 0.2 }}
                                >
                                    <ArrowRight size={24} />
                                </motion.div>
                            )}

                            {/* Mobile Connector */}
                            {index < steps.length - 1 && (
                                <div className="md:hidden py-4 text-emerald-500/30">
                                    <ArrowRight size={24} className="rotate-90" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
