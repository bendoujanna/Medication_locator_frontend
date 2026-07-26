import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Clock } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { isValidE164Phone } from '../../utils/validators'
import { createHoldRequest } from '../../api/holdRequestApi'
import { useToast } from '../../hooks/useToast'

export default function HoldRequestSheet() {
  const navigate = useNavigate()
  const [params]  = useSearchParams()
  const { showToast } = useToast()

  const inventoryId = params.get('inventory')
  const clinicName  = params.get('clinic')  || 'this clinic'
  const drugName    = params.get('drug')    || 'this medicine'

  const [phone,      setPhone]      = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState(null)

  const fullPhone = `+250${phone.replace(/\D/g,'')}`
  const canSubmit = isValidE164Phone(fullPhone) && !submitting

  const handleConfirm = async () => {
    setError(null)
    if (!isValidE164Phone(fullPhone)) {
      setError('Enter a valid phone number.')
      return
    }
    setSubmitting(true)

    try {
      // FIX 1: Keys are back to camelCase to match holdRequestApi.js
      const hold = await createHoldRequest({
        inventoryId: inventoryId,
        patientContact: fullPhone
      })
      navigate(`/hold/${hold.request_id}`, { replace: true })

    } catch (e) {
      // FIX 2: Smart error handling to catch both custom and DRF validation errors
      const data = e.response?.data;
      let msg = 'Something went wrong. Please try again.';

      if (data?.error?.message) {
        msg = data.error.message;
      } else if (data && typeof data === 'object') {
        const firstErrorKey = Object.keys(data)[0];
        if (firstErrorKey && Array.isArray(data[firstErrorKey])) {
          msg = data[firstErrorKey][0];
        }
      }

      console.error("Backend Error:", data); // Logs to DevTools for easy debugging
      setError(msg);
      showToast(msg, 'error');
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open
      onClose={() => navigate(-1)}
      variant="sheet"
      title="Reserve this medicine"
      className="md:max-w-[480px] md:mx-auto md:my-auto md:rounded-[20px] md:shadow-xl md:h-auto"
    >
      <p className="text-[13px] font-sans text-sage -mt-2 mb-4">{clinicName}</p>

      <div className="bg-white border-[0.5px] border-border shadow-sm rounded-sm px-3.5 py-3.5 mb-3.5">
        <p className="text-[15px] font-semibold font-sans text-black">{drugName}</p>
        <p className="text-[12px] font-sans text-sage mt-0.5">Active ingredient match confirmed</p>
      </div>

      <div className="flex items-start gap-2 bg-white border-y-[0.5px] border-r-[0.5px] border-l-[3px] border-y-border border-r-border border-l-[#E8B042] shadow-sm rounded-sm px-3.5 py-2.5 mb-5">
        <Clock size={15} className="text-[#E8B042] flex-shrink-0 mt-0.5"/>
        <p className="text-[12px] font-sans text-black leading-relaxed">
          This hold expires in 2 hours. Arrive before the timer runs out.
        </p>
      </div>

      <label className="block text-[13px] font-semibold font-sans text-black mb-1.5">
        Your phone number
      </label>
      <div className="flex items-center h-12 rounded-sm border-[1.5px] border-border bg-white px-3.5 focus-within:border-sage focus-within:ring-[3px] focus-within:ring-sage-tint">
        <span className="text-[14px] font-sans text-black">🇷🇼 +250</span>
        <span className="w-px h-6 bg-border mx-3"/>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="788 123 456"
          className="flex-1 bg-transparent outline-none text-[14px] font-sans text-black placeholder:text-muted"
        />
      </div>

      {error
        ? <p className="mt-1.5 text-[11px] text-status-out font-sans">{error}</p>
        : <p className="mt-1.5 text-[11px] text-muted font-sans">Your number is permanently deleted when the hold expires.</p>
      }

      <Button variant="accent" size="lg" fullWidth className="mt-6" disabled={!canSubmit} onClick={handleConfirm}>
        {submitting ? 'Confirming…' : 'Confirm Hold Request'}
      </Button>
      <p className="mt-3.5 text-center text-[11px] font-sans text-muted">No account needed · Your data is protected</p>
    </Modal>
  )
}