import { motion } from 'framer-motion';

const About = () => {
    return (
        <section id="about" className="py-24">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="p-8 md:p-12 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm"
                >
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-8">Unlocking Human Potential</h2>
                    <p className="text-lg text-text-muted leading-relaxed mb-6">
                        Voca is dedicated to removing bias and inefficiency from the hiring process. By using AI to conduct standardized, high-quality interviews, we help companies find hidden talent that traditional resumes miss.
                    </p>
                    <p className="text-lg text-text-muted leading-relaxed">
                        We also believe in transparency. That's why the same technology used to assess candidates is available to help them practice and improve.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
