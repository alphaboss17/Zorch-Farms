import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { artForCategory } from '../data'
import { categories, type Category, type Product } from '../types'
import { supabase } from '../lib/supabase'
import { Icon } from './Icons'

type DraftVariant = {
  id: string
  measurement: string
  price: number
  available: boolean
}

type Draft = Omit<Product, 'id' | 'variants'> & {
  variants: DraftVariant[]
}

const measurements = [
  'Basket',
  'Half Basket',
  'Paint Bucket',
  '1kg',
  '2kg',
  '5kg',
  '10kg',
  '50kg',
  'Whole',
  'Carton',
  '1L',
  '5L',
  '25L',
  'Paint Rubber',
  'Half Paint Rubber Bag',
]

const createBlankVariant = (): DraftVariant => ({
  id: crypto.randomUUID(),
  measurement: 'Basket',
  price: 0,
  available: true,
})

const createBlankDraft = (): Draft => ({
  slug: '',
  name: '',
  category: 'Fresh Produce',
  description: '',
  image_url: null,
  featured: false,
  popular: false,
  available: true,
  variants: [createBlankVariant()],
})

export function ProductDrawer({
  product,
  onClose,
  onSave,
}: {
  product: Product | null
  onClose: () => void
  onSave: (product: Product | Draft) => Promise<void>
}) {
  const [form, setForm] = useState<Product | Draft>(
    product ?? createBlankDraft(),
  )

  const [error, setError] = useState('')

  const [saving, setSaving] = useState(false)

  const [uploading, setUploading] = useState(false)

  const fileInput = useRef<HTMLInputElement>(null)

  const editing = Boolean(product)

  useEffect(() => {
    setForm(
      product ?? createBlankDraft(),
    )

    setError('')
    setSaving(false)
    setUploading(false)
  }, [product])

  // Block closing the drawer while a save is in flight so the
  // user can't dismiss it mid-request and lose their feedback.
  const requestClose = () => {
    if (saving) {
      return
    }

    onClose()
  }

  const update = <K extends keyof Draft>(
    key: K,
    value: Draft[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const updateVariant = (
    variantId: string,
    key: 'measurement' | 'price' | 'available',
    value: string | number | boolean,
  ) => {
    setForm((current) => ({
      ...current,

      variants: current.variants.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              [key]: value,
            }
          : variant,
      ),
    }))
  }

  const addVariant = () => {
    const usedMeasurements = new Set(
      form.variants.map(
        (variant) => variant.measurement,
      ),
    )

    const nextMeasurement = measurements.find(
      (measurement) =>
        !usedMeasurements.has(measurement),
    )

    if (!nextMeasurement) {
      setError(
        'All available measurements have already been added.',
      )
      return
    }

    setForm((current) => ({
      ...current,

      variants: [
        ...current.variants,

        {
          id: crypto.randomUUID(),
          measurement: nextMeasurement,
          price: 0,
          available: true,
        },
      ],
    }))

    setError('')
  }

  const removeVariant = (
    variantId: string,
  ) => {
    if (form.variants.length === 1) {
      setError(
        'A product must have at least one measurement and price.',
      )
      return
    }

    setForm((current) => ({
      ...current,

      variants: current.variants.filter(
        (variant) =>
          variant.id !== variantId,
      ),
    }))

    setError('')
  }

  const chooseImage = async (
  event: ChangeEvent<HTMLInputElement>,
) => {
  const file = event.target.files?.[0]

  if (!file) {
    return
  }

  setUploading(true)
  setError('Uploading image...')

  try {
    const fileExtension =
      file.name.split('.').pop()?.toLowerCase() || 'jpg'

    const fileName = `${crypto.randomUUID()}.${fileExtension}`

    const filePath = `products/${fileName}`

    const { error: uploadError } =
      await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

    if (uploadError) {
      throw uploadError
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    update('image_url', publicUrl)

    setError('')
  } catch (error) {
    console.error(
      'Failed to upload product image:',
      error,
    )

    setError(
      'Failed to upload image. Please try again.',
    )
  } finally {
    setUploading(false)
  }
}

  const submit = async (
    event: FormEvent,
  ) => {
    event.preventDefault()

    // Guard against double submission and saving mid-upload.
    if (saving || uploading) {
      return
    }

    if (!form.name.trim()) {
      setError(
        'Please enter a product name.',
      )
      return
    }

    if (!form.description.trim()) {
      setError(
        'Please enter a short product description.',
      )
      return
    }

    if (!form.variants.length) {
      setError(
        'Please add at least one measurement and price.',
      )
      return
    }

    if (
      form.variants.some(
        (variant) => variant.price < 1,
      )
    ) {
      setError(
        'Please enter a price greater than 0 for every measurement.',
      )
      return
    }

    const selectedMeasurements =
      form.variants.map(
        (variant) =>
          variant.measurement,
      )

    if (
      new Set(selectedMeasurements).size !==
      selectedMeasurements.length
    ) {
      setError(
        'Each measurement can only be added once.',
      )
      return
    }

    /*
     * Important:
     *
     * When editing an existing product, keep its image_url exactly
     * as it is. form.image_url already holds either the product's
     * current image (loaded when the drawer opened) or a newly
     * uploaded URL, so editing never replaces a real image with the
     * category fallback.
     *
     * When adding a new product without an uploaded image, use the
     * category artwork as the fallback.
     */
    const imageUrl = editing
      ? form.image_url
      : form.image_url || artForCategory(form.category)

    setError('')
    setSaving(true)

    try {
      await onSave({
        ...form,

        name: form.name.trim(),

        description:
          form.description.trim(),

        image_url: imageUrl,

        variants: form.variants.map(
          (variant) => ({
            ...variant,
            measurement:
              variant.measurement.trim(),
          }),
        ),
      })

      /*
       * On success the parent closes the drawer and
       * unmounts it, so there is no state to reset here.
       */
    } catch {
      /*
       * The catalog layer already surfaces an error toast.
       * Keep the drawer open with the user's input intact
       * and re-enable the form so they can retry.
       */
      setError(
        'Something went wrong while saving. Please try again.',
      )
      setSaving(false)
    }
  }

  /*
   * Only use artForCategory as a visual fallback.
   *
   * Existing products from Supabase already have
   * image_url, so their real image is displayed.
   */
  const image =
    form.image_url ||
    artForCategory(form.category)

  return (
    <div
      className="drawer-layer"
      role="dialog"
      aria-modal="true"
      aria-label={
        editing
          ? 'Edit product'
          : 'Add product'
      }
    >
      <button
        className="drawer-backdrop"
        aria-label="Close product drawer"
        onClick={requestClose}
      />

      <section className="product-drawer">
        <div className="drawer-heading">
          <div>
            <p className="eyebrow">
              PRODUCT CATALOG
            </p>

            <h2>
              {editing
                ? 'Edit product'
                : 'Add product'}
            </h2>

            <p>
              {editing
                ? 'Update what customers see on your store.'
                : 'Add a product to your customer catalog.'}
            </p>
          </div>

          <button
            className="icon-button"
            aria-label="Close product drawer"
            onClick={requestClose}
            disabled={saving}
          >
            <Icon name="x" />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="drawer-form"
        >
          {error && (
            <div
              className="form-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <label>
            Product name

            <input
              autoFocus
              value={form.name}
              onChange={(event) =>
                update(
                  'name',
                  event.target.value,
                )
              }
              placeholder="e.g. Fresh Tomatoes"
            />
          </label>

          <label>
            Category

            <select
              value={form.category}
              onChange={(event) =>
                update(
                  'category',
                  event.target.value as Category,
                )
              }
            >
              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ),
              )}
            </select>
          </label>

          <label>
            Description

            <textarea
              value={form.description}
              onChange={(event) =>
                update(
                  'description',
                  event.target.value,
                )
              }
              placeholder="A short description customers will see"
              rows={3}
            />
          </label>

          <div className="variant-section">
            <div className="variant-section-heading">
              <div>
                <span className="field-label">
                  Measurements & Prices
                </span>

                <p>
                  Add the different sizes or quantities
                  customers can buy.
                </p>
              </div>

              <button
                type="button"
                className="text-button"
                onClick={addVariant}
              >
                <Icon
                  name="plus"
                  size={16}
                />

                Add measurement
              </button>
            </div>

            <div className="variant-list">
              {form.variants.map(
                (variant) => (
                  <div
                    className="variant-row"
                    key={variant.id}
                  >
                    <label>
                      <span className="sr-only">
                        Measurement
                      </span>

                      <select
                        value={
                          variant.measurement
                        }
                        onChange={(
                          event,
                        ) =>
                          updateVariant(
                            variant.id,
                            'measurement',
                            event.target.value,
                          )
                        }
                      >
                        {measurements.map(
                          (
                            measurement,
                          ) => (
                            <option
                              key={
                                measurement
                              }
                              value={
                                measurement
                              }
                            >
                              {
                                measurement
                              }
                            </option>
                          ),
                        )}
                      </select>
                    </label>

                    <label>
                      <span className="sr-only">
                        Price
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={
                          variant.price ||
                          ''
                        }
                        onChange={(
                          event,
                        ) =>
                          updateVariant(
                            variant.id,
                            'price',
                            Number(
                              event.target
                                .value,
                            ),
                          )
                        }
                        placeholder="Price"
                      />
                    </label>

                    <button
                      type="button"
                      className="icon-button variant-remove"
                      aria-label={`Remove ${variant.measurement}`}
                      onClick={() =>
                        removeVariant(
                          variant.id,
                        )
                      }
                    >
                      <Icon
                        name="trash"
                        size={16}
                      />
                    </button>
                  </div>
                ),
              )}
            </div>
          </div>

          <div>
            <span className="field-label">
              Product image
            </span>

            <div className="image-upload">
              <img
                src={image}
                alt="Product preview"
              />

              <div>
                <strong>
                  Product photo
                </strong>

                <p>
                  Upload a local image for
                  preview.
                </p>

                <button
                  type="button"
                  className="text-button"
                  onClick={() =>
                    fileInput.current?.click()
                  }
                  disabled={saving || uploading}
                >
                  <Icon
                    name="upload"
                    size={16}
                  />

                  {uploading
                    ? 'Uploading…'
                    : 'Choose image'}
                </button>

                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  onChange={
                    chooseImage
                  }
                  hidden
                />
              </div>
            </div>
          </div>

          <div className="availability-field">
            <div>
              <strong>
                Availability
              </strong>

              <p>
                Show this product to
                customers.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={
                form.available
              }
              onClick={() =>
                update(
                  'available',
                  !form.available,
                )
              }
              className={`switch ${
                form.available
                  ? 'on'
                  : ''
              }`}
            >
              <span />
            </button>
          </div>

          <div className="drawer-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={requestClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={saving || uploading}
              aria-busy={saving}
            >
              {saving ? (
                <>
                  <span
                    className="button-spinner"
                    aria-hidden="true"
                  />

                  {editing
                    ? 'Saving…'
                    : 'Adding…'}
                </>
              ) : editing ? (
                'Save Changes'
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}