'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft, Terminal, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function NotFound() {
    const [glitchText, setGlitchText] = useState('404');

    // Glitch effect
    useEffect(() => {
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                setGlitchText(`4${randomChar}4`);
                setTimeout(() => setGlitchText('404'), 100);
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 cyber-grid opacity-20" />

            {/* Scan Lines */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.1, 0] }}
                        transition={{
                            duration: 0.1,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            repeatDelay: Math.random() * 10
                        }}
                        className="absolute left-0 right-0 h-px bg-red-500"
                        style={{ top: `${5 + i * 5}%` }}
                    />
                ))}
            </div>

            {/* Red Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-3xl" />

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 text-center max-w-2xl"
            >
                {/* Terminal Window */}
                <div className="bg-dark-panel rounded-2xl border border-red-500/30 overflow-hidden shadow-2xl shadow-red-500/10">
                    {/* Terminal Header */}
                    <div className="bg-dark-bg px-4 py-3 flex items-center gap-3 border-b border-red-500/20">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-gray-600" />
                        </div>
                        <div className="flex-1 text-center text-sm font-mono text-red-400">
                            ⚠ SYSTEM_ERROR.exe
                        </div>
                        <Terminal className="w-4 h-4 text-red-400" />
                    </div>

                    {/* Terminal Content */}
                    <div className="p-8 md:p-12">
                        {/* Error Code */}
                        <motion.div
                            animate={{
                                textShadow: [
                                    '0 0 10px #ef4444, 0 0 20px #ef4444',
                                    '0 0 20px #ef4444, 0 0 40px #ef4444',
                                    '0 0 10px #ef4444, 0 0 20px #ef4444'
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-8xl md:text-9xl font-display font-bold text-red-500 mb-4"
                            style={{ fontFamily: 'monospace' }}
                        >
                            {glitchText}
                        </motion.div>

                        {/* Error Message */}
                        <div className="space-y-2 mb-8">
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
                                SYSTEM ERROR
                            </h1>
                            <div className="font-mono text-red-400 text-sm space-y-1">
                                <p>{'>'} ERROR: Page not found in memory</p>
                                <p>{'>'} STATUS: Route undefined</p>
                                <p>{'>'} SUGGESTION: Return to safe zone</p>
                            </div>
                        </div>

                        {/* Corrupted Data Visual */}
                        <div className="mb-8 p-4 rounded-lg bg-dark-bg border border-red-500/20 font-mono text-xs text-gray-500 overflow-hidden">
                            <motion.div
                                animate={{ x: [-100, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <p className="text-red-400/50">0x4E4F545F464F554E44 // NOT_FOUND</p>
                                <p className="text-red-400/30">██████████░░░░░░ MEMORY_CORRUPTED</p>
                                <p className="text-red-400/20">████░░░░░░░░░░░░ STACK_OVERFLOW</p>
                            </motion.div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    <Home className="w-5 h-5" />
                                    Return to Base
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.history.back()}
                                className="px-6 py-3 rounded-xl border border-gray-600 text-gray-400 font-medium flex items-center justify-center gap-2 hover:border-neon-cyan hover:text-neon-cyan transition-all w-full sm:w-auto"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Go Back
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 text-sm text-gray-500 font-mono"
                >
                    Error logged at {new Date().toISOString().split('T')[0]} | LabLudus v3.0
                </motion.p>
            </motion.div>
        </div>
    );
}
