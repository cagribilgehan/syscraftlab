'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Zap,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Terminal,
    AlertTriangle,
    ChevronRight,
    Globe
} from 'lucide-react';
import Link from 'next/link';

// Login Page - System Access
export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Simulate authentication
        setTimeout(() => {
            if (formData.password.length < 6) {
                setError('ACCESS DENIED: Invalid credentials');
                setIsLoading(false);
            } else {
                setIsLoading(false);
                // Redirect would happen here
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 cyber-grid opacity-20" />

            {/* Animated Circuit Lines */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{
                        duration: 8 + i * 2,
                        repeat: Infinity,
                        delay: i * 1.5,
                        ease: 'linear'
                    }}
                    className="absolute h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent"
                    style={{
                        top: `${10 + i * 12}%`,
                        width: '30%',
                        opacity: 0.3
                    }}
                />
            ))}

            {/* Vertical Lines */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={`v-${i}`}
                    initial={{ y: '-100%' }}
                    animate={{ y: '200%' }}
                    transition={{
                        duration: 10 + i * 2,
                        repeat: Infinity,
                        delay: i * 2,
                        ease: 'linear'
                    }}
                    className="absolute w-px bg-gradient-to-b from-transparent via-neon-purple/30 to-transparent"
                    style={{
                        left: `${15 + i * 15}%`,
                        height: '30%',
                        opacity: 0.3
                    }}
                />
            ))}

            {/* Glow Effects */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-3xl" />

            {/* Back Button */}
            <Link
                href="/"
                className="absolute top-6 left-6 p-3 rounded-xl bg-dark-panel border border-gray-700 hover:border-neon-cyan transition-colors z-50"
            >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Terminal Header */}
                <div className="bg-dark-panel rounded-t-2xl border border-b-0 border-gray-700 p-4 flex items-center gap-3">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 text-center text-sm font-mono text-gray-500">
                        system_access.exe
                    </div>
                    <Terminal className="w-4 h-4 text-gray-500" />
                </div>

                {/* Main Card */}
                <div className="bg-dark-panel/95 backdrop-blur-xl rounded-b-2xl border border-gray-700 p-8 relative overflow-hidden">
                    {/* Scan Line Effect */}
                    <motion.div
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent pointer-events-none"
                    />

                    {/* Title */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center mx-auto mb-4 neon-border"
                        >
                            <Terminal className="w-8 h-8 text-neon-cyan" />
                        </motion.div>
                        <h1 className="text-3xl font-display font-bold mb-2">
                            System Access
                        </h1>
                        <p className="text-gray-400 font-mono text-sm">
                            // Authenticate to continue
                        </p>
                    </div>

                    {/* Error Message with Glitch Effect */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 flex items-center gap-3"
                        >
                            <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                            <span className="text-red-400 font-mono text-sm">{error}</span>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-mono text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <span className="text-neon-cyan">$</span> email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                                <input
                                    type="email"
                                    placeholder="user@syscraftlab.io"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-dark-bg border-2 border-gray-700 focus:border-neon-cyan focus:shadow-[0_0_20px_rgba(0,212,255,0.15)] focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-mono text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <span className="text-neon-cyan">$</span> password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••••"
                                    value={formData.password}
                                    onChange={(e) => {
                                        setFormData({ ...formData, password: e.target.value });
                                        setError(null);
                                    }}
                                    className={`w-full pl-12 pr-12 py-4 rounded-xl bg-dark-bg border-2 focus:outline-none transition-all ${error
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-700 focus:border-neon-cyan focus:shadow-[0_0_20px_rgba(0,212,255,0.15)]'
                                        }`}
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

                        {/* Forgot Password */}
                        <div className="text-right">
                            <a href="#" className="text-sm text-gray-400 hover:text-neon-cyan transition-colors font-mono">
                                Reset access key →
                            </a>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 rounded-xl bg-neon-cyan text-dark-bg font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-neon-cyan/20 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="w-6 h-6 border-2 border-dark-bg border-t-transparent rounded-full"
                                    />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Establish Connection
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-700" />
                        <span className="text-xs text-gray-500 font-mono">ALTERNATIVE</span>
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

                    {/* Register Link */}
                    <p className="mt-6 text-center text-gray-400 text-sm">
                        No identity yet?{' '}
                        <Link href="/register" className="text-neon-cyan hover:underline font-semibold">
                            Initialize Protocol →
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
