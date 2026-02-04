'use client';

import { motion } from 'framer-motion';

// Base Skeleton Component
export function Skeleton({
    className = '',
    animate = true
}: {
    className?: string;
    animate?: boolean;
}) {
    return (
        <motion.div
            animate={animate ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`bg-gray-800 rounded ${className}`}
        />
    );
}

// Text Line Skeleton
export function SkeletonText({
    lines = 1,
    lastLineWidth = '60%'
}: {
    lines?: number;
    lastLineWidth?: string;
}) {
    return (
        <div className="space-y-2">
            {[...Array(lines)].map((_, i) => (
                <Skeleton
                    key={i}
                    className="h-4"
                    style={{ width: i === lines - 1 ? lastLineWidth : '100%' }}
                />
            ))}
        </div>
    );
}

// Avatar Skeleton
export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-20 h-20'
    };

    return <Skeleton className={`${sizeClasses[size]} rounded-full`} />;
}

// Card Skeleton (for Zone/Mission cards)
export function SkeletonCard() {
    return (
        <div className="p-4 rounded-xl bg-dark-panel border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
        </div>
    );
}

// Mission List Skeleton
export function SkeletonMissionList({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="w-16 h-4" />
                </div>
            ))}
        </div>
    );
}

// Zone List Skeleton
export function SkeletonZoneList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

// Profile Skeleton
export function SkeletonProfile() {
    return (
        <div className="space-y-6">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4">
                <SkeletonAvatar size="lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 rounded-xl bg-dark-panel">
                        <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
                        <Skeleton className="h-3 w-3/4 mx-auto" />
                    </div>
                ))}
            </div>

            {/* Content */}
            <SkeletonCard />
            <SkeletonCard />
        </div>
    );
}

// Leaderboard Skeleton
export function SkeletonLeaderboard() {
    return (
        <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-dark-panel">
                    <Skeleton className="w-8 h-8" />
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="w-20 h-6" />
                </div>
            ))}
        </div>
    );
}

// Full Page Loading Skeleton
export function PageSkeleton({ variant = 'default' }: { variant?: 'default' | 'map' | 'profile' | 'leaderboard' }) {
    return (
        <div className="min-h-screen bg-dark-bg p-6 pt-20">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>

                {/* Content based on variant */}
                {variant === 'map' && <SkeletonZoneList />}
                {variant === 'profile' && <SkeletonProfile />}
                {variant === 'leaderboard' && <SkeletonLeaderboard />}
                {variant === 'default' && (
                    <div className="space-y-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Skeleton;
