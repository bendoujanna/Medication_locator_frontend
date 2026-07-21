import { Bike, ChevronRight } from 'lucide-react'
import Card from '../ui/Card'
import Avatar from '../ui/Avatar'
import StatusChip from '../ui/StatusChip'
import { formatDistance } from '../../utils/formatters'

export default function ClinicResultCard({ clinicName, address, distanceKm, etaLabel, status, isOpen=true, onHoldClick, substituteBrand, className='' }) {
  const initials = clinicName.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()
  const canHold  = status !== 'OUT_OF_STOCK'
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
        <p className="text-[14px] font-semibold font-sans text-black truncate">{clinicName}</p>
        {substituteBrand && <p className="text-[13px] font-medium font-sans text-rose mt-0.5">{substituteBrand}</p>}
        <p className="text-[12px] font-sans text-sage truncate mt-0.5">{address}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <Bike size={13} className="text-rose flex-shrink-0"/>
          <span className="text-[12px] font-sans text-sage">{formatDistance(distanceKm)} · {etaLabel}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <StatusChip status={status}/>
        {canHold && (
          <button onClick={onHoldClick} className="flex items-center gap-0.5 text-[12px] font-semibold font-sans text-rose min-h-[28px]">
            Hold · 2hrs <ChevronRight size={13}/>
          </button>
        )}
      </div>
    </Card>
  )
}
