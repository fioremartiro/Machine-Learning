import { useEffect, useState } from 'react';
import './AIAnalysisCard.css';

const AIAnalysisCard = ({ analysis }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate "AI Processing" time
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="ai-card loading">
                <div className="scanner-line"></div>
                <p>Analizando patrones de consumo...</p>
            </div>
        );
    }

    return (
        <div className="ai-card result" style={{ borderColor: analysis.color }}>
            <div className="ai-header">
                <span className="ai-badge">IA DETECTADA</span>
                <h3 style={{ color: analysis.color }}>{analysis.profile}</h3>
            </div>
            <p className="ai-desc">{analysis.description}</p>
            <div className="ai-meter">
                <div
                    className="ai-fill"
                    style={{
                        width: `${(analysis.score / 12) * 100}%`,
                        backgroundColor: analysis.color
                    }}
                ></div>
            </div>
        </div>
    );
};

export default AIAnalysisCard;
