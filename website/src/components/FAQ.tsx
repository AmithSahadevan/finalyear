import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "Can Voca conduct interviews for us?",
        answer: "Yes. For Enterprise clients, Voca acts as an autonomous interviewer, conducting first-round screening to evaluate thousands of candidates on communication and behavioral fit."
    },
    {
        question: "Is there an API for integration?",
        answer: "Yes, our Enterprise plan includes API access, allowing you to integrate Voca's analysis engine directly into your ATS, LMS, or HR platforms."
    },
    {
        question: "Do you offer discounts for universities?",
        answer: "We offer special pricing for educational institutions. Our Institution plan is designed to be affordable and scalable for large student bodies."
    },
    {
        question: "What if the limit reaches before one month?",
        answer: "No problem! You can always renew your plan to continue using Voca."
    }

];

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-emerald-500/10 last:border-0 hover:bg-white/5 transition-colors rounded-lg px-4">
            <button
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg text-white font-medium pr-8">{question}</span>
                <span className={`text-emerald-400/70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-text-muted leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    return (
        <section className="py-24 max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-serif text-white mb-12 text-center">Common Questions</h2>
            <div className="space-y-2 glass-panel p-2 rounded-2xl bg-white/5 border border-white/5">
                {faqs.map((faq, index) => (
                    <FAQItem key={index} {...faq} />
                ))}
            </div>
        </section>
    );
};

export default FAQ;
