import { useState } from 'react'
import InputForm from './components/InputForm'
import Visualizer from './components/Visualizer'
import { calculateImpact } from './utils/calculations'
import './App.css'

function App() {
  const [view, setView] = useState('input') // 'input', 'visualizer'
  const [impactData, setImpactData] = useState(null)

  const handleCalculate = (mgPerMl, mlPerDay, age, yearsVaping) => {
    const data = calculateImpact(mgPerMl, mlPerDay);
    // Add demographics to data
    data.user = { age, yearsVaping };
    setImpactData(data);
    setView('visualizer');
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setImpactData(null);
    setView('input');
    window.scrollTo(0, 0);
  };

  const handleHomeClick = () => {
    setView('input');
    setImpactData(null);
  };

  const [smoking, setSmoking] = useState(false);

  const handleLungHover = () => {
    setSmoking(true);
    setTimeout(() => setSmoking(false), 2000);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 onClick={handleHomeClick} className="brand-logo">Vaping Impact</h1>
      </header>

      <main className={`container ${view === 'visualizer' ? 'visualizer-mode' : ''}`}>
        {view === 'input' && (
          <div className="intro-section">
            <div className="lung-container" onMouseEnter={handleLungHover}>
              <div className="lung-icon">🫁</div>
              {smoking && (
                <div className="smoke-effect">
                  <span className="s1"></span>
                  <span className="s2"></span>
                  <span className="s3"></span>
                  <span className="s4"></span>
                  <span className="s5"></span>
                </div>
              )}
            </div>
            <h2>¿Qué tanto estás vapeando?</h2>
            <p className="subtitle">Tu consumo basado en data</p>

            <div style={{ marginTop: '2rem' }}>
              <InputForm onCalculate={handleCalculate} />
            </div>
          </div>
        )}

        {view === 'visualizer' && impactData && (
          <div className="visualizer-section">
            <Visualizer data={impactData} onReset={handleReset} />
          </div>
        )}
      </main>

      <div className="app-divider"></div>
      <footer className="app-footer">
        <p>Costa Rica • 2025</p>
      </footer>
    </div>
  )
}

export default App
