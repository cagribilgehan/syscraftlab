'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Zap,
    Shield,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ChevronRight,
    Users,
    Cpu,
    Globe
} from 'lucide-react';
import Link from 'next/link';

// Register Page - Initialize Architect Protocol
export default function RegisterPage() {
    const [formData, setFormData] = useState({
        callsign: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate loading
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="min-h-screen bg-dark-bg flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                {/* Background Grid */}
                <div className="absolute inset-0 cyber-grid opacity-30" />

                {/* Animated Background Circuits */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: -100, y: Math.random() * 100 }}
                            animate={{
                                x: ['0%', '100%'],
                                opacity: [0.1, 0.3, 0.1]
                            }}
                            transition={{
                                duration: 15 + i * 3,
                                repeat: Infinity,
                                delay: i * 2
                            }}
                            className="absolute h-px w-48 bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
                            style={{ top: `${20 + i * 15}%` }}
                        />
                    ))}
                </div>

                {/* Back Button */}
                <Link
                    href="/"
                    className="absolute top-6 left-6 p-3 rounded-xl bg-dark-panel border border-gray-700 hover:border-neon-cyan transition-colors z-50"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                </Link>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 w-full max-w-md"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                            <Cpu className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-display font-bold neon-text">LabLudus</h1>
                            <p className="text-xs text-gray-500 font-mono">ARCHITECT PROTOCOL v3.0</p>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-display font-bold mb-2">
                        Initialize<br />
                        <span className="neon-text">Architect Protocol</span>
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Create your system identity and begin your journey.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Callsign Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-mono text-gray-400 uppercase tracking-wider">
                                Callsign
                            </label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                                <input
                                    type="text"
                                    placeholder="architect_neo"
                                    value={formData.callsign}
                                    onChange={(e) => setFormData({ ...formData, callsign: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-dark-panel border-2 border-gray-700 focus:border-neon-cyan focus:outline-none transition-all font-mono"
                                />
                            </div>
                        </div>

                        {/* Communication Channel (Email) */}
                        <div className="space-y-2">
                            <label className="text-sm font-mono text-gray-400 uppercase tracking-wider">
                                Communication Channel
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                                <input
                                    type="email"
                                    placeholder="neo@matrix.io"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-dark-panel border-2 border-gray-700 focus:border-neon-cyan focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Security Key (Password) */}
                        <div className="space-y-2">
                            <label className="text-sm font-mono text-gray-400 uppercase tracking-wider">
                                Security Key
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-12 py-4 rounded-xl bg-dark-panel border-2 border-gray-700 focus:border-neon-cyan focus:outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-neon-cyan transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-neon-cyan/20 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                                />
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Compile & Build Profile
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-700" />
                        <span className="text-sm text-gray-500 font-mono">OR</span>
                        <div className="flex-1 h-px bg-gray-700" />
                    </div>

                    {/* Social Login */}
                    <div className="flex gap-4">
                        <button className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-400 font-medium hover:border-neon-cyan hover:text-neon-cyan transition-all flex items-center justify-center gap-2">
                            <Globe className="w-5 h-5" />
                            Google
                        </button>
                        <button className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-400 font-medium hover:border-neon-cyan hover:text-neon-cyan transition-all flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    {/* Login Link */}
                    <p className="mt-8 text-center text-gray-400">
                        Already have an identity?{' '}
                        <Link href="/login" className="text-neon-cyan hover:underline">
                            System Access →
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right Side - Motivation */}
            <div className="hidden lg:flex w-[450px] bg-gradient-to-br from-neon-cyan/10 via-neon-purple/10 to-dark-panel relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-0 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
                    {/* 3D Rotating Cube */}
                    <motion.div
                        animate={{ rotateY: 360, rotateX: 30 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="w-32 h-32 mb-12 relative"
                        style={{ transformStyle: 'preserve-3d', perspective: 500 }}
                    >
                        <div
                            className="absolute inset-0 border-2 border-neon-cyan/50 rounded-xl"
                            style={{ transform: 'translateZ(40px)', background: 'linear-gradient(135deg, rgba(0,212,255,0.1), transparent)' }}
                        />
                        <div
                            className="absolute inset-0 border-2 border-neon-purple/50 rounded-xl"
                            style={{ transform: 'translateZ(-40px)', background: 'linear-gradient(135deg, rgba(124,58,237,0.1), transparent)' }}
                        />
                    </motion.div>

                    <h3 className="text-2xl font-display font-bold mb-4">
                        Join 5,000+ Engineers
                    </h3>
                    <p className="text-gray-400 mb-8">
                        Building the future of<br />software architecture
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-6 w-full">
                        <div className="p-4 rounded-xl bg-dark-panel/50 border border-gray-700/50">
                            <div className="text-2xl font-bold text-neon-cyan">60+</div>
                            <div className="text-xs text-gray-500">Code Challenges</div>
                        </div>
                        <div className="p-4 rounded-xl bg-dark-panel/50 border border-gray-700/50">
                            <div className="text-2xl font-bold text-neon-purple">15</div>
                            <div className="text-xs text-gray-500">Crisis Simulations</div>
                        </div>
                        <div className="p-4 rounded-xl bg-dark-panel/50 border border-gray-700/50">
                            <div className="text-2xl font-bold text-green-500">6</div>
                            <div className="text-xs text-gray-500">Learning Zones</div>
                        </div>
                        <div className="p-4 rounded-xl bg-dark-panel/50 border border-gray-700/50">
                            <div className="text-2xl font-bold text-yellow-500">∞</div>
                            <div className="text-xs text-gray-500">Knowledge</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
