import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, X as XIcon, Navigation } from 'lucide-react'
import { usePolling } from '../../hooks/usePolling'
import { getHoldRequestStatus, cancelHoldRequest, getActiveHoldByPhone } from '../../api/holdRequestApi'
import { formatCountdown } from '../../utils/formatters'
import { HOLD_STATUS } from '../../utils/constants'
import { isValidE164Phone } from '../../utils/validators'
import { useToast } from '../../hooks/useToast'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'

export default function HoldPendingPage() {
  const { requestId } = useParams()

  if (!requestId) {
    return <HoldSearchForm />
  }

  return <ActiveHoldTracker requestId={requestId} />
}

// ==========================================
// THE SEARCH FORM (For the /track route)
// ==========================================
function HoldSearchForm() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fullPhone = `+250${phone.replace(/\D/g, '')}`
  const canSubmit = isValidE164Phone(fullPhone) && !loading

  const handleTrack = async (e) => {
    e.preventDefault()
    setError(null)

    if (!isValidE164Phone(fullPhone)) {
      setError('Enter a valid phone number.')
      return
    }

    setLoading(true)
    try {
      const activeHold = await getActiveHoldByPhone(fullPhone)
      // If found, redirect to the real URL so the Tracker mounts!
      if (activeHold && activeHold.request_id) {
        navigate(`/hold/${activeHold.request_id}`)
      }
    } catch (e) {
      // Check for Django's specific error shape
      const msg = e.response?.data?.error?.message || 'No active hold found for this number.'
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-5 py-10 w-full flex flex-col h-full bg-cream min-h-screen">
      <h1 className="text-[22px] font-bold font-sans text-black mb-1">Track your hold</h1>
      <p className="text-[14px] font-sans text-muted mb-8">
        Enter the phone number you used to reserve your medicine.
      </p>
      <form onSubmit={handleTrack} className="bg-white p-6 rounded-lg shadow-sm border-[0.5px] border-border">
        <label className="block text-[13px] font-bold font-sans text-black mb-2">
          Your phone number
        </label>
        <div className="flex items-center border-[0.5px] border-border rounded-md h-12 focus-within:border-sage focus-within:ring-1 focus-within:ring-sage transition-all mb-2">
          <span className="px-4 text-[14px] font-medium font-sans text-muted border-r border-border bg-cream/30 h-full flex items-center rounded-l-md">
            RW +250
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 h-full px-4 text-[14px] font-medium font-sans text-black outline-none rounded-r-md"
            placeholder="79502760fff"
          />
        </div>
        {error && <p className="text-[12px] text-rose font-sans mb-4">{error}</p>}
        <Button
          type="submit"
          variant="accent"
          size="lg"
          fullWidth
          className="mt-4 bg-[#9D7073] hover:bg-[#8A6164]"
          disabled={!canSubmit}
        >
          {loading ? 'Searching...' : 'Find My Hold'}
        </Button>
      </form>
    </div>
  )
}

