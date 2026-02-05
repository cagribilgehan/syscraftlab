'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    BookOpen,
    Check,
    Users,
    Code,
    AlertTriangle,
    Zap,
    Shield,
    Trophy,
    ChevronRight,
    CreditCard,
    Clock,
    Sparkles,
    Crown
} from 'lucide-react';
import Link from 'next/link';

export default function GetBookPage() {
    const [showRedeemForm, setShowRedeemForm] = useState(false);
    const [redeemCode, setRedeemCode] = useState('');
    const [codeStatus, setCodeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [subscribeStep, setSubscribeStep] = useState<'select' | 'checkout'>('select');

    const handleRedeemSubmit = () => {
        if (redeemCode.length < 8) {
            setCodeStatus('error');
            return;
        }
        setCodeStatus('loading');
        setTimeout(() => {
            if (redeemCode.toUpperCase().startsWith('CODEX')) {
                setCodeStatus('success');
            } else {
                setCodeStatus('error');
            }
        }, 1500);
    };

    const handleSubscribe = () => {
        setSubscribeStep('checkout');
    };

    const features = [
        { icon: AlertTriangle, text: '15+ Crisis Simulations' },
        { icon: Code, text: 'Full Source Code Examples' },
        { icon: Users, text: 'Private Discord Community' },
        { icon: Trophy, text: 'All 68 Missions Unlocked' },
        { icon: Shield, text: 'New Content Updates' },
        { icon: Zap, text: '7 Boss Battles' },
    ];

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
            {/* Background Effects */}
            <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
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
                className="max-w-lg w-full"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple to-pink-500 mb-4"
                    >
                        <Crown className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-display font-bold mb-3">
                        Unlock <span className="neon-text">Full Access</span>
                    </h1>
                    <p className="text-gray-400 max-w-md mx-auto">
                        Get unlimited access to all 68 missions, 7 boss battles, and exclusive content.
                    </p>
                </div>

                {/* Single PRO Membership Card */}
                <AnimatePresence mode="wait">
                    {subscribeStep === 'select' && !showRedeemForm && (
                        <motion.div
                            key="main"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="relative p-8 rounded-2xl border-2 border-neon-purple bg-gradient-to-b from-neon-purple/10 to-transparent">
                                {/* Badge */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-neon-purple to-pink-500 text-white text-sm font-bold flex items-center gap-1">
                                    <Sparkles className="w-4 h-4" />
                                    PRO MEMBERSHIP
                                </div>

                                {/* Price */}
                                <div className="text-center mt-4 mb-6">
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-5xl font-bold text-white">$9.99</span>
                                        <span className="text-gray-400 text-lg">/month</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-400">
                                        <Clock className="w-4 h-4 text-neon-purple" />
                                        <span>Cancel anytime, no commitment</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-gray-200">
                                            <div className="w-8 h-8 rounded-lg bg-neon-purple/20 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-neon-purple" />
                                            </div>
                                            {feature.text}
                                        </li>
                                    ))}
                                </ul>

                                {/* Subscribe Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubscribe}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-purple to-pink-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/25"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Subscribe Now
                                </motion.button>

                                {/* Yearly Option */}
                                <div className="mt-4 p-3 rounded-xl bg-dark-bg border border-gray-700 text-center">
                                    <span className="text-gray-400">Or save 25% with </span>
                                    <span className="text-neon-purple font-bold">$89.99/year</span>
                                </div>
                            </div>

                            {/* Redeem Code Link */}
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setShowRedeemForm(true)}
                                    className="text-gray-500 hover:text-neon-cyan transition-colors text-sm inline-flex items-center gap-1"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Already own the "Software Architecture 3.0" book? Redeem your access code here.
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Redeem Form */}
                    {showRedeemForm && (
                        <motion.div
                            key="redeem"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-dark-panel rounded-2xl border border-gray-700 p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-green-400" />
                                    Redeem Book Code
                                </h3>
                                <button
                                    onClick={() => setShowRedeemForm(false)}
                                    className="text-sm text-gray-400 hover:text-white"
                                >
                                    ← Back
                                </button>
                            </div>
                            <p className="text-sm text-gray-400 mb-4">
                                Find your unique 12-character code on the first page of your book.
                            </p>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={redeemCode}
                                    onChange={(e) => {
                                        setRedeemCode(e.target.value.toUpperCase());
                                        setCodeStatus('idle');
                                    }}
                                    placeholder="CODEX-XXXX-XXXX"
                                    className={`flex-1 px-4 py-3 rounded-xl bg-dark-bg border-2 font-mono text-center tracking-widest uppercase focus:outline-none transition-all ${codeStatus === 'error'
                                        ? 'border-red-500 animate-shake'
                                        : codeStatus === 'success'
                                            ? 'border-green-500'
                                            : 'border-gray-700 focus:border-green-500'
                                        }`}
                                    maxLength={14}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleRedeemSubmit}
                                    disabled={codeStatus === 'loading' || codeStatus === 'success'}
                                    className="px-6 py-3 rounded-xl bg-green-500 text-dark-bg font-bold disabled:opacity-50 flex items-center gap-2"
                                >
                                    {codeStatus === 'loading' ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="w-5 h-5 border-2 border-dark-bg border-t-transparent rounded-full"
                                        />
                                    ) : codeStatus === 'success' ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Unlocked!
                                        </>
                                    ) : (
                                        'Redeem'
                                    )}
                                </motion.button>
                            </div>
                            {codeStatus === 'error' && (
                                <p className="text-sm text-red-400 mt-2">
                                    Invalid code. Please check and try again.
                                </p>
                            )}
                            {codeStatus === 'success' && (
                                <p className="text-sm text-green-400 mt-2">
                                    🎉 Welcome, Architect! All content is now unlocked.
                                </p>
                            )}
                        </motion.div>
                    )}

                    {/* Checkout Form */}
                    {subscribeStep === 'checkout' && !showRedeemForm && (
                        <motion.div
                            key="checkout"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-dark-panel rounded-2xl border border-neon-purple/30 p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-neon-purple" />
                                    Checkout
                                </h3>
                                <button
                                    onClick={() => setSubscribeStep('select')}
                                    className="text-sm text-gray-400 hover:text-white"
                                >
                                    ← Back
                                </button>
                            </div>

                            {/* Mock Stripe Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="architect@example.com"
                                        className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-gray-700 focus:border-neon-purple focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        placeholder="4242 4242 4242 4242"
                                        className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-gray-700 focus:border-neon-purple focus:outline-none font-mono"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Expiry</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-gray-700 focus:border-neon-purple focus:outline-none font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">CVC</label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-gray-700 focus:border-neon-purple focus:outline-none font-mono"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-purple to-pink-500 text-white font-bold mt-4"
                                >
                                    Subscribe - $9.99/month
                                </motion.button>
                            </div>

                            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> Secure
                                </span>
                                <span>•</span>
                                <span>256-bit SSL</span>
                                <span>•</span>
                                <span>Cancel anytime</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
