'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    AlertTriangle,
    Cpu,
    Database,
    Activity,
    Server,
    Clock,
    Trophy,
    XCircle,
    CheckCircle,
    TrendingUp,
    Zap
} from 'lucide-react';
import Link from 'next/link';

// System metrics that change over time
const initialMetrics = {
    cpu: 78,
    ram: 89,
    dbConnections: 847,
    maxDbConnections: 1000,
    latency: 2300,
    requestsPerSec: 15000,
    errorRate: 23,
};

// Decision options
const decisions = [
    {
        id: 'vertical',
        title: 'Vertical Scale',
        description: 'Upgrade RAM/CPU',
        icon: Server,
        correct: false,
        feedback: 'Vertical scaling is not instant. New server provisioning takes hours and costs too much!'
    },
    {
        id: 'horizontal',
        title: 'Horizontal Scale',
        description: 'Add more servers',
        icon: Cpu,
        correct: false,
        feedback: 'Horizontal scaling is a good strategy but you have no auto-scaling group. New instances take 5 minutes - system will crash by then!'
    },
    {
        id: 'cache',
        title: 'Add Cache Layer',
        description: 'Deploy Redis cache',
        icon: Zap,
        correct: true,
        feedback: 'Excellent decision! Redis cache reduced database load by 70%. Latency dropped to 200ms, system saved!'
    },
    {
        id: 'ratelimit',
        title: 'Rate Limiting',
        description: 'Throttle traffic',
        icon: AlertTriangle,
        correct: false,
        feedback: 'You applied rate limiting but 40% of users received "429 Too Many Requests" errors. Customer satisfaction crashed!'
    }
];

// Metric Bar Component
function MetricBar({
    label,
    value,
    max,
    unit,
    danger
}: {
    label: string;
    value: number;
    max: number;
    unit: string;
    danger: number;
}) {
    const percentage = (value / max) * 100;
    const isDanger = percentage >= danger;

    return (
        <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{label}</span>
                <span className={`font-mono ${isDanger ? 'text-red-500' : 'text-neon-cyan'}`}>
                    {value}{unit} / {max}{unit}
                </span>
            </div>
            <div className="h-3 bg-dark-bg rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${isDanger
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse'
                        : 'bg-gradient-to-r from-neon-cyan to-neon-purple'
                        }`}
                />
            </div>
        </div>
    );
}

// Decision Card Component
function DecisionCard({
    decision,
    onSelect,
    disabled,
    selected
}: {
    decision: typeof decisions[0];
    onSelect: () => void;
    disabled: boolean;
    selected: boolean;
}) {
    const Icon = decision.icon;

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={onSelect}
            disabled={disabled}
            className={`p-4 rounded-xl border text-left transition-all ${selected
                ? decision.correct
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-red-500 bg-red-500/10'
                : disabled
                    ? 'border-gray-700 opacity-50 cursor-not-allowed'
                    : 'border-gray-700 hover:border-neon-cyan bg-dark-panel'
                }`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selected
                    ? decision.correct ? 'bg-green-500/20' : 'bg-red-500/20'
                    : 'bg-dark-bg'
                    }`}>
                    <Icon className={`w-5 h-5 ${selected
                        ? decision.correct ? 'text-green-500' : 'text-red-500'
                        : 'text-neon-cyan'
                        }`} />
                </div>
                <div>
                    <h4 className="font-bold">{decision.title}</h4>
                    <p className="text-sm text-gray-400">{decision.description}</p>
                </div>
            </div>
        </motion.button>
    );
}

