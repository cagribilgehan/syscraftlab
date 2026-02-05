// Virtual File System Types for Multi-File IDE

export interface VirtualFile {
    id: string;
    name: string;
    path: string; // Full path like "/src/services/payment.py"
    content: string;
    language: string;
    isEntry?: boolean; // Main file to run
    isModified?: boolean; // Unsaved changes indicator
}

export interface VirtualFolder {
    id: string;
    name: string;
    path: string;
    isExpanded?: boolean;
}

export interface FileSystemState {
    files: Record<string, VirtualFile>; // Key is file path
    folders: Record<string, VirtualFolder>; // Key is folder path
    openFiles: string[]; // Array of open file paths (for tabs)
    activeFile: string | null; // Currently active file path
}

// Initial file system for missions
export const createInitialFileSystem = (
    files: { name: string; content: string; isEntry?: boolean }[]
): FileSystemState => {
    const fileMap: Record<string, VirtualFile> = {};

    files.forEach((file, index) => {
        const path = `/${file.name}`;
        fileMap[path] = {
            id: `file-${index}`,
            name: file.name,
            path,
            content: file.content,
            language: getLanguageFromExtension(file.name),
            isEntry: file.isEntry,
            isModified: false,
        };
    });

    const firstFilePath = files.length > 0 ? `/${files[0].name}` : null;

    return {
        files: fileMap,
        folders: {},
        openFiles: firstFilePath ? [firstFilePath] : [],
        activeFile: firstFilePath,
    };
};

// Helper to detect language from file extension
export const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
        'py': 'python',
        'js': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'jsx': 'javascript',
        'json': 'json',
        'md': 'markdown',
        'yaml': 'yaml',
        'yml': 'yaml',
        'html': 'html',
        'css': 'css',
        'sql': 'sql',
        'sh': 'shell',
        'dockerfile': 'dockerfile',
    };
    return languageMap[ext || ''] || 'plaintext';
};

// File system operations
export const fileSystemOperations = {
    createFile: (fs: FileSystemState, name: string, path: string = '/'): FileSystemState => {
        const fullPath = path === '/' ? `/${name}` : `${path}/${name}`;
        const newFile: VirtualFile = {
            id: `file-${Date.now()}`,
            name,
            path: fullPath,
            content: '',
            language: getLanguageFromExtension(name),
            isModified: false,
        };
        return {
            ...fs,
            files: { ...fs.files, [fullPath]: newFile },
            openFiles: [...fs.openFiles, fullPath],
            activeFile: fullPath,
        };
    },

    deleteFile: (fs: FileSystemState, path: string): FileSystemState => {
        const { [path]: _, ...remainingFiles } = fs.files;
        const newOpenFiles = fs.openFiles.filter(p => p !== path);
        return {
            ...fs,
            files: remainingFiles,
            openFiles: newOpenFiles,
            activeFile: fs.activeFile === path
                ? (newOpenFiles[0] || null)
                : fs.activeFile,
        };
    },

    updateFile: (fs: FileSystemState, path: string, content: string): FileSystemState => {
        const file = fs.files[path];
        if (!file) return fs;
        return {
            ...fs,
            files: {
                ...fs.files,
                [path]: { ...file, content, isModified: true },
            },
        };
    },

    renameFile: (fs: FileSystemState, oldPath: string, newName: string): FileSystemState => {
        const file = fs.files[oldPath];
        if (!file) return fs;

        const parentPath = oldPath.substring(0, oldPath.lastIndexOf('/')) || '/';
        const newPath = parentPath === '/' ? `/${newName}` : `${parentPath}/${newName}`;

        const { [oldPath]: _, ...remainingFiles } = fs.files;
        const newFile: VirtualFile = {
            ...file,
            name: newName,
            path: newPath,
            language: getLanguageFromExtension(newName),
        };

        return {
            ...fs,
            files: { ...remainingFiles, [newPath]: newFile },
            openFiles: fs.openFiles.map(p => p === oldPath ? newPath : p),
            activeFile: fs.activeFile === oldPath ? newPath : fs.activeFile,
        };
    },

    openFile: (fs: FileSystemState, path: string): FileSystemState => {
        if (!fs.files[path]) return fs;
        const newOpenFiles = fs.openFiles.includes(path)
            ? fs.openFiles
            : [...fs.openFiles, path];
        return {
            ...fs,
            openFiles: newOpenFiles,
            activeFile: path,
        };
    },

    closeFile: (fs: FileSystemState, path: string): FileSystemState => {
        const newOpenFiles = fs.openFiles.filter(p => p !== path);
        const currentIndex = fs.openFiles.indexOf(path);
        let newActiveFile = fs.activeFile;

        if (fs.activeFile === path) {
            // Switch to adjacent tab or null
            newActiveFile = newOpenFiles[Math.min(currentIndex, newOpenFiles.length - 1)] || null;
        }

        return {
            ...fs,
            openFiles: newOpenFiles,
            activeFile: newActiveFile,
        };
    },

    setActiveFile: (fs: FileSystemState, path: string): FileSystemState => {
        if (!fs.files[path] || !fs.openFiles.includes(path)) return fs;
        return { ...fs, activeFile: path };
    },
};
