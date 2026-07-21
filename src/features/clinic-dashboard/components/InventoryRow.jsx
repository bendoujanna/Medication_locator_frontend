import { Bell } from 'lucide-react'
import Card from '../../../components/ui/Card'
import StatusChip from '../../../components/ui/StatusChip'
import ProgressBar from '../../../components/ui/ProgressBar'
import Toggle from '../../../components/ui/Toggle'

export default function InventoryRow({ inventory: inv, onQtyChange, onOverride }) {
  const qty       = inv.quantity_on_hand
  const threshold = inv.low_stock_threshold
  const hasAlert  = inv.status !== 'AVAILABLE'

  return (
    <Card padding="compact" className={`flex items-center gap-4 ${inv.status==='OUT_OF_STOCK'&&inv.is_out_of_stock_override?'bg-[#FFF8F8] border-[#FECACA]':''}`}>
      {/* Medicine */}
      <div className="flex-[2.5] min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[14px] font-semibold font-sans text-black truncate">{inv.medication.brand_name}</p>
          {hasAlert && <Bell size={13} className="text-status-low flex-shrink-0"/>}
        </div>
        <p className="text-[12px] font-sans text-sage truncate">{inv.medication.ingredient_name} · {inv.medication.dosage_form}</p>
      </div>

      {/* Stock level */}
      <div className="flex-[2] min-w-0">
        <ProgressBar status={inv.status} quantity={qty} referenceMax={Math.max(qty*2, threshold*3, 50)} className="mb-1"/>
        <p className="text-[12px] font-mono font-medium text-sage">{qty} units</p>
      </div>

      {/* Status */}
      <div className="flex-1 flex justify-center">
        <StatusChip status={inv.status}/>
      </div>

      {/* Actions */}
      <div className="flex-[1.5] flex items-center justify-end gap-2">
        <button onClick={() => onQtyChange(inv, Math.max(0, qty - 1))}
          className="w-[34px] h-[34px] rounded-sm bg-sage-tint border border-sage flex items-center justify-center text-sage font-bold text-lg">−</button>
        <button onClick={() => onQtyChange(inv, qty + 1)}
          className="w-[34px] h-[34px] rounded-sm bg-sage flex items-center justify-center text-white font-bold text-lg">+</button>
        <Toggle checked={inv.is_out_of_stock_override} onChange={v => onOverride(inv, v)} className="ml-2"/>
      </div>
    </Card>
  )
}
