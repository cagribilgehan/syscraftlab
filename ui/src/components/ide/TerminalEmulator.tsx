'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronRight, X, Trash2 } from 'lucide-react';

interface CommandOutput {
    id: number;
    command: string;
    output: string;
    isError?: boolean;
    timestamp: Date;
}

interface TerminalEmulatorProps {
    initialCommands?: CommandOutput[];
    onCommand?: (command: string) => Promise<string>;
    prompt?: string;
    welcomeMessage?: string;
    availableCommands?: Record<string, (args: string[]) => string>;
}

// Default simulated commands for Docker/K8s
const defaultCommands: Record<string, (args: string[]) => string> = {
    help: () => `Available commands:
  docker --help     Show Docker help
  docker ps         List running containers
  docker images     List images
  docker build      Build an image
  kubectl --help    Show Kubernetes help
  kubectl get pods  List pods
  kubectl apply     Apply a configuration
  clear             Clear terminal
  history           Show command history`,

    'docker': (args) => {
        if (args[0] === '--help' || args.length === 0) {
            return `Docker version 24.0.7

Usage:  docker [OPTIONS] COMMAND

Commands:
  ps          List containers
  images      List images
  build       Build an image from a Dockerfile
  run         Run a command in a new container
  stop        Stop running containers
  rm          Remove containers`;
        }
        if (args[0] === 'ps') {
            return `CONTAINER ID   IMAGE          COMMAND       STATUS         PORTS     NAMES
a1b2c3d4e5f6   nginx:latest   "nginx -g"    Up 2 hours     80/tcp    web-server
b2c3d4e5f6a1   redis:alpine   "redis..."    Up 3 hours     6379/tcp  cache`;
        }
        if (args[0] === 'images') {
            return `REPOSITORY   TAG       IMAGE ID       SIZE
nginx        latest    a1b2c3d4e5f6   142MB
redis        alpine    b2c3d4e5f6a1   32MB
python       3.11      c3d4e5f6a1b2   1.02GB`;
        }
        if (args[0] === 'build') {
            return `[+] Building 2.3s (10/10) FINISHED
 => [internal] load build definition from Dockerfile
 => [internal] load .dockerignore
 => [internal] load metadata for docker.io/library/python:3.11
 => [1/5] FROM docker.io/library/python:3.11
 => [2/5] WORKDIR /app
 => [3/5] COPY requirements.txt .
 => [4/5] RUN pip install -r requirements.txt
 => [5/5] COPY . .
 => exporting to image
 => => naming to docker.io/library/myapp:latest`;
        }
        return `docker: unknown command '${args.join(' ')}'`;
    },

    'kubectl': (args) => {
        if (args[0] === '--help' || args.length === 0) {
            return `kubectl controls the Kubernetes cluster manager.

Basic Commands:
  get         Display resources
  apply       Apply a configuration
  delete      Delete resources
  describe    Show details of a resource
  logs        Print container logs`;
        }
        if (args[0] === 'get' && args[1] === 'pods') {
            return `NAME                        READY   STATUS    RESTARTS   AGE
api-server-7d5b8f9c6-x2k4m  1/1     Running   0          2h
worker-5c7d8e9f0-a3b5c      1/1     Running   0          1h
redis-master-0              1/1     Running   0          3h`;
        }
        if (args[0] === 'get' && args[1] === 'services') {
            return `NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP    7d
api-server   ClusterIP   10.96.45.123   <none>        8080/TCP   2h
redis        ClusterIP   10.96.78.234   <none>        6379/TCP   3h`;
        }
        if (args[0] === 'apply') {
            return `deployment.apps/api-server configured
service/api-server configured`;
        }
        return `kubectl: unknown command '${args.join(' ')}'`;
    },

    'ls': () => `Dockerfile  README.md  app.py  requirements.txt  kubernetes/`,
    'pwd': () => `/home/user/project`,
    'whoami': () => `architect`,
    'date': () => new Date().toString(),
    'echo': (args) => args.join(' '),
};

export function TerminalEmulator({
    initialCommands = [],
    onCommand,
    prompt = '$ ',
    welcomeMessage = 'Welcome to LabLudus Terminal. Type "help" for available commands.',
    availableCommands = defaultCommands,
}: TerminalEmulatorProps) {
    const [history, setHistory] = useState<CommandOutput[]>(initialCommands);
    const [currentInput, setCurrentInput] = useState('');
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [history]);

    // Focus input on click
    const focusInput = () => {
        inputRef.current?.focus();
    };

    const executeCommand = async (cmd: string) => {
        const trimmedCmd = cmd.trim();
        if (!trimmedCmd) return;

        const parts = trimmedCmd.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        let output = '';
        let isError = false;

        // Handle special commands
        if (command === 'clear') {
            setHistory([]);
            setCurrentInput('');
            return;
        }

        if (command === 'history') {
            output = history.map((h, i) => `${i + 1}  ${h.command}`).join('\n');
        } else if (onCommand) {
            // Use custom command handler
            try {
                output = await onCommand(trimmedCmd);
            } catch (err) {
                output = `Error: ${err}`;
                isError = true;
            }
        } else if (availableCommands[command]) {
            // Use built-in commands
            output = availableCommands[command](args);
        } else {
            output = `Command not found: ${command}. Type "help" for available commands.`;
            isError = true;
        }

        setHistory(prev => [
            ...prev,
            {
                id: Date.now(),
                command: trimmedCmd,
                output,
                isError,
                timestamp: new Date(),
            },
        ]);
        setCurrentInput('');
        setHistoryIndex(-1);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            executeCommand(currentInput);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const commands = history.filter(h => h.command);
            if (commands.length > 0 && historyIndex < commands.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setCurrentInput(commands[commands.length - 1 - newIndex].command);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                const commands = history.filter(h => h.command);
                setHistoryIndex(newIndex);
                setCurrentInput(commands[commands.length - 1 - newIndex].command);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setCurrentInput('');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Simple tab completion
            const commands = Object.keys(availableCommands);
            const matches = commands.filter(c => c.startsWith(currentInput));
            if (matches.length === 1) {
                setCurrentInput(matches[0] + ' ');
            }
        }
    };

    return (
        <div
            className="bg-[#0a0a0f] rounded-xl border border-gray-800 overflow-hidden font-mono text-sm"
            onClick={focusInput}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-dark-panel border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-neon-cyan" />
                    <span className="text-sm font-medium text-gray-300">Terminal</span>
                </div>
                <button
                    onClick={() => setHistory([])}
                    className="p-1.5 rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-red-400"
                    title="Clear"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Terminal Content */}
            <div
                ref={containerRef}
                className="h-64 overflow-auto p-4 cursor-text"
            >
                {/* Welcome message */}
                {history.length === 0 && (
                    <div className="text-gray-500 mb-2">{welcomeMessage}</div>
                )}

                {/* Command history */}
                <AnimatePresence>
                    {history.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-2"
                        >
                            <div className="flex items-center text-gray-300">
                                <span className="text-neon-cyan">{prompt}</span>
                                <span>{item.command}</span>
                            </div>
                            {item.output && (
                                <pre
                                    className={`mt-1 whitespace-pre-wrap ${item.isError ? 'text-red-400' : 'text-gray-400'
                                        }`}
                                >
                                    {item.output}
                                </pre>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Current input line */}
                <div className="flex items-center text-gray-300">
                    <span className="text-neon-cyan">{prompt}</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent outline-none border-none text-white"
                        autoFocus
                        spellCheck={false}
                    />
                    <span className="w-2 h-5 bg-neon-cyan/50 animate-pulse" />
                </div>
            </div>
        </div>
    );
}
