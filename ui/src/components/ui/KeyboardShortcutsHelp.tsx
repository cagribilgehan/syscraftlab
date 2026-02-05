'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
    keys: string[];
    description: string;
}

const SHORTCUTS: Shortcut[] = [
    { keys: ['Ctrl', 'Enter'], description: 'Run Tests' },
    { keys: ['Ctrl', 'S'], description: 'Save Code' },
    { keys: ['Ctrl', 'H'], description: 'Show/Hide Hint' },
    { keys: ['Ctrl', 'B'], description: 'Toggle File Explorer' },
    { keys: ['Ctrl', '1'], description: 'Code Tab' },
    { keys: ['Ctrl', '2'], description: 'Solution/Diff Tab' },
    { keys: ['Ctrl', '3'], description: 'Diagram Tab' },
    { keys: ['Esc'], description: 'Close Modal' },
];

export function KeyboardShortcutsHelp() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Help Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-4 lg:bottom-4 w-10 h-10 rounded-full bg-dark-panel border border-gray-700 flex items-center justify-center text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/50 transition-all z-30 group"
                title="Keyboard Shortcuts"
            >
                <Keyboard className="w-5 h-5" />
                <span className="absolute right-12 bg-dark-panel px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-gray-700">
                    Keyboard Shortcuts
                </span>
            </button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-dark-panel border border-gray-700 rounded-xl max-w-md w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
                                <div className="flex items-center gap-3">
                                    <Keyboard className="w-5 h-5 text-neon-cyan" />
                                    <h2 className="text-lg font-bold text-white">Keyboard Shortcuts</h2>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Shortcuts List */}
                            <div className="p-5 space-y-3">
                                {SHORTCUTS.map((shortcut, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between py-2"
                                    >
                                        <span className="text-gray-300">{shortcut.description}</span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, j) => (
                                                <span key={j} className="flex items-center gap-1">
                                                    <kbd className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs font-mono text-gray-200 min-w-[2rem] text-center">
                                                        {key}
                                                    </kbd>
                                                    {j < shortcut.keys.length - 1 && (
                                                        <span className="text-gray-500 text-xs">+</span>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-3 bg-gray-900/50 border-t border-gray-700">
                                <p className="text-xs text-gray-500 text-center">
                                    Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-300 font-mono">Esc</kbd> to close
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
