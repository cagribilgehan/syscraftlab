'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
    id: number;
    x: number;
    color: string;
    delay: number;
    rotation: number;
}

interface ConfettiProps {
    isActive: boolean;
    onComplete?: () => void;
}

const COLORS = ['#00ffff', '#a855f7', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'];

export function Confetti({ isActive, onComplete }: ConfettiProps) {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        if (isActive) {
            const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                delay: Math.random() * 0.5,
                rotation: Math.random() * 360,
            }));
            setPieces(newPieces);

            const timer = setTimeout(() => {
                setPieces([]);
                onComplete?.();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isActive, onComplete]);

    return (
        <AnimatePresence>
            {pieces.map((piece) => (
                <motion.div
                    key={piece.id}
                    initial={{
                        opacity: 1,
                        y: -20,
                        x: `${piece.x}vw`,
                        rotate: 0,
                        scale: 1,
                    }}
                    animate={{
                        opacity: 0,
                        y: '100vh',
                        rotate: piece.rotation + 720,
                        scale: [1, 1.2, 0.8, 1],
                    }}
                    transition={{
                        duration: 2.5,
                        delay: piece.delay,
                        ease: 'easeOut',
                    }}
                    className="fixed top-0 z-50 pointer-events-none"
                    style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: piece.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    }}
                />
            ))}
        </AnimatePresence>
    );
}

interface MissionCompleteModalProps {
    isOpen: boolean;
    xpEarned: number;
    missionTitle: string;
    onClose: () => void;
    onNextMission?: () => void;
}

export function MissionCompleteModal({
    isOpen,
    xpEarned,
    missionTitle,
    onClose,
    onNextMission,
}: MissionCompleteModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <Confetti isActive={isOpen} />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 15 }}
                            className="bg-dark-panel border border-neon-cyan/30 rounded-2xl p-8 max-w-md mx-4 text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Trophy Animation */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, -10, 10, 0],
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: 2,
                                }}
                                className="text-7xl mb-4"
                            >
                                🏆
                            </motion.div>

                            <h2 className="text-2xl font-display font-bold text-white mb-2">
                                Mission Complete!
                            </h2>

                            <p className="text-gray-400 mb-4">{missionTitle}</p>

                            {/* XP Counter */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: 'spring' }}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neon-purple/20 border border-neon-purple/50 mb-6"
                            >
                                <span className="text-3xl font-bold text-neon-purple">
                                    +{xpEarned}
                                </span>
                                <span className="text-neon-purple/80">XP</span>
                            </motion.div>

                            {/* Stars */}
                            <div className="flex justify-center gap-2 mb-6">
                                {[1, 2, 3].map((star) => (
                                    <motion.span
                                        key={star}
                                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.5 + star * 0.15 }}
                                        className="text-4xl"
                                    >
                                        ⭐
                                    </motion.span>
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                                >
                                    Review Code
                                </button>
                                {onNextMission && (
                                    <button
                                        onClick={onNextMission}
                                        className="px-6 py-2 rounded-lg bg-neon-cyan text-dark-bg font-medium hover:bg-neon-cyan/90 transition-colors"
                                    >
                                        Next Mission →
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
