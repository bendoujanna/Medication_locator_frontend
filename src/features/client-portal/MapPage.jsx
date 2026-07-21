import { Suspense, lazy, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Crosshair, Plus, Minus } from 'lucide-react'
import { useSearch } from '../../hooks/useSearch'
import { useGeolocation } from '../../hooks/useGeolocation'
import { getMapPins } from '../../api/searchApi'
import { useEffect } from 'react'
import StatusChip from '../../components/ui/StatusChip'
import Spinner from '../../components/ui/Spinner'

const MapContainer = lazy(() => import('../../components/map/MapContainer'))

export default function MapPage() {
  const navigate  = useNavigate()
  const { query, results } = useSearch()
  const { effectiveCoords } = useGeolocation()
  const [pins, setPins]           = useState([])
  const [selected, setSelected]   = useState(null)

  useEffect(() => {
    if (!query) return
    getMapPins({ query, lat: effectiveCoords.lat, lng: effectiveCoords.lng })
      .then(d => setPins(d.pins)).catch(() => {})
  }, [query])

  return (
    <div className="relative h-screen w-full">
      <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-sage-tint"><Spinner/></div>}>
        <MapContainer pins={pins} center={[effectiveCoords.lat, effectiveCoords.lng]}
          zoom={14} height="100vh" onPinClick={setSelected}/>
      </Suspense>

      {/* Floating top bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex items-center h-12 bg-white rounded-pill shadow-floating px-3 gap-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center">
            <ArrowLeft size={18} className="text-black"/>
          </button>
          <span className="flex-1 text-[14px] font-semibold font-sans text-black truncate">
            {query ? `${query} near you` : 'Map view'}
          </span>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-sage-tint">
            <Crosshair size={18} className="text-sage"/>
          </button>
        </div>
      </div>

      {/* Bottom drawer — peek state */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-[20px] shadow-modal pb-6">
        <div className="flex justify-center pt-3 mb-3">
          <div className="w-9 h-1 bg-border rounded-pill"/>
        </div>
        <div className="px-5 flex items-center justify-between mb-3">
          <span className="text-[14px] font-semibold font-sans text-black">{pins.length} clinics found</span>
          <span className="text-[12px] font-medium font-sans text-sage">Sort: Nearest</span>
        </div>
        <div className="flex gap-2.5 overflow-x-auto px-5 scrollbar-none">
          {results.slice(0,5).map(r => (
            <div key={r.clinic_id} onClick={() => navigate(`/hold/new?inventory=${r.medication.inventory_id}&clinic=${encodeURIComponent(r.clinic_name)}&drug=${encodeURIComponent(r.medication.brand_name+' '+r.medication.strength)}`)}
              className={`flex-shrink-0 w-[220px] rounded-md border p-3.5 cursor-pointer
                ${selected?.clinic_id === r.clinic_id ? 'border-[1.5px] border-sage' : 'border-[0.5px] border-border'}`}>
              <p className="text-[13px] font-semibold font-sans text-black truncate">{r.clinic_name}</p>
              <p className="text-[11px] font-sans text-sage mt-0.5">{Number(r.distance_km).toFixed(1)} km</p>
              <div className="mt-2">
                <StatusChip status={r.traffic_light_status} size="sm"/>
              </div>
              {r.hold_available && (
                <p className="text-[11px] font-semibold font-sans text-rose mt-1.5">Hold · 2hrs →</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