// Main War Room Page
export default function WarRoomPage() {
    const [metrics, setMetrics] = useState(initialMetrics);
    const [timeLeft, setTimeLeft] = useState(45);
    const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
    const [gameState, setGameState] = useState<'playing' | 'success' | 'failure'>('playing');

    // Countdown timer
    useEffect(() => {
        if (gameState !== 'playing') return;

        if (timeLeft <= 0) {
            setGameState('failure');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);

            // Make metrics worse over time
            setMetrics(prev => ({
                ...prev,
                cpu: Math.min(99, prev.cpu + Math.random() * 2),
                ram: Math.min(99, prev.ram + Math.random() * 1.5),
                dbConnections: Math.min(1000, prev.dbConnections + Math.floor(Math.random() * 10)),
                latency: prev.latency + Math.floor(Math.random() * 200),
                errorRate: Math.min(100, prev.errorRate + Math.random() * 2),
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, gameState]);

    // Handle decision
    const handleDecision = (decisionId: string) => {
        const decision = decisions.find(d => d.id === decisionId);
        if (!decision) return;

        setSelectedDecision(decisionId);

        setTimeout(() => {
            if (decision.correct) {
                setGameState('success');
                // Improve metrics dramatically
                setMetrics({
                    cpu: 35,
                    ram: 45,
                    dbConnections: 230,
                    maxDbConnections: 1000,
                    latency: 200,
                    requestsPerSec: 15000,
                    errorRate: 0.5,
                });
            } else {
                setGameState('failure');
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col">
            {/* Warning Header */}
            <header className="h-14 bg-red-950/50 border-b border-red-500/50 flex items-center px-4 justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-dark-bg rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                        <div>
                            <p className="text-xs text-red-400 font-mono">CRISIS MODE</p>
                            <h1 className="text-sm font-semibold">Zone 2 Boss: The Fail Whale</h1>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Timer */}
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft <= 10 ? 'bg-red-500/20 border border-red-500' : 'bg-dark-panel'
                        }`}>
                        <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                        <span className={`font-mono text-2xl ${timeLeft <= 10 ? 'text-red-500' : ''}`}>
                            00:{timeLeft.toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 p-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
                    {/* System Monitor Panel */}
                    <div className="bg-dark-panel rounded-2xl p-6 neon-border relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />

                        <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-red-500" />
                            System Monitor
                        </h2>

                        <MetricBar label="CPU Usage" value={Math.round(metrics.cpu)} max={100} unit="%" danger={80} />
                        <MetricBar label="Memory" value={Math.round(metrics.ram)} max={100} unit="%" danger={85} />
                        <MetricBar label="DB Connections" value={metrics.dbConnections} max={metrics.maxDbConnections} unit="" danger={90} />

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-dark-bg rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-4 h-4 text-neon-cyan" />
                                    <span className="text-sm text-gray-400">Request/sec</span>
                                </div>
                                <span className="text-2xl font-mono font-bold">{metrics.requestsPerSec.toLocaleString()}</span>
                                <span className="text-xs text-red-500 ml-2">+1000%</span>
                            </div>

                            <div className="bg-dark-bg rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm text-gray-400">Latency</span>
                                </div>
                                <span className="text-2xl font-mono font-bold text-red-500">{(metrics.latency / 1000).toFixed(1)}s</span>
                                <span className="text-xs text-red-500 ml-2">Critical</span>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                <span className="text-red-400 font-semibold">Error Rate: {metrics.errorRate.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Decision Panel - Situation Room with Monospace */}
                    <div className="bg-dark-panel rounded-2xl p-6 neon-border">
                        <h2 className="text-xl font-mono font-bold mb-4 flex items-center gap-2 text-neon-cyan">
                            <Database className="w-6 h-6 text-neon-purple" />
                            [SITUATION_ROOM]
                        </h2>

                        <div className="mb-6 p-4 bg-dark-bg rounded-xl font-mono">
                            <p className="text-lg leading-relaxed">
                                <span className="text-gray-500">&gt;</span> Product went viral! Traffic spiked <span className="text-red-500 font-bold">10x</span>.
                                <br />
                                <span className="text-gray-500">&gt;</span> System is collapsing.
                                <br />
                                <span className="text-gray-500">&gt;</span> <span className="text-neon-cyan font-bold">What is your command, Architect?</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {decisions.map((decision) => (
                                <DecisionCard
                                    key={decision.id}
                                    decision={decision}
                                    onSelect={() => handleDecision(decision.id)}
                                    disabled={selectedDecision !== null}
                                    selected={selectedDecision === decision.id}
                                />
                            ))}
                        </div>

                        {/* Feedback */}
                        <AnimatePresence>
                            {selectedDecision && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mt-6 p-4 rounded-xl font-mono text-sm ${decisions.find(d => d.id === selectedDecision)?.correct
                                        ? 'bg-green-500/10 border border-green-500'
                                        : 'bg-red-500/10 border border-red-500'
                                        }`}
                                >
                                    <p>
                                        {decisions.find(d => d.id === selectedDecision)?.feedback}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Result Overlays */}
                <AnimatePresence>
                    {gameState === 'success' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="fixed inset-0 bg-dark-bg/90 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="text-center"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-500" />
                                </motion.div>
                                <h2 className="text-4xl font-display font-bold text-neon-cyan mb-4">SYSTEM SAVED!</h2>
                                <p className="text-xl text-gray-300 mb-8">
                                    Redis cache reduced database load by 70%.
                                </p>
                                <div className="flex items-center justify-center gap-2 text-2xl text-neon-purple font-bold mb-8">
                                    <Trophy className="w-8 h-8" />
                                    +500 XP Earned
                                </div>
                                <Link href="/">
                                    <button className="btn-primary px-8 py-4 text-lg">
                                        Continue →
                                    </button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}

                    {gameState === 'failure' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="fixed inset-0 bg-dark-bg/90 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="text-center"
                            >
                                <motion.div
                                    animate={{ x: [-5, 5, -5, 5, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <XCircle className="w-24 h-24 mx-auto mb-6 text-red-500" />
                                </motion.div>
                                <h2 className="text-4xl font-display font-bold text-red-500 mb-4">SYSTEM CRASHED!</h2>
                                <p className="text-xl text-gray-300 mb-4">
                                    {selectedDecision
                                        ? decisions.find(d => d.id === selectedDecision)?.feedback
                                        : 'Time ran out! No decision was made.'
                                    }
                                </p>
                                <p className="text-gray-500 mb-8">Don't worry, you can try again.</p>
                                <button
                                    onClick={() => {
                                        setGameState('playing');
                                        setTimeLeft(45);
                                        setSelectedDecision(null);
                                        setMetrics(initialMetrics);
                                    }}
                                    className="btn-primary px-8 py-4 text-lg"
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
