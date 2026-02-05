'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, GitCompare, Code, Lightbulb } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for Monaco Diff Editor
const MonacoDiffEditor = dynamic(
    () => import('@monaco-editor/react').then(mod => mod.DiffEditor),
    { ssr: false }
);

interface DiffViewerProps {
    originalCode: string;      // User's current code (or broken code)
    modifiedCode: string;      // Expected solution
    language?: string;
    showSolution?: boolean;    // Control from parent
    onToggleSolution?: () => void;
}

export function DiffViewer({
    originalCode,
    modifiedCode,
    language = 'python',
    showSolution = false,
    onToggleSolution,
}: DiffViewerProps) {
    const [internalShowSolution, setInternalShowSolution] = useState(false);

    // Use parent control if provided, otherwise internal state
    const isShowingSolution = onToggleSolution ? showSolution : internalShowSolution;
    const toggleSolution = onToggleSolution || (() => setInternalShowSolution(!internalShowSolution));

    return (
        <div className="flex flex-col h-full">
            {/* Header with toggle */}
            <div className="flex items-center justify-between px-4 py-2 bg-dark-panel border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-neon-purple" />
                    <span className="text-sm font-medium text-gray-300">
                        {isShowingSolution ? 'Comparing: Your Code vs Solution' : 'Your Code'}
                    </span>
                </div>

                <button
                    onClick={toggleSolution}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isShowingSolution
                            ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                >
                    {isShowingSolution ? (
                        <>
                            <EyeOff className="w-4 h-4" />
                            Hide Solution
                        </>
                    ) : (
                        <>
                            <Lightbulb className="w-4 h-4" />
                            Show Solution
                        </>
                    )}
                </button>
            </div>

            {/* Diff Editor */}
            <div className="flex-1">
                <AnimatePresence mode="wait">
                    {isShowingSolution ? (
                        <motion.div
                            key="diff"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full"
                        >
                            <MonacoDiffEditor
                                height="100%"
                                language={language}
                                original={originalCode}
                                modified={modifiedCode}
                                theme="vs-dark"
                                options={{
                                    readOnly: true,
                                    renderSideBySide: true,
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    fontFamily: 'JetBrains Mono, monospace',
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    originalEditable: false,
                                    diffWordWrap: 'on',
                                }}
                            />
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>

            {/* Helper text when showing solution */}
            {isShowingSolution && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-2 bg-neon-purple/10 border-t border-neon-purple/30"
                >
                    <div className="flex items-center gap-2 text-sm text-neon-purple">
                        <Lightbulb className="w-4 h-4" />
                        <span>
                            <strong>Left:</strong> Your code • <strong>Right:</strong> Expected solution •
                            <span className="text-green-400 ml-2">Green = additions</span> •
                            <span className="text-red-400 ml-1">Red = removals</span>
                        </span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// Inline diff for smaller comparisons (before/after in same view)
export function InlineDiffBadge({
    before,
    after,
    label
}: {
    before: string;
    after: string;
    label: string;
}) {
    return (
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-dark-bg border border-gray-700">
            <span className="text-xs text-gray-500">{label}:</span>
            <code className="text-xs text-red-400 line-through">{before}</code>
            <span className="text-gray-600">→</span>
            <code className="text-xs text-green-400">{after}</code>
        </div>
    );
}
