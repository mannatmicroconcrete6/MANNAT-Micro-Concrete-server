/**
 * Lead Scoring Logic
 * Helps prioritize leads so you don't waste time on low-intent callers.
 */
const calculateLeadScore = (lead) => {
    let score = 0;

    // 1. Service Type Score (Higher technical value = Higher score)
    const highValueServices = ['Microcement Flooring', 'Venetian Lime Plaster', 'Terrazzo'];
    if (highValueServices.some(s => lead.serviceNeeded?.includes(s))) {
        score += 30;
    }

    // 2. Area/Size Score (Bigger projects = Higher priority)
    const area = parseInt(lead.areaSqFt) || 0;
    if (area > 2000) score += 40;
    else if (area > 1000) score += 25;
    else if (area > 500) score += 15;

    // 3. Detail Score (Clients who write messages show higher intent)
    if (lead.message && lead.message.length > 20) {
        score += 20;
    }

    // 4. Contact Detail Score
    if (lead.email && lead.email.endsWith('.com')) {
        score += 10;
    }

    return score;
};

module.exports = { calculateLeadScore };
