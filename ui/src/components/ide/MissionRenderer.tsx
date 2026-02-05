'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Mission, MissionComponents } from '@/lib/missionData';
import { DiagramPanel } from './DiagramPanel';
import { TerminalEmulator } from './TerminalEmulator';
import { DatabasePlayground, SampleSchemas } from './DatabasePlayground';
import { StateVisualizer } from './StateVisualizer';
import { DiffViewer } from './DiffViewer';
import { GitBranch, Terminal, Database, Activity, Code, Lightbulb } from 'lucide-react';

// Dynamic import for Monaco Editor
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface MissionRendererProps {
    mission: Mission;
    code: string;
    onCodeChange: (value: string | undefined) => void;
    showSolution?: boolean;
}

type ActivePanel = 'code' | 'diagram' | 'terminal' | 'database' | 'state' | 'diff';

export function MissionRenderer({
    mission,
    code,
    onCodeChange,
    showSolution = false,
}: MissionRendererProps) {
    const [activePanel, setActivePanel] = useState<ActivePanel>('code');
    const { components } = mission;

    // Get solution code for diff view
    const solutionCode = mission.solutionFiles?.[0]?.content || '';

    // Available panels based on mission components
    const availablePanels = [
        { id: 'code' as const, icon: Code, label: 'Code', show: components.showEditor !== false },
        { id: 'diff' as const, icon: Lightbulb, label: 'Solution', show: !!components.showDiffViewer && !!solutionCode },
        { id: 'diagram' as const, icon: GitBranch, label: 'Diagram', show: !!components.showDiagram },
        { id: 'terminal' as const, icon: Terminal, label: 'Terminal', show: !!components.showTerminal },
        { id: 'database' as const, icon: Database, label: 'Database', show: !!components.showDatabase },
        { id: 'state' as const, icon: Activity, label: 'State', show: !!components.showStateVisualizer },
    ].filter(p => p.show);

    return (
        <div className="flex flex-col h-full">
            {/* Panel Tabs */}
            {availablePanels.length > 1 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-dark-bg border-b border-gray-800">
                    {availablePanels.map((panel) => {
                        const Icon = panel.icon;
                        const isActive = activePanel === panel.id;
                        return (
                            <button
                                key={panel.id}
                                onClick={() => setActivePanel(panel.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {panel.label}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {/* Code Editor */}
                    {activePanel === 'code' && (
                        <motion.div
                            key="code"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full"
                        >
                            <MonacoEditor
                                height="100%"
                                language={mission.files[0]?.language || 'python'}
                                theme="vs-dark"
                                value={code}
                                onChange={onCodeChange}
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

                    {/* Diff Viewer */}
                    {activePanel === 'diff' && (
                        <motion.div
                            key="diff"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full"
                        >
                            <DiffViewer
                                originalCode={code}
                                modifiedCode={solutionCode}
                                language={mission.files[0]?.language || 'python'}
                                showSolution={true}
                            />
                        </motion.div>
                    )}

                    {/* Diagram Panel */}
                    {activePanel === 'diagram' && mission.diagram && (
                        <motion.div
                            key="diagram"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full p-4 overflow-auto"
                        >
                            <DiagramPanel
                                diagram={mission.diagram.code}
                                title={mission.diagram.title}
                            />
                        </motion.div>
                    )}

                    {/* Terminal Emulator */}
                    {activePanel === 'terminal' && (
                        <motion.div
                            key="terminal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full p-4"
                        >
                            <TerminalEmulator
                                welcomeMessage={mission.terminalConfig?.welcomeMessage || 'LabLudus Terminal Ready'}
                            />
                        </motion.div>
                    )}

                    {/* Database Playground */}
                    {activePanel === 'database' && (
                        <motion.div
                            key="database"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full p-4 overflow-auto"
                        >
                            <DatabasePlayground
                                initialSchema={mission.databaseConfig?.schema || SampleSchemas.ecommerce}
                                initialQuery={mission.databaseConfig?.initialQuery || 'SELECT * FROM users;'}
                            />
                        </motion.div>
                    )}

                    {/* State Visualizer */}
                    {activePanel === 'state' && (
                        <motion.div
                            key="state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full p-4 overflow-auto"
                        >
                            <StateVisualizer
                                initialState={mission.stateConfig?.initialState || 'closed'}
                                failureThreshold={mission.stateConfig?.failureThreshold || 3}
                                successThreshold={mission.stateConfig?.successThreshold || 2}
                                autoPlay={mission.stateConfig?.autoPlay || false}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Sidebar component showing mission-specific panels
interface MissionSidePanelProps {
    mission: Mission;
}

export function MissionSidePanel({ mission }: MissionSidePanelProps) {
    const { components } = mission;
    const hasMultiplePanels =
        (components.showDiagram ? 1 : 0) +
        (components.showStateVisualizer ? 1 : 0) +
        (components.showTerminal ? 1 : 0) +
        (components.showDatabase ? 1 : 0) > 0;

    if (!hasMultiplePanels) return null;

    return (
        <div className="flex flex-col gap-4 h-full overflow-auto p-4">
            {/* Diagram */}
            {components.showDiagram && mission.diagram && (
                <DiagramPanel
                    diagram={mission.diagram.code}
                    title={mission.diagram.title}
                />
            )}

            {/* State Visualizer */}
            {components.showStateVisualizer && mission.stateConfig && (
                <StateVisualizer
                    initialState={mission.stateConfig.initialState}
                    failureThreshold={mission.stateConfig.failureThreshold}
                    successThreshold={mission.stateConfig.successThreshold}
                    autoPlay={mission.stateConfig.autoPlay}
                />
            )}

            {/* Terminal (small version) */}
            {components.showTerminal && (
                <TerminalEmulator
                    welcomeMessage={mission.terminalConfig?.welcomeMessage}
                />
            )}

            {/* Database */}
            {components.showDatabase && (
                <DatabasePlayground
                    initialSchema={mission.databaseConfig?.schema}
                    initialQuery={mission.databaseConfig?.initialQuery}
                />
            )}
        </div>
    );
}
