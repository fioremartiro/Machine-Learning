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
    const [showAllResources, setShowAllResources] = useState(false);

    const resourcesList = [
        { name: 'IAFA Costa Rica', desc: 'Instituto sobre Alcoholismo y Farmacodependencia', url: 'https://iafa.go.cr/aprender/cigarrillos-electronicos-o-vaporizadores/' },
        { name: 'Red Nacional Antitabaco', desc: 'Información local sobre EVALI', url: 'https://www.rednacionalantitabaco.com/tag/evali/' },
        { name: 'OMS: Tabaco', desc: 'Datos y cifras mundiales', url: 'https://www.who.int/es/news-room/fact-sheets/detail/tobacco' },
        { name: 'CDC: EVALI', desc: 'Brote de lesiones pulmonares', url: 'https://www.cdc.gov/mmwr/volumes/68/wr/mm6845e1.htm' },
        { name: 'American Lung Association', desc: 'Salud pulmonar y vapeo', url: 'https://www.lung.org/quit-smoking/e-cigarettes-vaping/lung-health' },
        { name: 'American Heart Association', desc: 'Impacto cardiovascular del tabaco', url: 'https://www.heart.org/en/healthy-living/healthy-lifestyle/quit-smoking-tobacco' },
        { name: 'Quit', desc: 'Recursos para dejar de fumar y vapear', url: 'https://www.quit.org.au/' },
        { name: 'NHS Smokefree', desc: 'Servicio de salud del Reino Unido', url: 'https://www.nhs.uk/better-health/quit-smoking/' },
        { name: 'Smokefree.gov', desc: 'Herramientas y consejos para dejarlo', url: 'https://smokefree.gov/' }
    ];

    // Animation delay effect
    useEffect(() => {
        const timer = setTimeout(() => setShowDetails(true), 500);

        // Run ML Analysis (Async TensorFlow)
        const runAnalysis = async () => {
            const result = await analyzeDependency(
                data.daily.nicotineMg,
                'disposable',
                data.user?.age,
                data.user?.yearsVaping
            );
            setAnalysis(result);
        };

        runAnalysis();

        return () => clearTimeout(timer);
    }, [data]);

    const { daily, monthly } = data;

    // Calculate comparisons
    // Cost based on volume (ml), assuming user buys disposables
    const vapesPerMonth = (daily.ml * 30) / CR_STATS.avgVapeMl;
    const costInColones = Math.round(vapesPerMonth * CR_STATS.avgVapePrice);
    const casados = Math.floor(costInColones / 3500);

    return (
        <div className="visualizer-wrapper">
            {/* LEFT COLUMN: Health Risks */}
            <div className="side-column left-col">
                <div className="info-card">
                    <h3>Riesgos de Salud</h3>
                    <div className="risk-item">
                        <h4>EVALI</h4>
                        <p className="risk-subtitle">Lesión Pulmonar Asociada al Vapeo</p>
                        <ul className="risk-details">
                            <li><strong>Causa:</strong> Químicos inhalados como Acetato de Vitamina E.</li>
                            <li><strong>Síntomas:</strong> Dificultad respiratoria severa, dolor de pecho, fiebre y fatiga.</li>
                            <li><strong>Impacto:</strong> Inflamación aguda que puede requerir hospitalización inmediata.</li>
                        </ul>
                    </div>
                    <div className="divider"></div>
                    <div className="risk-item">
                        <h4>Popcorn Lung</h4>
                        <p className="risk-subtitle">Bronquiolitis Obliterante</p>
                        <ul className="risk-details">
                            <li><strong>Causa:</strong> Diacetilo (saborizante común en vapes).</li>
                            <li><strong>Síntomas:</strong> Tos seca persistente, sibilancias y falta de aire progresiva.</li>
                            <li><strong>Impacto:</strong> Cicatrización irreversible de los sacos de aire. No tiene cura.</li>
                        </ul>
                    </div>
                    <div className="alert-box">
                        <strong>Diferencia Clave:</strong> EVALI es una inflamación aguda y repentina, mientras que Popcorn Lung es un daño crónico y permanente.
                    </div>
                </div>
            </div>

            {/* CENTER COLUMN: Visualizer (Existing) */}
            <div className="visualizer-center-col">
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


                </div>
            </div>

            {/* RIGHT COLUMN: Resources */}
            <div className="side-column right-col">
                <div className="info-card">
                    <h3>Recursos de Ayuda</h3>
                    <ul className="resource-list">
                        {resourcesList.slice(0, showAllResources ? resourcesList.length : 3).map((res, idx) => (
                            <li key={idx}>
                                <a href={res.url} target="_blank" rel="noopener noreferrer">
                                    <strong>{res.name}</strong>
                                    <span>{res.desc}</span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    {!showAllResources && (
                        <button
                            className="btn-text"
                            onClick={() => setShowAllResources(true)}
                            style={{ width: '100%', marginTop: '0.5rem', color: '#000', fontSize: '0.9rem', fontWeight: '600' }}
                        >
                            Ver más recursos
                        </button>
                    )}

                    <div className="help-tip">
                        <p>¿Buscas dejarlo? No estás solo. Consulta a un profesional de salud.</p>
                    </div>

                    {/* Action Buttons moved here for Mobile (Bottom) / Desktop (Right) */}
                    <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.5rem' }}>
                        <button className="btn-secondary" onClick={() => setShowShare(true)} style={{ width: '100%' }}>
                            Compartir resultados
                        </button>
                        <button className="btn-primary" onClick={onReset} style={{ width: '100%' }}>
                            Probar otro dispositivo
                        </button>
                    </div>
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
