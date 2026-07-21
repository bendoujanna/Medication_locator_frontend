import { createContext, useState, useCallback } from 'react'

export const ToastContext = createContext(null)
let id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success', ms = 3500) => {
    const tid = ++id
    setToasts(p => [...p, { id: tid, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== tid)), ms)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-md shadow-modal font-sans text-sm text-black bg-white border-[0.5px] border-border min-w-[260px] max-w-xs
            ${t.type === 'error' ? 'border-l-4 border-l-status-out' : t.type === 'warning' ? 'border-l-4 border-l-status-low' : 'border-l-4 border-l-status-available'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
