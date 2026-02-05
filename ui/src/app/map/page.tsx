'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Lock,
    CheckCircle,
    Star,
    Zap,
    Skull,
    ChevronRight,
    Trophy,
    AlertTriangle,
    Database,
    Cloud,
    Server,
    Cpu,
    MessageSquare,
    Shield,
    ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

// Complete Book Structure - All Zones and Missions
const zones = [
    {
        id: 1,
        name: 'Zone 1: Quality Attributes',
        description: 'Bölüm 1 - Kalite Nitelikleri',
        icon: 'shield',
        unlocked: true,
        completed: false,
        missions: [
            { id: '1.1', title: 'Latency Budget', desc: 'User journey latency budget', type: 'code', status: 'available', xp: 100 },
            { id: '1.2', title: 'Stateless Design', desc: 'Stateful vs Stateless comparison', type: 'code', status: 'available', xp: 100 },
            { id: '1.3', title: 'Redundancy Strategy', desc: 'Active-Active redundancy', type: 'code', status: 'available', xp: 120 },
            { id: '1.4', title: 'Loose Coupling', desc: 'Coupling example', type: 'code', status: 'available', xp: 120 },
            { id: '1.B', title: 'The Bottleneck', type: 'boss', status: 'available', xp: 400 },
        ]
    },
    {
        id: 2,
        name: 'Zone 2: SOLID & Patterns',
        description: 'Bölüm 2 - Temel Yazılım Prensipleri',
        icon: 'cpu',
        unlocked: true,
        completed: false,
        missions: [
            { id: '2.1', title: 'SRP Violation', desc: 'Single Responsibility fix', type: 'code', status: 'available', xp: 150 },
            { id: '2.2', title: 'Open/Closed', desc: 'OCP Before and After', type: 'code', status: 'available', xp: 150 },
            { id: '2.3', title: 'Liskov Substitution', desc: 'Rectangle/Square problem', type: 'code', status: 'available', xp: 150 },
            { id: '2.4', title: 'Interface Segregation', desc: 'Fat vs segregated interfaces', type: 'code', status: 'available', xp: 150 },
            { id: '2.5', title: 'Dependency Inversion', desc: 'Inverting dependencies', type: 'code', status: 'available', xp: 150 },
            { id: '2.6', title: 'KISS Principle', desc: 'Clever vs Clear code', type: 'code', status: 'available', xp: 100 },
            { id: '2.7', title: 'Encapsulation', desc: 'Encapsulation example', type: 'code', status: 'available', xp: 100 },
            { id: '2.8', title: 'Factory Pattern', desc: 'Factory design pattern', type: 'code', status: 'available', xp: 120 },
            { id: '2.9', title: 'Singleton Pattern', desc: 'Single instance pattern', type: 'code', status: 'available', xp: 120 },
            { id: '2.10', title: 'Builder Pattern', desc: 'Builder design pattern', type: 'code', status: 'available', xp: 120 },
            { id: '2.11', title: 'Adapter Pattern', desc: 'Adapter design pattern', type: 'code', status: 'available', xp: 120 },
            { id: '2.12', title: 'Facade Pattern', desc: 'Facade design pattern', type: 'code', status: 'available', xp: 120 },
            { id: '2.13', title: 'Decorator Pattern', desc: 'Decorator design pattern', type: 'code', status: 'available', xp: 120 },
            { id: '2.14', title: 'Observer Pattern', desc: 'Observer design pattern', type: 'code', status: 'available', xp: 120 },
            { id: '2.15', title: 'Strategy Pattern', desc: 'Strategy design pattern', type: 'code', status: 'available', xp: 120 },
            { id: '2.16', title: 'Command Pattern', desc: 'Command design pattern', type: 'code', status: 'available', xp: 120 },
            { id: '2.B', title: 'Legacy Monster', type: 'boss', status: 'available', xp: 800 },
        ]
    },
    {
        id: 3,
        name: 'Zone 3: Application Architecture',
        description: 'Bölüm 3 - Uygulama Mimarileri',
        icon: 'server',
        unlocked: true,
        completed: false,
        missions: [
            { id: '3.1', title: 'Monolith Structure', desc: 'Typical monolith', type: 'code', status: 'available', xp: 180 },
            { id: '3.2', title: 'Modular Monolith', desc: 'Modular monolith structure', type: 'code', status: 'available', xp: 200 },
            { id: '3.3', title: 'Three-Tier', desc: 'Three-tier architecture', type: 'code', status: 'available', xp: 200 },
            { id: '3.4', title: 'Hexagonal', desc: 'Ports & Adapters', type: 'code', status: 'available', xp: 250 },
            { id: '3.5', title: 'Bounded Contexts', desc: 'DDD bounded contexts', type: 'code', status: 'available', xp: 250 },
            { id: '3.6', title: 'Aggregate Root', desc: 'Aggregate example', type: 'code', status: 'available', xp: 250 },
            { id: '3.7', title: 'Entity vs Value', desc: 'Entity vs Value Object', type: 'code', status: 'available', xp: 200 },
            { id: '3.8', title: 'Domain Events', desc: 'Domain events example', type: 'code', status: 'available', xp: 250 },
            { id: '3.B', title: 'The Monolith Giant', type: 'boss', status: 'available', xp: 900 },
        ]
    },
    {
        id: 4,
        name: 'Zone 4: Microservices',
        description: 'Bölüm 4 - Mikroservisler',
        icon: 'zap',
        unlocked: true,
        completed: false,
        missions: [
            { id: '4.1', title: 'Strangler Fig', desc: 'Strangler Fig Pattern', type: 'code', status: 'available', xp: 250 },
            { id: '4.2', title: 'REST vs gRPC', desc: 'Protocol comparison', type: 'code', status: 'available', xp: 200 },
            { id: '4.3', title: 'Circuit Breaker', desc: 'Circuit Breaker implementation', type: 'code', status: 'available', xp: 300 },
            { id: '4.4', title: 'Async Messaging', desc: 'Async messaging example', type: 'code', status: 'available', xp: 250 },
            { id: '4.5', title: 'API Gateway', desc: 'Gateway configuration', type: 'code', status: 'available', xp: 250 },
            { id: '4.6', title: 'Service Mesh', desc: 'Sidecar pattern', type: 'code', status: 'available', xp: 300 },
            { id: '4.7', title: 'Saga Orchestration', desc: 'Saga orchestration approach', type: 'code', status: 'available', xp: 350 },
            { id: '4.8', title: 'Outbox Pattern', desc: 'Outbox pattern', type: 'code', status: 'available', xp: 300 },
            { id: '4.9', title: 'Service Discovery', desc: 'Discovery patterns', type: 'code', status: 'available', xp: 250 },
            { id: '4.10', title: 'Health Checks', desc: 'Health check endpoints', type: 'code', status: 'available', xp: 200 },
            { id: '4.B', title: 'The Fail Whale', type: 'boss', status: 'available', xp: 1200 },
        ]
    },
    {
        id: 5,
        name: 'Zone 5: Event-Driven',
        description: 'Bölüm 5 - Event-Driven Mimari',
        icon: 'message',
        unlocked: true,
        completed: false,
        missions: [
            { id: '5.1', title: 'Command vs Event', desc: 'Command and event difference', type: 'code', status: 'available', xp: 200 },
            { id: '5.2', title: 'Pub/Sub Pattern', desc: 'Publish/Subscribe pattern', type: 'code', status: 'available', xp: 250 },
            { id: '5.3', title: 'Kafka Concepts', desc: 'Kafka fundamentals', type: 'code', status: 'available', xp: 300 },
            { id: '5.4', title: 'RabbitMQ Exchanges', desc: 'Exchange types', type: 'code', status: 'available', xp: 280 },
            { id: '5.5', title: 'Event Sourcing', desc: 'Event sourcing example', type: 'code', status: 'available', xp: 350 },
            { id: '5.6', title: 'Snapshots', desc: 'Snapshot optimization', type: 'code', status: 'available', xp: 300 },
            { id: '5.7', title: 'CQRS', desc: 'CQRS architecture', type: 'code', status: 'available', xp: 400 },
            { id: '5.B', title: 'Event Storm', type: 'boss', status: 'available', xp: 1000 },
        ]
    },
    {
        id: 6,
        name: 'Zone 6: Data Strategies',
        description: 'Bölüm 6 - Modern Veri Stratejileri',
        icon: 'database',
        unlocked: true,
        completed: false,
        missions: [
            { id: '6.1', title: 'ACID Transactions', desc: 'ACID transaction example', type: 'code', status: 'available', xp: 200 },
            { id: '6.2', title: 'Document DB', desc: 'MongoDB example', type: 'code', status: 'available', xp: 250 },
            { id: '6.3', title: 'Key-Value Store', desc: 'Redis example', type: 'code', status: 'available', xp: 250 },
            { id: '6.4', title: 'Column-Family', desc: 'Cassandra example', type: 'code', status: 'available', xp: 280 },
            { id: '6.5', title: 'Graph Database', desc: 'Neo4j example', type: 'code', status: 'available', xp: 300 },
            { id: '6.6', title: 'Polyglot Persistence', desc: 'Multi-DB usage', type: 'code', status: 'available', xp: 350 },
            { id: '6.7', title: 'Vector Embeddings', desc: 'Embedding concept', type: 'code', status: 'available', xp: 350 },
            { id: '6.8', title: 'Vector Database', desc: 'Pinecone operations', type: 'code', status: 'available', xp: 350 },
            { id: '6.9', title: 'RAG Architecture', desc: 'RAG pipeline', type: 'code', status: 'available', xp: 400 },
            { id: '6.10', title: 'Chunking', desc: 'Chunking strategies', type: 'code', status: 'available', xp: 300 },
            { id: '6.11', title: 'Hybrid Search', desc: 'Vector + keyword search', type: 'code', status: 'available', xp: 350 },
            { id: '6.B', title: 'Data Kraken', type: 'boss', status: 'available', xp: 1200 },
        ]
    },
    {
        id: 7,
        name: 'Zone 7: Cloud Native',
        description: 'Bölüm 7 - Bulut Yerli Mimari',
        icon: 'cloud',
        unlocked: true,
        completed: false,
        missions: [
            { id: '7.1', title: 'Dockerfile', desc: 'Dockerfile example', type: 'code', status: 'available', xp: 200 },
            { id: '7.2', title: 'Docker CLI', desc: 'Docker commands', type: 'code', status: 'available', xp: 200 },
            { id: '7.3', title: 'K8s Deployment', desc: 'Deployment manifest', type: 'code', status: 'available', xp: 300 },
            { id: '7.4', title: 'K8s Service', desc: 'Service manifest', type: 'code', status: 'available', xp: 280 },
            { id: '7.5', title: 'HPA Autoscaling', desc: 'Horizontal Pod Autoscaler', type: 'code', status: 'available', xp: 350 },
            { id: '7.B', title: 'Cloud Titan', type: 'boss', status: 'available', xp: 1500 },
        ]
    }
];

