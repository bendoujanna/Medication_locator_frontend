import { useState, useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { getInventory, updateThreshold } from '../../../api/inventoryApi'
import { useToast } from '../../../hooks/useToast'
import Card from '../../../components/ui/Card'

export default function ThresholdsCard() {
  const { clinicId }  = useAuth()
  const { showToast } = useToast()
  const [items,   setItems]   = useState([])
  const [editing, setEditing] = useState({})

  useEffect(() => {
    if (!clinicId) return
    getInventory(clinicId).then(d => {
      setItems(d.results)
      const init = {}
      d.results.forEach(i => { init[i.inventory_id] = i.low_stock_threshold })
      setEditing(init)
    }).catch(() => {})
  }, [clinicId])

  const handleSave = async (inv) => {
    try {
      await updateThreshold(clinicId, inv.inventory_id, Number(editing[inv.inventory_id]))
      showToast(`Threshold updated for ${inv.medication.brand_name}.`)
    } catch { showToast('Failed to update threshold', 'error') }
  }

  const isDirty = (inv) => Number(editing[inv.inventory_id]) !== inv.low_stock_threshold

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[16px] font-semibold font-sans text-black">Alert Thresholds</h2>
        <p className="text-[12px] font-sans text-muted max-w-[280px] text-right">
          Alerts fire when stock reaches or drops below this number.
        </p>
      </div>
      <div className="h-px bg-border mb-4"/>

      <div className="flex items-center gap-4 px-1 mb-3">
        {['MEDICINE','THRESHOLD',''].map((h, i) => (
          <span key={i} className={`text-[11px] font-semibold font-sans text-muted uppercase tracking-wide
            ${i===0?'flex-[2]':i===1?'flex-1 text-center':'w-12'}`}>{h}</span>
        ))}
      </div>

      <div className="flex flex-col divide-y divide-border">
        {items.map(inv => (
          <div key={inv.inventory_id} className="flex items-center gap-4 py-3.5 px-1">
            <div className="flex-[2] min-w-0">
              <p className="text-[14px] font-semibold font-sans text-black truncate">{inv.medication.brand_name}</p>
              <p className="text-[12px] font-sans text-sage">{inv.medication.ingredient_name}</p>
            </div>
            <div className="flex-1 flex justify-center">
              <input type="number" min={1} value={editing[inv.inventory_id] ?? inv.low_stock_threshold}
                onChange={e => setEditing(prev => ({ ...prev, [inv.inventory_id]: e.target.value }))}
                className="w-[72px] h-9 rounded-sm border-[1.5px] border-border bg-white text-[14px] font-mono text-black text-center
                  focus:outline-none focus:border-sage focus:ring-[3px] focus:ring-sage-tint"/>
            </div>
            <div className="w-12 flex justify-end">
              <button onClick={() => handleSave(inv)}
                className={`text-[13px] font-semibold font-sans transition-colors
                  ${isDirty(inv) ? 'text-sage cursor-pointer' : 'text-muted cursor-default'}`}
                disabled={!isDirty(inv)}>
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}