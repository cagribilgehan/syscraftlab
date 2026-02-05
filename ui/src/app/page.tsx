'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Zap, Trophy, Lock, ChevronRight, Terminal, Brain, Database, Map, Rocket, Menu, X, FileText } from 'lucide-react';
import Link from 'next/link';

// Book Card Component
function BookCard({
    title,
    subtitle,
    theme,
    level,
    maxLevel,
    isLocked,
    accentColor,
    icon: Icon,
    status
}: {
    title: string;
    subtitle: string;
    theme: string;
    level?: number;
    maxLevel?: number;
    isLocked: boolean;
    accentColor: string;
    icon: React.ElementType;
    status?: string;
}) {
    return (
        <motion.div
            whileHover={!isLocked ? { y: -10, scale: 1.02 } : {}}
            className={`relative overflow-hidden rounded-2xl border ${isLocked
                ? 'border-gray-700 opacity-70'
                : 'border-neon-cyan/30 neon-border'
                } bg-dark-panel p-6 pb-8 h-[340px] card-hover flex flex-col`}
        >
            {/* Locked Overlay */}
            {isLocked && (
                <div className="absolute inset-0 locked-overlay flex items-center justify-center z-10">
                    <div className="text-center">
                        <Lock className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                        <p className="text-gray-300 font-semibold text-lg">Coming Soon</p>
                        <p className="text-gray-500 text-sm mt-1">Season 2 & Beyond</p>
                    </div>
                </div>
            )}

            {/* Status Badge + Theme */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
                    {theme}
                </span>
                {status && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                        {status}
                    </span>
                )}
            </div>

            {/* Icon */}
            <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mt-4 mb-4"
                style={{ backgroundColor: `${accentColor}20` }}
            >
                <Icon className="w-8 h-8" style={{ color: accentColor }} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold font-display mb-2">{title}</h3>
            <p className="text-sm text-gray-400 mb-4">{subtitle}</p>

            {/* Progress */}
            {!isLocked && level !== undefined && (
                <div className="mt-auto">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-neon-cyan font-mono">Lvl {level}/{maxLevel}</span>
                    </div>
                    <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(level! / maxLevel!) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full progress-glow rounded-full"
                        />
                    </div>
                </div>
            )}

            {/* CTA Button - 16px gap from progress */}
            {!isLocked && (
                <Link href="/map">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 btn-primary"
                    >
                        Enter CodexLudus <ChevronRight className="w-4 h-4" />
                    </motion.button>
                </Link>
            )}
        </motion.div>
    );
}

// Skill Bar Component
function SkillBar({ name, level, maxLevel, color }: {
    name: string;
    level: number;
    maxLevel: number;
    color: string;
}) {
    const percentage = (level / maxLevel) * 100;

    return (
        <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{name}</span>
                <span className="font-mono" style={{ color }}>Lvl {level}</span>
            </div>
            <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                />
            </div>
        </div>
    );
}

// Stats Card Component
function StatCard({ icon: Icon, value, label, color }: {
    icon: React.ElementType;
    value: string | number;
    label: string;
    color: string;
}) {
    return (
        <div className="bg-dark-panel rounded-xl p-4 neon-border">
            <Icon className="w-6 h-6 mb-2" style={{ color }} />
            <div className="text-2xl font-bold font-display">{value}</div>
            <div className="text-sm text-gray-400">{label}</div>
        </div>
    );
}

