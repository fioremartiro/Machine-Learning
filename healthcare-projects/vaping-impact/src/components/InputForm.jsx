import { useState } from 'react';
import './InputForm.css';

const InputForm = ({ onCalculate }) => {
    const [deviceType, setDeviceType] = useState('disposable'); // disposable, pod, mod

    // State for inputs
    const [disposablePuffs, setDisposablePuffs] = useState(5000);
    const [disposableNicotine, setDisposableNicotine] = useState(50); // mg/ml (5%)
    const [disposableDays, setDisposableDays] = useState(7);

    const [podSize, setPodSize] = useState(2); // ml
    const [podNicotine, setPodNicotine] = useState(50); // mg/ml
    const [podsPerDay, setPodsPerDay] = useState(1);

    const [modNicotine, setModNicotine] = useState(3); // mg/ml
    const [modMlPerDay, setModMlPerDay] = useState(5);

    // Demographics
    const [age, setAge] = useState(24);
    const [yearsVaping, setYearsVaping] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        let mgPerMl = 0;
        let mlPerDay = 0;

        if (deviceType === 'disposable') {
            // Estimate: 5000 puffs approx 10-13ml. Let's assume standard:
            // Elfbar BC5000 is 13ml.
            // We can approximate ml based on puffs if we don't ask for ml.
            // Rule of thumb: 1000 puffs ≈ 2.5ml - 3ml? 
            // Actually, let's just ask for "Puffs on label" and map to known capacities or ask for ml if known.
            // For MVP, let's map common puff counts to ml.
            const puffToMl = {
                600: 2,
                1500: 5,
                3000: 10,
                5000: 13,
                7000: 16,
                10000: 20
            };

            // Find closest or interpolate. For now, simple lookup or linear approx.
            // Linear approx: ~2.5ml per 1000 puffs is a safe upper bound for modern disposables.
            const estimatedMl = (disposablePuffs / 1000) * 2.6;

            mgPerMl = disposableNicotine;
            mlPerDay = estimatedMl / disposableDays;
        } else if (deviceType === 'pod') {
            mgPerMl = podNicotine;
            mlPerDay = podSize * podsPerDay;
        } else {
            mgPerMl = modNicotine;
            mlPerDay = modMlPerDay;
        }

        onCalculate(mgPerMl, mlPerDay, age, yearsVaping);
    };

    return (
        <div className="input-form-container">
            <div className="device-selector">
                <div className="tooltip-wrapper">
                    <button className={`device-btn ${deviceType === 'disposable' ? 'active' : ''}`} onClick={() => setDeviceType('disposable')}>
                        Desechable
                    </button>
                    <span className="tooltip">Vapes de un solo uso (ElfBar, GeekBar). No se recargan.</span>
                </div>

                <div className="tooltip-wrapper">
                    <button className={`device-btn ${deviceType === 'pod' ? 'active' : ''}`} onClick={() => setDeviceType('pod')}>
                        Sistema Pod
                    </button>
                    <span className="tooltip">Usa cartuchos recambiables (Juul, Vaporesso Xros).</span>
                </div>

                <div className="tooltip-wrapper">
                    <button className={`device-btn ${deviceType === 'mod' ? 'active' : ''}`} onClick={() => setDeviceType('mod')}>
                        Mod / Tanque
                    </button>
                    <span className="tooltip">Dispositivos grandes con tanque de vidrio y baterías externas.</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="vape-form">
                {deviceType === 'disposable' && (
                    <>
                        <div className="form-group">
                            <label>Puffs en la etiqueta</label>
                            <select value={disposablePuffs} onChange={(e) => setDisposablePuffs(Number(e.target.value))}>
                                <option value={600}>600 (Pequeño)</option>
                                <option value={3000}>3000 (Mediano)</option>
                                <option value={5000}>5000 (Estándar)</option>
                                <option value={7000}>7000+ (Grande)</option>
                                <option value={10000}>10000+ (Mega)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Fuerza de Nicotina</label>
                            <select value={disposableNicotine} onChange={(e) => setDisposableNicotine(Number(e.target.value))}>
                                <option value={50}>5% (50mg) - Estándar</option>
                                <option value={20}>2% (20mg) - Bajo/EU</option>
                                <option value={0}>0% (Sin Nicotina)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>¿Cuánto te dura?</label>
                            <input
                                type="number"
                                min="1"
                                value={disposableDays}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setDisposableDays(val === '' ? '' : Number(val));
                                }}
                            />
                            <span className="unit">días</span>
                        </div>
                    </>
                )}

                {deviceType === 'pod' && (
                    <>
                        <div className="form-group">
                            <label>Tamaño del Pod</label>
                            <input
                                type="number"
                                step="0.1"
                                value={podSize}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setPodSize(val === '' ? '' : Number(val));
                                }}
                            />
                            <span className="unit">ml</span>
                        </div>
                        <div className="form-group">
                            <label>Fuerza de Nicotina</label>
                            <select value={podNicotine} onChange={(e) => setPodNicotine(Number(e.target.value))}>
                                <option value={50}>5% (50mg)</option>
                                <option value={35}>3.5% (35mg)</option>
                                <option value={20}>2% (20mg)</option>
                                <option value={3}>0.3% (3mg)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Pods por día</label>
                            <input
                                type="number"
                                step="0.5"
                                value={podsPerDay}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setPodsPerDay(val === '' ? '' : Number(val));
                                }}
                            />
                        </div>
                    </>
                )}

                {deviceType === 'mod' && (
                    <>
                        <div className="form-group">
                            <label>Fuerza de Nicotina</label>
                            <input
                                type="number"
                                value={modNicotine}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setModNicotine(val === '' ? '' : Number(val));
                                }}
                            />
                            <span className="unit">mg/ml</span>
                        </div>
                        <div className="form-group">
                            <label>Consumo Diario</label>
                            <input
                                type="number"
                                value={modMlPerDay}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setModMlPerDay(val === '' ? '' : Number(val));
                                }}
                            />
                            <span className="unit">ml/día</span>
                        </div>
                    </>
                )}

                {/* Demographics Section */}
                <div className="form-group">
                    <label>Tu Edad</label>
                    <input
                        type="number"
                        min="12"
                        max="100"
                        value={age}
                        onChange={(e) => {
                            const val = e.target.value;
                            setAge(val === '' ? '' : Number(val));
                        }}
                    />
                    <span className="unit">años</span>
                </div>

                <div className="form-group">
                    <label>Años Vapeando</label>
                    <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={yearsVaping}
                        onChange={(e) => {
                            const val = e.target.value;
                            setYearsVaping(val === '' ? '' : Number(val));
                        }}
                    />
                    <span className="unit">años</span>
                </div>

                <button type="submit" className="btn-primary submit-btn">
                    Ver resultados
                </button>
            </form>
        </div >
    );
};

export default InputForm;
