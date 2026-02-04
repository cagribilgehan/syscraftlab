'use client';

import { useState } from 'react';
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
    Target
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import for Monaco Editor (client-side only)
const MonacoEditor = dynamic(
    () => import('@monaco-editor/react'),
    { ssr: false }
);

// Mission Data
const currentMission = {
    id: '1.1',
    title: 'The Broken Report',
    zone: 'Zone 1: The Foundation',
    description: `The ReportService class has multiple responsibilities. 
It generates sales reports, formats PDFs, and sends emails.

This is a Single Responsibility Principle (SRP) violation.

Your mission: Split this class appropriately.`,
    xp: 100,
    timeLimit: 600, // 10 minutes
    hints: [
        'Each class should only have one reason to change.',
        'Report generation, formatting, and distribution are different responsibilities.',
        'Consider creating three separate classes: Generator, Formatter, Distributor'
    ]
};

const initialCode = `# report_service.py
# SRP VIOLATION - Fix this class!

class ReportService:
    """
    This class handles too many responsibilities:
    1. Calculate sales data
    2. Format PDF
    3. Send email
    
    TODO: Refactor according to Single Responsibility Principle!
    """
    
    def generate_sales_data(self, start_date, end_date):
        # Fetch sales data from database
        sales = self.fetch_from_db(start_date, end_date)
        # Calculate totals
        total = sum(s.amount for s in sales)
        return {"total": total, "items": sales}
    
    def format_as_pdf(self, data):
        # PDF generation logic
        pdf = PDFDocument()
        pdf.add_title("Sales Report")
        pdf.add_table(data)
        return pdf.render()
    
    def send_via_email(self, pdf, recipients):
        # Email sending logic
        email = Email()
        email.attach(pdf)
        email.send_to(recipients)
        return True
    
    def fetch_from_db(self, start, end):
        # Simulated database call
        return []

# ============= YOUR SOLUTION HERE =============
# Refactor the class above according to SRP
# Split into multiple classes
# ==============================================

`;

const testResults = [
    { name: 'test_srp_compliance', status: 'pending', message: 'Single responsibility check' },
    { name: 'test_generator_class', status: 'pending', message: 'SalesReportGenerator class exists?' },
    { name: 'test_formatter_class', status: 'pending', message: 'ReportFormatter class exists?' },
    { name: 'test_distributor_class', status: 'pending', message: 'ReportDistributor class exists?' },
    { name: 'test_no_cross_dependencies', status: 'pending', message: 'No cross-dependencies?' },
];