// ==========================================
// THE LIVE TRACKER (For the /hold/:requestId route)
// ==========================================
function ActiveHoldTracker({ requestId }) {
  const navigate = useNavigate()
  const [msLeft, setMsLeft] = useState(0)

  const { data: hold } = usePolling(() => getHoldRequestStatus(requestId), 30000, [requestId])

  useEffect(() => {
    if (!hold?.expires_at) return
    const tick = () => setMsLeft(Math.max(0, new Date(hold.expires_at).getTime() - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [hold?.expires_at])

  if (!hold) return <div className="flex justify-center pt-20 bg-cream min-h-screen"><Spinner/></div>
  if (hold.status === HOLD_STATUS.DENIED) return <DeniedView hold={hold} navigate={navigate}/>

  const handleCancel = async () => {
    await cancelHoldRequest(requestId)
    navigate('/')
  }

  return (
    <div className="px-5 bg-cream min-h-screen">
      <h1 className="mt-7 text-[22px] font-bold font-sans text-black">Tracking your hold</h1>
      <p className="mt-1 text-[14px] font-sans text-sage">Waiting for clinic confirmation.</p>

      <div className="mt-5 bg-white border-[0.5px] border-border rounded-lg shadow-card px-6 py-7 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <span className="absolute w-24 h-24 rounded-full border-[1.5px] border-dashed border-sage-light opacity-50"/>
          <span className="w-[76px] h-[76px] rounded-full bg-sage-tint border-2 border-sage flex items-center justify-center">
            <Clock size={34} className="text-sage"/>
          </span>
        </div>

        <span className="mt-4 h-[26px] px-3.5 rounded-pill bg-sage-tint border border-sage-light text-sage text-[11px] font-semibold font-sans uppercase tracking-wide flex items-center">
          {hold.status === HOLD_STATUS.APPROVED ? 'Approved' : 'Pending'}
        </span>

        <h2 className="mt-3 text-[22px] font-bold font-sans text-black text-center">
          {hold.status === HOLD_STATUS.APPROVED ? 'Unit reserved' : 'Hold sent'}
        </h2>

        <p className="mt-1.5 text-[13px] font-sans text-sage text-center leading-relaxed max-w-[260px]">
          {hold.status === HOLD_STATUS.APPROVED
            ? `${hold.clinic_name} has confirmed your reservation.`
            : `${hold.clinic_name} has been notified.`}
        </p>

        <div className="mt-5 text-center">
          <p className="text-[38px] font-mono font-medium text-sage tracking-[3px]">{formatCountdown(msLeft)}</p>
          <p className="text-[11px] font-sans text-muted uppercase tracking-wide mt-0.5">remaining</p>
        </div>

        <div className="w-full h-px bg-border mt-5 mb-4"/>

        <div className="w-full flex justify-between text-[13px] font-sans">
          <span className="font-semibold text-black">{hold.medication_name}</span>
          <span className="text-sage">{hold.clinic_name}</span>
        </div>

        <div className="w-full flex justify-between text-[12px] font-sans mt-1">
          <span className="text-sage">{hold.address}</span>
        </div>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hold.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 w-full h-11 flex items-center justify-center gap-2 bg-sage-tint border-[0.5px] border-sage/30 rounded-md text-sage text-[13px] font-semibold font-sans hover:bg-sage/10 transition-colors"
        >
          <Navigation size={16} />
          Get Directions
        </a>

        {hold.status === HOLD_STATUS.PENDING && (
          <button onClick={handleCancel} className="mt-3 text-[13px] font-sans text-status-out min-h-[44px]">
            Cancel this request
          </button>
        )}
      </div>
    </div>
  )
}

function DeniedView({ hold, navigate }) {
  return (
    <div className="px-5 bg-cream min-h-screen">
      <h1 className="mt-7 text-[22px] font-bold font-sans text-black">Hold request update</h1>
      <p className="mt-1 text-[14px] font-sans text-sage">This reservation could not be completed.</p>

      <div className="mt-5 bg-white border-[0.5px] border-border rounded-lg shadow-card px-6 py-7 flex flex-col items-center">
        <span className="w-[76px] h-[76px] rounded-full bg-status-out-bg border-2 border-status-out flex items-center justify-center">
          <XIcon size={32} className="text-status-out"/>
        </span>

        <span className="mt-4 h-[26px] px-3.5 rounded-pill bg-status-out-bg border border-status-out text-status-out-text text-[11px] font-semibold font-sans uppercase tracking-wide flex items-center">DENIED</span>

        <h2 className="mt-3 text-[19px] font-bold font-sans text-black text-center leading-tight max-w-[280px]">
          This clinic couldn't hold your medicine
        </h2>

        <p className="mt-2 text-[13px] font-sans text-sage text-center leading-relaxed max-w-[270px]">
          {hold.clinic_name} was unable to fulfill this request. Here's what else is nearby.
        </p>

        <div className="w-full h-px bg-border mt-5 mb-4"/>

        <div className="w-full flex justify-between text-[13px] font-sans">
          <span className="font-semibold text-black">{hold.medication_name}</span>
          <span className="text-sage">{hold.clinic_name}</span>
        </div>
      </div>

      <button onClick={() => navigate('/')}
        className="mt-5 w-full h-[52px] rounded-md bg-sage text-white text-[14px] font-semibold font-sans">
        Find this medicine elsewhere
      </button>
    </div>
  )
}