import { useState } from 'react'
import { Eye, EyeOff, User, AtSign, Lock } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { createStaff } from '../../api/staffApi'
import { useToast } from '../../hooks/useToast'
import { passwordError } from '../../utils/validators'
import { STAFF_ROLE, STAFF_ROLE_LABEL } from '../../utils/constants'

const PERMISSIONS = {
  [STAFF_ROLE.STANDARD_PHARMACIST]: {
    can:    ['Update inventory','Process hold requests','View stock alerts','View inventory reports'],
    cannot: ['Manage staff accounts','Edit facility profile','Configure alert thresholds','Access system settings'],
  },
  [STAFF_ROLE.ADMINISTRATOR]: {
    can:    ['Update inventory','Process hold requests','View stock alerts','Manage staff accounts','Edit facility profile','Configure alert thresholds'],
    cannot: [],
  },
}

export default function AddStaffModal({ open, onClose, onCreated }) {
  const { clinicId }  = useAuth()
  const { showToast } = useToast()
  const [form,    setForm]    = useState({ email:'', password:'', username:'', full_name:'', role: STAFF_ROLE.STANDARD_PHARMACIST })
  const [showPw,  setShowPw]  = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [errors,  setErrors]  = useState({})

  const set = (k, v) => { setForm(f => ({...f, [k]:v})); setErrors(e => ({...e, [k]:null})) }

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Required'
    if (!form.username) e.username = 'Required'
    const pwErr = passwordError(form.password)
    if (pwErr) e.password = pwErr
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      await createStaff(clinicId, form)
      showToast(`${form.username} account created.`)
      onCreated?.()
      onClose()
      setForm({ email:'', password:'', username:'', full_name:'', role: STAFF_ROLE.STANDARD_PHARMACIST })
    } catch (err) {
      const msg = err.response?.data?.email?.[0] || err.response?.data?.error?.message || 'Failed to create account'
      showToast(msg, 'error')
    } finally { setSaving(false) }
  }

  const perms = PERMISSIONS[form.role]

  return (
    <Modal open={open} onClose={onClose} variant="center" title="Add staff member" width={440}>
      <div className="flex flex-col gap-4 mt-1">
        <Input label="Full name" value={form.full_name} onChange={e => set('full_name', e.target.value)}
          placeholder="e.g. Aline Uwase" leftIcon={<User size={15}/>}/>
        <Input label="Username" value={form.username} onChange={e => set('username', e.target.value)}
          placeholder="e.g. aline.uwase" leftIcon={<AtSign size={15}/>} error={errors.username}/>
        <Input label="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)}
          placeholder="staff@clinic.rw" error={errors.email}/>
        <Input label="Temporary password" type={showPw?'text':'password'} value={form.password}
          onChange={e => set('password', e.target.value)} leftIcon={<Lock size={15}/>}
          rightIcon={showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
          onRightIconClick={() => setShowPw(p => !p)}
          helperText="Min 10 chars, 1 uppercase, 1 number, 1 special character."
          error={errors.password}/>

        {/* Role selector */}
        <div>
          <p className="text-[13px] font-semibold font-sans text-black mb-2">Role</p>
          <div className="flex gap-2.5">
            {[STAFF_ROLE.STANDARD_PHARMACIST, STAFF_ROLE.ADMINISTRATOR].map(r => {
              const active = form.role === r
              return (
                <button key={r} onClick={() => set('role', r)}
                  className={`flex-1 rounded-md p-3.5 text-left border transition-colors
                    ${active ? 'bg-sage-tint border-[1.5px] border-sage' : 'bg-white border-[0.5px] border-border hover:bg-sage-tint/50'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 mb-2 flex items-center justify-center
                    ${active ? 'border-sage' : 'border-border'}`}>
                    {active && <div className="w-2.5 h-2.5 rounded-full bg-sage"/>}
                  </div>
                  <p className="text-[13px] font-semibold font-sans text-black">{STAFF_ROLE_LABEL[r]}</p>
                  <p className="text-[11px] font-sans text-sage mt-1 leading-relaxed">
                    {r === STAFF_ROLE.ADMINISTRATOR ? 'Full access including staff management.' : 'Can update inventory and process holds.'}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Permission summary */}
        <div className="bg-rose-tint rounded-md p-3.5">
          <p className="text-[12px] font-semibold font-sans text-black mb-2">{STAFF_ROLE_LABEL[form.role]} can:</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {perms.can.map(p => (
              <div key={p} className="flex items-center gap-1.5">
                <span className="text-status-available text-[11px]">✓</span>
                <span className="text-[11px] font-sans text-sage">{p}</span>
              </div>
            ))}
            {perms.cannot.map(p => (
              <div key={p} className="flex items-center gap-1.5">
                <span className="text-status-out text-[11px]">✕</span>
                <span className="text-[11px] font-sans text-muted">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2.5 mt-2">
          <Button variant="ghost" size="md" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="accent" size="md" onClick={handleSubmit} disabled={saving} className="flex-1">
            {saving ? 'Creating…' : 'Create account'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
