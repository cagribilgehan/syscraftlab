'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    User,
    Bell,
    Volume2,
    VolumeX,
    Moon,
    Globe,
    Shield,
    Save,
    Camera,
    Check,
    ChevronRight,
    LogOut,
    Trash2
} from 'lucide-react';
import Link from 'next/link';

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            className={`relative w-14 h-7 rounded-full transition-all ${enabled ? 'bg-neon-cyan' : 'bg-gray-700'
                }`}
        >
            <motion.div
                animate={{ x: enabled ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
            />
        </button>
    );
}

// Settings Section Component
function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-8">
            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">{title}</h3>
            <div className="bg-dark-panel rounded-xl border border-gray-700 divide-y divide-gray-700">
                {children}
            </div>
        </div>
    );
}

// Settings Row Component
function SettingsRow({
    icon: Icon,
    label,
    description,
    children,
    onClick,
    danger = false
}: {
    icon: React.ElementType;
    label: string;
    description?: string;
    children?: React.ReactNode;
    onClick?: () => void;
    danger?: boolean;
}) {
    const Wrapper = onClick ? 'button' : 'div';
    return (
        <Wrapper
            onClick={onClick}
            className={`w-full p-4 flex items-center gap-4 ${onClick ? 'hover:bg-dark-bg/50 transition-colors cursor-pointer' : ''}`}
        >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${danger ? 'bg-red-500/10' : 'bg-neon-cyan/10'
                }`}>
                <Icon className={`w-5 h-5 ${danger ? 'text-red-400' : 'text-neon-cyan'}`} />
            </div>
            <div className="flex-1 text-left">
                <div className={`font-medium ${danger ? 'text-red-400' : 'text-white'}`}>{label}</div>
                {description && <div className="text-sm text-gray-500">{description}</div>}
            </div>
            {children}
            {onClick && !children && <ChevronRight className="w-5 h-5 text-gray-500" />}
        </Wrapper>
    );
}

// Avatar Selection Component
function AvatarSelector({ selected, onSelect }: { selected: number; onSelect: (id: number) => void }) {
    const avatars = [
        { id: 1, color: 'from-neon-cyan to-blue-500' },
        { id: 2, color: 'from-neon-purple to-pink-500' },
        { id: 3, color: 'from-green-500 to-emerald-500' },
        { id: 4, color: 'from-yellow-500 to-orange-500' },
        { id: 5, color: 'from-red-500 to-rose-500' },
        { id: 6, color: 'from-gray-500 to-gray-700' },
    ];

    return (
        <div className="grid grid-cols-6 gap-3">
            {avatars.map((avatar) => (
                <button
                    key={avatar.id}
                    onClick={() => onSelect(avatar.id)}
                    className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center ${selected === avatar.id ? 'ring-2 ring-neon-cyan ring-offset-2 ring-offset-dark-bg' : ''
                        }`}
                >
                    <User className="w-6 h-6 text-white/80" />
                    {selected === avatar.id && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-neon-cyan flex items-center justify-center">
                            <Check className="w-3 h-3 text-dark-bg" />
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        soundEnabled: true,
        notificationsEnabled: true,
        emailUpdates: false,
        darkMode: true,
        language: 'en',
        selectedAvatar: 1,
        callsign: 'architect_neo'
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/80 backdrop-blur-lg border-b border-gray-800">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/profile" className="p-2 hover:bg-dark-panel rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                        </Link>
                        <h1 className="text-xl font-display font-bold">Settings</h1>
                    </div>
                    <motion.button
                        onClick={handleSave}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-neon-cyan text-dark-bg font-bold flex items-center gap-2"
                    >
                        {isSaving ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full"
                            />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save'}
                    </motion.button>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 pb-12 px-4">
                <div className="max-w-2xl mx-auto">

                    {/* Profile Section */}
                    <SettingsSection title="Profile">
                        <div className="p-6">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="relative">
                                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center`}>
                                        <User className="w-10 h-10 text-white/80" />
                                    </div>
                                    <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-dark-panel border border-gray-600 flex items-center justify-center hover:border-neon-cyan transition-colors">
                                        <Camera className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-mono text-gray-500 uppercase">Callsign</label>
                                    <input
                                        type="text"
                                        value={settings.callsign}
                                        onChange={(e) => setSettings({ ...settings, callsign: e.target.value })}
                                        className="w-full mt-1 px-4 py-2 rounded-lg bg-dark-bg border border-gray-700 focus:border-neon-cyan focus:outline-none font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-mono text-gray-500 uppercase mb-3 block">Choose Avatar</label>
                                <AvatarSelector
                                    selected={settings.selectedAvatar}
                                    onSelect={(id) => setSettings({ ...settings, selectedAvatar: id })}
                                />
                            </div>
                        </div>
                    </SettingsSection>

                    {/* Sound & Notifications */}
                    <SettingsSection title="Sound & Notifications">
                        <SettingsRow
                            icon={settings.soundEnabled ? Volume2 : VolumeX}
                            label="Sound Effects"
                            description="Play sounds on actions"
                        >
                            <ToggleSwitch
                                enabled={settings.soundEnabled}
                                onChange={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                            />
                        </SettingsRow>
                        <SettingsRow
                            icon={Bell}
                            label="Push Notifications"
                            description="Get notified about new missions"
                        >
                            <ToggleSwitch
                                enabled={settings.notificationsEnabled}
                                onChange={() => setSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled })}
                            />
                        </SettingsRow>
                        <SettingsRow
                            icon={Bell}
                            label="Email Updates"
                            description="Weekly progress reports"
                        >
                            <ToggleSwitch
                                enabled={settings.emailUpdates}
                                onChange={() => setSettings({ ...settings, emailUpdates: !settings.emailUpdates })}
                            />
                        </SettingsRow>
                    </SettingsSection>

                    {/* Appearance */}
                    <SettingsSection title="Appearance">
                        <SettingsRow
                            icon={Moon}
                            label="Dark Mode"
                            description="Always enabled for Cyberpunk aesthetic"
                        >
                            <ToggleSwitch
                                enabled={settings.darkMode}
                                onChange={() => { }} // Always dark
                            />
                        </SettingsRow>
                    </SettingsSection>

                    {/* Security */}
                    <SettingsSection title="Security">
                        <SettingsRow
                            icon={Shield}
                            label="Change Password"
                            onClick={() => { }}
                        />
                        <SettingsRow
                            icon={Shield}
                            label="Two-Factor Authentication"
                            description="Not enabled"
                            onClick={() => { }}
                        />
                    </SettingsSection>

                    {/* Danger Zone */}
                    <SettingsSection title="Danger Zone">
                        <SettingsRow
                            icon={LogOut}
                            label="Log Out"
                            danger
                            onClick={() => { }}
                        />
                        <SettingsRow
                            icon={Trash2}
                            label="Delete Account"
                            description="This action cannot be undone"
                            danger
                            onClick={() => { }}
                        />
                    </SettingsSection>

                </div>
            </main>
        </div>
    );
}
