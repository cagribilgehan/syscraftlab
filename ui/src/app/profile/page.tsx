'use client';

import { motion } from 'framer-motion';
import {
    ArrowLeft,
    User,
    Trophy,
    Star,
    Shield,
    Zap,
    Clock,
    Target,
    Award,
    Code,
    Database,
    Cloud,
    Lock,
    Server,
    Cpu
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

// Type definitions
interface Skill {
    name: string;
    level: number;
    maxLevel: number;
    color: string;
    icon: LucideIcon;
}

interface Badge {
    id: number;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
}

// User data
const userData = {
    username: 'architect_neo',
    avatar: '👾',
    rank: 'Junior Architect',
    level: 3,
    xp: 450,
    nextLevelXp: 600,
    joinDate: 'January 2026',
    completedMissions: 2,
    totalMissions: 13,
    streak: 5,
    timeSpent: '4h 32m'
};

// Skill data for hexagon graph
const skills: Skill[] = [
    { name: 'Backend', level: 5, maxLevel: 10, color: '#00d4ff', icon: Server },
    { name: 'Database', level: 3, maxLevel: 10, color: '#7c3aed', icon: Database },
    { name: 'Cloud', level: 1, maxLevel: 10, color: '#10b981', icon: Cloud },
    { name: 'Security', level: 2, maxLevel: 10, color: '#f59e0b', icon: Shield },
    { name: 'DevOps', level: 1, maxLevel: 10, color: '#ec4899', icon: Cpu },
    { name: 'Frontend', level: 4, maxLevel: 10, color: '#06b6d4', icon: Code },
];

// Badges data
const badges: Badge[] = [
    { id: 1, name: 'First Steps', description: 'Complete your first mission', icon: '🚀', unlocked: true },
    { id: 2, name: 'Clean Coder', description: 'Complete a mission with no errors', icon: '✨', unlocked: true },
    { id: 3, name: 'SOLID Foundation', description: 'Master all SOLID principles', icon: '🏗️', unlocked: false },
    { id: 4, name: 'Whale Slayer', description: 'Defeat The Fail Whale', icon: '🐋', unlocked: false },
    { id: 5, name: 'Circuit Master', description: 'Implement Circuit Breaker pattern', icon: '⚡', unlocked: false },
    { id: 6, name: 'Data Architect', description: 'Complete all database challenges', icon: '💾', unlocked: false },
    { id: 7, name: 'Cloud Native', description: 'Deploy to Kubernetes', icon: '☁️', unlocked: false },
    { id: 8, name: 'System Lead', description: 'Reach Level 10', icon: '👑', unlocked: false },
];

// Rank progression
const ranks = [
    { name: 'Novice', minLevel: 1 },
    { name: 'Junior Architect', minLevel: 3 },
    { name: 'Architect', minLevel: 5 },
    { name: 'Senior Architect', minLevel: 7 },
    { name: 'System Lead', minLevel: 10 },
];

// Hexagon Skill Graph Component
function HexagonSkillGraph({ skills }: { skills: Skill[] }) {
    const center = { x: 150, y: 150 };
    const radius = 100;
    const points = 6;

    // Calculate positions for each skill point
    const getPosition = (index: number, value: number) => {
        const angle = (Math.PI * 2 * index) / points - Math.PI / 2;
        const distance = (value / 10) * radius;
        return {
            x: center.x + distance * Math.cos(angle),
            y: center.y + distance * Math.sin(angle)
        };
    };

    // Generate polygon points for the skill values
    const polygonPoints = skills
        .map((skill, i) => getPosition(i, skill.level))
        .map(p => `${p.x},${p.y}`)
        .join(' ');

    // Generate outer hexagon
    const outerPoints = Array.from({ length: points })
        .map((_, i) => getPosition(i, 10))
        .map(p => `${p.x},${p.y}`)
        .join(' ');

    // Grid lines
    const gridLevels = [2, 4, 6, 8, 10];

    return (
        <div className="relative w-[300px] h-[300px]">
            <svg width="300" height="300" className="absolute inset-0">
                {/* Grid lines */}
                {gridLevels.map(level => {
                    const points = Array.from({ length: 6 })
                        .map((_, i) => getPosition(i, level))
                        .map(p => `${p.x},${p.y}`)
                        .join(' ');
                    return (
                        <polygon
                            key={level}
                            points={points}
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Lines from center to vertices */}
                {skills.map((_, i) => {
                    const pos = getPosition(i, 10);
                    return (
                        <line
                            key={i}
                            x1={center.x}
                            y1={center.y}
                            x2={pos.x}
                            y2={pos.y}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Skill polygon */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    points={polygonPoints}
                    fill="url(#skillGradient)"
                    stroke="#00d4ff"
                    strokeWidth="2"
                    style={{ transformOrigin: 'center' }}
                />

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(0, 212, 255, 0.3)" />
                        <stop offset="100%" stopColor="rgba(124, 58, 237, 0.3)" />
                    </linearGradient>
                </defs>

                {/* Skill points */}
                {skills.map((skill, i) => {
                    const pos = getPosition(i, skill.level);
                    return (
                        <motion.circle
                            key={skill.name}
                            initial={{ r: 0 }}
                            animate={{ r: 6 }}
                            transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                            cx={pos.x}
                            cy={pos.y}
                            fill={skill.color}
                            stroke="white"
                            strokeWidth="2"
                        />
                    );
                })}
            </svg>

            {/* Skill labels */}
            {skills.map((skill, i) => {
                const pos = getPosition(i, 12);
                const Icon = skill.icon;
                return (
                    <div
                        key={skill.name}
                        className="absolute flex flex-col items-center"
                        style={{
                            left: pos.x - 30,
                            top: pos.y - 15,
                            width: 60
                        }}
                    >
                        <Icon className="w-4 h-4 mb-1" style={{ color: skill.color }} />
                        <span className="text-xs text-gray-400 text-center">{skill.name}</span>
                    </div>
                );
            })}
        </div>
    );
}

// Badge Card Component
function BadgeCard({ badge }: { badge: typeof badges[0] }) {
    return (
        <motion.div
            whileHover={badge.unlocked ? { scale: 1.05 } : {}}
            className={`p-4 rounded-xl text-center transition-all ${badge.unlocked
                ? 'bg-dark-panel neon-border'
                : 'bg-gray-900/50 border border-gray-800 opacity-50'
                }`}
        >
            <div className={`text-4xl mb-2 ${badge.unlocked ? '' : 'grayscale'}`}>
                {badge.unlocked ? badge.icon : '🔒'}
            </div>
            <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
            <p className="text-xs text-gray-500">{badge.description}</p>
        </motion.div>
    );
}

// Main Profile Page
export default function ProfilePage() {
    const xpProgress = (userData.xp / userData.nextLevelXp) * 100;
    const currentRank = ranks.filter(r => userData.level >= r.minLevel).pop();
    const nextRank = ranks.find(r => r.minLevel > userData.level);

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/80 backdrop-blur-lg border-b border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-dark-panel rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-display font-bold neon-text">The Dossier</h1>
                                <p className="text-xs text-gray-500">Architect Profile</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Identity Card */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Profile Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-dark-panel rounded-2xl p-6 neon-border relative overflow-hidden"
                            >
                                {/* Scan line effect */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan animate-pulse" />

                                {/* Avatar */}
                                <div className="flex flex-col items-center mb-6">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', delay: 0.2 }}
                                        className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center text-5xl mb-4 neon-border"
                                    >
                                        {userData.avatar}
                                    </motion.div>
                                    <h2 className="text-2xl font-display font-bold">{userData.username}</h2>
                                    <span className="text-neon-cyan font-mono text-sm">{currentRank?.name}</span>
                                </div>

                                {/* Level Progress */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">Level {userData.level}</span>
                                        <span className="font-mono text-neon-purple">{userData.xp}/{userData.nextLevelXp} XP</span>
                                    </div>
                                    <div className="h-3 bg-dark-bg rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${xpProgress}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full progress-glow rounded-full"
                                        />
                                    </div>
                                    {nextRank && (
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            Next rank: {nextRank.name} at Level {nextRank.minLevel}
                                        </p>
                                    )}
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-dark-bg rounded-xl p-3 text-center">
                                        <Target className="w-5 h-5 mx-auto mb-1 text-neon-cyan" />
                                        <div className="text-lg font-bold">{userData.completedMissions}/{userData.totalMissions}</div>
                                        <div className="text-xs text-gray-500">Missions</div>
                                    </div>
                                    <div className="bg-dark-bg rounded-xl p-3 text-center">
                                        <Zap className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                                        <div className="text-lg font-bold">{userData.streak} days</div>
                                        <div className="text-xs text-gray-500">Streak</div>
                                    </div>
                                    <div className="bg-dark-bg rounded-xl p-3 text-center">
                                        <Clock className="w-5 h-5 mx-auto mb-1 text-neon-purple" />
                                        <div className="text-lg font-bold">{userData.timeSpent}</div>
                                        <div className="text-xs text-gray-500">Time Spent</div>
                                    </div>
                                    <div className="bg-dark-bg rounded-xl p-3 text-center">
                                        <Award className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                                        <div className="text-lg font-bold">{badges.filter(b => b.unlocked).length}</div>
                                        <div className="text-xs text-gray-500">Badges</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Joined Date */}
                            <div className="text-center text-sm text-gray-500">
                                Joined {userData.joinDate}
                            </div>
                        </div>

                        {/* Middle Column - Skill Tree */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-dark-panel rounded-2xl p-6 neon-border"
                            >
                                <h3 className="text-xl font-display font-bold mb-6 text-center">
                                    Skill Hexagon
                                </h3>
                                <div className="flex justify-center">
                                    <HexagonSkillGraph skills={skills} />
                                </div>

                                {/* Skill Legend */}
                                <div className="mt-6 grid grid-cols-2 gap-2">
                                    {skills.map(skill => {
                                        const Icon = skill.icon;
                                        return (
                                            <div key={skill.name} className="flex items-center gap-2 text-sm">
                                                <Icon className="w-4 h-4" style={{ color: skill.color }} />
                                                <span className="text-gray-400">{skill.name}</span>
                                                <span className="ml-auto font-mono" style={{ color: skill.color }}>
                                                    {skill.level}/{skill.maxLevel}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Badges */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-dark-panel rounded-2xl p-6 neon-border"
                            >
                                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    Badges
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    {badges.map(badge => (
                                        <BadgeCard key={badge.id} badge={badge} />
                                    ))}
                                </div>

                                <div className="mt-6 text-center text-sm text-gray-500">
                                    {badges.filter(b => b.unlocked).length} of {badges.length} badges unlocked
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
