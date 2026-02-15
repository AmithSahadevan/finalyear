import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

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
    return (
        <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-8 rounded-3xl border ${plan.highlight ? 'bg-white/5 border-emerald-500/50 shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]' : 'glass-panel border-white/5'} flex flex-col group backdrop-blur-md`}
        >
            {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-xs uppercase tracking-wide border border-emerald-500 z-20 shadow-lg">
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
                            <Check className="w-4 h-4 text-emerald-400 mr-3 mt-0.5" />
                            <span className="flex-1">{feature}</span>
                        </li>
                    ))}
                </ul>

                <button className={`w-full py-3 rounded-xl font-medium transition-all ${plan.highlight ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                    {plan.name === 'Organization' ? 'Contact Sales' : `Get ${plan.name}`}
                </button>
            </div>
        </motion.div>
    );
};

const Pricing = () => {
    return (
        <section id="pricing" className="py-24 relative">
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
