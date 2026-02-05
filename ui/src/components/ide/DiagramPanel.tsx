'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import mermaid from 'mermaid';

// Initialize mermaid with dark theme
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        primaryColor: '#00d4ff',
        primaryTextColor: '#fff',
        primaryBorderColor: '#7c3aed',
        lineColor: '#6b7280',
        secondaryColor: '#1e1e2e',
        tertiaryColor: '#0a0a0f',
        background: '#0a0a0f',
        mainBkg: '#1a1a2e',
        nodeBkg: '#1e1e2e',
        clusterBkg: '#0a0a0f',
        titleColor: '#00d4ff',
        edgeLabelBackground: '#1e1e2e',
    },
    flowchart: {
        curve: 'basis',
        padding: 20,
    },
    sequence: {
        actorMargin: 50,
        boxMargin: 10,
    },
});

interface DiagramPanelProps {
    diagram: string;
    title?: string;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
}

export function DiagramPanel({
    diagram,
    title = 'Architecture Diagram',
    isExpanded = false,
    onToggleExpand,
}: DiagramPanelProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svgContent, setSvgContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isRendering, setIsRendering] = useState(false);

    const renderDiagram = async () => {
        if (!diagram || !containerRef.current) return;

        setIsRendering(true);
        setError(null);

        try {
            // Generate unique ID
            const id = `mermaid-${Date.now()}`;

            // Render the diagram
            const { svg } = await mermaid.render(id, diagram);
            setSvgContent(svg);
        } catch (err) {
            setError(`Diagram error: ${err}`);
            console.error('Mermaid rendering error:', err);
        } finally {
            setIsRendering(false);
        }
    };

    useEffect(() => {
        renderDiagram();
    }, [diagram]);

    return (
        <motion.div
            layout
            className={`bg-dark-panel rounded-xl border border-gray-800 overflow-hidden ${isExpanded ? 'fixed inset-4 z-50' : ''
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-dark-bg border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-neon-purple" />
                    <span className="text-sm font-medium text-gray-300">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={renderDiagram}
                        className="p-1.5 rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-neon-cyan"
                        title="Refresh"
                        disabled={isRendering}
                    >
                        <RefreshCw className={`w-4 h-4 ${isRendering ? 'animate-spin' : ''}`} />
                    </button>
                    {onToggleExpand && (
                        <button
                            onClick={onToggleExpand}
                            className="p-1.5 rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-neon-cyan"
                            title={isExpanded ? 'Minimize' : 'Maximize'}
                        >
                            {isExpanded ? (
                                <Minimize2 className="w-4 h-4" />
                            ) : (
                                <Maximize2 className="w-4 h-4" />
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Diagram Content */}
            <div
                ref={containerRef}
                className={`p-4 overflow-auto ${isExpanded ? 'h-[calc(100%-48px)]' : 'h-64'}`}
            >
                {isRendering && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500 text-sm">Rendering diagram...</div>
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-red-400 text-sm font-mono">{error}</div>
                    </div>
                )}

                {svgContent && !isRendering && !error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center min-h-full"
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                )}
            </div>

            {/* Expanded backdrop */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 -z-10"
                        onClick={onToggleExpand}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Pre-defined diagram templates for common architecture patterns
export const DiagramTemplates = {
    // Hexagonal Architecture
    hexagonal: `
        graph LR
            subgraph Domain[Domain Core]
                E[Entities]
                S[Services]
                P[Ports]
            end
            
            subgraph Adapters[Adapters]
                WA[Web API]
                DB[(Database)]
                MQ[Message Queue]
            end
            
            WA --> P
            P --> S
            S --> E
            P --> DB
            P --> MQ
            
            style Domain fill:#1e1e2e,stroke:#00d4ff
            style Adapters fill:#0a0a0f,stroke:#7c3aed
    `,

    // Event Sourcing
    eventSourcing: `
        sequenceDiagram
            participant C as Command
            participant H as Handler
            participant ES as Event Store
            participant P as Projection
            
            C->>H: PlaceOrder
            H->>ES: OrderPlaced Event
            ES->>P: Update Read Model
            P-->>C: Query Result
    `,

    // Circuit Breaker States
    circuitBreaker: `
        stateDiagram-v2
            [*] --> Closed
            Closed --> Open: Failures >= Threshold
            Open --> HalfOpen: Timeout
            HalfOpen --> Closed: Success
            HalfOpen --> Open: Failure
            
            note right of Closed: Normal operation
            note right of Open: Fail fast
            note right of HalfOpen: Testing
    `,

    // Microservices
    microservices: `
        graph TB
            GW[API Gateway]
            
            subgraph Services
                US[User Service]
                OS[Order Service]
                PS[Product Service]
            end
            
            subgraph Data
                UD[(User DB)]
                OD[(Order DB)]
                PD[(Product DB)]
            end
            
            MQ[Message Queue]
            
            GW --> US
            GW --> OS
            GW --> PS
            
            US --> UD
            OS --> OD
            PS --> PD
            
            US --> MQ
            OS --> MQ
            PS --> MQ
    `,

    // CQRS
    cqrs: `
        graph LR
            subgraph Commands
                C[Command] --> CH[Handler]
                CH --> W[(Write DB)]
            end
            
            subgraph Events
                W --> E[Event Bus]
                E --> P[Projector]
            end
            
            subgraph Queries
                P --> R[(Read DB)]
                R --> Q[Query Service]
            end
            
            style Commands fill:#1a1a2e,stroke:#00d4ff
            style Events fill:#1a1a2e,stroke:#7c3aed
            style Queries fill:#1a1a2e,stroke:#10b981
    `,
};
