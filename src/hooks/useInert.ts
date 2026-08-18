import { useEffect, useRef } from 'react'

/**
 * Returns a ref to attach to a container element.
 * When `active` is true, sets the `inert` attribute on that element,
 * preventing focus/interaction for keyboard and screen reader users.
 */
export function useInert<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current) return
    if (active) {
      ref.current.setAttribute('inert', '')
    } else {
      ref.current.removeAttribute('inert')
    }
  }, [active])

  return ref
}
