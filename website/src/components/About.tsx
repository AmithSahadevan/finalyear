import { motion } from 'framer-motion';

const About = () => {
    return (
        <section id="about" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Empty space for Particles (Left) */}
                <div className="hidden md:block min-h-[400px]" />
                
                {/* Text Content (Right) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-left"
                >
                    <span className="text-emerald-400 font-mono tracking-widest text-sm uppercase mb-4 block">Our Philosophy</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">Unlocking Human <br/><span className="text-text-muted">Potential</span></h2>
                    <p className="text-lg text-text-muted leading-relaxed mb-6 border-l-2 border-primary-500/30 pl-6">
                        Voca is dedicated to removing bias and inefficiency from the hiring process. By using AI to conduct standardized, high-quality interviews, we help companies find hidden talent that traditional resumes miss.
                    </p>
                    <p className="text-lg text-text-muted leading-relaxed pl-6">
                        We also believe in transparency. That's why the same technology used to assess candidates is available to help them practice and improve.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
