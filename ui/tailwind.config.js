/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Dark Mode: Command Center
                dark: {
                    bg: '#0a0e17',
                    panel: '#151b2b',
                    accent: '#00d4ff',
                    accent2: '#7c3aed',
                    text: '#e2e8f0',
                    success: '#10b981',
                    danger: '#ef4444',
                    warning: '#f59e0b',
                },
                // Light Mode: Blueprint
                light: {
                    bg: '#f8fafc',
                    panel: '#e2e8f0',
                    accent: '#1e3a5f',
                    accent2: '#2563eb',
                    text: '#1e293b',
                    grid: '#cbd5e1',
                },
                // Neon colors for cyberpunk theme
                neon: {
                    cyan: '#00d4ff',
                    purple: '#7c3aed',
                    pink: '#ec4899',
                    green: '#10b981',
                }
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
                display: ['Orbitron', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'scan': 'scan 2s linear infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff' },
                    '100%': { boxShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff' },
                },
                scan: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                }
            },
            backgroundImage: {
                'grid-pattern': 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                'cyber-gradient': 'linear-gradient(135deg, #0a0e17 0%, #151b2b 50%, #1e1b4b 100%)',
            }
        },
    },
    plugins: [],
};
