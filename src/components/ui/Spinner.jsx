export default function Spinner({ fullScreen=false, size=28 }) {
  const el = (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin" role="status" aria-label="Loading">
      <circle cx="12" cy="12" r="10" stroke="#E8F0EF" strokeWidth="3"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#586F6B" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
  if (!fullScreen) return el
  return <div className="fixed inset-0 flex items-center justify-center bg-cream">{el}</div>
}
