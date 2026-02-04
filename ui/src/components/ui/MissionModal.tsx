'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Star,
    Trophy,
    Clock,
    Target,
    Zap,
    Lock,
    ChevronRight,
    BookOpen,
    AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface MissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    mission: {
        id: string;
        title: string;
        description?: string;
        xp: number;
        difficulty?: 'easy' | 'medium' | 'hard' | 'boss';
        estimatedTime?: string;
        isLocked?: boolean;
        isBoss?: boolean;
    } | null;
}

export function MissionModal({ isOpen, onClose, mission }: MissionModalProps) {
    if (!isOpen || !mission) return null;

    const getDifficultyConfig = (difficulty?: string) => {
        switch (difficulty) {
            case 'easy': return { label: 'Easy', color: 'text-green-400', bg: 'bg-green-500/20', stars: 1 };
            case 'medium': return { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20', stars: 2 };
            case 'hard': return { label: 'Hard', color: 'text-orange-400', bg: 'bg-orange-500/20', stars: 3 };
            case 'boss': return { label: 'Boss Battle', color: 'text-red-400', bg: 'bg-red-500/20', stars: 4 };
            default: return { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20', stars: 2 };
        }
    };

    const diffConfig = getDifficultyConfig(mission.difficulty);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-dark-bg/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full max-w-md rounded-2xl border overflow-hidden ${mission.isBoss
                            ? 'bg-gradient-to-br from-red-500/10 to-dark-panel border-red-500/30'
                            : 'bg-dark-panel border-neon-cyan/30'
                        }`}
                >
                    {/* Header */}
                    <div className={`p-6 ${mission.isBoss ? 'bg-red-500/10' : 'bg-neon-cyan/5'}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <span className={`text-xs font-mono ${mission.isBoss ? 'text-red-400' : 'text-neon-cyan'}`}>
                                    Mission {mission.id}
                                </span>
                                {mission.isBoss && (
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded bg-red-500/30 text-red-400 font-bold">
                                        BOSS
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-dark-panel rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <h2 className="text-2xl font-display font-bold mb-2">{mission.title}</h2>

                        {mission.description && (
                            <p className="text-gray-400 text-sm">{mission.description}</p>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="p-6 border-t border-gray-700/50">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {/* XP */}
                            <div className="text-center p-3 rounded-xl bg-dark-bg">
                                <Trophy className="w-5 h-5 mx-auto mb-1 text-neon-purple" />
                                <div className="text-lg font-bold text-neon-purple">+{mission.xp}</div>
                                <div className="text-xs text-gray-500">XP</div>
                            </div>

                            {/* Difficulty */}
                            <div className="text-center p-3 rounded-xl bg-dark-bg">
                                <Target className={`w-5 h-5 mx-auto mb-1 ${diffConfig.color}`} />
                                <div className="flex justify-center gap-0.5 mb-1">
                                    {[...Array(4)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3 h-3 ${i < diffConfig.stars ? diffConfig.color : 'text-gray-600'}`}
                                            fill={i < diffConfig.stars ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>
                                <div className="text-xs text-gray-500">{diffConfig.label}</div>
                            </div>

                            {/* Time */}
                            <div className="text-center p-3 rounded-xl bg-dark-bg">
                                <Clock className="w-5 h-5 mx-auto mb-1 text-neon-cyan" />
                                <div className="text-lg font-bold text-neon-cyan">{mission.estimatedTime || '10m'}</div>
                                <div className="text-xs text-gray-500">Est. Time</div>
                            </div>
                        </div>

                        {/* Action */}
                        {mission.isLocked ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-sm">
                                    <Lock className="w-4 h-4 text-yellow-500" />
                                    <span className="text-yellow-500">This mission requires the book to unlock</span>
                                </div>
                                <Link href="/get-book" className="block">
                                    <button className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-dark-bg font-bold flex items-center justify-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Get the Book
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <Link href={mission.isBoss ? '/warroom' : '/game'} className="block">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${mission.isBoss
                                            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                                            : 'bg-neon-cyan text-dark-bg'
                                        }`}
                                >
                                    {mission.isBoss ? (
                                        <>
                                            <AlertTriangle className="w-5 h-5" />
                                            Enter Battle
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-5 h-5" />
                                            Start Mission
                                        </>
                                    )}
                                    <ChevronRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default MissionModal;
