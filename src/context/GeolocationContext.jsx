import { createContext, useState, useEffect } from 'react'

export const GeolocationContext = createContext(null)

const KIGALI_DEFAULT = { lat: -1.9441, lng: 30.0619 }

export function GeolocationProvider({ children }) {
  const [coords,       setCoords]       = useState(null)
  const [status,       setStatus]       = useState('loading')
  const [manualSector, setManualSector] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) { setStatus('denied'); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus('success')
      },
      () => setStatus('denied'),
      { enableHighAccuracy: false, timeout: 8000 }
    )
  }, [])

  const effectiveCoords = coords ?? manualSector ?? KIGALI_DEFAULT

  return (
    <GeolocationContext.Provider value={{ coords, status, effectiveCoords, setManualSector }}>
      {children}
    </GeolocationContext.Provider>
  )
}
