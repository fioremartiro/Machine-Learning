import { useState } from 'react';
import './LungVisual.css';

const LungVisual = ({ riskColor }) => {
    const [timeframe, setTimeframe] = useState('now'); // 'now', '1yr', '5yr'

    // Map timeframe to visual state
    const stateMap = {
        now: 'healthy',
        '1yr': 'warning',
        '5yr': 'danger'
    };
    const state = stateMap[timeframe];

    // Configuration for different states
    const states = {
        now: {
            label: 'ESTADO ACTUAL',
            desc: 'Tus pulmones están irritados, pero resisten.'
        },
        '1yr': {
            label: '+1 AÑO',
            desc: 'Inflamación crónica. Daño a los cilios acelera.'
        },
        '5yr': {
            label: '+5 AÑOS',
            desc: 'Alto riesgo de cicatrices permanentes y capacidad reducida.'
        }
    };

    const current = states[timeframe];

    return (
        <div className="lung-visual-container">
            <div className="lung-info-panel">
                <div className="lung-info">
                    <h3 className={`status-title ${state}`}>
                        {current.label}
                    </h3>
                    <p>{current.desc}</p>
                </div>

                <div className="lung-controls">
                    <button
                        className={`time-btn ${timeframe === 'now' ? 'active' : ''}`}
                        onClick={() => setTimeframe('now')}
                    >
                        Ahora
                    </button>
                    <button
                        className={`time-btn ${timeframe === '1yr' ? 'active' : ''}`}
                        onClick={() => setTimeframe('1yr')}
                    >
                        +1 Año
                    </button>
                    <button
                        className={`time-btn ${timeframe === '5yr' ? 'active' : ''}`}
                        onClick={() => setTimeframe('5yr')}
                    >
                        +5 Años
                    </button>
                </div>
            </div>

            <div className="lung-display">
                <svg viewBox="0 0 300 300" className="lung-svg">
                    <defs>
                        {/* Glow Gradients */}
                        <radialGradient id="glow-healthy" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="glow-warning" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="glow-danger" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#f87171" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
                        </radialGradient>

                        {/* Glass Effect Gradient */}
                        <linearGradient id="glass-shine" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
                            <stop offset="50%" stopColor="#fff" stopOpacity="0.05" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Outer Glow based on state */}
                    <circle cx="150" cy="150" r="120" fill={`url(#glow-${state})`} className="lung-glow" />

                    {/* TRACHEA (Windpipe) */}
                    <g className="trachea" transform="translate(150, 40)">
                        <path d="M -10 0 L -10 60 Q -10 80 -30 100" stroke="#4b5563" strokeWidth="12" fill="none" opacity="0.5" />
                        <path d="M 10 0 L 10 60 Q 10 80 30 100" stroke="#4b5563" strokeWidth="12" fill="none" opacity="0.5" />
                        {/* Rings */}
                        <path d="M -10 10 L 10 10 M -10 20 L 10 20 M -10 30 L 10 30 M -10 40 L 10 40 M -10 50 L 10 50" stroke="#6b7280" strokeWidth="2" />
                    </g>

                    {/* LEFT LUNG (Viewer's Left) */}
                    <g className="lung-lobe left" transform="translate(150, 100)">
                        {/* Glass Container */}
                        <path d="M -10 0 Q -60 10 -80 60 Q -90 110 -50 150 Q -20 170 -10 140 Z"
                            fill="url(#glass-shine)" stroke={state === 'healthy' ? '#2dd4bf' : state === 'warning' ? '#fbbf24' : '#f87171'}
                            strokeWidth="1" strokeOpacity="0.5" className="glass-shell" />

                        {/* Bronchial Tree (Detailed Veins) */}
                        <g className="bronchi" stroke={state === 'healthy' ? '#2dd4bf' : state === 'warning' ? '#fbbf24' : '#f87171'} fill="none" strokeLinecap="round">
                            {/* Main Branch */}
                            <path d="M -10 0 Q -30 30 -40 70" strokeWidth="3" />
                            {/* Sub Branches */}
                            <path d="M -30 30 Q -60 40 -70 60" strokeWidth="1.5" opacity="0.8" />
                            <path d="M -35 50 Q -15 60 -20 90" strokeWidth="1.5" opacity="0.8" />
                            <path d="M -40 70 Q -60 90 -50 120" strokeWidth="1.5" opacity="0.8" />
                            {/* Fine Details */}
                            <path d="M -60 40 L -75 35" strokeWidth="0.5" opacity="0.6" />
                            <path d="M -70 60 L -80 70" strokeWidth="0.5" opacity="0.6" />
                            <path d="M -20 90 L -10 110" strokeWidth="0.5" opacity="0.6" />
                            <path d="M -50 120 L -60 140" strokeWidth="0.5" opacity="0.6" />
                        </g>
                    </g>

                    {/* RIGHT LUNG (Viewer's Right) */}
                    <g className="lung-lobe right" transform="translate(150, 100)">
                        {/* Glass Container */}
                        <path d="M 10 0 Q 60 10 80 60 Q 90 110 50 150 Q 20 170 10 140 Z"
                            fill="url(#glass-shine)" stroke={state === 'healthy' ? '#2dd4bf' : state === 'warning' ? '#fbbf24' : '#f87171'}
                            strokeWidth="1" strokeOpacity="0.5" className="glass-shell" />

                        {/* Bronchial Tree */}
                        <g className="bronchi" stroke={state === 'healthy' ? '#2dd4bf' : state === 'warning' ? '#fbbf24' : '#f87171'} fill="none" strokeLinecap="round">
                            {/* Main Branch */}
                            <path d="M 10 0 Q 30 30 40 70" strokeWidth="3" />
                            {/* Sub Branches */}
                            <path d="M 30 30 Q 60 40 70 60" strokeWidth="1.5" opacity="0.8" />
                            <path d="M 35 50 Q 15 60 20 90" strokeWidth="1.5" opacity="0.8" />
                            <path d="M 40 70 Q 60 90 50 120" strokeWidth="1.5" opacity="0.8" />
                            {/* Fine Details */}
                            <path d="M 60 40 L 75 35" strokeWidth="0.5" opacity="0.6" />
                            <path d="M 70 60 L 80 70" strokeWidth="0.5" opacity="0.6" />
                            <path d="M 20 90 L 10 110" strokeWidth="0.5" opacity="0.6" />
                            <path d="M 50 120 L 60 140" strokeWidth="0.5" opacity="0.6" />
                        </g>
                    </g>

                </svg>
            </div>
        </div>
    );
};

export default LungVisual;
