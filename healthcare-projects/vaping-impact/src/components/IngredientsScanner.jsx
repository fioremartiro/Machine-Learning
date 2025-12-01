import { useState } from 'react';
import './IngredientsScanner.css';

const IngredientsScanner = () => {
    const [activePart, setActivePart] = useState(null);

    const info = {
        cartridge: {
            title: 'El Cartucho (Líquido)',
            content: 'Contiene nicotina, propilenglicol, glicerol y saborizantes. Puede contener Acetato de Vitamina E.',
            warning: 'Riesgo: Químicos desconocidos.',
            style: { top: '20%', left: '85%' }
        },
        coil: {
            title: 'La Resistencia',
            content: 'Calienta el líquido. Puede liberar partículas de metales tóxicos (níquel, plomo) que se inhalan.',
            warning: 'Riesgo: Metales pesados.',
            style: { top: '40%', left: '85%' }
        },
        vapor: {
            title: 'El Aerosol',
            content: 'No es vapor de agua. Es una mezcla química de partículas ultrafinas que penetran los pulmones.',
            warning: 'EVALI: Daño pulmonar.',
            style: { top: '5%', left: '85%' }
        },
        battery: {
            title: 'La Batería',
            content: 'Iones de litio. Desecharlas incorrectamente genera toneladas de basura tóxica.',
            warning: 'Daño Ambiental.',
            style: { top: '70%', left: '85%' }
        }
    };

    return (
        <div className="scanner-container">
            <h3 className="scanner-title">Escáner de Toxicidad</h3>
            <p className="scanner-subtitle">Toca los puntos para ver qué estás inhalando realmente.</p>

            <div className="scanner-content-vertical">
                {/* 1. Centered Vape Visual */}
                <div className="vape-blueprint centered">
                    <svg viewBox="0 0 200 400" className="blueprint-svg">
                        {/* Device Body */}
                        <rect x="70" y="150" width="60" height="200" rx="10" stroke="#374151" strokeWidth="2" fill="none" className="blueprint-part" />

                        {/* Cartridge/Pod */}
                        <path d="M 70 150 L 70 80 Q 100 60 130 80 L 130 150 Z" stroke="#374151" strokeWidth="2" fill="none" className="blueprint-part" />

                        {/* Mouthpiece */}
                        <path d="M 85 80 L 85 50 Q 100 40 115 50 L 115 80" stroke="#374151" strokeWidth="2" fill="none" className="blueprint-part" />

                        {/* Coil/Heating Element */}
                        <path d="M 80 130 L 120 130 M 80 135 L 120 135 M 80 140 L 120 140" stroke="#ef4444" strokeWidth="2" className="blueprint-coil" />

                        {/* Vapor Path */}
                        <path d="M 100 130 L 100 50" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" className="vapor-flow" />

                        {/* Hotspots (Visual Indicators only now, or clickable too) */}
                        <g
                            className={`hotspot ${activePart === 'cartridge' ? 'active' : ''}`}
                            onMouseEnter={() => setActivePart('cartridge')}
                            onMouseLeave={() => setActivePart(null)}
                            onClick={() => setActivePart(activePart === 'cartridge' ? null : 'cartridge')}
                        >
                            <circle cx="100" cy="100" r="15" fill="rgba(37, 99, 235, 0.1)" stroke="#2563eb" strokeWidth="2" />
                            <circle cx="100" cy="100" r="5" fill="#2563eb" className="pulse-dot" />
                        </g>

                        <g
                            className={`hotspot ${activePart === 'coil' ? 'active' : ''}`}
                            onMouseEnter={() => setActivePart('coil')}
                            onMouseLeave={() => setActivePart(null)}
                            onClick={() => setActivePart(activePart === 'coil' ? null : 'coil')}
                        >
                            <circle cx="100" cy="135" r="15" fill="rgba(239, 68, 68, 0.1)" stroke="#ef4444" strokeWidth="2" />
                            <circle cx="100" cy="135" r="5" fill="#ef4444" className="pulse-dot" />
                        </g>

                        <g
                            className={`hotspot ${activePart === 'vapor' ? 'active' : ''}`}
                            onMouseEnter={() => setActivePart('vapor')}
                            onMouseLeave={() => setActivePart(null)}
                            onClick={() => setActivePart(activePart === 'vapor' ? null : 'vapor')}
                        >
                            <circle cx="100" cy="40" r="15" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="2" />
                            <circle cx="100" cy="40" r="5" fill="#10b981" className="pulse-dot" />
                        </g>

                        <g
                            className={`hotspot ${activePart === 'battery' ? 'active' : ''}`}
                            onMouseEnter={() => setActivePart('battery')}
                            onMouseLeave={() => setActivePart(null)}
                            onClick={() => setActivePart(activePart === 'battery' ? null : 'battery')}
                        >
                            <circle cx="100" cy="250" r="15" fill="rgba(234, 179, 8, 0.1)" stroke="#eab308" strokeWidth="2" />
                            <circle cx="100" cy="250" r="5" fill="#eab308" className="pulse-dot" />
                        </g>
                    </svg>

                    {/* Floating Prompt */}
                    {activePart && (
                        <div className="scanner-prompt" style={info[activePart].style}>
                            <h4 style={{ color: activePart === 'coil' ? '#f87171' : activePart === 'cartridge' ? '#60a5fa' : activePart === 'battery' ? '#facc15' : '#34d399' }}>
                                {info[activePart].title}
                            </h4>
                            <p>{info[activePart].content}</p>
                            <div className="prompt-warning">
                                {info[activePart].warning}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IngredientsScanner;
