import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Activity, ArrowRight } from 'lucide-react';

const Hero = () => {
    const [activeStatus, setActiveStatus] = useState("Listening");

    useEffect(() => {
        const statuses = ["Listening", "Analyzing", "Evaluating"];
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % statuses.length;
            setActiveStatus(statuses[index]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

                {/* AI Status Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col items-center mb-12"
                >
                    <div className="relative flex items-center justify-center mb-4">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                        <div className="w-16 h-16 rounded-full bg-black/40 border border-emerald-500/30 flex items-center justify-center backdrop-blur-md relative z-10">
                            <Mic className="w-6 h-6 text-emerald-400" />
                        </div>
                        {/* Audio Waveform Effect */}
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute inset-0 border border-emerald-500/10 rounded-full"
                                animate={{ scale: [1, 1.5 + i * 0.2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                        ))}
                    </div>

                    <div className="h-8 flex items-center justify-center overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStatus}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wider uppercase"
                            >
                                <Activity className="w-3 h-3 animate-pulse" />
                                <span>{activeStatus}</span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-[1.1] mb-8">
                        The new standard for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-500">
                            candidate evaluation.
                        </span>
                    </h1>

                    <p className="text-xl text-text-muted max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        Voca is an autonomous interviewing engine that helps companies screen thousands of candidates with human-level nuance and infinite scale. Also available for internal training.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="px-8 py-3.5 rounded-full bg-emerald-500 text-black font-medium text-lg hover:bg-emerald-400 transition-all shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.6)] flex items-center gap-2">
                            Automate Hiring <ArrowRight className="w-4 h-4" />
                        </button>

                        <button className="px-8 py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                            For Training
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="w-5 h-8 border-2 border-current rounded-full flex justify-center pt-2">
                    <div className="w-0.5 h-1.5 bg-current rounded-full" />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
