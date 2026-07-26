import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import { useToast } from '../../../hooks/useToast'
import axiosClient from '../../../api/axiosClient'
import { addInventory } from '../../../api/inventoryApi'

export default function AddMedicineModal({ open, onClose, clinicId, onAdded }) {
  const { showToast } = useToast()

  const [ingredients,  setIngredients]  = useState([])
  const [medications,  setMedications]  = useState([])
  const [form, setForm] = useState({
    ingredient_id:  '',
    medication_id:  '',
    quantity_on_hand: '',
    low_stock_threshold: '10',
  })
  const [saving,  setSaving]  = useState(false)
  const [errors,  setErrors]  = useState({})

  // Load ingredients (EML) on open
  useEffect(() => {
    if (!open) return
    axiosClient.get('/ingredients/')
      .then(r => setIngredients(r.data.results))
      .catch(() => showToast('Failed to load ingredients', 'error'))
  }, [open])

  // When ingredient changes, load its medications
  useEffect(() => {
    if (!form.ingredient_id) { setMedications([]); return }
    axiosClient.get('/medications/', { params: { ingredient_id: form.ingredient_id } })
      .then(r => setMedications(r.data.results))
      .catch(() => showToast('Failed to load medications', 'error'))
  }, [form.ingredient_id])

  const set = (k, v) => {
    setForm(f => {
      const next = { ...f, [k]: v }
      // Reset medication when ingredient changes
      if (k === 'ingredient_id') next.medication_id = ''
      return next
    })
    setErrors(e => ({ ...e, [k]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.medication_id)                e.medication_id      = 'Select a medicine'
    if (!form.quantity_on_hand && form.quantity_on_hand !== 0) e.quantity_on_hand = 'Enter starting quantity'
    if (Number(form.quantity_on_hand) < 0)  e.quantity_on_hand   = 'Cannot be negative'
    if (!form.low_stock_threshold || Number(form.low_stock_threshold) < 1)
                                             e.low_stock_threshold = 'Must be at least 1'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      await addInventory(clinicId, {
        medication_id:        form.medication_id,
        quantity_on_hand:     Number(form.quantity_on_hand),
        low_stock_threshold:  Number(form.low_stock_threshold),
      })
      showToast('Medicine added to inventory.')
      onAdded?.()
      handleClose()
    } catch (err) {
      const msg = err.response?.data?.error?.message
        || Object.values(err.response?.data || {})[0]?.[0]
        || 'Failed to add medicine'
      showToast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setForm({ ingredient_id:'', medication_id:'', quantity_on_hand:'', low_stock_threshold:'10' })
    setErrors({})
    setMedications([])
    onClose()
  }

  const selectedMed = medications.find(m => m.medication_id === form.medication_id)

  return (
    <Modal open={open} onClose={handleClose} variant="center" title="Add medicine to inventory" width={480}>
      {/* Scrollable wrapper to prevent the modal from getting cut off */}
      <div className="max-h-[75vh] overflow-y-auto pr-1 flex flex-col gap-5 mt-2">

        {/* Step 1 — Active ingredient */}
        <div>
          <label className="block text-[13px] font-semibold font-sans text-black mb-1.5">
            Active ingredient
          </label>
          <select
            value={form.ingredient_id}
            onChange={e => set('ingredient_id', e.target.value)}
            className="w-full h-12 rounded-sm border-[1.5px] border-border bg-white text-[14px] font-sans text-black px-3.5
              focus:outline-none focus:border-sage focus:ring-[3px] focus:ring-sage-tint appearance-none cursor-pointer">
            <option value="">Select from Essential Medicines List…</option>
            {ingredients.map(i => (
              <option key={i.ingredient_id} value={i.ingredient_id}>
                {i.name} — {i.symptom_category}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11px] text-muted font-sans">
            Choose the active ingredient first. Brand names will appear below.
          </p>
        </div>

        {/* Step 2 — Brand name (only shown after ingredient is selected) */}
        {form.ingredient_id && (
          <div>
            <label className="block text-[13px] font-semibold font-sans text-black mb-1.5">
              Brand name / formulation
            </label>
            {medications.length === 0 ? (
              <p className="text-[13px] font-sans text-muted italic">
                No medications registered for this ingredient yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
                {medications.map(med => {
                  const selected = form.medication_id === med.medication_id
                  return (
                    <button key={med.medication_id}
                      onClick={() => set('medication_id', med.medication_id)}
                      className={`w-full text-left px-4 py-3 rounded-sm border transition-colors
                        ${selected
                          ? 'border-[1.5px] border-sage bg-sage-tint'
                          : 'border-[0.5px] border-border bg-white hover:bg-sage-tint/40'}`}>
                      <p className="text-[14px] font-semibold font-sans text-black">
                        {med.brand_name} {med.strength}
                      </p>
                      <p className="text-[12px] font-sans text-sage mt-0.5">
                        {med.dosage_form}
                      </p>
                    </button>
                  )
                })}
              </div>
            )}
            {errors.medication_id && (
              <p className="mt-1.5 text-[11px] text-status-out font-sans">{errors.medication_id}</p>
            )}
          </div>
        )}

        {/* Step 3 — Quantity and threshold (only shown after medication is selected) */}
        {form.medication_id && (
          <>
            {/* Selected medicine confirmation */}
            <div className="bg-sage-tint rounded-sm px-4 py-3">
              <p className="text-[12px] font-semibold font-sans text-sage uppercase tracking-wide mb-0.5">
                Adding to inventory
              </p>
              <p className="text-[15px] font-semibold font-sans text-black">
                {selectedMed?.brand_name} {selectedMed?.strength}
              </p>
              <p className="text-[12px] font-sans text-sage">{selectedMed?.dosage_form}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold font-sans text-black mb-1.5">
                  Starting quantity
                </label>
                <input
                  type="number" min={0}
                  value={form.quantity_on_hand}
                  onChange={e => set('quantity_on_hand', e.target.value)}
                  placeholder="e.g. 50"
                  className={`w-full h-12 rounded-sm border-[1.5px] bg-white text-[14px] font-mono text-black px-3.5
                    placeholder:text-muted focus:outline-none focus:border-sage focus:ring-[3px] focus:ring-sage-tint
                    ${errors.quantity_on_hand ? 'border-status-out' : 'border-border'}`}/>
                {errors.quantity_on_hand && (
                  <p className="mt-1.5 text-[11px] text-status-out font-sans">{errors.quantity_on_hand}</p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-semibold font-sans text-black mb-1.5">
                  Low-stock alert threshold
                </label>
                <input
                  type="number" min={1}
                  value={form.low_stock_threshold}
                  onChange={e => set('low_stock_threshold', e.target.value)}
                  placeholder="e.g. 10"
                  className={`w-full h-12 rounded-sm border-[1.5px] bg-white text-[14px] font-mono text-black px-3.5
                    placeholder:text-muted focus:outline-none focus:border-sage focus:ring-[3px] focus:ring-sage-tint
                    ${errors.low_stock_threshold ? 'border-status-out' : 'border-border'}`}/>
                {errors.low_stock_threshold && (
                  <p className="mt-1.5 text-[11px] text-status-out font-sans">{errors.low_stock_threshold}</p>
                )}
                <p className="mt-1.5 text-[11px] text-muted font-sans">
                  Alert fires when stock drops to or below this number.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex gap-2.5 pt-3 border-t border-border mt-2">
          <Button variant="ghost" size="md" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit}
            disabled={saving || !form.medication_id || form.quantity_on_hand === ''}
            className="flex-1">
            {saving ? 'Adding…' : 'Add to inventory'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}