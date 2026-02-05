'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Play, Pause, RotateCcw, Zap, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

type CircuitState = 'closed' | 'open' | 'half-open';
type EventType = 'request' | 'success' | 'failure' | 'timeout' | 'retry';

interface Event {
    id: number;
    type: EventType;
    timestamp: Date;
    message: string;
}

interface StateVisualizerProps {
    initialState?: CircuitState;
    failureThreshold?: number;
    successThreshold?: number;
    timeout?: number;
    autoPlay?: boolean;
}

const stateColors: Record<CircuitState, string> = {
    'closed': '#10b981', // green
    'open': '#ef4444',   // red
    'half-open': '#f59e0b', // orange
};

const stateDescriptions: Record<CircuitState, string> = {
    'closed': 'Normal operation - requests are passing through',
    'open': 'Circuit open - failing fast to protect system',
    'half-open': 'Testing recovery - allowing limited requests',
};

export function StateVisualizer({
    initialState = 'closed',
    failureThreshold = 3,
    successThreshold = 2,
    timeout = 5000,
    autoPlay = false,
}: StateVisualizerProps) {
    const [state, setState] = useState<CircuitState>(initialState);
    const [failures, setFailures] = useState(0);
    const [successes, setSuccesses] = useState(0);
    const [events, setEvents] = useState<Event[]>([]);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [requestInFlight, setRequestInFlight] = useState(false);

    const addEvent = useCallback((type: EventType, message: string) => {
        setEvents(prev => [
            { id: Date.now(), type, timestamp: new Date(), message },
            ...prev.slice(0, 9), // Keep last 10 events
        ]);
    }, []);

    const simulateRequest = useCallback(async () => {
        if (requestInFlight) return;

        setRequestInFlight(true);
        addEvent('request', 'Incoming request...');

        // Simulate network delay
        await new Promise(r => setTimeout(r, 500));

        if (state === 'open') {
            addEvent('failure', 'Request rejected - circuit is OPEN');
            setRequestInFlight(false);
            return;
        }

        // Random success/failure (70% success rate in closed, 50% in half-open)
        const successRate = state === 'closed' ? 0.7 : 0.5;
        const isSuccess = Math.random() < successRate;

        if (isSuccess) {
            addEvent('success', 'Request succeeded');
            if (state === 'half-open') {
                setSuccesses(prev => {
                    const newSuccesses = prev + 1;
                    if (newSuccesses >= successThreshold) {
                        setState('closed');
                        addEvent('success', '✓ Circuit CLOSED - System recovered!');
                        return 0;
                    }
                    return newSuccesses;
                });
            }
            setFailures(0);
        } else {
            addEvent('failure', 'Request failed');
            setSuccesses(0);
            setFailures(prev => {
                const newFailures = prev + 1;
                if (state === 'closed' && newFailures >= failureThreshold) {
                    setState('open');
                    addEvent('failure', '⚠ Circuit OPEN - Too many failures!');
                    // Auto-transition to half-open after timeout
                    setTimeout(() => {
                        setState('half-open');
                        addEvent('timeout', '⏱ Timeout expired - trying HALF-OPEN');
                        setFailures(0);
                    }, timeout);
                    return 0;
                }
                if (state === 'half-open') {
                    setState('open');
                    addEvent('failure', '⚠ Circuit OPEN - Test failed!');
                    setTimeout(() => {
                        setState('half-open');
                        addEvent('timeout', '⏱ Timeout expired - trying HALF-OPEN');
                        setFailures(0);
                    }, timeout);
                    return 0;
                }
                return newFailures;
            });
        }

        setRequestInFlight(false);
    }, [state, failureThreshold, successThreshold, timeout, addEvent, requestInFlight]);

    // Auto-play mode
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            simulateRequest();
        }, 1500);

        return () => clearInterval(interval);
    }, [isPlaying, simulateRequest]);

    const reset = () => {
        setState('closed');
        setFailures(0);
        setSuccesses(0);
        setEvents([]);
        setIsPlaying(false);
    };

    const getEventIcon = (type: EventType) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'failure': return <XCircle className="w-4 h-4 text-red-400" />;
            case 'timeout': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            case 'retry': return <RotateCcw className="w-4 h-4 text-blue-400" />;
            default: return <Zap className="w-4 h-4 text-neon-cyan" />;
        }
    };

    return (
        <div className="bg-dark-panel rounded-xl border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-dark-bg border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-neon-cyan" />
                    <span className="text-sm font-medium text-gray-300">Circuit Breaker Visualizer</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`p-1.5 rounded transition-colors ${isPlaying
                            ? 'bg-neon-cyan/20 text-neon-cyan'
                            : 'hover:bg-gray-700 text-gray-400 hover:text-white'
                            }`}
                        title={isPlaying ? 'Pause' : 'Auto-play'}
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={reset}
                        className="p-1.5 rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                        title="Reset"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* State Machine Diagram */}
            <div className="p-8">
                <div className="flex items-center justify-center gap-12">
                    {/* Closed State */}
                    <motion.div
                        animate={{
                            scale: state === 'closed' ? 1.1 : 1,
                            opacity: state === 'closed' ? 1 : 0.5,
                        }}
                        className="flex flex-col items-center"
                    >
                        <motion.div
                            className="w-28 h-28 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: stateColors.closed }}
                            animate={{
                                boxShadow: state === 'closed' ? `0 0 30px ${stateColors.closed}` : 'none',
                            }}
                        >
                            CLOSED
                        </motion.div>
                        <span className="text-sm text-gray-400 mt-3 font-medium">Normal</span>
                    </motion.div>

                    {/* Arrow Closed -> Open */}
                    <div className="flex flex-col items-center gap-1">
                        <motion.div
                            animate={{ opacity: state === 'closed' ? 1 : 0.3 }}
                            className="text-5xl text-gray-400"
                        >
                            →
                        </motion.div>
                        <span className="text-sm text-gray-500 font-mono">failures ≥ {failureThreshold}</span>
                    </div>

                    {/* Open State */}
                    <motion.div
                        animate={{
                            scale: state === 'open' ? 1.1 : 1,
                            opacity: state === 'open' ? 1 : 0.5,
                        }}
                        className="flex flex-col items-center"
                    >
                        <motion.div
                            className="w-28 h-28 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: stateColors.open }}
                            animate={{
                                boxShadow: state === 'open' ? `0 0 30px ${stateColors.open}` : 'none',
                            }}
                        >
                            OPEN
                        </motion.div>
                        <span className="text-sm text-gray-400 mt-3 font-medium">Fail Fast</span>
                    </motion.div>

                    {/* Arrow Open -> Half-Open */}
                    <div className="flex flex-col items-center gap-1">
                        <motion.div
                            animate={{ opacity: state === 'open' ? 1 : 0.3 }}
                            className="text-5xl text-gray-400"
                        >
                            →
                        </motion.div>
                        <span className="text-sm text-gray-500 font-mono">timeout</span>
                    </div>

                    {/* Half-Open State */}
                    <motion.div
                        animate={{
                            scale: state === 'half-open' ? 1.1 : 1,
                            opacity: state === 'half-open' ? 1 : 0.5,
                        }}
                        className="flex flex-col items-center"
                    >
                        <motion.div
                            className="w-28 h-28 rounded-full flex items-center justify-center text-white font-bold text-base text-center px-3"
                            style={{ backgroundColor: stateColors['half-open'] }}
                            animate={{
                                boxShadow: state === 'half-open' ? `0 0 30px ${stateColors['half-open']}` : 'none',
                            }}
                        >
                            HALF-OPEN
                        </motion.div>
                        <span className="text-sm text-gray-400 mt-3 font-medium">Testing</span>
                    </motion.div>
                </div>

                {/* Current State Info */}
                <motion.div
                    key={state}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-center"
                >
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                        style={{
                            backgroundColor: `${stateColors[state]}20`,
                            color: stateColors[state],
                        }}
                    >
                        <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: stateColors[state] }}
                        />
                        {stateDescriptions[state]}
                    </div>
                </motion.div>

                {/* Counters */}
                <div className="flex justify-center gap-16 mt-6">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-red-400">{failures}</div>
                        <div className="text-sm text-gray-500">Failures</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-400">{successes}</div>
                        <div className="text-sm text-gray-500">Successes</div>
                    </div>
                </div>

                {/* Manual Request Button */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={simulateRequest}
                        disabled={requestInFlight}
                        className="px-4 py-2 bg-neon-purple/20 text-neon-purple rounded-lg font-medium text-sm hover:bg-neon-purple/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Zap className="w-4 h-4" />
                        {requestInFlight ? 'Sending...' : 'Send Request'}
                    </button>
                </div>
            </div>

            {/* Event Log */}
            <div className="border-t border-gray-800 p-4 max-h-48 overflow-auto">
                <div className="text-xs font-medium text-gray-500 mb-2">Event Log</div>
                <AnimatePresence>
                    {events.length === 0 ? (
                        <div className="text-xs text-gray-600 text-center py-4">
                            No events yet. Click "Send Request" or enable auto-play.
                        </div>
                    ) : (
                        events.map((event) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 py-1 text-xs"
                            >
                                {getEventIcon(event.type)}
                                <span className="text-gray-500 font-mono">
                                    {event.timestamp.toLocaleTimeString()}
                                </span>
                                <span className="text-gray-300">{event.message}</span>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
