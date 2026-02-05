'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    User,
    Zap,
    Target,
    Trophy,
    BookOpen,
    Rocket,
    Check,
    Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Avatar Options
const avatarOptions = [
    { id: 1, name: 'Cyber Knight', color: 'from-neon-cyan to-blue-500' },
    { id: 2, name: 'Purple Haze', color: 'from-neon-purple to-pink-500' },
    { id: 3, name: 'Green Matrix', color: 'from-green-500 to-emerald-500' },
    { id: 4, name: 'Solar Flare', color: 'from-yellow-500 to-orange-500' },
    { id: 5, name: 'Red Alert', color: 'from-red-500 to-rose-500' },
    { id: 6, name: 'Ghost Mode', color: 'from-gray-400 to-gray-600' },
];

// Step 1: Welcome Screen
function WelcomeStep({ onNext }: { onNext: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
        >
            {/* Logo Animation */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center"
            >
                <Zap className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl font-display font-bold mb-4">
                Welcome to<br />
                <span className="neon-text">LabLudus</span>
            </h1>

            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Master software architecture through interactive code challenges and crisis simulations.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                {[
                    { icon: Target, label: '68 Missions', color: 'text-neon-cyan' },
                    { icon: Trophy, label: '7 Boss Battles', color: 'text-red-400' },
                    { icon: Star, label: '20,000+ XP', color: 'text-yellow-500' },
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className="p-4 rounded-xl bg-dark-panel border border-gray-700"
                    >
                        <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                        <div className="text-xs text-gray-400">{item.label}</div>
                    </motion.div>
                ))}
            </div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={onNext}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-lg flex items-center gap-2 mx-auto hover:shadow-lg hover:shadow-neon-cyan/20 transition-all"
            >
                Begin Your Journey
                <ChevronRight className="w-5 h-5" />
            </motion.button>
        </motion.div>
    );
}

// Step 2: Avatar Selection
function AvatarStep({ onNext, selectedAvatar, setSelectedAvatar }: {
    onNext: () => void;
    selectedAvatar: number;
    setSelectedAvatar: (id: number) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
        >
            <h2 className="text-3xl font-display font-bold mb-2">
                Choose Your Identity
            </h2>
            <p className="text-gray-400 mb-8">
                Select an avatar that represents your coding style
            </p>

            {/* Avatar Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
                {avatarOptions.map((avatar) => (
                    <motion.button
                        key={avatar.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className={`relative p-4 rounded-xl border-2 transition-all ${selectedAvatar === avatar.id
                            ? 'border-neon-cyan bg-neon-cyan/10'
                            : 'border-gray-700 hover:border-gray-600 bg-dark-panel'
                            }`}
                    >
                        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center mb-2`}>
                            <User className="w-8 h-8 text-white/80" />
                        </div>
                        <div className="text-sm text-gray-300">{avatar.name}</div>
                        {selectedAvatar === avatar.id && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon-cyan flex items-center justify-center"
                            >
                                <Check className="w-4 h-4 text-dark-bg" />
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Callsign Input */}
            <div className="max-w-sm mx-auto mb-8">
                <label className="block text-left text-sm font-mono text-gray-400 uppercase tracking-wider mb-2">
                    Your Callsign
                </label>
                <input
                    type="text"
                    placeholder="architect_neo"
                    className="w-full px-4 py-3 rounded-xl bg-dark-panel border-2 border-gray-700 focus:border-neon-cyan focus:outline-none font-mono text-center"
                />
            </div>

            <button
                onClick={onNext}
                disabled={!selectedAvatar}
                className="px-8 py-4 rounded-xl bg-neon-cyan text-dark-bg font-bold text-lg flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Continue
                <ChevronRight className="w-5 h-5" />
            </button>
        </motion.div>
    );
}

// Step 3: Tutorial Intro
function TutorialStep({ onNext }: { onNext: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
        >
            <h2 className="text-3xl font-display font-bold mb-2">
                How It Works
            </h2>
            <p className="text-gray-400 mb-8">
                Your path to becoming a System Architect
            </p>

            {/* Steps */}
            <div className="space-y-4 mb-8 max-w-md mx-auto text-left">
                {[
                    { icon: BookOpen, title: 'Read the Briefing', desc: 'Each mission starts with a code scenario from the book' },
                    { icon: Target, title: 'Fix the Code', desc: 'Apply architectural principles to solve the challenge' },
                    { icon: Zap, title: 'Run Tests', desc: 'Your code is validated against real test cases' },
                    { icon: Trophy, title: 'Earn XP & Level Up', desc: 'Complete missions to unlock new zones' },
                ].map((step, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.15 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-dark-panel border border-gray-700"
                    >
                        <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
                            <step.icon className="w-5 h-5 text-neon-cyan" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{step.title}</h4>
                            <p className="text-sm text-gray-400">{step.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={onNext}
                className="px-8 py-4 rounded-xl bg-neon-cyan text-dark-bg font-bold text-lg flex items-center gap-2 mx-auto"
            >
                Got It!
                <ChevronRight className="w-5 h-5" />
            </button>
        </motion.div>
    );
}

// Step 4: Book Preview / Ready
function ReadyStep({ onComplete }: { onComplete: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
            >
                <Rocket className="w-10 h-10 text-green-500" />
            </motion.div>

            <h2 className="text-3xl font-display font-bold mb-2">
                You're Ready!
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Zone 1 is free to explore. Unlock all 68 missions with the book.
            </p>

            {/* Book CTA */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 mb-8 max-w-md mx-auto">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-20 rounded bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-neon-cyan" />
                    </div>
                    <div className="text-left flex-1">
                        <h4 className="font-bold text-white">Software Architecture 3.0</h4>
                        <p className="text-sm text-gray-400">Unlock all zones & missions</p>
                        <p className="text-sm font-bold text-yellow-500">$29.99 on Amazon</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={onComplete}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-lg flex items-center justify-center gap-2"
                >
                    <Rocket className="w-5 h-5" />
                    Start Playing
                </button>
                <button
                    onClick={onComplete}
                    className="px-8 py-4 rounded-xl border border-gray-600 text-gray-400 font-medium hover:border-neon-cyan hover:text-neon-cyan transition-all"
                >
                    Skip for Now
                </button>
            </div>
        </motion.div>
    );
}

// Main Onboarding Page
export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedAvatar, setSelectedAvatar] = useState(1);

    const handleComplete = () => {
        // Would save onboarding status here
        router.push('/map');
    };

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
            {/* Background */}
            <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5 pointer-events-none" />

            {/* Progress Dots */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 flex gap-2">
                {[1, 2, 3, 4].map((s) => (
                    <div
                        key={s}
                        className={`w-2 h-2 rounded-full transition-all ${s === step
                            ? 'w-8 bg-neon-cyan'
                            : s < step
                                ? 'bg-neon-cyan'
                                : 'bg-gray-700'
                            }`}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="w-full max-w-2xl relative z-10">
                <AnimatePresence mode="wait">
                    {step === 1 && <WelcomeStep key="welcome" onNext={() => setStep(2)} />}
                    {step === 2 && (
                        <AvatarStep
                            key="avatar"
                            onNext={() => setStep(3)}
                            selectedAvatar={selectedAvatar}
                            setSelectedAvatar={setSelectedAvatar}
                        />
                    )}
                    {step === 3 && <TutorialStep key="tutorial" onNext={() => setStep(4)} />}
                    {step === 4 && <ReadyStep key="ready" onComplete={handleComplete} />}
                </AnimatePresence>
            </div>
        </div>
    );
}
