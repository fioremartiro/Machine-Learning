/**
 * Calculations for Vaping Impact Visualizer
 * 
 * Sources & Assumptions:
 * - 1 Cigarette ≈ 1mg to 1.5mg of absorbed nicotine (CDC/NIH data varies, we use 1.2mg as a realistic average).
 * - Vaping absorption efficiency varies by device, but we calculate based on "Potential Nicotine Exposure".
 * - 1 Pack = 20 Cigarettes.
 */

const MG_NICOTINE_PER_CIGARETTE = 1.2;
const CIGARETTES_PER_PACK = 20;

export const calculateImpact = (nicotineMgPerMl, mlPerDay) => {
    // Total nicotine mass consumed per day
    const totalNicotineMg = nicotineMgPerMl * mlPerDay;

    // Equivalent cigarettes per day
    const cigarettesPerDay = Math.round(totalNicotineMg / MG_NICOTINE_PER_CIGARETTE);

    // Equivalent packs per day
    const packsPerDay = parseFloat((cigarettesPerDay / CIGARETTES_PER_PACK).toFixed(1));

    // Monthly projections
    const cigarettesPerMonth = cigarettesPerDay * 30;
    const packsPerMonth = Math.round(cigarettesPerMonth / CIGARETTES_PER_PACK);
    const totalNicotineMonthly = Math.round(totalNicotineMg * 30);

    return {
        daily: {
            nicotineMg: totalNicotineMg,
            cigarettes: cigarettesPerDay,
            packs: packsPerDay,
            ml: parseFloat(mlPerDay)
        },
        monthly: {
            nicotineMg: totalNicotineMonthly,
            cigarettes: cigarettesPerMonth,
            packs: packsPerMonth
        }
    };
};

export const getHealthMilestones = (monthsVaping) => {
    // Placeholder for future health timeline features
    return [];
}
