import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { CanvasRevealEffect } from './ui/canvas-reveal-effect';

const plans = [
    {
        name: "Individual",
        price: "₹10",
        period: "/month",
        description: "For candidates practicing for their next role.",
        features: ["Review Voca Assessments", "3 Mock Interviews / Mo", "Personal Speech Insights"],
        highlight: true
    },
    {
        name: "Institution",
        price: "₹2999",
        period: "/month",
        description: "For Institutions for training Students",
        features: ["100 AI Interviews / Mo", "Custom Role Builder", "Auto-Scheduling", "Basic ATS Integration"],
        highlight: false
    },
    {
        name: "Organization",
        price: "Contact",
        period: "Sales",
        description: "For global teams requiring scale.",
        features: ["Unlimited Screens", "Advanced Bias Protection", "Custom LLM Fine-tuning", "Dedicated CSM", "SSO & Compliance"],
        highlight: false
    }
];

const PricingCard = ({ plan, index }: { plan: typeof plans[0], index: number }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`relative p-8 rounded-3xl border ${plan.highlight ? 'bg-white/5 border-primary-900/50' : 'glass-panel border-white/5'} flex flex-col group`}
        >
             <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0 z-0 overflow-hidden rounded-3xl"
                    >
                        <CanvasRevealEffect
                            animationSpeed={3}
                            containerClassName="bg-transparent"
                            colors={[[46, 127, 85], [107, 185, 127]]}
                            opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
                            dotSize={2}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-900 text-primary-100 px-4 py-1 rounded-full text-xs uppercase tracking-wide border border-primary-700 z-20">
                    Available
                </div>
            )}

            <div className="relative z-10 flex flex-col flex-1 h-full">
                <div className="mb-6">
                    <h3 className="text-2xl font-serif text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline">
                        <span className="text-3xl text-white font-light">{plan.price}</span>
                        {plan.period && <span className="text-text-muted ml-2 text-sm">{plan.period}</span>}
                    </div>
                    <p className="text-sm text-text-muted mt-4 min-h-[40px]">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-300">
                            <Check className="w-4 h-4 text-primary-400 mr-3 mt-0.5" />
                            <span className="flex-1">{feature}</span>
                        </li>
                    ))}
                </ul>

                <button className={`w-full py-3 rounded-xl font-medium transition-all ${plan.highlight ? 'bg-white text-black hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : `Get ${plan.name}`}
                </button>
            </div>
        </motion.div>
    );
};

const Pricing = () => {
    return (
        <section id="pricing" className="py-24 relative">
            {/* Background accent */}
            <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-primary-900/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Plans for Scale</h2>
                    <p className="text-text-muted">Simple pricing for teams of all sizes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <PricingCard key={plan.name} plan={plan} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
