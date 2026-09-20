import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 to `end` over `duration` ms.
 * Respects prefers-reduced-motion by returning the final value immediately.
 */
export default function useCountUp(end, duration = 1000, decimals = 0) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    // Respect reduced-motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setValue(end)
      return
    }

    // Parse the numeric part from strings like "42%" or "3.14"
    const numericEnd = parseFloat(String(end).replace(/[^0-9.]/g, '')) || 0
    const suffix = String(end).replace(/[0-9.]/g, '')

    if (numericEnd === 0) {
      setValue(end)
      return
    }

    const start = performance.now()
    setValue(0)

    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = eased * numericEnd

      setValue(
        decimals > 0
          ? current.toFixed(decimals) + suffix
          : Math.floor(current) + suffix
      )

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setValue(end)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [end, duration, decimals])

  return value
}
