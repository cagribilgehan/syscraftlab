'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    BookOpen,
    Check,
    X,
    Users,
    Code,
    AlertTriangle,
    Zap,
    Shield,
    Star,
    Trophy,
    Lock,
    ChevronRight,
    Copy,
    CheckCircle
} from 'lucide-react';
import Link from 'next/link';

// Main Get the Book Page
export default function GetBookPage() {
    const [redeemMode, setRedeemMode] = useState(false);
    const [redeemCode, setRedeemCode] = useState('');
    const [codeStatus, setCodeStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleRedeemSubmit = () => {
        // Simulate code validation
        if (redeemCode.length === 12) {
            setCodeStatus('success');
        } else {
            setCodeStatus('error');
        }
    };

    const features = [
        { icon: AlertTriangle, text: '15+ Crisis Simulations (Fail Whale, Memory Leaks)', color: '#ef4444' },
        { icon: Code, text: 'Full Source Code Access & Examples', color: '#00d4ff' },
        { icon: Users, text: 'Private Discord Community', color: '#7c3aed' },
        { icon: Trophy, text: 'All Zones Unlocked (Zone 2-6)', color: '#f59e0b' },
        { icon: Shield, text: 'Lifetime Updates & New Content', color: '#10b981' },
    ];

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
            {/* Background Effects */}
            <div className="fixed inset-0 cyber-grid pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-cyan/5 pointer-events-none" />

            {/* Back Button */}
            <Link
                href="/"
                className="fixed top-6 left-6 p-3 rounded-xl bg-dark-panel border border-gray-700 hover:border-neon-cyan transition-colors z-50"
            >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl w-full bg-dark-panel/90 backdrop-blur-xl rounded-3xl border border-neon-cyan/20 overflow-hidden shadow-2xl"
            >
                <div className="grid lg:grid-cols-2">
                    {/* Left Side - 3D Book Display */}
                    <div className="relative p-12 bg-gradient-to-br from-neon-cyan/10 via-neon-purple/10 to-dark-panel flex flex-col items-center justify-center overflow-hidden">
                        {/* Glow Effects */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-3xl" />
                        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-neon-cyan/20 rounded-full blur-3xl" />

                        {/* 3D Floating Book */}
                        <motion.div
                            animate={{
                                y: [0, -15, 0],
                                rotateY: [0, 5, 0, -5, 0]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                            className="relative z-10"
                        >
                            {/* Book Shadow */}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/40 rounded-full blur-xl" />

                            {/* Book Cover */}
                            <div
                                className="w-56 h-72 rounded-lg shadow-2xl relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                                    transform: 'perspective(1000px) rotateY(-10deg)',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 60px rgba(0, 212, 255, 0.2)'
                                }}
                            >
                                {/* Book Spine Glow */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-cyan" />

                                {/* Book Content */}
                                <div className="p-6 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="text-xs font-mono text-neon-cyan mb-2">ARCHITECTURE 3.0</div>
                                        <h3 className="text-xl font-display font-bold leading-tight">
                                            Software<br />
                                            Architecture
                                        </h3>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="w-full h-px bg-gradient-to-r from-neon-cyan/50 to-transparent" />
                                        <div className="w-3/4 h-px bg-gradient-to-r from-neon-purple/50 to-transparent" />
                                        <div className="w-1/2 h-px bg-gradient-to-r from-neon-cyan/50 to-transparent" />
                                    </div>

                                    <div className="text-xs text-gray-400">
                                        Fatih Çağrı Bilgehan
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Best Seller Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center gap-2"
                        >
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-semibold text-yellow-500">Best Seller in Architecture</span>
                        </motion.div>
                    </div>

                    {/* Right Side - CTA Content */}
                    <div className="p-10 lg:p-12">
                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-3xl lg:text-4xl font-display font-bold mb-4">
                                Unlock the Full<br />
                                <span className="neon-text">Architecture</span>
                            </h1>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Zone 2 and beyond are locked. To battle <span className="text-red-400 font-semibold">The Fail Whale</span> and scale your systems, you need the Codex.
                            </p>
                        </motion.div>

                        {/* Features Checklist */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4 mb-8"
                        >
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${feature.color}20` }}
                                    >
                                        <Check className="w-4 h-4" style={{ color: feature.color }} />
                                    </div>
                                    <span className="text-gray-300">{feature.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Action Buttons */}
                        <AnimatePresence mode="wait">
                            {!redeemMode ? (
                                <motion.div
                                    key="buttons"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    {/* Primary CTA */}
                                    <a
                                        href="https://www.amazon.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-dark-bg font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
                                        >
                                            <BookOpen className="w-5 h-5" />
                                            Buy on Amazon — $29.99
                                            <ChevronRight className="w-5 h-5" />
                                        </motion.button>
                                    </a>

                                    {/* Secondary CTA */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setRedeemMode(true)}
                                        className="w-full py-4 rounded-xl border-2 border-gray-600 text-gray-300 font-semibold flex items-center justify-center gap-3 hover:border-neon-cyan hover:text-neon-cyan transition-all"
                                    >
                                        <Lock className="w-5 h-5" />
                                        I Have the Book — Redeem Code
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="redeem"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="p-6 rounded-xl bg-dark-bg border border-gray-700">
                                        <h3 className="text-lg font-bold mb-2">Redeem Your Code</h3>
                                        <p className="text-sm text-gray-400 mb-4">
                                            Enter the 12-character code from inside your book (Page 3).
                                        </p>

                                        <div className="relative">
                                            <input
                                                type="text"
                                                maxLength={12}
                                                value={redeemCode}
                                                onChange={(e) => {
                                                    setRedeemCode(e.target.value.toUpperCase());
                                                    setCodeStatus('idle');
                                                }}
                                                placeholder="XXXX-XXXX-XXXX"
                                                className={`w-full px-4 py-3 rounded-lg bg-dark-panel border-2 font-mono text-lg tracking-wider text-center focus:outline-none transition-all ${codeStatus === 'success'
                                                    ? 'border-green-500 text-green-500'
                                                    : codeStatus === 'error'
                                                        ? 'border-red-500 text-red-500 animate-shake'
                                                        : 'border-gray-600 focus:border-neon-cyan'
                                                    }`}
                                            />
                                            {codeStatus === 'success' && (
                                                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500" />
                                            )}
                                        </div>

                                        {codeStatus === 'error' && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-500 text-sm mt-2 font-mono"
                                            >
                                                ⚠️ Invalid code. Check and try again.
                                            </motion.p>
                                        )}

                                        {codeStatus === 'success' && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-green-500 text-sm mt-2 font-mono"
                                            >
                                                ✓ Code verified! All zones unlocked.
                                            </motion.p>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setRedeemMode(false)}
                                            className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-400 font-medium hover:border-gray-400 transition-all"
                                        >
                                            Back
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleRedeemSubmit}
                                            className="flex-1 py-3 rounded-xl bg-neon-cyan text-dark-bg font-bold"
                                        >
                                            Verify Code
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Trust Badge */}
                        <div className="mt-8 pt-6 border-t border-gray-700/50 flex items-center justify-center gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Secure Payment
                            </span>
                            <span className="flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Instant Access
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

