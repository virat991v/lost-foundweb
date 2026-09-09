import { supabase } from '../../lib/supabase'
import { PAGINATION_LIMIT } from '../../utils/constants'

export const lostItemsService = {
  async getAll({ page = 1, category, location, search, status } = {}) {
    let query = supabase
      .from('lost_items')
      .select('*, profiles(id, full_name, avatar_url)', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (location) query = query.eq('campus_location', location)
    if (status) query = query.eq('status', status)
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const from = (page - 1) * PAGINATION_LIMIT
    const to = from + PAGINATION_LIMIT - 1
    query = query.range(from, to)

    const { data, error, count } = await query
    if (error) throw error
    return { data, count }
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('lost_items')
      .select('*, profiles(id, full_name, avatar_url, email)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async getByUser(userId) {
    const { data, error } = await supabase
      .from('lost_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async create(item, photoFile) {
    let photoUrl = ''
    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const path = `${item.user_id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('item-photos')
        .upload(path, photoFile)
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('item-photos').getPublicUrl(path)
      photoUrl = data.publicUrl
    }

    const { data, error } = await supabase
      .from('lost_items')
      .insert({ ...item, photo_url: photoUrl })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('lost_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateStatus(id, status) {
    return this.update(id, { status })
  },

  async getSimilar(item) {
    const { data, error } = await supabase
      .from('lost_items')
      .select('*, profiles(id, full_name)')
      .eq('category', item.category)
      .neq('id', item.id)
      .neq('status', 'closed')
      .limit(3)
    if (error) throw error
    return data
  },
}
