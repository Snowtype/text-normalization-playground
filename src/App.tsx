import Nav from './components/Nav';
import Hero from './components/Hero';
import Playground from './components/Playground';
import SemioticLegend from './components/SemioticLegend';
import AmbiguityShowcase from './components/AmbiguityShowcase';
import BatchMetrics from './components/BatchMetrics';
import TestCasesPanel from './components/TestCasesPanel';
import Footer from './components/Footer';

export default function App() {
  return (
    <div id="top" className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Playground />
        <SemioticLegend />
        <AmbiguityShowcase />
        <BatchMetrics />
        <TestCasesPanel />
      </main>
      <Footer />
    </div>
  );
}
