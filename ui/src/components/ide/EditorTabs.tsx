'use client';

import { X, FileCode, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VirtualFile } from '@/lib/virtualFileSystem';

interface EditorTabsProps {
    files: Record<string, VirtualFile>;
    openFiles: string[];
    activeFile: string | null;
    onSelectFile: (path: string) => void;
    onCloseFile: (path: string) => void;
}

// Get icon color based on file extension
const getFileColor = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const colorMap: Record<string, string> = {
        'py': 'text-yellow-400',
        'js': 'text-yellow-300',
        'ts': 'text-blue-400',
        'tsx': 'text-blue-400',
        'jsx': 'text-blue-300',
        'json': 'text-yellow-500',
        'md': 'text-gray-400',
        'css': 'text-pink-400',
        'html': 'text-orange-400',
    };
    return colorMap[ext || ''] || 'text-gray-400';
};

export function EditorTabs({
    files,
    openFiles,
    activeFile,
    onSelectFile,
    onCloseFile,
}: EditorTabsProps) {
    if (openFiles.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center bg-dark-bg border-b border-gray-800 overflow-x-auto scrollbar-hide">
            <AnimatePresence mode="popLayout">
                {openFiles.map((path) => {
                    const file = files[path];
                    if (!file) return null;

                    const isActive = path === activeFile;

                    return (
                        <motion.div
                            key={path}
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.15 }}
                            className={`
                                flex items-center gap-2 px-3 py-2 text-sm cursor-pointer
                                border-r border-gray-800 flex-shrink-0
                                transition-colors duration-150
                                ${isActive
                                    ? 'bg-dark-panel text-white border-t-2 border-t-neon-cyan'
                                    : 'bg-dark-bg text-gray-400 hover:bg-dark-panel/50 border-t-2 border-t-transparent'
                                }
                            `}
                            onClick={() => onSelectFile(path)}
                        >
                            <FileCode className={`w-4 h-4 ${getFileColor(file.name)}`} />
                            <span className="font-mono text-xs">{file.name}</span>

                            {/* Modified indicator */}
                            {file.isModified && (
                                <Circle className="w-2 h-2 fill-neon-cyan text-neon-cyan" />
                            )}

                            {/* Close button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCloseFile(path);
                                }}
                                className="p-0.5 rounded hover:bg-gray-700 transition-colors ml-1"
                                title="Close"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
