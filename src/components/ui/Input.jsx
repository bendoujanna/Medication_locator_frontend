export default function Input({ label, helperText, error, leftIcon, rightIcon, onRightIconClick, className='', inputClassName='', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-[13px] font-semibold text-black mb-1.5 font-sans">{label}</label>}
      <div className="relative flex items-center">
        {leftIcon  && <span className="absolute left-3.5 text-muted flex items-center pointer-events-none">{leftIcon}</span>}
        <input className={`w-full h-12 rounded-sm border-[1.5px] bg-white text-[14px] font-sans text-black placeholder:text-muted
          ${leftIcon?'pl-10':'pl-3.5'} ${rightIcon?'pr-10':'pr-3.5'}
          ${error?'border-status-out':'border-border'}
          focus:outline-none focus:border-sage focus:ring-[3px] focus:ring-sage-tint transition-shadow ${inputClassName}`}
          {...props} />
        {rightIcon && (
          <button type="button" onClick={onRightIconClick} className="absolute right-3.5 text-muted flex items-center">
            {rightIcon}
          </button>
        )}
      </div>
      {error     ? <p className="mt-1.5 text-[11px] text-status-out font-sans">{error}</p>
       : helperText ? <p className="mt-1.5 text-[11px] text-muted font-sans leading-relaxed">{helperText}</p>
       : null}
    </div>
  )
}
