'use client';

import { useEffect, useState, useCallback } from 'react';

// Types
export interface UserProgress {
    xp: number;
    level: number;
    completedMissions: string[];
    currentStreak: number;
    lastPlayedAt: string | null;
    savedCode: Record<string, string>;
}

const DEFAULT_PROGRESS: UserProgress = {
    xp: 0,
    level: 1,
    completedMissions: [],
    currentStreak: 0,
    lastPlayedAt: null,
    savedCode: {},
};

const STORAGE_KEY = 'labludus_progress';

// Calculate level from XP
export function calculateLevel(xp: number): number {
    // Each level requires progressively more XP
    // Level 1: 0-99, Level 2: 100-299, Level 3: 300-599, etc.
    let level = 1;
    let xpRequired = 100;
    let totalXP = 0;

    while (totalXP + xpRequired <= xp) {
        totalXP += xpRequired;
        level++;
        xpRequired = Math.floor(xpRequired * 1.5);
    }

    return level;
}

// Calculate XP needed for next level
export function xpForNextLevel(currentXP: number): { current: number; needed: number; progress: number } {
    let level = 1;
    let xpRequired = 100;
    let totalXP = 0;

    while (totalXP + xpRequired <= currentXP) {
        totalXP += xpRequired;
        level++;
        xpRequired = Math.floor(xpRequired * 1.5);
    }

    const currentLevelProgress = currentXP - totalXP;
    const progress = (currentLevelProgress / xpRequired) * 100;

    return {
        current: currentLevelProgress,
        needed: xpRequired,
        progress,
    };
}

// Hook to manage user progress
export function useProgress() {
    const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setProgress({ ...DEFAULT_PROGRESS, ...parsed });
            }
        } catch (e) {
            console.warn('Failed to load progress:', e);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage when progress changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
            } catch (e) {
                console.warn('Failed to save progress:', e);
            }
        }
    }, [progress, isLoaded]);

    // Add XP and update level
    const addXP = useCallback((amount: number) => {
        setProgress((prev) => {
            const newXP = prev.xp + amount;
            return {
                ...prev,
                xp: newXP,
                level: calculateLevel(newXP),
            };
        });
    }, []);

    // Complete a mission
    const completeMission = useCallback((missionId: string, xpReward: number) => {
        setProgress((prev) => {
            if (prev.completedMissions.includes(missionId)) {
                return prev; // Already completed
            }

            const newXP = prev.xp + xpReward;
            const today = new Date().toDateString();
            const lastPlayed = prev.lastPlayedAt ? new Date(prev.lastPlayedAt).toDateString() : null;

            // Update streak
            let newStreak = prev.currentStreak;
            if (lastPlayed === today) {
                // Same day, keep streak
            } else if (lastPlayed === new Date(Date.now() - 86400000).toDateString()) {
                // Yesterday, increment streak
                newStreak += 1;
            } else {
                // Streak broken
                newStreak = 1;
            }

            return {
                ...prev,
                xp: newXP,
                level: calculateLevel(newXP),
                completedMissions: [...prev.completedMissions, missionId],
                currentStreak: newStreak,
                lastPlayedAt: new Date().toISOString(),
            };
        });
    }, []);

    // Save code for a mission
    const saveCode = useCallback((missionId: string, code: string) => {
        setProgress((prev) => ({
            ...prev,
            savedCode: {
                ...prev.savedCode,
                [missionId]: code,
            },
        }));
    }, []);

    // Get saved code for a mission
    const getSavedCode = useCallback(
        (missionId: string): string | null => {
            return progress.savedCode[missionId] || null;
        },
        [progress.savedCode]
    );

    // Check if mission is completed
    const isMissionCompleted = useCallback(
        (missionId: string): boolean => {
            return progress.completedMissions.includes(missionId);
        },
        [progress.completedMissions]
    );

    // Reset progress
    const resetProgress = useCallback(() => {
        setProgress(DEFAULT_PROGRESS);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        progress,
        isLoaded,
        addXP,
        completeMission,
        saveCode,
        getSavedCode,
        isMissionCompleted,
        resetProgress,
        xpInfo: xpForNextLevel(progress.xp),
    };
}

// Stats display component
export function ProgressStats({ xp, level, streak }: { xp: number; level: number; streak: number }) {
    const xpInfo = xpForNextLevel(xp);

    return (
        <div className= "flex items-center gap-4" >
        {/* XP */ }
        < div className = "flex items-center gap-2 px-3 py-1 rounded-full bg-dark-panel border border-gray-700" >
            <span className="text-neon-cyan" >⚡</span>
                < span className = "text-sm font-medium text-gray-300" > { xp.toLocaleString() } </span>
                    </div>

    {/* Level with progress bar */ }
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-dark-panel border border-gray-700" >
        <span className="text-neon-purple" >★</span>
            < span className = "text-sm font-medium text-gray-300" > Lvl { level } </span>
                < div className = "w-12 h-1.5 bg-gray-700 rounded-full overflow-hidden" >
                    <div
                        className="h-full bg-neon-purple transition-all duration-500"
    style = {{ width: `${xpInfo.progress}%` }
}
                    />
    </div>
    </div>

{/* Streak */ }
{
    streak > 0 && (
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/50" >
            <span>🔥</span>
                < span className = "text-sm font-medium text-orange-400" > { streak } </span>
                    </div>
            )
}
</div>
    );
}
