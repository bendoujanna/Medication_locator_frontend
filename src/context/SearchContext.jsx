import { createContext, useState, useCallback } from 'react'
import { searchMedications } from '../api/searchApi'

export const SearchContext = createContext(null)

const CHIPS = ['Paracetamol', 'Amoxicillin', 'ORS Sachets', 'Ibuprofen']

export function SearchProvider({ children }) {
  const [query,               setQuery]               = useState('')
  const [results,             setResults]             = useState([])
  const [matchedIngredient,   setMatchedIngredient]   = useState(null)
  const [substitutesAvailable,setSubstitutesAvailable]= useState(false)
  const [status,              setStatus]              = useState('idle')

  const runSearch = useCallback(async (q, coords) => {
    if (!q?.trim()) return
    setStatus('loading')
    setQuery(q)
    try {
      const data = await searchMedications({ query: q, lat: coords.lat, lng: coords.lng })
      setResults(data.results)
      setMatchedIngredient(data.matched_ingredient)
      setSubstitutesAvailable(data.substitutes_available)
      setStatus(data.results.length ? 'success' : 'empty')
    } catch {
      setStatus('error')
    }
  }, [])

  return (
    <SearchContext.Provider value={{
      query, setQuery, results, matchedIngredient,
      substitutesAvailable, status, runSearch, chips: CHIPS,
    }}>
      {children}
    </SearchContext.Provider>
  )
}
