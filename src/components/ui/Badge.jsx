export default function Badge({ count, className='' }) {
  if (!count || count <= 0) return null
  return (
    <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-rose text-white text-[10px] font-bold font-sans rounded-pill ${className}`}>
      {count}
    </span>
  )
}
