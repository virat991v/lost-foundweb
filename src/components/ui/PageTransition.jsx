import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Wraps page content with a smooth fade+slide entrance animation
 * on every route change. Uses CSS classes only — no deps.
 */
export default function PageTransition({ children }) {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionState, setTransitionState] = useState('entered')
  const timeoutRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setDisplayChildren(children)
      return
    }

    // Exit current page
    setTransitionState('exiting')
    timeoutRef.current = setTimeout(() => {
      setDisplayChildren(children)
      setTransitionState('entering')
      timeoutRef.current = setTimeout(() => {
        setTransitionState('entered')
      }, 350)
    }, 150)

    return () => clearTimeout(timeoutRef.current)
  }, [location.pathname]) // eslint-disable-line

  const styles = {
    exiting: {
      opacity: 0,
      transform: 'translateY(8px) scale(0.99)',
      pointerEvents: 'none',
    },
    entering: {
      opacity: 0,
      transform: 'translateY(10px) scale(0.99)',
      pointerEvents: 'none',
    },
    entered: {
      opacity: 1,
      transform: 'translateY(0) scale(1)',
    },
  }

  return (
    <div
      style={{
        ...styles[transitionState],
        transition: 'opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        willChange: 'opacity, transform',
        minHeight: '100%',
      }}
    >
      {displayChildren}
    </div>
  )
}
