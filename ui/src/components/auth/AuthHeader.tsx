'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { LoginButton } from './AuthButtons'
import { UserMenu } from './UserMenu'

/**
 * AuthHeader - Shows login button or user menu based on auth state
 * Use this in navigation headers
 */
export function AuthHeader() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        // Get initial user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return (
            <div className="px-4 py-2 rounded-lg bg-dark-panel border border-gray-700 animate-pulse">
                <span className="text-gray-500">Loading...</span>
            </div>
        )
    }

    if (user) {
        return <UserMenu initialUser={user} />
    }

    return <LoginButton variant="outline" />
}
