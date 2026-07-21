import { Search, Mic } from 'lucide-react'
export default function SearchBar({ value, onChange, onSubmit, placeholder='Search medicine, ingredient, or symptom…' }) {
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit?.(value) }}
      className="flex items-center h-[52px] w-full bg-white border-[1.5px] border-border rounded-pill shadow-card px-[18px]">
      <Search size={18} className="text-sage flex-shrink-0"/>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 mx-2.5 bg-transparent outline-none text-[14px] font-sans text-black placeholder:text-muted"/>
      <button type="button" aria-label="Voice search"><Mic size={18} className="text-sage"/></button>
    </form>
  )
}
