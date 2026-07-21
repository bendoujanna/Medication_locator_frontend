import { useState, useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { getClinic, updateClinic } from '../../../api/clinicApi'
import { useToast } from '../../../hooks/useToast'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { MapPin } from 'lucide-react'

export default function FacilityProfileCard() {
  const { clinicId } = useAuth()
  const { showToast } = useToast()
  const [clinic,   setClinic]   = useState(null)
  const [editing,  setEditing]  = useState(false)
  const [form,     setForm]     = useState({})
  const [saving,   setSaving]   = useState(false)

  useEffect(() => {
    if (!clinicId) return
    getClinic(clinicId).then(d => { setClinic(d); setForm(d) }).catch(() => {})
  }, [clinicId])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await updateClinic(clinicId, {
        name: form.name, address: form.address,
        latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude),
        operating_hours: form.operating_hours, emergency_contact: form.emergency_contact,
      })
      setClinic(updated)
      setEditing(false)
      showToast('Facility profile updated.')
    } catch { showToast('Failed to update profile', 'error') }
    finally { setSaving(false) }
  }

  const useGPS = () => {
    navigator.geolocation?.getCurrentPosition(pos => {
      setForm(f => ({ ...f, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) }))
    })
  }

  if (!clinic) return null

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-semibold font-sans text-black">Facility Profile</h2>
        {!editing
          ? <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>Edit profile</Button>
          : <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setForm(clinic) }}>Cancel</Button>
              <Button variant="primary" size="sm" disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : 'Save changes'}</Button>
            </div>
        }
      </div>
      <div className="h-px bg-border mb-6"/>

      {editing ? (
        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          <Input label="Clinic Name" value={form.name||''} onChange={e => setForm(f=>({...f,name:e.target.value}))}/>
          <Input label="Address" value={form.address||''} onChange={e => setForm(f=>({...f,address:e.target.value}))}/>
          <Input label="Latitude" value={form.latitude||''} onChange={e => setForm(f=>({...f,latitude:e.target.value}))} inputClassName="font-mono"/>
          <Input label="Longitude" value={form.longitude||''} onChange={e => setForm(f=>({...f,longitude:e.target.value}))} inputClassName="font-mono"/>
          <Input label="Operating Hours" value={form.operating_hours||''} onChange={e => setForm(f=>({...f,operating_hours:e.target.value}))}/>
          <Input label="Emergency Contact" value={form.emergency_contact||''} onChange={e => setForm(f=>({...f,emergency_contact:e.target.value}))}/>
          <div className="col-span-2">
            <button onClick={useGPS} className="flex items-center gap-1.5 text-[13px] font-medium font-sans text-sage underline">
              <MapPin size={13}/> Update coordinates from device GPS
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
          {[
            ['CLINIC NAME', clinic.name],
            ['ADDRESS', clinic.address],
            ['LATITUDE', clinic.latitude],
            ['LONGITUDE', clinic.longitude],
            ['OPERATING HOURS', clinic.operating_hours],
            ['EMERGENCY CONTACT', clinic.emergency_contact],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[11px] font-semibold font-sans text-muted uppercase tracking-wide mb-1">{label}</p>
              <p className={`text-[14px] font-sans text-black ${label.includes('LAT')||label.includes('LONG')?'font-mono':''}`}>{value||'—'}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
