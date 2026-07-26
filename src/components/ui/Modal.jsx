import { X } from 'lucide-react'

export default function Modal({ open, onClose, variant='center', title, width=440, children }) {
  if (!open) return null
  const isSheet = variant === 'sheet'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />

      <div
        className={`relative bg-white z-10 flex flex-col 
          ${isSheet 
            ? 'w-full rounded-t-lg max-h-[85vh] animate-slide-up sm:w-[var(--modal-width)] sm:rounded-lg sm:max-h-none sm:shadow-modal sm:mx-4' 
            : 'w-[var(--modal-width)] max-w-[calc(100vw-32px)] rounded-lg shadow-modal mx-4'}`}
        style={{ '--modal-width': `${width}px` }}
      >
        {/* Grab Handle: Only shows on mobile screens */}
        {isSheet && (
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-9 h-1 bg-border rounded-pill"/>
          </div>
        )}

        <div className={`flex items-center justify-between px-6 ${isSheet ? 'pt-2 sm:pt-6' : 'pt-6'}`}>
          <h2 className="text-[18px] sm:text-[20px] font-bold font-sans text-black">{title}</h2>

          {/* Close Button: Always shows on center variant, desktop-only on sheet variant */}
          <button
            onClick={onClose}
            className={`w-9 h-9 items-center justify-center text-muted hover:text-black ${isSheet ? 'hidden sm:flex' : 'flex'}`}
          >
            <X size={20}/>
          </button>
        </div>

        <div className={`px-6 pb-6 ${isSheet ? 'pt-5 sm:pt-6' : 'pt-6'} overflow-y-auto`}>
          {children}
        </div>
      </div>
    </div>
  )
}