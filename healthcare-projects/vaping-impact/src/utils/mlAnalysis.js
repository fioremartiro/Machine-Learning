import { predictRisk } from './tensorModel';

/**
 * ML Dependency Analysis (TensorFlow.js)
 * 
 * Uses a trained Neural Network to predict addiction risk (0.0 - 1.0)
 * and maps it to user profiles.
 */

export const analyzeDependency = async (dailyNicotineMg, deviceType, age = 25, yearsVaping = 1) => {

    // 1. Get Prediction from Neural Network (0.0 to 1.0)
    const riskProbability = await predictRisk(age, dailyNicotineMg, deviceType, yearsVaping);

    // Scale probability to match the old score system (0-19) for UI consistency
    // 0.0 -> 0
    // 1.0 -> 19
    const score = Math.round(riskProbability * 19);

    let profile = '';
    let description = '';
    let color = '';

    // 2. Map Prediction to UI Profiles
    if (riskProbability <= 0.35) { // Low Risk
        profile = 'Usuario Social';
        description = 'Tu consumo es bajo, pero la nicotina crea dependencia rápidamente. Estás a tiempo de dejarlo fácil.';
        color = '#10b981'; // Green
    } else if (riskProbability <= 0.55) { // Moderate
        profile = 'Hábito Moderado';
        description = 'Tu cuerpo ya espera nicotina diariamente. Es probable que sientas ansiedad si pasas 24h sin vapear.';
        color = '#f59e0b'; // Amber
    } else if (riskProbability <= 0.75) { // High
        profile = 'Dependencia Alta';
        description = 'Estás consumiendo niveles equivalentes a un fumador empedernido. Tu tolerancia es muy alta.';
        color = '#f97316'; // Orange
    } else { // Extreme
        profile = 'Riesgo Extremo';
        description = 'Niveles peligrosos de nicotina. Tu riesgo de efectos cardiovasculares y EVALI es significativamente mayor.';
        color = '#ef4444'; // Red
    }

    return {
        score,
        profile,
        description,
        color,
        isML: true // Flag to show this came from TF.js
    };
};
