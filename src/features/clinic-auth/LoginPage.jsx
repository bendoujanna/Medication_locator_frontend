import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      const code = err.code || ''
      if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential'))
        setError('Incorrect email or password.')
      else if (code.includes('too-many-requests'))
        setError('Too many attempts. Please wait a moment.')
      else
        setError('Login failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[42%] flex-col items-center justify-center bg-gradient-to-b from-sage to-sage-dark px-12">
        <p className="text-white font-bold text-[30px] font-sans tracking-[-0.5px]">MedLocator</p>
        <p className="text-white/70 text-[16px] font-sans mt-2 text-center">Real-time inventory for frontline care.</p>
        <svg className="mt-12" width="180" height="140" viewBox="0 0 180 140" fill="none">
          <rect x="30" y="60" width="120" height="70" rx="4" stroke="white" strokeWidth="1.5"/>
          <rect x="75" y="95" width="30" height="35" stroke="white" strokeWidth="1.5"/>
          <rect x="50" y="80" width="20" height="20" stroke="white" strokeWidth="1.5"/>
          <rect x="110" y="80" width="20" height="20" stroke="white" strokeWidth="1.5"/>
          <path d="M80 60V50H100V60" stroke="white" strokeWidth="1.5"/>
          <path d="M90 20L90 48" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M78 32L90 20L102 32" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="90" cy="22" r="4" stroke="white" strokeWidth="1.5"/>
          <line x1="85" y1="72" x2="95" y2="72" stroke="white" strokeWidth="1.5"/>
          <line x1="90" y1="67" x2="90" y2="77" stroke="white" strokeWidth="1.5"/>
        </svg>
        <div className="flex gap-8 mt-12">
          {[['52%','avg stock gap'],['2 hrs','hold window'],['0','sign-ups needed']].map(([n,l]) => (
            <div key={l} className="text-center">
              <p className="text-white font-bold text-[22px] font-sans">{n}</p>
              <p className="text-white/55 text-[10px] font-sans uppercase tracking-wide mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-cream px-6">
        <div className="w-full max-w-[400px]">
          <p className="text-[16px] font-bold font-sans text-rose mb-1 lg:hidden">MedLocator</p>
          <h1 className="text-[26px] font-bold font-sans text-black">Clinic staff login</h1>
          <p className="text-[14px] font-sans text-sage mt-1 mb-8">Sign in to manage your inventory.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" leftIcon={<User size={16}/>} required/>
            <Input label="Password" type={showPw?'text':'password'} value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••••"
              leftIcon={<Lock size={16}/>}
              rightIcon={showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
              onRightIconClick={() => setShowPw(p => !p)} required/>
            {error && <p className="text-[13px] text-status-out font-sans">{error}</p>}
            <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-8 border-t border-border pt-5">
            <p className="text-[12px] text-muted font-sans text-center leading-relaxed">
              Account access is granted by your clinic administrator. There is no public sign-up.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
