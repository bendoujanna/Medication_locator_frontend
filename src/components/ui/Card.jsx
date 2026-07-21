export default function Card({ padding='md', className='', children, ...props }) {
  const p = { compact:'p-3', md:'p-4', lg:'p-6' }
  return (
    <div className={`bg-white border-[0.5px] border-border rounded-md shadow-card ${p[padding]} ${className}`} {...props}>
      {children}
    </div>
  )
}
