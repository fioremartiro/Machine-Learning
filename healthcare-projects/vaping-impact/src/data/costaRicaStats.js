/**
 * Costa Rica Specific Data
 * Currency: CRC (Colones)
 */

export const CR_STATS = {
    currencySymbol: '₡',
    currencySymbol: '₡',
    avgPackPrice: 2800, // Approximate price in CRC for a premium pack (Marlboro etc)
    avgVapePrice: 10000, // Avg price for a standard disposable (approx 5000 puffs / 10ml)
    avgVapeMl: 10, // Avg ml per disposable
    youthVapingRate: '15%', // Placeholder stat
    evaliCases: 12, // Placeholder based on recent news (needs verification if real data is needed, using generic for now)
    legalAge: 18,

    // Comparisons
    comparisons: [
        {
            id: 'cost',
            text: 'That’s enough to buy {x} casados a month.',
            factor: 3500 // Avg price of a Casado
        },
        {
            id: 'prevalence',
            text: 'You consume more nicotine than 80% of Costa Rican vapers.',
            thresholdMg: 50 // Daily mg threshold
        }
    ]
};
