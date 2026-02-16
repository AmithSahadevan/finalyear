import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Activity, ArrowRight } from 'lucide-react';

const Hero = () => {
    const [activeStatus, setActiveStatus] = useState('Listening');

    useEffect(() => {
        const statuses = ['Listening', 'Analyzing', 'Evaluating'];
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % statuses.length;
            setActiveStatus(statuses[index]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className='relative min-h-screen flex items-center overflow-hidden pt-20'>
            <div className='relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
                
                {/* Content aligned to Left */}
                <div className='text-left md:pl-8'>
                    {/* AI Status Indicator */}
                    <div className='flex items-center gap-4 mb-8'>
                        <div className='relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-900/20 border border-emerald-500/20'>
                           <Mic className='w-5 h-5 text-emerald-400' />
                        </div>
                        <div className='h-8 flex items-center overflow-hidden relative'>
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={activeStatus}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className='flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wider uppercase'
                                >
                                    <Activity className='w-3 h-3 animate-pulse' />
                                    <span>{activeStatus}</span>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <h1 className='text-5xl md:text-7xl font-serif font-medium tracking-tight leading-tight mb-8'>
                        Master Your<br />
                        <span className='bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-300 bg-clip-text text-transparent'>
                            Interview Voice
                        </span>
                    </h1>
                     
                    <p className='text-lg text-white/60 max-w-xl mb-10 leading-relaxed font-light'>
                        Real-time AI analysis of your tone, pace, and clarity. Get instant feedback to speak with confidence and land your dream job.
                    </p>

                    <div className='flex flex-col sm:flex-row gap-4'>
                         <button className='group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] overflow-hidden'>
                            <span className='relative z-10 flex items-center gap-2'>
                                Start Interview
                                <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                            </span>
                        </button>
                        <button className='px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-medium transition-all duration-300 backdrop-blur-sm'>
                            Watch Demo
                        </button>
                    </div>
                </div>

                {/* Empty space on Right for Particles */}
                <div className='hidden md:block h-full min-h-[50vh]'>
                    {/* Particles will appear here */}
                </div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div
                className='absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20'
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className='w-5 h-8 border-2 border-current rounded-full flex justify-center pt-2'>
                    <div className='w-0.5 h-1.5 bg-current rounded-full' />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;

