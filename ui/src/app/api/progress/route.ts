import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/progress - Get user's mission progress
export async function GET() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: progress, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ progress })
}

// POST /api/progress - Save mission completion
export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { missionId, zoneId, completed, stars, xpEarned, timeSpentSeconds } = body

    if (!missionId || zoneId === undefined) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upsert progress
    const { data: progress, error } = await supabase
        .from('progress')
        .upsert({
            user_id: user.id,
            mission_id: missionId,
            zone_id: zoneId,
            completed: completed ?? false,
            stars: stars ?? 0,
            xp_earned: xpEarned ?? 0,
            time_spent_seconds: timeSpentSeconds ?? 0,
            completed_at: completed ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id,mission_id',
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If mission completed, add XP to profile
    if (completed && xpEarned) {
        const { data: xpResult } = await supabase.rpc('add_xp', {
            p_user_id: user.id,
            p_xp: xpEarned,
        })

        // Update total missions completed
        await supabase
            .from('profiles')
            .update({
                total_missions_completed: supabase.rpc('count', { table: 'progress', column: 'completed', value: true }),
                last_active_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        return NextResponse.json({
            progress,
            xpResult: xpResult?.[0],
        })
    }

    return NextResponse.json({ progress })
}
