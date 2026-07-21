export default function Avatar({ initials, size='md', tone='sage', className='' }) {
  const sizes = { sm:'w-9 h-9 text-[12px]', md:'w-11 h-11 text-[14px]' }
  const tones = { sage:'bg-sage-tint text-sage', rose:'bg-rose-tint text-rose' }
  return (
    <div className={`flex items-center justify-center rounded-md font-bold font-sans flex-shrink-0 ${sizes[size]} ${tones[tone]} ${className}`}>
      {initials}
    </div>
  )
}
