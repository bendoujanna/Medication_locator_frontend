import { Bike, ChevronRight, Navigation } from 'lucide-react'
import Card from '../ui/Card'
import Avatar from '../ui/Avatar'
import StatusChip from '../ui/StatusChip'
import { formatDistance } from '../../utils/formatters'

export default function ClinicResultCard({ clinicName, medicationName, activeIngredient, query, address, distanceKm, etaLabel, status, isOpen=true, onHoldClick, substituteBrand, className='' }) {
  const initials = clinicName.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()
  const canHold  = status !== 'OUT_OF_STOCK'

  // Fallback to what the user searched for if the backend didn't supply an ingredient name
  const displayIngredient = activeIngredient || query

  return (
    <Card padding="md" className={`flex items-start gap-3 ${className}`}>
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <Avatar initials={initials}/>
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${isOpen?'bg-status-available':'bg-muted'}`}/>
          <span className="text-[10px] font-sans text-sage">{isOpen?'Open':'Closed'}</span>
        </span>
      </div>

      <div className="flex-1 min-w-0">
        {substituteBrand && (
          <span className="inline-block mb-1.5 px-2 py-0.5 rounded-pill bg-rose-tint border border-rose-light text-rose text-[10px] font-semibold font-sans uppercase tracking-wide">
            Substitute
          </span>
        )}

        <p className="text-[12px] font-medium font-sans text-sage truncate">{clinicName}</p>

        <p className="text-[15px] font-bold font-sans text-black truncate mt-0.5">
          {substituteBrand ? substituteBrand : medicationName}
        </p>

        {displayIngredient && (
          <p className="text-[11px] font-sans text-sage/80 truncate">
            Contains: {displayIngredient}
          </p>
        )}

        <p className="text-[12px] font-sans text-sage truncate mt-1">{address}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <Bike size={13} className="text-rose flex-shrink-0"/>
          <span className="text-[12px] font-sans text-sage">{formatDistance(distanceKm)} · {etaLabel}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <StatusChip status={status}/>

        {canHold && (
          <button onClick={onHoldClick} className="flex items-center gap-0.5 text-[12px] font-semibold font-sans text-rose min-h-[28px]">
            Hold · 2hrs <ChevronRight size={13}/>
          </button>
        )}

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[11px] font-medium font-sans text-muted hover:text-sage flex items-center gap-1 transition-colors mt-0.5"
        >
          <Navigation size={11} />
          Get directions
        </a>
      </div>
    </Card>
  )
}