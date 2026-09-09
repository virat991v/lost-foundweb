import { useState, useEffect, useCallback } from 'react'
import { claimsService } from '../services/claims/claimsService'

export function useClaims({ userId, claimId } = {}) {
  const [claims, setClaims] = useState([])
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (claimId) {
        const data = await claimsService.getById(claimId)
        setClaim(data)
      } else if (userId) {
        const data = await claimsService.getByUser(userId)
        setClaims(data ?? [])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId, claimId])

  useEffect(() => { load() }, [load])

  return { claims, claim, loading, error, refetch: load }
}
