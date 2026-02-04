'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Trophy,
    Medal,
    Crown,
    Flame,
    ChevronDown,
    Globe,
    Calendar,
    Star,
    TrendingUp,
    TrendingDown,
    Minus
} from 'lucide-react';
import Link from 'next/link';

// Mock leaderboard data
const leaderboardData = [
    { rank: 1, name: 'code_master_42', xp: 15420, streak: 45, country: '🇹🇷', change: 0, avatar: 'from-yellow-500 to-orange-500' },
    { rank: 2, name: 'arch_ninja', xp: 14850, streak: 38, country: '🇺🇸', change: 1, avatar: 'from-neon-cyan to-blue-500' },
    { rank: 3, name: 'system_queen', xp: 13200, streak: 32, country: '🇩🇪', change: -1, avatar: 'from-pink-500 to-rose-500' },
    { rank: 4, name: 'devops_wizard', xp: 12100, streak: 28, country: '🇬🇧', change: 2, avatar: 'from-green-500 to-emerald-500' },
    { rank: 5, name: 'cloud_hunter', xp: 11500, streak: 25, country: '🇫🇷', change: 0, avatar: 'from-neon-purple to-violet-500' },
    { rank: 6, name: 'architect_neo', xp: 10890, streak: 22, country: '🇹🇷', change: 3, isCurrentUser: true, avatar: 'from-neon-cyan to-neon-purple' },
    { rank: 7, name: 'byte_crusher', xp: 9800, streak: 18, country: '🇯🇵', change: -2, avatar: 'from-red-500 to-orange-500' },
    { rank: 8, name: 'data_sage', xp: 9200, streak: 15, country: '🇧🇷', change: 0, avatar: 'from-blue-500 to-cyan-500' },
    { rank: 9, name: 'micro_master', xp: 8750, streak: 12, country: '🇮🇳', change: 1, avatar: 'from-purple-500 to-pink-500' },
    { rank: 10, name: 'event_lord', xp: 8100, streak: 10, country: '🇰🇷', change: -1, avatar: 'from-gray-500 to-gray-700' },
];

