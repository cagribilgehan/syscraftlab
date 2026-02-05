'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    action: () => void;
    description: string;
}

interface UseKeyboardShortcutsOptions {
    enabled?: boolean;
    shortcuts: KeyboardShortcut[];
}

export function useKeyboardShortcuts({ enabled = true, shortcuts }: UseKeyboardShortcutsOptions) {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!enabled) return;

            // Don't trigger shortcuts when typing in inputs
            const target = event.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                // Allow Ctrl+Enter and Ctrl+S even in editors
                if (!(event.ctrlKey && (event.key === 'Enter' || event.key === 's'))) {
                    return;
                }
            }

            for (const shortcut of shortcuts) {
                const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : !event.ctrlKey;
                const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
                const altMatch = shortcut.altKey ? event.altKey : !event.altKey;
                const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

                if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
                    event.preventDefault();
                    shortcut.action();
                    break;
                }
            }
        },
        [enabled, shortcuts]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

// Shortcut help modal content
export const GAME_SHORTCUTS = [
    { key: 'Enter', ctrlKey: true, description: 'Run Tests' },
    { key: 's', ctrlKey: true, description: 'Save Code' },
    { key: 'h', ctrlKey: true, description: 'Show/Hide Hint' },
    { key: 'b', ctrlKey: true, description: 'Toggle File Explorer' },
    { key: '1', ctrlKey: true, description: 'Switch to Code Tab' },
    { key: '2', ctrlKey: true, description: 'Switch to Solution/Diff Tab' },
    { key: '3', ctrlKey: true, description: 'Switch to Diagram Tab' },
    { key: 'Escape', description: 'Close Modal' },
];

export function ShortcutHelpList() {
    return (
        <div className= "space-y-2" >
        {
            GAME_SHORTCUTS.map((shortcut, i) => (
                <div key= { i } className = "flex items-center justify-between py-1" >
                <span className="text-gray-300 text-sm" > { shortcut.description } </span>
            < div className = "flex items-center gap-1" >
            {
                shortcut.ctrlKey && (
                    <kbd className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300 font-mono">
                        Ctrl
                        </kbd>
                        )
        }
    { shortcut.ctrlKey && <span className="text-gray-500" > +</span> }
    <kbd className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300 font-mono" >
        { shortcut.key }
        </kbd>
        </div>
        </div>
            ))
}
</div>
    );
}
