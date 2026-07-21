import { useState, useEffect, useCallback } from 'react'
import { Search, Plus } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { getInventory, updateInventory, updateThreshold } from '../../api/inventoryApi'
import InventoryRow from './components/InventoryRow'
import Spinner from '../../components/ui/Spinner'
import { useToast } from '../../hooks/useToast'

export default function InventoryPage() {
  const { clinicId }      = useAuth()
  const { showToast }     = useToast()
  const [items,    setItems]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')

  const load = useCallback(async () => {
    if (!clinicId) return
    try {
      const data = await getInventory(clinicId, search ? { search } : {})
      setItems(data.results)
    } catch { showToast('Failed to load inventory', 'error') }
    finally { setLoading(false) }
  }, [clinicId, search])

  useEffect(() => { load() }, [load])

  const handleQtyChange = async (inv, newQty) => {
    try {
      const updated = await updateInventory(clinicId, inv.inventory_id, { quantity_on_hand: newQty })
      setItems(prev => prev.map(i => i.inventory_id === inv.inventory_id ? updated : i))
    } catch (e) {
      showToast(e.response?.data?.error?.message || 'Update failed', 'error')
    }
  }

  const handleOverride = async (inv, val) => {
    try {
      const updated = await updateInventory(clinicId, inv.inventory_id, { is_out_of_stock_override: val })
      setItems(prev => prev.map(i => i.inventory_id === inv.inventory_id ? updated : i))
    } catch { showToast('Update failed', 'error') }
  }

  const filtered = items.filter(i =>
    !search || i.medication.brand_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-7">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[22px] font-bold font-sans text-black">Inventory</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage"/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Filter medicines…"
              className="h-10 pl-9 pr-3 rounded-sm border-[1.5px] border-border bg-white text-[14px] font-sans text-black placeholder:text-muted focus:outline-none focus:border-sage w-[200px]"/>
          </div>
        </div>
      </div>
      <p className="text-[13px] font-sans text-muted mb-1">{items.length} medicines tracked</p>
      <div className="h-px bg-border my-4"/>

      {/* Column headers */}
      <div className="flex items-center px-4 mb-2 gap-4">
        {['MEDICINE','STOCK LEVEL','STATUS','ACTIONS'].map((h,i) => (
          <span key={h} className={`text-[11px] font-semibold font-sans text-muted uppercase tracking-wide
            ${i===0?'flex-[2.5]':i===1?'flex-[2]':i===2?'flex-1 text-center':'flex-[1.5] text-right'}`}>{h}</span>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-16"><Spinner/></div>
        : filtered.length === 0 ? <p className="text-center text-sage py-16 font-sans text-[14px]">No medicines found.</p>
        : <div className="flex flex-col gap-2">
            {filtered.map(inv => (
              <InventoryRow key={inv.inventory_id} inventory={inv}
                onQtyChange={handleQtyChange} onOverride={handleOverride}/>
            ))}
          </div>
      }
    </div>
  )
}
