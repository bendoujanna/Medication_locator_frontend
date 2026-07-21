import { useContext } from 'react'
import { SearchContext } from '../context/SearchContext'
export function useSearch() {
  return useContext(SearchContext)
}