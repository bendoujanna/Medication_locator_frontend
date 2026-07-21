import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { searchSubstitutes } from '../../api/searchApi'
import { useGeolocation } from '../../hooks/useGeolocation'
import ClinicResultCard from '../../components/search/ClinicResultCard'
import Spinner from '../../components/ui/Spinner'

export default function SubstitutePage() {
  const [params]   = useSearchParams()
  const navigate   = useNavigate()
  const { effectiveCoords } = useGeolocation()
  const ingredientId   = params.get('ingredient')
  const ingredientName = params.get('name') || 'this ingredient'

  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ingredientId) return
    searchSubstitutes({ ingredientId, lat: effectiveCoords.lat, lng: effectiveCoords.lng })
      .then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [ingredientId])

  return (
    <div className="px-5">
      {/* Out-of-stock notice */}
      <div className="mt-5 bg-status-out-bg rounded-md p-4 mb-4">
        <p className="text-[14px] font-semibold font-sans text-status-out-text">Not available nearby</p>
        <p className="text-[12px] font-sans text-status-out-text mt-1 leading-relaxed">
          The medicine you searched is out of stock at all nearby clinics. Here are equivalent alternatives.
        </p>
      </div>

      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[14px] font-semibold font-sans text-black">Smart substitutes for {ingredientName}</span>
      </div>
      <p className="text-[12px] font-sans text-sage mb-3">Same active ingredient. Equally effective.</p>

      {loading && <div className="flex justify-center py-10"><Spinner/></div>}

      {!loading && data?.substitutes?.length === 0 && (
        <p className="text-center text-[13px] font-sans text-sage py-8">No substitutes found nearby either.</p>
      )}

      <div className="flex flex-col gap-2">
        {data?.substitutes?.map(r => (
          <ClinicResultCard key={r.clinic_id + r.medication.inventory_id}
            clinicName={r.clinic_name} address={r.address}
            distanceKm={r.distance_km}
            etaLabel={`~${Math.max(3, Math.round((r.distance_km/25)*60))} min by moto`}
            status={r.traffic_light_status}
            substituteBrand={`${r.medication.brand_name} ${r.medication.strength}`}
            onHoldClick={() => navigate(`/hold/new?inventory=${r.medication.inventory_id}&clinic=${encodeURIComponent(r.clinic_name)}&drug=${encodeURIComponent(r.medication.brand_name+' '+r.medication.strength)}`)}
          />
        ))}
      </div>

      <button onClick={() => navigate('/')}
        className="mt-5 w-full text-center text-[13px] font-medium font-sans text-sage underline py-3">
        Search for a different medicine instead
      </button>
    </div>
  )
}