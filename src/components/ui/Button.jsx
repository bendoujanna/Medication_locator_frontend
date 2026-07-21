export default function Button({ variant='primary', size='md', fullWidth=false, disabled=false, children, className='', ...props }) {
  const base = 'inline-flex items-center justify-center font-sans font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = { sm:'h-9 px-4 text-sm rounded-sm', md:'h-11 px-5 text-sm rounded-md', lg:'h-[52px] px-6 text-[14px] rounded-md' }
  const variants = {
    primary:     'bg-sage text-white hover:bg-sage-dark active:bg-sage-dark',
    accent:      'bg-rose text-white hover:bg-rose-dark',
    ghost:       'bg-transparent border-[1.5px] border-sage text-sage hover:bg-sage-tint',
    destructive: 'bg-transparent border-[1.5px] border-status-out text-status-out hover:bg-status-out-bg',
  }
  return (
    <button disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth?'w-full':''} ${className}`}
      {...props}>
      {children}
    </button>
  )
}
