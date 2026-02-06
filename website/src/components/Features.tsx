import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Brain, ShieldCheck, Users, Zap } from 'lucide-react';

const features = [
    {
        icon: <Zap className="w-6 h-6 text-primary-400" />,
        title: "Autonomous Interviews",
        description: "Conduct thousands of first-round screens simultaneously without scheduling conflicts."
    },
    {
        icon: <ShieldCheck className="w-6 h-6 text-primary-400" />,
        title: "Bias-Free Evaluation",
        description: "Standardize scoring criteria to eliminate unconscious bias and judge solely on performance."
    },
    {
        icon: <Brain className="w-6 h-6 text-primary-400" />,
        title: "Deep Behavioral Insight",
        description: "Go beyond keywords. Our AI analyzes improved problem-solving and communication clarity."
    },
    {
        icon: <Users className="w-6 h-6 text-primary-400" />,
        title: "Training Mode",
        description: "Use the same engine to upskill your existing workforce with private, safe practice environments."
    }
];

const Features = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
    const opacity = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

    return (
        <motion.section
            id="features"
            ref={containerRef}
            style={{ scale, opacity }}
            className="py-24 bg-bg-800/50"
        >
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <span className="text-primary-400 uppercase tracking-widest text-xs font-medium">Platform Capabilities</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mt-4 mb-6">Built for Modern Recruiting</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel p-8 rounded-2xl hover:bg-white/10 transition-all duration-300"
                        >
                            <div className="mb-6 p-3 bg-white/5 w-fit rounded-xl border border-white/10">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-serif text-white mb-3">{feature.title}</h3>
                            <p className="text-sm text-text-muted leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default Features;
