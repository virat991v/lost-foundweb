import { useState, useEffect, useCallback } from 'react'
import { lostItemsService } from '../services/items/lostItemsService'
import { foundItemsService } from '../services/items/foundItemsService'

export function useItems({ type = 'lost', userId, page = 1, filters = {} } = {}) {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const service = type === 'found' ? foundItemsService : lostItemsService

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (userId) {
        const data = await service.getByUser(userId)
        setItems(data ?? [])
        setCount(data?.length ?? 0)
      } else {
        const res = await service.getAll({ page, ...filters })
        setItems(res.data ?? [])
        setCount(res.count ?? 0)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [type, userId, page, JSON.stringify(filters)]) // eslint-disable-line

  useEffect(() => { load() }, [load])

  return { items, count, loading, error, refetch: load }
}
