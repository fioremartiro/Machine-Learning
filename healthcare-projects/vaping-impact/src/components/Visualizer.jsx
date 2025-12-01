import { useState, useEffect } from 'react';
import { CR_STATS } from '../data/costaRicaStats';
import LungVisual from './LungVisual';
import AIAnalysisCard from './AIAnalysisCard';
import IngredientsScanner from './IngredientsScanner';
import SocialCard from './SocialCard';
import { analyzeDependency } from '../utils/mlAnalysis';
import './Visualizer.css';

const Visualizer = ({ data, onReset }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [showShare, setShowShare] = useState(false);

    // Animation delay effect
    useEffect(() => {
        const timer = setTimeout(() => setShowDetails(true), 500);

        // Run ML Analysis
        // Run ML Analysis
        const result = analyzeDependency(
            data.daily.nicotineMg,
            'disposable',
            data.user?.age,
            data.user?.yearsVaping
        );
        setAnalysis(result);

        return () => clearTimeout(timer);
    }, [data]);

    const { daily, monthly } = data;

    // Calculate comparisons
    // Cost based on volume (ml), assuming user buys disposables
    const vapesPerMonth = (daily.ml * 30) / CR_STATS.avgVapeMl;
    const costInColones = Math.round(vapesPerMonth * CR_STATS.avgVapePrice);
    const casados = Math.floor(costInColones / 3500);

    return (
        <div className="visualizer-container">
            <div className="shock-header">
                <p className="label">Tu Consumo Diario de Cigarrillos</p>
                <h2 className="big-number">{daily.cigarettes}</h2>
            </div>

            <div className="visual-representation">
                {/* Simple CSS representation of a cigarette pack stack */}
                <div className="cigarette-stack">
                    {Array.from({ length: Math.min(daily.cigarettes, 50) }).map((_, i) => (
                        <div key={i} className="cig-visual" style={{ animationDelay: `${i * 0.05}s` }}></div>
                    ))}
                    {daily.cigarettes > 50 && <div className="plus-more">+{daily.cigarettes - 50} más...</div>}
                </div>
                <p className="caption">Esto es lo que tus pulmones procesan cada día.</p>
            </div>

            <div className={`details-section ${showDetails ? 'visible' : ''}`}>

                {/* ROW 2: AI & Monthly Stats */}
                <div className="grid-row-2">
                    {analysis && <AIAnalysisCard analysis={analysis} />}
                    <div className="stat-card warning">
                        <h3 style={{ color: analysis?.color }}>IMPACTO MENSUAL</h3>
                        <div className="stat-card-content">
                            <div className="stat-row">
                                <span>Nicotina</span>
                                <strong>{monthly.nicotineMg} mg</strong>
                            </div>
                            <div className="stat-row">
                                <span>Cigarrillos</span>
                                <strong>{monthly.cigarettes}</strong>
                            </div>
                            <div className="stat-row">
                                <span>Paquetes</span>
                                <strong>{monthly.packs}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROW 3: Lung & Scanner */}
                <div className="grid-row-3">
                    <LungVisual riskColor={analysis?.color} />
                    <IngredientsScanner />
                </div>

                {/* ROW 4: Context */}
                <div className="grid-row-4">
                    <div className="stat-card local-context">
                        <h3>COMO SE REFLEJA ESTO EN TUS FINANZAS</h3>
                        <p>Estás gastando aprox <strong>₡{costInColones.toLocaleString()}</strong> por mes.</p>
                        <p className="comparison" style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.7 }}>
                            Un vape desechable cuesta aprox ₡{CR_STATS.avgVapePrice.toLocaleString()} en Costa Rica y estás consumiendo aprox <strong>{vapesPerMonth.toFixed(1)}</strong> al mes.
                        </p>
                    </div>
                </div>

                <div className="action-buttons" style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary" onClick={() => setShowShare(true)} style={{ flex: 1 }}>
                        Compartir resultados
                    </button>
                    <button className="btn-primary" onClick={onReset} style={{ flex: 1 }}>
                        Probar otro dispositivo
                    </button>
                </div>
            </div>

            {/* Social Share Modal */}
            {showShare && (
                <SocialCard
                    data={data}
                    onClose={() => setShowShare(false)}
                />
            )}
        </div>
    );
};

export default Visualizer;
