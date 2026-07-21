export default function Toggle({ checked, onChange, label, className='' }) {
  return (
    <label className={`inline-flex items-center gap-2.5 cursor-pointer ${className}`}>
      {label && <span className="text-[13px] font-sans text-black select-none">{label}</span>}
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={`relative w-10 h-[22px] rounded-pill transition-colors flex-shrink-0 ${checked?'bg-status-out':'bg-border'}`}>
        <span className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform ${checked?'translate-x-[18px]':'translate-x-0'}`}/>
      </button>
    </label>
  )
}
