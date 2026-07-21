import { useContext } from 'react'
import { GeolocationContext } from '../context/GeolocationContext'
export function useGeolocation() {
  return useContext(GeolocationContext)
}