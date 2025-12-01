import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './SocialCard.css';

const SocialCard = ({ data, onClose }) => {
    const cardRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#000000', // Match dark theme
                scale: 2, // High resolution
                useCORS: true,
                logging: false
            });

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'mi-impacto-vaping.png';
            link.click();
        } catch (err) {
            console.error('Error generating image:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const { daily, monthly } = data;

    return (
        <div className="social-modal-overlay">
            <div className="social-modal-content">
                <button className="close-btn" onClick={onClose}>&times;</button>

                <h3>Comparte tu Impacto</h3>


                {/* The Card to Capture */}
                <div className="social-card-preview" ref={cardRef}>
                    <div className="card-header">
                        <span className="brand">Vaping Impact</span>
                        <span className="date">{new Date().toLocaleDateString()}</span>
                    </div>

                    <div className="card-body">
                        <div className="impact-stat">
                            <span className="label">Cigarrillos diarios</span>
                            <h2 className="number">{daily.cigarettes}</h2>
                        </div>

                        <div className="divider"></div>

                        <div className="secondary-stats">
                            <div className="stat">
                                <strong>{monthly.nicotineMg}mg</strong>
                                <span>Nicotina/Mes</span>
                            </div>
                            <div className="stat">
                                <strong>{monthly.packs}</strong>
                                <span>Paquetes/Mes</span>
                            </div>
                        </div>

                        <div className="lung-status">
                            <p>Estado Pulmonar: <strong>Irritado</strong></p>
                            <div className="status-bar">
                                <div className="fill warning"></div>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <p>Descubre tu impacto real en</p>
                        <strong>vaping-impact.vercel.app</strong>
                    </div>
                </div>

                <div className="modal-actions">
                    <button
                        className="btn-download"
                        onClick={handleDownload}
                        disabled={isGenerating}
                    >
                        {isGenerating ? 'Generando...' : 'Descargar Imagen'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SocialCard;
