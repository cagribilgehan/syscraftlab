import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/profile - Get current user profile
export async function GET() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get progress stats
    const { data: progressStats } = await supabase
        .from('progress')
        .select('zone_id, completed, stars')
        .eq('user_id', user.id)

    const stats = {
        totalMissions: progressStats?.length || 0,
        completedMissions: progressStats?.filter(p => p.completed).length || 0,
        totalStars: progressStats?.reduce((acc, p) => acc + (p.stars || 0), 0) || 0,
        zoneProgress: {} as Record<number, { completed: number; total: number }>,
    }

    // Calculate per-zone progress
    progressStats?.forEach(p => {
        if (!stats.zoneProgress[p.zone_id]) {
            stats.zoneProgress[p.zone_id] = { completed: 0, total: 0 }
        }
        stats.zoneProgress[p.zone_id].total++
        if (p.completed) stats.zoneProgress[p.zone_id].completed++
    })

    return NextResponse.json({ profile, stats })
}

// PATCH /api/profile - Update user profile
export async function PATCH(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const allowedFields = ['full_name', 'avatar_url']
    const updates: Record<string, unknown> = {}

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            updates[field] = body[field]
        }
    }

    if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    updates.updated_at = new Date().toISOString()

    const { data: profile, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile })
}
