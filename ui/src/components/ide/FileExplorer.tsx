'use client';

import { useState } from 'react';
import {
    ChevronRight,
    ChevronDown,
    FileCode,
    FolderOpen,
    Folder,
    Plus,
    FilePlus,
    FolderPlus,
    Trash2,
    Edit2,
    MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VirtualFile, VirtualFolder } from '@/lib/virtualFileSystem';

interface FileExplorerProps {
    files: Record<string, VirtualFile>;
    folders: Record<string, VirtualFolder>;
    activeFile: string | null;
    onSelectFile: (path: string) => void;
    onCreateFile: (name: string, parentPath?: string) => void;
    onDeleteFile: (path: string) => void;
    onRenameFile: (path: string, newName: string) => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
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

// File item component
function FileItem({
    file,
    isActive,
    onSelect,
    onDelete,
    onRename,
}: {
    file: VirtualFile;
    isActive: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onRename: (newName: string) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [newName, setNewName] = useState(file.name);

    const handleRename = () => {
        if (newName.trim() && newName !== file.name) {
            onRename(newName.trim());
        }
        setIsEditing(false);
    };

    return (
        <div
            className={`
                group flex items-center gap-2 px-3 py-1.5 cursor-pointer
                transition-colors duration-150 relative
                ${isActive
                    ? 'bg-neon-cyan/20 text-white border-l-2 border-l-neon-cyan'
                    : 'hover:bg-gray-800/50 text-gray-400 border-l-2 border-l-transparent'
                }
            `}
            onClick={onSelect}
        >
            <FileCode className={`w-4 h-4 flex-shrink-0 ${getFileColor(file.name)}`} />

            {isEditing ? (
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleRename}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename();
                        if (e.key === 'Escape') {
                            setNewName(file.name);
                            setIsEditing(false);
                        }
                    }}
                    className="flex-1 bg-dark-bg border border-neon-cyan/50 rounded px-1 py-0.5 text-xs font-mono text-white focus:outline-none"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <span className="flex-1 text-xs font-mono truncate">{file.name}</span>
            )}

            {/* Modified indicator */}
            {file.isModified && (
                <span className="w-2 h-2 rounded-full bg-neon-cyan flex-shrink-0" />
            )}

            {/* Context menu button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-700 rounded transition-opacity"
            >
                <MoreVertical className="w-3 h-3" />
            </button>

            {/* Context menu */}
            <AnimatePresence>
                {showMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-full mt-1 bg-dark-panel border border-gray-700 rounded-lg shadow-lg z-50 py-1 min-w-[120px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                setIsEditing(true);
                                setShowMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                            <Edit2 className="w-3 h-3" />
                            Rename
                        </button>
                        <button
                            onClick={() => {
                                onDelete();
                                setShowMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-gray-700 transition-colors"
                        >
                            <Trash2 className="w-3 h-3" />
                            Delete
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// New file input component
function NewFileInput({
    onSubmit,
    onCancel,
}: {
    onSubmit: (name: string) => void;
    onCancel: () => void;
}) {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (name.trim()) {
            onSubmit(name.trim());
        } else {
            onCancel();
        }
    };

    return (
        <div className="flex items-center gap-2 px-3 py-1.5">
            <FilePlus className="w-4 h-4 text-neon-cyan flex-shrink-0" />
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSubmit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit();
                    if (e.key === 'Escape') onCancel();
                }}
                placeholder="filename.py"
                className="flex-1 bg-dark-bg border border-neon-cyan/50 rounded px-2 py-0.5 text-xs font-mono text-white focus:outline-none placeholder-gray-500"
                autoFocus
            />
        </div>
    );
}

export function FileExplorer({
    files,
    folders,
    activeFile,
    onSelectFile,
    onCreateFile,
    onDeleteFile,
    onRenameFile,
    isCollapsed = false,
}: FileExplorerProps) {
    const [isCreatingFile, setIsCreatingFile] = useState(false);

    // Sort files alphabetically
    const sortedFiles = Object.values(files).sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    if (isCollapsed) {
        return null;
    }

    return (
        <div className="h-full flex flex-col bg-dark-bg border-r border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Files
                </span>
                <button
                    onClick={() => setIsCreatingFile(true)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-neon-cyan"
                    title="New File"
                >
                    <FilePlus className="w-4 h-4" />
                </button>
            </div>

            {/* File list */}
            <div className="flex-1 overflow-y-auto py-1">
                {/* New file input */}
                {isCreatingFile && (
                    <NewFileInput
                        onSubmit={(name) => {
                            onCreateFile(name);
                            setIsCreatingFile(false);
                        }}
                        onCancel={() => setIsCreatingFile(false)}
                    />
                )}

                {/* Files */}
                {sortedFiles.map((file) => (
                    <FileItem
                        key={file.path}
                        file={file}
                        isActive={file.path === activeFile}
                        onSelect={() => onSelectFile(file.path)}
                        onDelete={() => onDeleteFile(file.path)}
                        onRename={(newName) => onRenameFile(file.path, newName)}
                    />
                ))}

                {/* Empty state */}
                {sortedFiles.length === 0 && !isCreatingFile && (
                    <div className="text-center py-8 text-gray-500 text-xs">
                        No files yet.<br />
                        Click + to create one.
                    </div>
                )}
            </div>
        </div>
    );
}
