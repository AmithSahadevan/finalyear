import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { NoiseBackground } from './ui/noise-background';

const Hero = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

    return (
        <motion.section
            ref={containerRef}
            style={{ scale, opacity }}
            className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
        >
            {/* Abstract Background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                        x: [0, 10, -10, 0],
                        y: [0, 15, -15, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 20, -20, 0],
                        y: [0, -20, 20, 0]
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-[10%] right-[0%] w-[40%] h-[40%] bg-primary-400/20 rounded-full blur-[100px] mix-blend-screen"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        rotate: [0, -10, 10, 0],
                        x: [0, -15, 15, 0],
                        y: [0, 10, -10, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary-900/40 rounded-full blur-[120px]"
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <span className="inline-block px-4 py-1.5 mb-8 rounded-full border border-white/10 bg-white/5 text-xs tracking-widest text-primary-100 uppercase">
                        Intelligent Interviewing
                    </span>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-[1.1] mb-8">
                        The new standard for <br />
                        <span className="text-text-muted">candidate evaluation.</span>
                    </h1>

                    <p className="text-xl text-text-muted max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        Voca is an autonomous interviewing engine that helps companies screen thousands of candidates with human-level nuance and infinite scale. Also available for internal training.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button className="px-8 py-3.5 rounded-full bg-white text-black font-medium text-lg hover:bg-gray-200 transition-all transform hover:scale-105">
                            Automate Hiring
                        </button>

                        <NoiseBackground
                            containerClassName="w-fit p-1.5 rounded-full"
                            gradientColors={[
                                "#064e3b", // emerald-900
                                "#10b981", // emerald-500
                                "#34d399", // emerald-400
                            ]}
                        >
                            <button className="h-full w-full cursor-pointer rounded-full bg-zinc-950 px-8 py-3 text-white border border-white/10 shadow-lg hover:bg-zinc-900 transition-all font-medium text-lg">
                                For Training
                            </button>
                        </NoiseBackground>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2 bg-current rounded-full" />
                </div>
            </motion.div>
        </motion.section>
    );
};

export default Hero;
