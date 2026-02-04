'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Terminal,
    Calendar,
    Clock,
    Tag,
    ChevronRight,
    Search,
    BookOpen,
    AlertTriangle,
    Zap,
    Database,
    Code
} from 'lucide-react';
import Link from 'next/link';

// Blog post data
const blogPosts = [
    {
        id: 1,
        title: 'Incident Report #04: Why Twitter Failed',
        excerpt: 'Deep dive into the 2023 Fail Whale incident. How a simple database query brought down one of the largest platforms.',
        date: '2026-02-01',
        readTime: '8 min',
        tags: ['#FailureStories', '#SystemDesign', '#Scaling'],
        type: 'incident',
        commitHash: 'a3f7d2e'
    },
    {
        id: 2,
        title: 'Pattern Analysis: Circuit Breaker Implementation',
        excerpt: 'A practical guide to implementing circuit breakers in distributed systems with real-world examples.',
        date: '2026-01-28',
        readTime: '12 min',
        tags: ['#Microservices', '#Patterns', '#Resilience'],
        type: 'tutorial',
        commitHash: 'b8c4f1a'
    },
    {
        id: 3,
        title: 'Architecture Review: From Monolith to Microservices',
        excerpt: 'Lessons learned from migrating a 2M LOC monolith to a microservices architecture over 18 months.',
        date: '2026-01-25',
        readTime: '15 min',
        tags: ['#Migration', '#Microservices', '#CaseStudy'],
        type: 'case-study',
        commitHash: 'c9d5e2b'
    },
    {
        id: 4,
        title: 'System Log: Debugging a Memory Leak in Production',
        excerpt: 'How we identified and fixed a subtle memory leak that was causing our Kubernetes pods to restart every 4 hours.',
        date: '2026-01-20',
        readTime: '10 min',
        tags: ['#Debugging', '#Kubernetes', '#Performance'],
        type: 'incident',
        commitHash: 'd1e6f3c'
    },
    {
        id: 5,
        title: 'Design Document: Event Sourcing for E-commerce',
        excerpt: 'Architectural decision record for implementing event sourcing in an order management system.',
        date: '2026-01-15',
        readTime: '20 min',
        tags: ['#EventSourcing', '#CQRS', '#Architecture'],
        type: 'design-doc',
        commitHash: 'e2f7g4d'
    }
];

const allTags = ['#Microservices', '#FailureStories', '#SystemDesign', '#Patterns', '#Scaling', '#Kubernetes', '#CQRS'];

// Tag filter component
function TagFilter({
    tags,
    selectedTag,
    onSelect
}: {
    tags: string[];
    selectedTag: string | null;
    onSelect: (tag: string | null) => void;
}) {
    return (
        <div className="space-y-2">
            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider">Filter by Tag</h3>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onSelect(null)}
                    className={`px-3 py-1 rounded-full text-sm font-mono transition-all ${selectedTag === null
                            ? 'bg-neon-cyan text-dark-bg'
                            : 'bg-dark-panel text-gray-400 hover:text-neon-cyan'
                        }`}
                >
                    all
                </button>
                {tags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => onSelect(tag)}
                        className={`px-3 py-1 rounded-full text-sm font-mono transition-all ${selectedTag === tag
                                ? 'bg-neon-cyan text-dark-bg'
                                : 'bg-dark-panel text-gray-400 hover:text-neon-cyan'
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Blog post card - commit history style
function BlogPostCard({ post, index }: { post: typeof blogPosts[0]; index: number }) {
    const typeIcons = {
        'incident': <AlertTriangle className="w-4 h-4 text-red-500" />,
        'tutorial': <Code className="w-4 h-4 text-neon-cyan" />,
        'case-study': <Database className="w-4 h-4 text-neon-purple" />,
        'design-doc': <BookOpen className="w-4 h-4 text-green-500" />
    };

    const typeColors = {
        'incident': 'border-red-500/30 bg-red-500/5',
        'tutorial': 'border-neon-cyan/30 bg-neon-cyan/5',
        'case-study': 'border-neon-purple/30 bg-neon-purple/5',
        'design-doc': 'border-green-500/30 bg-green-500/5'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
        >
            {/* Timeline connector */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-700" />

            {/* Commit dot */}
            <div className="absolute left-4 top-6 w-5 h-5 rounded-full bg-dark-bg border-2 border-neon-cyan flex items-center justify-center z-10">
                <div className="w-2 h-2 rounded-full bg-neon-cyan" />
            </div>

            <Link href={`/blog/${post.id}`}>
                <motion.div
                    whileHover={{ x: 10 }}
                    className={`ml-12 p-6 rounded-xl border transition-all hover:border-neon-cyan/50 ${typeColors[post.type as keyof typeof typeColors]}`}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-xs text-gray-500 bg-dark-bg px-2 py-1 rounded">
                            {post.commitHash}
                        </span>
                        {typeIcons[post.type as keyof typeof typeIcons]}
                        <span className="text-xs text-gray-500 uppercase">{post.type.replace('-', ' ')}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-display font-bold mb-2 group-hover:text-neon-cyan transition-colors">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.readTime}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {post.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs font-mono text-neon-cyan">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
}

// Main Blog Page
export default function BlogPage() {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = blogPosts.filter(post => {
        const matchesTag = !selectedTag || post.tags.includes(selectedTag);
        const matchesSearch = !searchQuery ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTag && matchesSearch;
    });

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
                                <Terminal className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-display font-bold neon-text">DevLogs</h1>
                                <p className="text-xs text-gray-500">Engineering Journal</p>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg bg-dark-panel border border-gray-700 text-sm focus:border-neon-cyan focus:outline-none w-64 font-mono"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Terminal Header */}
                                <div className="p-4 rounded-xl bg-dark-panel neon-border">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="font-mono text-sm text-gray-400">
                                        <span className="text-neon-cyan">$</span> cat /var/log/engineering.log
                                    </div>
                                </div>

                                {/* Tag Filter */}
                                <div className="p-4 rounded-xl bg-dark-panel border border-gray-800">
                                    <TagFilter
                                        tags={allTags}
                                        selectedTag={selectedTag}
                                        onSelect={setSelectedTag}
                                    />
                                </div>

                                {/* Stats */}
                                <div className="p-4 rounded-xl bg-dark-panel border border-gray-800">
                                    <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-3">Stats</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Total Posts</span>
                                            <span className="font-mono text-neon-cyan">{blogPosts.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Incidents</span>
                                            <span className="font-mono text-red-400">2</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Tutorials</span>
                                            <span className="font-mono text-neon-cyan">1</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Posts List */}
                        <div className="lg:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8"
                            >
                                <h2 className="text-3xl font-display font-bold mb-2">
                                    <span className="text-gray-500 font-mono">$</span> Engineering Journal
                                </h2>
                                <p className="text-gray-400 font-mono text-sm">
                                    // Lessons learned from the trenches of system design
                                </p>
                            </motion.div>

                            {/* Timeline Posts */}
                            <div className="space-y-6">
                                {filteredPosts.map((post, index) => (
                                    <BlogPostCard key={post.id} post={post} index={index} />
                                ))}
                            </div>

                            {filteredPosts.length === 0 && (
                                <div className="text-center py-12">
                                    <Terminal className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                                    <p className="text-gray-500 font-mono">No logs found matching criteria...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
