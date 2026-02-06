import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import About from './components/About';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-bg-900 text-text-main font-sans selection:bg-primary-900/30">
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <HowItWorks />
        <Features />
        <About />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default App
