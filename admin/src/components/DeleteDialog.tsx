import { useState } from 'react'
import type { Product } from '../types'
import { Icon } from './Icons'

export function DeleteDialog({
  product,
  onCancel,
  onConfirm,
}: {
  product: Product
  onCancel: () => void
  onConfirm: () => Promise<void> | void
}) {
  const [deleting, setDeleting] = useState(false)

  // Prevent repeated delete clicks and block closing mid-request.
  const requestCancel = () => {
    if (deleting) {
      return
    }

    onCancel()
  }

  const handleConfirm = async () => {
    if (deleting) {
      return
    }

    setDeleting(true)

    try {
      await onConfirm()
      // On success the parent closes the dialog and unmounts it.
    } catch {
      // The catalog layer already surfaces an error toast;
      // keep the dialog open so the user can retry.
      setDeleting(false)
    }
  }

  return (
    <div
      className="dialog-layer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
    >
      <button
        className="dialog-backdrop"
        onClick={requestCancel}
        aria-label="Close delete confirmation"
      />

      <section className="delete-dialog">
        <button
          className="dialog-close icon-button"
          onClick={requestCancel}
          aria-label="Close"
          disabled={deleting}
        >
          <Icon name="x" />
        </button>

        <span className="danger-icon">
          <Icon name="trash" />
        </span>

        <h2 id="delete-title">Delete product?</h2>

        <p>
          Are you sure you want to remove <strong>{product.name}</strong> from your product
          catalog? This cannot be undone.
        </p>

        <div className="dialog-actions">
          <button
            className="button button-secondary"
            onClick={requestCancel}
            disabled={deleting}
          >
            Cancel
          </button>

          <button
            className="button button-danger"
            onClick={handleConfirm}
            disabled={deleting}
            aria-busy={deleting}
          >
            {deleting ? (
              <>
                <span className="button-spinner" aria-hidden="true" />
                Deleting…
              </>
            ) : (
              'Delete Product'
            )}
          </button>
        </div>
      </section>
    </div>
  )
}
