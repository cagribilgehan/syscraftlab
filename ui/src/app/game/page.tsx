'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Play,
    Lightbulb,
    BookOpen,
    CheckCircle,
    XCircle,
    Clock,
    Trophy,
    ChevronRight,
    Zap,
    Target,
    FileText,
    Code,
    Terminal,
    Maximize2,
    Minimize2,
    PanelRight,
    PanelRightClose,
    PanelLeft,
    PanelLeftClose,
    GitBranch,
    Database,
    Activity
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Mission System
import { Mission, MISSIONS, getMissionById, getZoneComponents } from '@/lib/missionData';
import { FileSystemState, createInitialFileSystem, fileSystemOperations } from '@/lib/virtualFileSystem';
import { useProgress, ProgressStats } from '@/lib/progressStore';
import { EditorTabs } from '@/components/ide/EditorTabs';
import { FileExplorer } from '@/components/ide/FileExplorer';
import { DiffViewer } from '@/components/ide/DiffViewer';
import { DiagramPanel } from '@/components/ide/DiagramPanel';
import { TerminalEmulator } from '@/components/ide/TerminalEmulator';
import { DatabasePlayground, SampleSchemas } from '@/components/ide/DatabasePlayground';
import { StateVisualizer } from '@/components/ide/StateVisualizer';
import { MissionCompleteModal } from '@/components/ui/MissionComplete';
import { KeyboardShortcutsHelp } from '@/components/ui/KeyboardShortcutsHelp';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