// Test Result Item Component
function TestResult({ name, status, message }: { name: string; status: string; message: string }) {
    const icons = {
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
                    'bg-dark-panel border border-gray-700'
                }`}
        >
            {icons[status as keyof typeof icons]}
            <div className="flex-1">
                <code className="text-sm font-mono text-gray-300">{name}</code>
                <p className="text-xs text-gray-500">{message}</p>
            </div>
        </motion.div>
    );
}

// Main Game Page
export default function GamePage() {
    const [code, setCode] = useState(initialCode);
    const [tests, setTests] = useState(testResults);
    const [isRunning, setIsRunning] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [hintIndex, setHintIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(currentMission.timeLimit);

    // Simulate running tests
    const runTests = async () => {
        setIsRunning(true);

        // Simulate test execution
        for (let i = 0; i < tests.length; i++) {
            await new Promise(r => setTimeout(r, 500));
            setTests(prev => prev.map((t, idx) =>
                idx === i ? { ...t, status: 'running' } : t
            ));

            await new Promise(r => setTimeout(r, 800));

            // Check if code contains expected patterns
            const hasSalesGenerator = code.includes('SalesReportGenerator') || code.includes('ReportGenerator');
            const hasFormatter = code.includes('Formatter') || code.includes('PdfFormatter');
            const hasDistributor = code.includes('Distributor') || code.includes('EmailSender');

            let passed = false;
            if (i === 0) passed = hasSalesGenerator && hasFormatter && hasDistributor;
            if (i === 1) passed = hasSalesGenerator;
            if (i === 2) passed = hasFormatter;
            if (i === 3) passed = hasDistributor;
            if (i === 4) passed = hasSalesGenerator && hasFormatter;

            setTests(prev => prev.map((t, idx) =>
                idx === i ? { ...t, status: passed ? 'passed' : 'failed' } : t
            ));
        }

        setIsRunning(false);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col">
            {/* Top Bar */}
            <header className="h-14 bg-dark-panel border-b border-gray-800 flex items-center px-4 justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-dark-bg rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <div className="h-6 w-px bg-gray-700" />
                    <div>
                        <p className="text-xs text-neon-cyan font-mono">{currentMission.zone}</p>
                        <h1 className="text-sm font-semibold">Mission {currentMission.id}: {currentMission.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Timer */}
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                    </div>

                    {/* XP Reward */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/30">
                        <Trophy className="w-4 h-4 text-neon-purple" />
                        <span className="text-sm font-semibold text-neon-purple">+{currentMission.xp} XP</span>
                    </div>
                </div>
            </header>

            {/* Main Content - 3 Column Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Story/Mission Brief */}
                <div className="w-[300px] border-r border-gray-800 bg-dark-panel overflow-y-auto">
                    <div className="p-4">
                        {/* Commander Avatar */}
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                                <span className="text-xl">👾</span>
                            </div>
                            <div>
                                <p className="font-semibold">Commander Eve</p>
                                <p className="text-xs text-gray-400">Mission Briefing</p>
                            </div>
                        </div>

                        {/* Mission Description */}
                        <div className="mb-6">
                            <h3 className="text-lg font-display font-bold mb-3 flex items-center gap-2">
                                <Target className="w-5 h-5 text-neon-cyan" />
                                Mission
                            </h3>
                            <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                                {currentMission.description}
                            </div>
                        </div>

                        {/* Hint Section */}
                        <div className="mb-4">
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors"
                            >
                                <Lightbulb className="w-4 h-4" />
                                <span className="text-sm font-medium">AI Hint ({hintIndex + 1}/{currentMission.hints.length})</span>
                            </button>

                            <AnimatePresence>
                                {showHint && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30"
                                    >
                                        <p className="text-sm text-yellow-200">{currentMission.hints[hintIndex]}</p>
                                        {hintIndex < currentMission.hints.length - 1 && (
                                            <button
                                                onClick={() => setHintIndex(prev => prev + 1)}
                                                className="mt-2 text-xs text-yellow-500 hover:underline"
                                            >
                                                Next hint →
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Documentation Link */}
                        <button className="flex items-center gap-2 text-neon-cyan hover:text-neon-cyan/80 transition-colors">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-sm">SOLID Principles Docs</span>
                        </button>
                    </div>
                </div>

                {/* Center Panel - Code Editor */}
                <div className="flex-1 flex flex-col">
                    <div className="h-10 bg-dark-panel border-b border-gray-800 flex items-center px-4 justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-500">report_service.py</span>
                        </div>
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

                    <div className="flex-1 monaco-wrapper m-2">
                        <MonacoEditor
                            height="100%"
                            defaultLanguage="python"
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: 'JetBrains Mono, monospace',
                                padding: { top: 16 },
                                scrollBeyondLastLine: false,
                                lineNumbers: 'on',
                                glyphMargin: false,
                                folding: true,
                                lineDecorationsWidth: 10,
                                renderLineHighlight: 'line',
                            }}
                        />
                    </div>
                </div>

                {/* Right Panel - Test Results */}
                <div className="w-[320px] border-l border-gray-800 bg-dark-panel overflow-y-auto">
                    <div className="p-4">
                        <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-neon-cyan" />
                            Test Results
                        </h3>

                        <div className="space-y-3">
                            {tests.map((test, idx) => (
                                <TestResult key={idx} {...test} />
                            ))}
                        </div>

                        {/* Success Message */}
                        {tests.every(t => t.status === 'passed') && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-6 p-4 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/50 text-center"
                            >
                                <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                                <h4 className="text-xl font-display font-bold text-neon-cyan mb-2">
                                    Mission Complete!
                                </h4>
                                <p className="text-sm text-gray-300 mb-4">
                                    You successfully applied the SRP principle.
                                </p>
                                <div className="flex items-center justify-center gap-2 text-neon-purple font-bold">
                                    <Trophy className="w-5 h-5" />
                                    +{currentMission.xp} XP Earned
                                </div>
                                <button className="mt-4 w-full py-3 rounded-lg btn-primary flex items-center justify-center gap-2">
                                    Next Mission <ChevronRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
