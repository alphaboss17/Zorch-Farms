import { useCatalog } from '../context/CatalogContext'
import { Icon } from './Icons'

export function ToastViewport() {
  const { toasts, dismissToast } = useCatalog()
  return (
    <div className="toast-viewport" aria-live="polite">
      {toasts.map((toast) => {
        const isError = toast.variant === 'error'
        return (
          <div
            className={`toast ${isError ? 'toast-error' : ''}`}
            key={toast.id}
            role={isError ? 'alert' : 'status'}
          >
            <span className="toast-check">
              <Icon name={isError ? 'x' : 'check'} size={15} />
            </span>
            <span>{toast.message}</span>
            <button aria-label="Dismiss notification" onClick={() => dismissToast(toast.id)}>
              <Icon name="x" size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