// Main Landing Page
export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                            <Terminal className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-display font-bold neon-text">LabLudus</h1>
                            <p className="text-xs text-gray-500 hidden sm:block">Engineering Craftsmanship</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-4 lg:gap-6">
                        <Link href="/map" className="text-gray-400 hover:text-neon-cyan transition-colors flex items-center gap-1">
                            <Map className="w-4 h-4" />
                            <span className="hidden xl:inline">Mission Map</span>
                            <span className="xl:hidden">Map</span>
                        </Link>
                        <Link href="/leaderboard" className="text-gray-400 hover:text-neon-cyan transition-colors flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            <span className="hidden xl:inline">Leaderboard</span>
                            <span className="xl:hidden">Ranks</span>
                        </Link>
                        <Link href="/blog" className="text-gray-400 hover:text-neon-cyan transition-colors flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            DevLogs
                        </Link>
                        <Link href="/store" className="text-gray-400 hover:text-neon-cyan transition-colors flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            <span className="hidden xl:inline">The Armory</span>
                            <span className="xl:hidden">Armory</span>
                        </Link>
                        <Link
                            href="/map"
                            className="px-3 lg:px-4 py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-blue-500 text-dark-bg font-bold hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center gap-2"
                        >
                            <Rocket className="w-4 h-4" />
                            <span className="hidden lg:inline">Start Coding</span>
                            <span className="lg:hidden">Start</span>
                        </Link>
                        <Link href="/login" className="px-3 lg:px-4 py-2 rounded-lg bg-dark-panel border border-neon-cyan/30 text-neon-cyan font-medium hover:bg-neon-cyan/10 transition-all">
                            Sign In
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-dark-panel transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-400" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-400" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-dark-panel border-t border-gray-800 overflow-hidden"
                        >
                            <nav className="flex flex-col p-4 gap-2">
                                <Link
                                    href="/map"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-bg transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Map className="w-5 h-5 text-neon-cyan" />
                                    <span>Mission Map</span>
                                </Link>
                                <Link
                                    href="/leaderboard"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-bg transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    <span>Leaderboard</span>
                                </Link>
                                <Link
                                    href="/blog"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-bg transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <FileText className="w-5 h-5 text-green-400" />
                                    <span>DevLogs</span>
                                </Link>
                                <Link
                                    href="/store"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-bg transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Zap className="w-5 h-5 text-neon-purple" />
                                    <span>The Armory</span>
                                </Link>
                                <div className="border-t border-gray-700 my-2" />
                                <Link
                                    href="/map"
                                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-neon-cyan to-blue-500 text-dark-bg font-bold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Rocket className="w-5 h-5" />
                                    Start Coding
                                </Link>
                                <Link
                                    href="/login"
                                    className="flex items-center justify-center gap-2 p-3 rounded-lg border border-neon-cyan/30 text-neon-cyan font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
                            <span className="text-white">Learn by Coding,</span>
                            <br />
                            <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                                Master by Failing
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                            The first flight simulator for Software Architects. Don't just read about distributed systems—build them, break them, and fix them in a live production environment.
                        </p>

                        {/* Stats */}
                        <div className="flex justify-center gap-6 mb-12">
                            <StatCard icon={Code} value="60+" label="Code Challenges" color="#00d4ff" />
                            <StatCard icon={Zap} value="15" label="Crisis Simulations" color="#f59e0b" />
                            <StatCard icon={Trophy} value="6" label="Zones" color="#10b981" />
                        </div>

                        {/* Hero CTAs */}
                        <div className="hero-buttons-container">
                            <Link href="/map">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="hero-btn btn-primary flex items-center gap-2"
                                >
                                    <Rocket className="w-5 h-5" />
                                    Enter the Simulation
                                </motion.button>
                            </Link>
                            <Link href="/store">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="hero-btn btn-secondary flex items-center gap-2"
                                >
                                    Explore Resources
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Library Section */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-3xl font-display font-bold mb-2 text-center">
                            Active Simulations
                        </h3>
                        <p className="text-gray-400 text-center mb-12">
                            Choose your battlefield. Master the stack from Clean Code to Cloud-Native Scale.
                        </p>

                        {/* Book Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <BookCard
                                title="CodexLudus"
                                subtitle="Software Architecture 3.0"
                                theme="Cyberpunk"
                                status="Season 1"
                                level={12}
                                maxLevel={50}
                                isLocked={false}
                                accentColor="#00d4ff"
                                icon={Terminal}
                            />
                            <BookCard
                                title="AlgoKeep"
                                subtitle="Algorithms & Data Structures"
                                theme="Medieval"
                                isLocked={true}
                                accentColor="#f59e0b"
                                icon={Code}
                            />
                            <BookCard
                                title="AI Station"
                                subtitle="AI Engineering"
                                theme="Space"
                                isLocked={true}
                                accentColor="#ec4899"
                                icon={Brain}
                            />
                            <BookCard
                                title="DataForge"
                                subtitle="Database Systems"
                                theme="Steampunk"
                                isLocked={true}
                                accentColor="##10b981"
                                icon={Database}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Universal Skill Tree */}
            <section className="py-16 px-6 bg-dark-panel/50">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-3xl font-display font-bold mb-2 text-center">
                        Universal Skill Tree
                    </h3>
                    <p className="text-gray-400 text-center mb-8">
                        All skills from every book in one profile
                    </p>

                    <div className="bg-dark-bg rounded-2xl p-8 neon-border">
                        <SkillBar name="System Design" level={5} maxLevel={10} color="#00d4ff" />
                        <SkillBar name="Distributed Systems" level={2} maxLevel={10} color="#7c3aed" />
                        <SkillBar name="Cloud Architecture" level={1} maxLevel={10} color="#10b981" />
                        <SkillBar name="AI & Agents" level={0} maxLevel={10} color="#ec4899" />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-4xl font-display font-bold mb-6">
                            Ready for the Adventure?
                        </h3>
                        <p className="text-xl text-gray-400 mb-8">
                            Your first mission awaits. Learn SOLID principles,
                            defeat the Legacy Monster!
                        </p>
                        <Link href="/game">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-xl font-bold text-lg btn-primary"
                            >
                                Start Journey
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-gray-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-500">
                    <p>© 2026 LabLudus. Learn by coding.</p>
                    <p className="font-mono">v0.1.0-mvp</p>
                </div>
            </footer>
        </div>
    );
}