// Dynamic import for Monaco Editor
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// Test Result Component
function TestResult({ name, status, message }: { name: string; status: string; message: string }) {
    const icons: Record<string, React.ReactNode> = {
        passed: <CheckCircle className="w-5 h-5 text-green-500" />,
        failed: <XCircle className="w-5 h-5 text-red-500" />,
        pending: <Clock className="w-5 h-5 text-gray-500 animate-pulse" />,
        running: <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Zap className="w-5 h-5 text-yellow-500" /></motion.div>
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-3 p-3 rounded-lg ${status === 'passed' ? 'bg-green-500/10 border border-green-500/30' :
                status === 'failed' ? 'bg-red-500/10 border border-red-500/30' :
                    'bg-gray-800/50'
                }`}
        >
            {icons[status] || icons.pending}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-mono truncate">{name}</p>
                <p className="text-xs text-gray-500 truncate">{message}</p>
            </div>
        </motion.div>
    );
}

// Active Panel Type
type ActivePanel = 'code' | 'diff' | 'diagram' | 'terminal' | 'database' | 'state';

// Game Page Content (uses useSearchParams)
function GamePageContent() {
    const searchParams = useSearchParams();
    const missionId = searchParams.get('mission') || '1.1';

    // Get mission from data
    const mission = getMissionById(missionId) || MISSIONS[0];

    // Initialize file system from mission files
    const [fileSystem, setFileSystem] = useState<FileSystemState>(() =>
        createInitialFileSystem(
            mission.files.map(f => ({
                name: f.name,
                content: f.content,
                isEntry: f.isEntry,
            }))
        )
    );

    // UI State
    const [showFileExplorer, setShowFileExplorer] = useState(true);
    const [isZenMode, setIsZenMode] = useState(false);
    const [showTerminalPanel, setShowTerminalPanel] = useState(false);
    const [mobileTab, setMobileTab] = useState<'mission' | 'code' | 'terminal'>('mission');

    // Mission State
    const [activePanel, setActivePanel] = useState<ActivePanel>('code');
    const [tests, setTests] = useState(
        mission.tests.map(t => ({ name: t.name, status: 'pending', message: t.description }))
    );
    const [isRunning, setIsRunning] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [hintIndex, setHintIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(mission.timeLimit);
    const [showMissionComplete, setShowMissionComplete] = useState(false);

    // Progress persistence
    const { progress, completeMission, saveCode, getSavedCode, isMissionCompleted } = useProgress();

    // Get current file
    const activeFile = fileSystem.activeFile ? fileSystem.files[fileSystem.activeFile] : null;
    const code = activeFile?.content || '';

    // Code change handler
    const handleCodeChange = useCallback((value: string | undefined) => {
        if (!fileSystem.activeFile || value === undefined) return;
        setFileSystem(prev => fileSystemOperations.updateFile(prev, fileSystem.activeFile!, value));
    }, [fileSystem.activeFile]);

    // File operations
    const handleFileSelect = useCallback((fileId: string) => {
        setFileSystem(prev => fileSystemOperations.openFile(prev, fileId));
    }, []);

    const handleFileClose = useCallback((fileId: string) => {
        setFileSystem(prev => fileSystemOperations.closeFile(prev, fileId));
    }, []);

    // Run tests
    const runTests = async () => {
        setIsRunning(true);

        // Run each test with delay for animation
        let allPassed = true;
        for (let i = 0; i < tests.length; i++) {
            setTests(prev => prev.map((t, idx) =>
                idx === i ? { ...t, status: 'running' } : t
            ));

            await new Promise(r => setTimeout(r, 500));

            // Simple validation (in real app would use pyodide)
            const passed = Math.random() > 0.3;
            if (!passed) allPassed = false;
            setTests(prev => prev.map((t, idx) =>
                idx === i ? { ...t, status: passed ? 'passed' : 'failed' } : t
            ));
        }

        setIsRunning(false);

        // Show completion modal if all tests passed
        if (allPassed && !isMissionCompleted(missionId)) {
            completeMission(missionId, mission.xp);
            setShowMissionComplete(true);
        }
    };

    // Save code periodically
    useEffect(() => {
        const timer = setTimeout(() => {
            if (code) saveCode(missionId, code);
        }, 2000);
        return () => clearTimeout(timer);
    }, [code, missionId, saveCode]);

    // Keyboard shortcuts
    useKeyboardShortcuts({
        enabled: true,
        shortcuts: [
            { key: 'Enter', ctrlKey: true, action: runTests, description: 'Run Tests' },
            { key: 's', ctrlKey: true, action: () => saveCode(missionId, code), description: 'Save Code' },
            { key: 'h', ctrlKey: true, action: () => setShowHint(!showHint), description: 'Toggle Hint' },
            { key: 'b', ctrlKey: true, action: () => setShowFileExplorer(!showFileExplorer), description: 'Toggle Explorer' },
            { key: '1', ctrlKey: true, action: () => setActivePanel('code'), description: 'Code Tab' },
            { key: '2', ctrlKey: true, action: () => setActivePanel('diff'), description: 'Diff Tab' },
            { key: '3', ctrlKey: true, action: () => setActivePanel('diagram'), description: 'Diagram Tab' },
        ],
    });

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Get solution code
    const solutionCode = mission.solutionFiles?.[0]?.content || '';

    // Check which panels are available
    const { components } = mission;
    const availablePanels = [
        { id: 'code' as const, icon: Code, label: 'Code', show: components.showEditor !== false },
        { id: 'diff' as const, icon: Lightbulb, label: 'Solution', show: !!components.showDiffViewer && !!solutionCode },
        { id: 'diagram' as const, icon: GitBranch, label: 'Diagram', show: !!components.showDiagram && !!mission.diagram },
        { id: 'state' as const, icon: Activity, label: 'Circuit', show: !!components.showStateVisualizer },
        { id: 'terminal' as const, icon: Terminal, label: 'Terminal', show: !!components.showTerminal },
        { id: 'database' as const, icon: Database, label: 'SQL', show: !!components.showDatabase },
    ].filter(p => p.show);

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/90 backdrop-blur-lg border-b border-gray-800">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                        <Link href="/map" className="p-2 hover:bg-dark-panel rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                        </Link>
                        <div>
                            <p className="text-xs text-neon-cyan font-mono">Zone {mission.zoneId}</p>
                            <h1 className="text-lg font-display font-bold">{mission.title}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className={`font-mono ${timeLeft < 60 ? 'text-red-400' : 'text-gray-300'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm font-medium">+{mission.xp} XP</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Tabs */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-panel border-t border-gray-800">
                <div className="flex">
                    {['mission', 'code', 'terminal'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setMobileTab(tab as typeof mobileTab)}
                            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${mobileTab === tab ? 'text-neon-cyan border-t-2 border-neon-cyan' : 'text-gray-400'
                                }`}
                        >
                            {tab === 'mission' && <FileText className="w-5 h-5 mx-auto mb-1" />}
                            {tab === 'code' && <Code className="w-5 h-5 mx-auto mb-1" />}
                            {tab === 'terminal' && <Terminal className="w-5 h-5 mx-auto mb-1" />}
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 pt-16 pb-16 lg:pb-0" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <div className="h-full flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 64px)' }}>
                    {/* Left Panel - Mission Briefing */}
                    <div className={`lg:w-80 xl:w-96 bg-dark-panel border-r border-gray-800 overflow-y-auto ${mobileTab !== 'mission' ? 'hidden lg:block' : ''
                        }`}>
                        <div className="p-6 space-y-6">
                            {/* Commander */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-2xl">
                                    👩‍✈️
                                </div>
                                <div>
                                    <h3 className="font-bold text-neon-cyan">Commander Eve</h3>
                                    <p className="text-xs text-gray-500">Mission Briefing</p>
                                </div>
                            </div>

                            {/* Mission Description */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-neon-purple" />
                                    <h4 className="font-bold">Mission</h4>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {mission.briefing || mission.description}
                                </p>
                            </div>

                            {/* Objectives */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-sm">Objectives</h4>
                                <ul className="space-y-2">
                                    {mission.objectives.map((obj, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                            <ChevronRight className="w-4 h-4 text-neon-cyan mt-0.5" />
                                            {obj}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Hints */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowHint(!showHint)}
                                    className="flex items-center gap-2 text-sm text-neon-purple hover:text-neon-purple/80"
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    AI Hint ({hintIndex + 1}/{mission.hints.length})
                                </button>
                                <AnimatePresence>
                                    {showHint && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="p-3 rounded-lg bg-neon-purple/10 border border-neon-purple/30"
                                        >
                                            <p className="text-sm text-gray-300">
                                                {mission.hints[hintIndex]?.text}
                                            </p>
                                            {hintIndex < mission.hints.length - 1 && (
                                                <button
                                                    onClick={() => setHintIndex(i => i + 1)}
                                                    className="mt-2 text-xs text-neon-purple hover:underline"
                                                >
                                                    Next hint →
                                                </button>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Docs Link */}
                            {mission.docsUrl && (
                                <Link
                                    href={mission.docsUrl}
                                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-neon-cyan"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    {mission.referenceChapter || 'Documentation'}
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Center Panel - Code Editor */}
                    <div className={`flex-1 flex flex-col min-w-0 ${mobileTab !== 'code' ? 'hidden lg:flex' : ''
                        }`}>
                        {/* Editor Header */}
                        <div className="flex items-center justify-between px-4 py-2 bg-dark-panel border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowFileExplorer(!showFileExplorer)}
                                    className="p-1.5 rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-neon-cyan"
                                >
                                    {showFileExplorer ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
                                </button>
                                <span className="text-xs font-mono text-gray-500">{activeFile?.name || 'No file'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Panel Tabs */}
                                {availablePanels.length > 1 && (
                                    <div className="flex items-center gap-1 mr-4">
                                        {availablePanels.map((panel) => {
                                            const Icon = panel.icon;
                                            return (
                                                <button
                                                    key={panel.id}
                                                    onClick={() => setActivePanel(panel.id)}
                                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${activePanel === panel.id
                                                        ? 'bg-neon-cyan/20 text-neon-cyan'
                                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                                        }`}
                                                >
                                                    <Icon className="w-3.5 h-3.5" />
                                                    {panel.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                                <button
                                    onClick={runTests}
                                    disabled={isRunning}
                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-medium text-sm transition-all ${isRunning
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-neon-cyan text-dark-bg hover:bg-neon-cyan/90'
                                        }`}
                                >
                                    <Play className="w-4 h-4" />
                                    {isRunning ? 'Running...' : 'Run Tests'}
                                </button>
                            </div>
                        </div>

                        {/* Main Editor Area */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* File Explorer */}
                            <AnimatePresence>
                                {showFileExplorer && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 180, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="border-r border-gray-800 overflow-hidden"
                                    >
                                        <FileExplorer
                                            files={fileSystem.files}
                                            folders={fileSystem.folders}
                                            activeFile={fileSystem.activeFile}
                                            onSelectFile={handleFileSelect}
                                            onCreateFile={(name) => setFileSystem(prev => fileSystemOperations.createFile(prev, name))}
                                            onDeleteFile={(path) => setFileSystem(prev => fileSystemOperations.deleteFile(prev, path))}
                                            onRenameFile={(path, newName) => setFileSystem(prev => fileSystemOperations.renameFile(prev, path, newName))}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Editor/Panel Content */}
                            <div className="flex-1 flex flex-col min-w-0">
                                <EditorTabs
                                    files={fileSystem.files}
                                    openFiles={fileSystem.openFiles}
                                    activeFile={fileSystem.activeFile}
                                    onSelectFile={handleFileSelect}
                                    onCloseFile={handleFileClose}
                                />

                                <div className="flex-1 overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        {/* Code Editor */}
                                        {activePanel === 'code' && (
                                            <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                                                <MonacoEditor
                                                    height="100%"
                                                    language={activeFile?.language || 'python'}
                                                    theme="vs-dark"
                                                    value={code}
                                                    onChange={handleCodeChange}
                                                    options={{
                                                        minimap: { enabled: false },
                                                        fontSize: 14,
                                                        fontFamily: 'JetBrains Mono, monospace',
                                                        padding: { top: 16 },
                                                        scrollBeyondLastLine: false,
                                                        automaticLayout: true,
                                                    }}
                                                />
                                            </motion.div>
                                        )}

                                        {/* Diff/Solution View */}
                                        {activePanel === 'diff' && (
                                            <motion.div key="diff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                                                <DiffViewer
                                                    originalCode={code}
                                                    modifiedCode={solutionCode}
                                                    language={activeFile?.language || 'python'}
                                                    showSolution={true}
                                                />
                                            </motion.div>
                                        )}

                                        {/* Diagram Panel */}
                                        {activePanel === 'diagram' && mission.diagram && (
                                            <motion.div key="diagram" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full p-4 overflow-auto">
                                                <DiagramPanel
                                                    diagram={mission.diagram.code}
                                                    title={mission.diagram.title}
                                                />
                                            </motion.div>
                                        )}

                                        {/* State Visualizer */}
                                        {activePanel === 'state' && (
                                            <motion.div key="state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full p-4 overflow-auto">
                                                <StateVisualizer
                                                    initialState={mission.stateConfig?.initialState || 'closed'}
                                                    failureThreshold={mission.stateConfig?.failureThreshold || 3}
                                                    successThreshold={mission.stateConfig?.successThreshold || 2}
                                                    autoPlay={false}
                                                />
                                            </motion.div>
                                        )}

                                        {/* Terminal */}
                                        {activePanel === 'terminal' && (
                                            <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full p-4">
                                                <TerminalEmulator
                                                    welcomeMessage={mission.terminalConfig?.welcomeMessage || 'LabLudus Terminal Ready'}
                                                />
                                            </motion.div>
                                        )}

                                        {/* Database */}
                                        {activePanel === 'database' && (
                                            <motion.div key="database" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full p-4 overflow-auto">
                                                <DatabasePlayground
                                                    initialSchema={mission.databaseConfig?.schema || SampleSchemas.ecommerce}
                                                    initialQuery={mission.databaseConfig?.initialQuery || 'SELECT * FROM users;'}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Test Results */}
                    <div className={`lg:w-72 xl:w-80 bg-dark-panel border-l border-gray-800 overflow-y-auto ${mobileTab !== 'terminal' ? 'hidden lg:block' : ''
                        }`}>
                        <div className="p-4 border-b border-gray-800">
                            <h3 className="font-bold flex items-center gap-2">
                                <Zap className="w-5 h-5 text-neon-cyan" />
                                Test Results
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {tests.map((test, i) => (
                                <TestResult key={i} {...test} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Mission Complete Modal with Confetti */}
            <MissionCompleteModal
                isOpen={showMissionComplete}
                xpEarned={mission.xp}
                missionTitle={mission.title}
                onClose={() => setShowMissionComplete(false)}
                onNextMission={() => {
                    setShowMissionComplete(false);
                    // Navigate to next mission (placeholder)
                    const nextMissionNum = parseInt(missionId.split('.')[1]) + 1;
                    window.location.href = `/game?mission=${mission.zoneId}.${nextMissionNum}`;
                }}
            />

            {/* Keyboard Shortcuts Help Button */}
            <KeyboardShortcutsHelp />
        </div>
    );
}

// Main export with Suspense wrapper for useSearchParams
export default function GamePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading mission...</p>
                </div>
            </div>
        }>
            <GamePageContent />
        </Suspense>
    );
}
