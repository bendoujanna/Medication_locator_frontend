import { useEffect, useRef, useState } from 'react'
export function usePolling(fetchFn, intervalMs = 30000, deps = []) {
  const [data,  setData]  = useState(null)
  const [error, setError] = useState(null)
  const ref = useRef(fetchFn)
  ref.current = fetchFn
  useEffect(() => {
    let cancelled = false
    async function tick() {
      try {
        const r = await ref.current()
        if (!cancelled) { setData(r); setError(null) }
      } catch(e) {
        if (!cancelled) setError(e)
      }
    }
    tick()
    const id = setInterval(tick, intervalMs)
    return () => { cancelled = true; clearInterval(id) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return { data, error }
}
