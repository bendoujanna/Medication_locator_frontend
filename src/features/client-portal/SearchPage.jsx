import { useEffect, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import SearchBar from '../../components/search/SearchBar'
import SuggestionChips from '../../components/search/SuggestionChips'
import ClinicResultCard from '../../components/search/ClinicResultCard'
import Spinner from '../../components/ui/Spinner'
import { useSearch } from '../../hooks/useSearch'
import { useGeolocation } from '../../hooks/useGeolocation'
import { getMapPins } from '../../api/searchApi'
import { useState } from 'react'

const MapContainer = lazy(() => import('../../components/map/MapContainer'))

export default function SearchPage() {
  const navigate = useNavigate()
  const { query, setQuery, results, status, runSearch, chips, substitutesAvailable, matchedIngredient } = useSearch()
  const { effectiveCoords } = useGeolocation()
  const [pins, setPins] = useState([])

  useEffect(() => {
    if (status === 'idle') runSearch('Paracetamol', effectiveCoords)
  }, [])

  useEffect(() => {
    if (query && effectiveCoords) {
      getMapPins({ query, lat: effectiveCoords.lat, lng: effectiveCoords.lng })
        .then(d => setPins(d.pins))
        .catch(() => {})
    }
  }, [results])

  const handleSubmit = (v) => runSearch(v, effectiveCoords)
  const handleChip   = (c) => { setQuery(c); runSearch(c, effectiveCoords) }

  return (
    <div className="px-5">
      <div className="mt-3">
        <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmit}/>
      </div>
      <div className="mt-2.5">
        <SuggestionChips chips={chips} onSelect={handleChip}/>
      </div>

      {/* Map thumbnail */}
      <div className="mt-3.5 rounded-md overflow-hidden border-[0.5px] border-border relative">
        <Suspense fallback={<div className="h-[175px] bg-sage-tint flex items-center justify-center"><Spinner/></div>}>
          <MapContainer pins={pins} height="175px"/>
        </Suspense>
        <button onClick={() => navigate('/map')}
          className="absolute bottom-2 right-2 h-6 px-2.5 rounded-pill bg-white shadow-floating flex items-center text-[11px] font-medium font-sans text-sage z-10">
          Expand map <ChevronRight size={12} className="ml-0.5"/>
        </button>
      </div>

      <div className="flex items-center justify-between mt-[18px]">
        <span className="text-[13px] font-semibold font-sans text-sage uppercase tracking-wide">Clinics nearby</span>
        <span className="text-[12px] font-sans text-muted">{status==='success'?`${results.length} results`:''}</span>
      </div>

      <div className="mt-2.5 flex flex-col gap-2 pb-2">
        {status === 'loading' && <div className="flex justify-center py-10"><Spinner/></div>}
        {status === 'error'   && <ErrorState onRetry={() => runSearch(query, effectiveCoords)}/>}
        {(status === 'empty' || (status === 'success' && results.length === 0)) && <NoResultsState query={query}/>}
        {status === 'success' && results.map(r => (
          <ClinicResultCard
            key={r.clinic_id + r.medication.inventory_id}
            clinicName={r.clinic_name}
            address={r.address}
            distanceKm={r.distance_km}
            etaLabel={`~${Math.max(3, Math.round((r.distance_km/25)*60))} min by moto`}
            status={r.traffic_light_status}
            onHoldClick={() => navigate(`/hold/new?inventory=${r.medication.inventory_id}&clinic=${encodeURIComponent(r.clinic_name)}&drug=${encodeURIComponent(r.medication.brand_name+' '+r.medication.strength)}`)}
          />
        ))}
        {substitutesAvailable && matchedIngredient && (
          <button onClick={() => navigate(`/substitutes?ingredient=${matchedIngredient.ingredient_id}&name=${encodeURIComponent(matchedIngredient.name)}`)}
            className="mt-1 text-center text-[13px] font-semibold font-sans text-rose underline">
            See substitute medicines available nearby →
          </button>
        )}
      </div>
    </div>
  )
}

function NoResultsState({ query }) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="24" cy="24" r="14" stroke="#586F6B" strokeWidth="1.5"/>
        <line x1="34" y1="34" x2="46" y2="46" stroke="#586F6B" strokeWidth="1.5" strokeLinecap="round"/>
        <text x="24" y="29" textAnchor="middle" fontSize="14" fill="#586F6B" fontFamily="sans-serif">?</text>
      </svg>
      <p className="mt-4 text-[16px] font-bold font-sans text-black">No results nearby</p>
      <p className="mt-1.5 text-[13px] font-sans text-sage leading-relaxed max-w-[260px]">
        We couldn't find "{query}" within 10km. Try a different spelling or search by symptom.
      </p>
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      <p className="text-[16px] font-bold font-sans text-black">Connection trouble</p>
      <p className="mt-1.5 text-[13px] font-sans text-sage">Check your connection and try again.</p>
      <button onClick={onRetry} className="mt-4 h-10 px-6 rounded-md bg-sage text-white text-[13px] font-semibold font-sans">Try again</button>
    </div>
  )
}