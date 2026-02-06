import { motion } from 'framer-motion';
import { Mic, BarChart, Trophy } from 'lucide-react';

const steps = [
    {
        icon: <Mic className="w-8 h-8 md:w-10 md:h-10 text-white" />,
        title: "Create Assessment",
        description: "Select from our role library or build custom scenarios to test specific soft skills and technical knowledge."
    },
    {
        icon: <BarChart className="w-8 h-8 md:w-10 md:h-10 text-white" />,
        title: "Autonomous Screening",
        description: "Candidates interview with our AI voice agent, which adapts follow-up questions in real-time."
    },
    {
        icon: <Trophy className="w-8 h-8 md:w-10 md:h-10 text-white" />,
        title: "Data-Driven Shortlist",
        description: "Receive instant, bias-free scores and transcripts to identify top performers 10x faster."
    }
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-primary-900/10 rounded-full blur-[100px] pointer-events-none" />

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors duration-500">
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-serif text-white mb-4">{step.title}</h3>
                            <p className="text-text-muted leading-relaxed max-w-xs">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