// Calculate totals
const totalMissions = zones.reduce((sum, z) => sum + z.missions.length, 0);
const totalXPAvailable = zones.reduce((sum, z) => z.missions.reduce((s, m) => s + m.xp, 0) + sum, 0);

// Icon mapping
const getZoneIcon = (icon: string) => {
    switch (icon) {
        case 'shield': return Shield;
        case 'cpu': return Cpu;
        case 'server': return Server;
        case 'zap': return Zap;
        case 'message': return MessageSquare;
        case 'database': return Database;
        case 'cloud': return Cloud;
        default: return Zap;
    }
};

// Unlock Modal Component
function UnlockModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-bg/90 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-dark-panel rounded-2xl p-8 max-w-md w-full neon-border text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <Lock className="w-16 h-16 mx-auto mb-4 text-neon-purple" />
                <h3 className="text-2xl font-display font-bold mb-4">Zone Locked</h3>
                <p className="text-gray-400 mb-6">
                    To face <span className="text-red-500 font-bold">The Fail Whale</span> and unlock all <span className="text-neon-cyan font-bold">{totalMissions} missions</span>, get PRO membership.
                </p>
                <div className="space-y-3">
                    <Link href="/get-book">
                        <button className="w-full py-3 rounded-xl btn-primary font-bold flex items-center justify-center gap-2">
                            <Zap className="w-5 h-5" />
                            Get PRO - $9.99/mo
                        </button>
                    </Link>
                    <Link href="/store">
                        <button className="w-full py-3 rounded-xl border border-gray-600 text-gray-400 hover:border-neon-purple hover:text-neon-purple transition-all flex items-center justify-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            Visit The Armory
                        </button>
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Mission Node Component
function MissionNode({
    mission,
    index,
    zoneUnlocked,
    onLockedClick
}: {
    mission: typeof zones[0]['missions'][0];
    index: number;
    zoneUnlocked: boolean;
    onLockedClick: () => void;
}) {
    const isAvailable = mission.status === 'available';
    const isCompleted = mission.status === 'completed';
    const isBoss = mission.type === 'boss';
    const isLocked = mission.status === 'locked' || !zoneUnlocked;

    const getLink = () => {
        if (isLocked) return '/get-book';
        if (isBoss) return '/warroom';
        return '/game';
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="relative flex items-center gap-3 py-2"
        >
            {/* Connection Line */}
            {index > 0 && (
                <div className={`absolute -top-2 left-4 w-0.5 h-2 ${isCompleted || isAvailable ? 'bg-neon-cyan' : 'bg-gray-700'}`} />
            )}

            <Link href={getLink()} className="flex items-center gap-3 flex-1 group">
                <motion.div
                    whileHover={!isLocked ? { scale: 1.1 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all flex-shrink-0
                        ${isBoss
                            ? isLocked
                                ? 'bg-gray-800 border border-gray-600'
                                : 'bg-gradient-to-br from-red-500 to-orange-500'
                            : isCompleted
                                ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                : isAvailable
                                    ? 'bg-gradient-to-br from-neon-cyan to-neon-purple'
                                    : 'bg-gray-800 border border-gray-700'
                        }`}
                >
                    {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                    {isAvailable && !isCompleted && <Star className="w-3 h-3 text-white" />}
                    {isBoss && <Skull className="w-4 h-4 text-white" />}
                    {!isBoss && isLocked && <Lock className="w-3 h-3 text-gray-500" />}
                </motion.div>

                {/* Mission Info */}
                <div className={`flex-1 min-w-0 ${isLocked ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono ${isBoss ? 'text-red-400' : 'text-gray-500'}`}>
                            {mission.id}
                        </span>
                        {isBoss && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">
                                BOSS
                            </span>
                        )}
                    </div>
                    <h4 className="font-medium text-sm truncate group-hover:text-neon-cyan transition-colors">
                        {mission.title}
                    </h4>
                    {'desc' in mission && (
                        <p className="text-xs text-gray-500 truncate">{mission.desc}</p>
                    )}
                </div>

                {/* XP Badge */}
                <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                    <Trophy className="w-3 h-3" />
                    <span>+{mission.xp}</span>
                </div>

                {/* Action Arrow */}
                {isAvailable && !isCompleted && (
                    <ChevronRight className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                )}
            </Link>
        </motion.div>
    );
}

// Zone Section Component
function ZoneSection({
    zone,
    isExpanded,
    onToggle,
    onLockedClick
}: {
    zone: typeof zones[0];
    isExpanded: boolean;
    onToggle: () => void;
    onLockedClick: () => void;
}) {
    const totalXP = zone.missions.reduce((sum, m) => sum + m.xp, 0);
    const completedMissions = zone.missions.filter(m => m.status === 'completed').length;
    const ZoneIcon = getZoneIcon(zone.icon);

    return (
        <div className="mb-4">
            {/* Zone Header */}
            <motion.button
                onClick={onToggle}
                className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${zone.unlocked
                    ? 'bg-dark-panel border border-neon-cyan/20 hover:border-neon-cyan/40'
                    : 'bg-gray-900/50 border border-gray-800 hover:border-gray-600'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${zone.unlocked
                        ? 'bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20'
                        : 'bg-gray-800'
                        }`}>
                        {zone.unlocked ? (
                            <ZoneIcon className="w-5 h-5 text-neon-cyan" />
                        ) : (
                            <Lock className="w-5 h-5 text-gray-500" />
                        )}
                    </div>
                    <div className="text-left">
                        <h3 className="font-display font-bold">{zone.name}</h3>
                        <p className="text-xs text-gray-500">{zone.description}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400">
                        {completedMissions}/{zone.missions.length} missions
                    </div>
                    <div className="text-xs text-neon-purple font-mono">
                        {totalXP.toLocaleString()} XP
                    </div>
                </div>
            </motion.button>

            {/* Missions List - Always expandable */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3 pl-4 pr-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {zone.missions.map((mission, index) => (
                                <MissionNode
                                    key={mission.id}
                                    mission={mission}
                                    index={index}
                                    zoneUnlocked={zone.unlocked}
                                    onLockedClick={onLockedClick}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Main Map Page
export default function MapPage() {
    const [expandedZone, setExpandedZone] = useState<number>(1);
    const [showUnlockModal, setShowUnlockModal] = useState(false);

    const totalXP = 450; // User's current XP
    const currentLevel = 3;
    const completedMissions = 0;

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/80 backdrop-blur-lg border-b border-gray-800">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 hover:bg-dark-panel rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-display font-bold neon-text">CodexLudus</h1>
                            <p className="text-xs text-gray-500">Software Architecture 3.0</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* XP Display */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-panel border border-neon-purple/30 text-sm">
                            <Trophy className="w-4 h-4 text-neon-purple" />
                            <span className="font-mono font-bold">{totalXP}</span>
                        </div>

                        {/* Level Badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-panel border border-neon-cyan/30 text-sm">
                            <Star className="w-4 h-4 text-neon-cyan" />
                            <span className="font-mono font-bold">Lvl {currentLevel}</span>
                        </div>

                        {/* The Armory */}
                        <Link href="/store">
                            <button className="px-3 py-1.5 rounded-lg border border-neon-purple/50 text-neon-purple font-medium text-sm hover:bg-neon-purple/10 transition-all flex items-center gap-1.5">
                                <ShoppingBag className="w-4 h-4" />
                                <span className="hidden sm:inline">Armory</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 pb-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Title Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl font-display font-bold mb-2">
                            The System Map
                        </h2>
                        <p className="text-gray-400 text-sm max-w-md mx-auto">
                            {totalMissions} missions across 7 zones. Master software architecture from fundamentals to cloud.
                        </p>
                    </motion.div>

                    {/* Progress Overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8 p-4 rounded-xl bg-dark-panel border border-gray-700"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-sm">Overall Progress</h3>
                            <span className="text-neon-cyan font-mono text-sm">{completedMissions}/{totalMissions} Missions</span>
                        </div>
                        <div className="h-2 bg-dark-bg rounded-full overflow-hidden mb-3">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(completedMissions / totalMissions) * 100}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full progress-glow rounded-full"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center text-xs">
                            <div>
                                <div className="text-lg font-bold text-neon-cyan">{zones.filter(z => z.unlocked).length}</div>
                                <div className="text-gray-500">Zones Unlocked</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-neon-purple">{totalXPAvailable.toLocaleString()}</div>
                                <div className="text-gray-500">Total XP Available</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-red-400">7</div>
                                <div className="text-gray-500">Boss Battles</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Zone List */}
                    <div>
                        {zones.map((zone, idx) => (
                            <motion.div
                                key={zone.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + idx * 0.05 }}
                            >
                                <ZoneSection
                                    zone={zone}
                                    isExpanded={expandedZone === zone.id}
                                    onToggle={() => setExpandedZone(expandedZone === zone.id ? 0 : zone.id)}
                                    onLockedClick={() => setShowUnlockModal(true)}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 p-4 rounded-xl bg-gradient-to-r from-neon-cyan/5 to-neon-purple/5 border border-gray-700 text-center"
                    >
                        <div className="grid grid-cols-4 gap-4 text-xs">
                            <div>
                                <div className="text-lg font-bold">9</div>
                                <div className="text-gray-500">Design Patterns</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold">5</div>
                                <div className="text-gray-500">SOLID Principles</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold">6</div>
                                <div className="text-gray-500">Database Types</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold">5+</div>
                                <div className="text-gray-500">RAG/AI Examples</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Unlock Modal */}
            <AnimatePresence>
                <UnlockModal
                    isOpen={showUnlockModal}
                    onClose={() => setShowUnlockModal(false)}
                />
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #374151;
                    border-radius: 2px;
                }
            `}</style>
        </div>
    );
}
