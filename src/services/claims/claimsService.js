import { supabase } from '../../lib/supabase'

export const claimsService = {
  async create(claim) {
    const { data, error } = await supabase
      .from('claims')
      .insert(claim)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('claims')
      .select(`
        *,
        profiles!claims_claimant_id_fkey(id, full_name, email, avatar_url)
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async getByUser(userId) {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('claimant_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getAll({ page = 1, status, limit = 20 } = {}) {
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

  async submitVerification(claimId, verificationResponse, proofFile, userId) {
    let proofUrl = null
    if (proofFile) {
      const ext = proofFile.name.split('.').pop()
      const path = `${userId}/${claimId}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('proof-documents')
        .upload(path, proofFile, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('proof-documents').getPublicUrl(path)
      proofUrl = data.publicUrl
    }

    const { data, error } = await supabase
      .from('claims')
      .update({
        verification_response: verificationResponse,
        proof_url: proofUrl,
        status: 'under_verification',
      })
      .eq('id', claimId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateStatus(claimId, status, adminNotes, reviewedBy) {
    const updates = {
      status,
      reviewed_at: new Date().toISOString(),
    }
    if (adminNotes) updates.admin_notes = adminNotes
    if (reviewedBy) updates.reviewed_by = reviewedBy

    const { data, error } = await supabase
      .from('claims')
      .update(updates)
      .eq('id', claimId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async cancel(claimId) {
    return this.updateStatus(claimId, 'cancelled')
  },

  async createReturn(claimId) {
    const { data, error } = await supabase
      .from('returns')
      .insert({ claim_id: claimId })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async confirmReturn(returnId, role) {
    const field = role === 'owner' ? 'owner_confirmed' : 'finder_confirmed'
    const timeField = role === 'owner' ? 'owner_confirmed_at' : 'finder_confirmed_at'
    const { data, error } = await supabase
      .from('returns')
      .update({ [field]: true, [timeField]: new Date().toISOString() })
      .eq('id', returnId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async submitRating(returnId, rating, feedback) {
    const { data, error } = await supabase
      .from('returns')
      .update({ rating, feedback })
      .eq('id', returnId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getReturn(claimId) {
    const { data, error } = await supabase
      .from('returns')
      .select('*')
      .eq('claim_id', claimId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async revealContact(claimId, userId) {
    const { data, error } = await supabase
      .from('contact_disclosures')
      .insert({ claim_id: claimId, disclosed_by: userId })
      .select()
      .single()
    if (error) throw error
    return data
  },
}
