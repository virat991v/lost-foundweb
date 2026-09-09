import { supabase } from '../../lib/supabase'

export const adminService = {
  // ── Stats ──────────────────────────────────────────────────
  async getDashboardStats() {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [lostResult, foundResult, claimsResult, returnedResult] = await Promise.all([
      supabase.from('lost_items').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
      supabase.from('found_items').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
      supabase.from('claims').select('*', { count: 'exact', head: true }).eq('status', 'under_verification'),
      supabase.from('returns').select('*', { count: 'exact', head: true }),
    ])

    const totalReports = (lostResult.count ?? 0) + (foundResult.count ?? 0)
    const activeCases = lostResult.count ?? 0
    const returned = returnedResult.count ?? 0
    const resolutionRate = totalReports > 0 ? Math.round((returned / totalReports) * 100) : 0

    return {
      totalReports,
      activeCases,
      resolutionRate,
      pendingVerifications: claimsResult.count ?? 0,
    }
  },

  // ── Users ──────────────────────────────────────────────────
  async getUsers({ page = 1, role, status, search, limit = 20 } = {}) {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (role) query = query.eq('role', role)
    if (status) query = query.eq('account_status', status)
    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query
    if (error) throw error
    return { data, count }
  },

  async updateUserStatus(userId, accountStatus) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ account_status: accountStatus })
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateUserRole(userId, role) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateTrustScore(userId, trustScore) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ trust_score: trustScore })
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // ── Reports ────────────────────────────────────────────────
  async getAllReports({ page = 1, type, status, search, limit = 20 } = {}) {
    const lostQuery = supabase
      .from('lost_items')
      .select('*, profiles(id, full_name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })

    const foundQuery = supabase
      .from('found_items')
      .select('*, profiles(id, full_name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (status) {
      lostQuery.eq('status', status)
      foundQuery.eq('status', status)
    }
    if (search) {
      lostQuery.or(`title.ilike.%${search}%`)
      foundQuery.or(`title.ilike.%${search}%`)
    }

    const [lostResult, foundResult] = await Promise.all([
      type === 'found' ? { data: [], count: 0 } : lostQuery,
      type === 'lost' ? { data: [], count: 0 } : foundQuery,
    ])

    const allItems = [
      ...(lostResult.data ?? []).map((i) => ({ ...i, report_type: 'lost' })),
      ...(foundResult.data ?? []).map((i) => ({ ...i, report_type: 'found' })),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const total = (lostResult.count ?? 0) + (foundResult.count ?? 0)
    const from = (page - 1) * limit
    return { data: allItems.slice(from, from + limit), count: total }
  },

  // ── Claims ─────────────────────────────────────────────────
  async getAllClaims({ page = 1, status, limit = 20 } = {}) {
    let query = supabase
      .from('claims')
      .select('*, profiles!claims_claimant_id_fkey(id, full_name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query
    if (error) throw error
    return { data, count }
  },

  async approveClaim(claimId, adminId, notes) {
    const { data, error } = await supabase
      .from('claims')
      .update({
        status: 'approved',
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
        admin_notes: notes,
      })
      .eq('id', claimId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async rejectClaim(claimId, adminId, notes) {
    const { data, error } = await supabase
      .from('claims')
      .update({
        status: 'rejected',
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
        admin_notes: notes,
      })
      .eq('id', claimId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // ── Flags ──────────────────────────────────────────────────
  async getFlags({ page = 1, status, limit = 20 } = {}) {
    let query = supabase
      .from('flags')
      .select('*, profiles!flags_reporter_id_fkey(id, full_name)', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query
    if (error) throw error
    return { data, count }
  },

  async resolveFlag(flagId, adminId, status = 'resolved') {
    const { data, error } = await supabase
      .from('flags')
      .update({
        status,
        resolved_by: adminId,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', flagId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // ── Activity Logs ──────────────────────────────────────────
  async getActivityLogs({ page = 1, limit = 30 } = {}) {
    const from = (page - 1) * limit
    const { data, error, count } = await supabase
      .from('activity_logs')
      .select('*, profiles(id, full_name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1)
    if (error) throw error
    return { data, count }
  },

  async logActivity(actorId, action, targetType, targetId, metadata) {
    const { error } = await supabase.from('activity_logs').insert({
      actor_id: actorId,
      action,
      target_type: targetType,
      target_id: targetId,
      metadata,
    })
    if (error) console.error('Failed to log activity:', error)
  },

  // ── Quick Operations ───────────────────────────────────────
  async exportClaimsCSV() {
    const { data, error } = await supabase
      .from('claims')
      .select('*, profiles!claims_claimant_id_fkey(full_name, email)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
}