// Podium Component
function Podium({ data }: { data: typeof leaderboardData }) {
    const top3 = data.slice(0, 3);
    const [second, first, third] = [top3[1], top3[0], top3[2]];

    const podiumConfig = [
        { user: second, height: 'h-24', position: '2nd', medal: 'text-gray-300', bg: 'from-gray-400/20 to-gray-600/20' },
        { user: first, height: 'h-32', position: '1st', medal: 'text-yellow-500', bg: 'from-yellow-500/20 to-orange-500/20' },
        { user: third, height: 'h-20', position: '3rd', medal: 'text-amber-600', bg: 'from-amber-600/20 to-orange-700/20' },
    ];

    return (
        <div className="flex items-end justify-center gap-4 mb-8">
            {podiumConfig.map((config, idx) => (
                <motion.div
                    key={config.position}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.2 }}
                    className="flex flex-col items-center"
                >
                    {/* Avatar */}
                    <div className="relative mb-2">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${config.user.avatar} flex items-center justify-center text-2xl font-bold text-white/80 border-2 ${config.position === '1st' ? 'border-yellow-500' : config.position === '2nd' ? 'border-gray-300' : 'border-amber-600'
                            }`}>
                            {config.user.name[0].toUpperCase()}
                        </div>
                        {config.position === '1st' && (
                            <Crown className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-500" />
                        )}
                    </div>

                    {/* Name */}
                    <p className="text-sm font-mono text-white mb-1 truncate max-w-[80px]">{config.user.name}</p>
                    <p className="text-xs text-neon-cyan font-bold mb-2">{config.user.xp.toLocaleString()} XP</p>

                    {/* Podium */}
                    <div className={`w-24 ${config.height} rounded-t-lg bg-gradient-to-t ${config.bg} border border-gray-700 flex items-center justify-center`}>
                        <Medal className={`w-8 h-8 ${config.medal}`} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

// Leaderboard Row Component
function LeaderboardRow({ user, index }: { user: typeof leaderboardData[0]; index: number }) {
    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
        if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
        return <span className="text-gray-500 font-mono">#{rank}</span>;
    };

    const getChangeIcon = (change: number) => {
        if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
        return <Minus className="w-4 h-4 text-gray-500" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-4 p-4 rounded-xl ${user.isCurrentUser
                    ? 'bg-neon-cyan/10 border border-neon-cyan/30'
                    : 'bg-dark-panel hover:bg-dark-panel/80'
                } transition-colors`}
        >
            {/* Rank */}
            <div className="w-10 flex justify-center">
                {getRankIcon(user.rank)}
            </div>

            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.avatar} flex items-center justify-center text-white font-bold`}>
                {user.name[0].toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className={`font-medium truncate ${user.isCurrentUser ? 'text-neon-cyan' : 'text-white'}`}>
                        {user.name}
                    </span>
                    <span className="text-lg">{user.country}</span>
                    {user.isCurrentUser && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neon-cyan/20 text-neon-cyan">YOU</span>
                    )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {user.streak} day streak
                    </span>
                </div>
            </div>

            {/* XP */}
            <div className="text-right">
                <div className="font-bold text-neon-purple">{user.xp.toLocaleString()} XP</div>
                <div className="flex items-center justify-end gap-1">
                    {getChangeIcon(user.change)}
                    <span className="text-xs text-gray-500">
                        {user.change !== 0 ? Math.abs(user.change) : '—'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export default function LeaderboardPage() {
    const [filter, setFilter] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
    const [countryFilter, setCountryFilter] = useState<'all' | 'turkey'>('all');

    const filteredData = countryFilter === 'turkey'
        ? leaderboardData.filter(u => u.country === '🇹🇷')
        : leaderboardData;

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Background */}
            <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/80 backdrop-blur-lg border-b border-gray-800">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 hover:bg-dark-panel rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-display font-bold flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                Leaderboard
                            </h1>
                            <p className="text-xs text-gray-500">Weekly XP Rankings</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 pb-12 px-4">
                <div className="max-w-3xl mx-auto">

                    {/* Filters */}
                    <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                        {/* Time Filter */}
                        <div className="flex bg-dark-panel rounded-lg p-1 border border-gray-700">
                            {(['weekly', 'monthly', 'alltime'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                                            ? 'bg-neon-cyan text-dark-bg'
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {f === 'weekly' ? 'Weekly' : f === 'monthly' ? 'Monthly' : 'All Time'}
                                </button>
                            ))}
                        </div>

                        {/* Country Filter */}
                        <button
                            onClick={() => setCountryFilter(countryFilter === 'all' ? 'turkey' : 'all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${countryFilter === 'turkey'
                                    ? 'bg-red-500/20 border-red-500/50 text-white'
                                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                                }`}
                        >
                            <Globe className="w-4 h-4" />
                            {countryFilter === 'turkey' ? '🇹🇷 Turkey' : 'Global'}
                        </button>
                    </div>

                    {/* Podium - Only show for top 3 */}
                    {filteredData.length >= 3 && <Podium data={filteredData} />}

                    {/* Rankings List */}
                    <div className="space-y-2">
                        {filteredData.slice(3).map((user, index) => (
                            <LeaderboardRow key={user.rank} user={user} index={index} />
                        ))}
                    </div>

                    {/* Your Position Footer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 p-6 rounded-xl bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/20 text-center"
                    >
                        <p className="text-gray-400 mb-2">Your current position</p>
                        <div className="flex items-center justify-center gap-4">
                            <div>
                                <div className="text-4xl font-display font-bold text-neon-cyan">#6</div>
                                <div className="text-sm text-gray-500">Rank</div>
                            </div>
                            <div className="w-px h-12 bg-gray-700" />
                            <div>
                                <div className="text-4xl font-display font-bold text-neon-purple">10,890</div>
                                <div className="text-sm text-gray-500">XP</div>
                            </div>
                            <div className="w-px h-12 bg-gray-700" />
                            <div>
                                <div className="text-4xl font-display font-bold text-orange-500 flex items-center justify-center gap-1">
                                    <Flame className="w-6 h-6" />22
                                </div>
                                <div className="text-sm text-gray-500">Day Streak</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
