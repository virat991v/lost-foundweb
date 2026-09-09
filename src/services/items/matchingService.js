import { supabase } from '../../lib/supabase'

// Simple keyword + category matching algorithm
export const matchingService = {
  /**
   * Find potential found-item matches for a given lost item.
   * Scores based on: same category (40pts), color overlap (20pts), keyword overlap (40pts)
   */
  async findMatchesForLostItem(lostItem) {
    const { data: foundItems, error } = await supabase
      .from('found_items')
      .select('*')
      .eq('category', lostItem.category)
      .eq('status', 'active')

    if (error) throw error
    if (!foundItems?.length) return []

    const scored = foundItems.map((fi) => {
      let score = 0

      // Category match — already filtered, so full points
      score += 40

      // Color match
      if (
        lostItem.color &&
        fi.color &&
        lostItem.color.toLowerCase() === fi.color.toLowerCase()
      ) {
        score += 20
      }

      // Keyword match on title/description
      const lostWords = tokenize(lostItem.title + ' ' + lostItem.description)
      const foundWords = tokenize(fi.title + ' ' + fi.description)
      const overlap = lostWords.filter((w) => foundWords.includes(w)).length
      const keywordScore = Math.min(40, Math.round((overlap / Math.max(lostWords.length, 1)) * 80))
      score += keywordScore

      return { ...fi, match_score: score }
    })

    // Return items with score > 40, sorted descending
    return scored
      .filter((fi) => fi.match_score > 40)
      .sort((a, b) => b.match_score - a.match_score)
  },

  async createMatch(lostItemId, foundItemId, score, reason) {
    const { data, error } = await supabase
      .from('matches')
      .upsert(
        {
          lost_item_id: lostItemId,
          found_item_id: foundItemId,
          match_score: score,
          match_reason: reason,
          status: 'potential',
        },
        { onConflict: 'lost_item_id,found_item_id' }
      )
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getMatchesForItem(itemId, itemType = 'lost') {
    const column = itemType === 'lost' ? 'lost_item_id' : 'found_item_id'
    const joinTable = itemType === 'lost' ? 'found_items(*)' : 'lost_items(*)'
    const { data, error } = await supabase
      .from('matches')
      .select(`*, ${joinTable}`)
      .eq(column, itemId)
      .order('match_score', { ascending: false })
    if (error) throw error
    return data
  },

  async confirmMatch(matchId) {
    const { data, error } = await supabase
      .from('matches')
      .update({ status: 'confirmed' })
      .eq('id', matchId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async rejectMatch(matchId) {
    const { data, error } = await supabase
      .from('matches')
      .update({ status: 'rejected' })
      .eq('id', matchId)
      .select()
      .single()
    if (error) throw error
    return data
  },
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3)
}
