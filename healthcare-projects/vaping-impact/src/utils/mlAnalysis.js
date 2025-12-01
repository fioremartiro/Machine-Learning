/**
 * ML Dependency Analysis (Rule-Based Classifier)
 * 
 * Classifies user into addiction profiles based on:
 * - Daily Nicotine Intake (mg)
 * - Consumption Volume (ml)
 * - Device Type efficiency
 */

export const analyzeDependency = (dailyNicotineMg, deviceType, age = 25, yearsVaping = 1) => {
    let score = 0;
    let profile = '';
    let description = '';
    let color = '';

    // 1. Nicotine Threshold Scoring
    if (dailyNicotineMg < 5) score += 1;       // Very Low
    else if (dailyNicotineMg < 15) score += 3; // Low/Social
    else if (dailyNicotineMg < 30) score += 5; // Moderate
    else if (dailyNicotineMg < 60) score += 8; // High
    else score += 10;                          // Extreme

    // 2. Device Factor (Absorption efficiency)
    // Disposables (salt nic) hit harder and faster -> higher addiction risk
    if (deviceType === 'disposable') score += 2;
    if (deviceType === 'pod') score += 1;

    // 3. Duration Factor (Chronic Exposure)
    if (yearsVaping > 3) score += 4;
    else if (yearsVaping >= 1) score += 2;

    // 4. Age Factor (Vulnerability)
    if (age < 25) score += 3; // High brain plasticity = faster addiction
    else if (age > 50) score += 2; // Higher cardiovascular risk baseline

    // Classification
    // Max possible score: 10 (nic) + 2 (device) + 4 (years) + 3 (age) = 19
    if (score <= 6) {
        profile = 'Usuario Social';
        description = 'Tu consumo es bajo, pero la nicotina crea dependencia rápidamente. Estás a tiempo de dejarlo fácil.';
        color = '#10b981'; // Green
    } else if (score <= 10) {
        profile = 'Hábito Moderado';
        description = 'Tu cuerpo ya espera nicotina diariamente. Es probable que sientas ansiedad si pasas 24h sin vapear.';
        color = '#f59e0b'; // Amber
    } else if (score <= 14) {
        profile = 'Dependencia Alta';
        description = 'Estás consumiendo niveles equivalentes a un fumador empedernido. Tu tolerancia es muy alta.';
        color = '#f97316'; // Orange
    } else {
        profile = 'Riesgo Extremo';
        description = 'Niveles peligrosos de nicotina. Tu riesgo de efectos cardiovasculares y EVALI es significativamente mayor.';
        color = '#ef4444'; // Red
    }

    return {
        score,
        profile,
        description,
        color
    };
};
