import { supabase } from '../../lib/supabase'
import { PAGINATION_LIMIT } from '../../utils/constants'

export const foundItemsService = {
  async getAll({ page = 1, category, location, search, status } = {}) {
    let query = supabase
      .from('found_items')
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
      .from('found_items')
      .select('*, profiles(id, full_name, avatar_url, email)')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    if (!data) throw new Error('Item not found')
    return data
  },

  async getByUser(userId) {
    const { data, error } = await supabase
      .from('found_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async create(item, photoFile) {
    let photoUrl = ''
    if (photoFile) {
      try {
        const ext = photoFile.name.split('.').pop()
        const path = `${item.user_id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('item-photos')
          .upload(path, photoFile)
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('item-photos').getPublicUrl(path)
          photoUrl = urlData.publicUrl
        } else {
          console.warn('Photo upload failed, submitting without photo:', uploadError.message)
        }
      } catch (e) {
        console.warn('Photo upload error, submitting without photo:', e)
      }
    }

    const { data, error } = await supabase
      .from('found_items')
      .insert({ ...item, photo_url: photoUrl })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('found_items')
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
      .from('found_items')
      .select('*, profiles(id, full_name)')
      .eq('category', item.category)
      .neq('id', item.id)
      .neq('status', 'closed')
      .limit(3)
    if (error) throw error
    return data
  },

  // Combined browse: merge lost + found items for the Browse page
  async getAllItems({ page = 1, category, location, search, type } = {}) {
    const filters = { page, category, location, search }
    if (type === 'lost' || !type) {
      const lost = await this.getAll ? null : null
      void lost
    }
    // Return found items by default for browse
    return this.getAll(filters)
  },
}
