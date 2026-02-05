import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/leaderboard - Get top players
export async function GET(request: Request) {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const timeframe = searchParams.get('timeframe') || 'all' // 'all', 'weekly', 'daily'

    let query = supabase
        .from('profiles')
        .select('id, full_name, avatar_url, xp, level, total_missions_completed')
        .order('xp', { ascending: false })
        .limit(limit)

    // For weekly/daily, we'd need to track XP changes over time
    // For MVP, just return all-time rankings

    const { data: leaderboard, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Add rank to each entry
    const rankedLeaderboard = leaderboard?.map((player, index) => ({
        ...player,
        rank: index + 1,
    }))

    return NextResponse.json({ leaderboard: rankedLeaderboard })
}
