export function calculateLevel(totalXp: number): { currentLevel: number; progressPct: number; xpForNextLevel: number; currentLevelXp: number } {
    let level = 1;
    let remainingXp = totalXp;
    let currentTierCost = 100;

    while (true) {
        // Determine how much XP is needed for the NEXT level
        const xpNeededForNext = Math.floor((level - 1) / 10) * 100 + 100;

        if (remainingXp >= xpNeededForNext) {
            remainingXp -= xpNeededForNext;
            level++;
        } else {
            currentTierCost = xpNeededForNext;
            break;
        }
    }

    const progressPct = Math.round((remainingXp / currentTierCost) * 100);

    return {
        currentLevel: level,
        progressPct: progressPct,
        xpForNextLevel: currentTierCost,
        currentLevelXp: remainingXp
    };
}
