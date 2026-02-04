'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
    isActive: boolean;
    duration?: number;
}

// Confetti Particle
const ConfettiParticle = ({ delay, color }: { delay: number; color: string }) => {
    const randomX = Math.random() * 100;
    const randomRotation = Math.random() * 360;
    const randomScale = 0.5 + Math.random() * 0.5;

    return (
        <motion.div
            initial={{
                x: `${randomX}vw`,
                y: -20,
                rotate: 0,
                scale: randomScale
            }}
            animate={{
                y: '110vh',
                rotate: randomRotation + 720,
                x: `${randomX + (Math.random() - 0.5) * 20}vw`
            }}
            transition={{
                duration: 3 + Math.random() * 2,
                delay: delay,
                ease: 'linear'
            }}
            className="absolute"
            style={{
                width: '10px',
                height: '10px',
                backgroundColor: color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
        />
    );
};

export function Confetti({ isActive, duration = 3000 }: ConfettiProps) {
    const colors = [
        '#00d4ff', // neon-cyan
        '#7c3aed', // neon-purple
        '#f59e0b', // yellow
        '#10b981', // green
        '#ef4444', // red
        '#ec4899', // pink
    ];

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(50)].map((_, i) => (
                <ConfettiParticle
                    key={i}
                    delay={i * 0.05}
                    color={colors[i % colors.length]}
                />
            ))}
        </div>
    );
}

// Success Celebration Component
export function SuccessCelebration({
    isVisible,
    xpGained,
    onClose
}: {
    isVisible: boolean;
    xpGained: number;
    onClose: () => void;
}) {
    if (!isVisible) return null;

    return (
        <>
            <Confetti isActive={isVisible} />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-dark-bg/90 backdrop-blur-sm flex items-center justify-center z-40 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="text-center"
                >
                    {/* Trophy Icon */}
                    <motion.div
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center"
                    >
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-6xl"
                        >
                            🏆
                        </motion.span>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-display font-bold mb-4 neon-text"
                    >
                        Mission Complete!
                    </motion.h2>

                    {/* XP Gained */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neon-purple/20 border border-neon-purple/30 mb-8"
                    >
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-3xl font-bold text-neon-purple"
                        >
                            +{xpGained} XP
                        </motion.span>
                    </motion.div>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button
                            onClick={onClose}
                            className="px-8 py-4 rounded-xl bg-neon-cyan text-dark-bg font-bold flex items-center justify-center gap-2"
                        >
                            Next Mission →
                        </button>
                        <button
                            onClick={onClose}
                            className="px-8 py-4 rounded-xl border border-gray-600 text-gray-400 font-medium hover:border-neon-cyan hover:text-neon-cyan transition-all flex items-center justify-center gap-2"
                        >
                            Share Victory 🐦
                        </button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </>
    );
}

export default Confetti;
