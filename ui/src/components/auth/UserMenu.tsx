'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useEffect, useState, useRef } from 'react'
import { LogoutButton } from './AuthButtons'

interface UserMenuProps {
    initialUser?: User | null
}

export function UserMenu({ initialUser }: UserMenuProps) {
    const [user, setUser] = useState<User | null>(initialUser || null)
    const [isOpen, setIsOpen] = useState(false)
    const [profile, setProfile] = useState<{ xp: number; level: number } | null>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        // Get initial user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        // Fetch profile data when user is available
        if (user) {
            supabase
                .from('profiles')
                .select('xp, level')
                .eq('id', user.id)
                .single()
                .then(({ data }) => {
                    if (data) setProfile(data)
                })
        }
    }, [user])

    useEffect(() => {
        // Close menu when clicking outside
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!user) return null

    const avatarUrl = user.user_metadata.avatar_url || '/default-avatar.png'
    const displayName = user.user_metadata.full_name || user.email?.split('@')[0] || 'User'

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition"
            >
                <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-8 h-8 rounded-full border-2 border-cyan-500"
                />
                <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-white">{displayName}</span>
                    {profile && (
                        <span className="text-xs text-gray-400">
                            Lvl {profile.level} · {profile.xp} XP
                        </span>
                    )}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{displayName}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                    </div>

                    {profile && (
                        <div className="px-4 py-3 border-b border-gray-700">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Level</span>
                                <span className="text-cyan-400 font-bold">{profile.level}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-400">XP</span>
                                <span className="text-purple-400 font-bold">{profile.xp}</span>
                            </div>
                            <div className="mt-2 bg-gray-800 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all"
                                    style={{ width: `${(profile.xp % 100)}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="px-2 py-2">
                        <a
                            href="/profile"
                            className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition"
                        >
                            👤 Profile
                        </a>
                        <a
                            href="/settings"
                            className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition"
                        >
                            ⚙️ Settings
                        </a>
                    </div>

                    <div className="px-2 py-2 border-t border-gray-700">
                        <LogoutButton className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-lg" />
                    </div>
                </div>
            )}
        </div>
    )
}
