import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DeleteDialog } from '../components/DeleteDialog'
import { Icon } from '../components/Icons'
import { ProductDrawer } from '../components/ProductDrawer'
import { formatNaira, useCatalog } from '../context/CatalogContext'
import { categories, type Product } from '../types'

export function Products() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    loading,
  } = useCatalog()

  const location = useLocation()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [availability, setAvailability] = useState('All')
  const [drawer, setDrawer] = useState<'add' | 'edit' | null>(null)
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  useEffect(() => {
    if ((location.state as { openAdd?: boolean } | null)?.openAdd) {
      setDrawer('add')
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const filtered = useMemo(() => {
    // Normalise the query once instead of per-product inside the loop.
    const query = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        category === 'All' || product.category === category

      const matchesAvailability =
        availability === 'All' ||
        (availability === 'Available'
          ? product.available
          : !product.available)

      const matchesSearch =
        query === '' ||
        `${product.name} ${product.description}`
          .toLowerCase()
          .includes(query)

      return matchesCategory && matchesAvailability && matchesSearch
    })
  }, [products, category, availability, search])

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'All' ||
    availability !== 'All'

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
    setAvailability('All')
  }

  const openEdit = (product: Product) => {
    setActiveProduct(product)
    setDrawer('edit')
  }

  const closeDrawer = () => {
    setDrawer(null)
    setActiveProduct(null)
  }

  const save = async (product: Product | Omit<Product, 'id'>) => {
    /*
     * Await the catalog operation so the drawer can show a
     * saving state. addProduct / updateProduct re-throw on
     * failure, so closeDrawer only runs on success — a failed
     * save keeps the drawer open with the user's input intact.
     */
    if ('id' in product) {
      await updateProduct(product)
    } else {
      await addProduct(product)
    }

    closeDrawer()
  }

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return
    }

    /*
     * deleteProduct re-throws on failure, so the dialog only
     * closes once the delete has actually succeeded.
     */
    await deleteProduct(deleteTarget.id)

    setDeleteTarget(null)
  }

  return (
    <div className="page products-page">
      <div className="page-intro product-page-intro">
        <div>
          <h2>Products</h2>
          <p>
            Manage the products, prices and availability shown on your store.
          </p>
        </div>

        <button
          className="button button-primary"
          onClick={() => setDrawer('add')}
        >
          <Icon name="plus" size={18} />
          Add Product
        </button>
      </div>

      <section className="product-controls">
        <div className="search-box">
          <Icon name="search" size={19} />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
          />
        </div>

        <div className="filters">
          <label className="select-control">
            <span className="sr-only">Filter by category</span>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>All</option>

              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <Icon name="chevronDown" size={16} />
          </label>

          <label className="select-control">
            <span className="sr-only">Filter by availability</span>

            <select
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
            >
              <option>All</option>
              <option>Available</option>
              <option>Unavailable</option>
            </select>

            <Icon name="chevronDown" size={16} />
          </label>
        </div>
      </section>

      <section className="product-panel">
        {loading ? (
          <div className="loading-state">
            <div
              className="loading-spinner"
              aria-hidden="true"
            />

            <h3>Loading products...</h3>

            <p>Fetching your product catalog.</p>
          </div>
        ) : (
          <>
            {filtered.length === 0 ? (
              products.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">
                    <Icon name="products" />
                  </span>

                  <h3>No products yet</h3>

                  <p>
                    Add your first product to start building your catalog.
                  </p>

                  <button
                    className="button button-primary"
                    onClick={() => setDrawer('add')}
                  >
                    <Icon name="plus" size={18} />
                    Add Product
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">
                    <Icon name="search" />
                  </span>

                  <h3>No matching products</h3>

                  <p>
                    No products match your current search or filters. Try
                    adjusting or clearing them.
                  </p>

                  <button
                    className="button button-secondary"
                    onClick={clearFilters}
                  >
                    <Icon name="x" size={16} />
                    Clear filters
                  </button>
                </div>
              )
            ) : (
              <>
                <div className="results-count">
                  <span>
                    {filtered.length}{' '}
                    {filtered.length === 1 ? 'product' : 'products'} shown
                  </span>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="text-button clear-filters"
                      onClick={clearFilters}
                    >
                      <Icon name="x" size={14} />
                      Clear filters
                    </button>
                  )}
                </div>

                <div className="products-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Measurements & Prices</th>
                        <th>Availability</th>
                        <th className="actions-heading">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filtered.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <ProductCell product={product} />
                          </td>

                          <td>
                            <span className="category-text">
                              {product.category}
                            </span>
                          </td>

                          <td>
                            <div className="product-variants">
                              {product.variants.map((variant) => (
                                <div
                                  className="product-variant"
                                  key={variant.id}
                                >
                                  <span>{variant.measurement}</span>

                                  <strong>
                                    {formatNaira(variant.price)}
                                  </strong>
                                </div>
                              ))}
                            </div>
                          </td>

                          <td>
                            <Availability
                              available={product.available}
                            />
                          </td>

                          <td>
                            <div className="row-actions">
                              <button
                                className="table-action"
                                onClick={() => openEdit(product)}
                              >
                                <Icon name="edit" size={16} />
                                Edit
                              </button>

                              <button
                                className="table-action delete"
                                onClick={() =>
                                  setDeleteTarget(product)
                                }
                              >
                                <Icon name="trash" size={16} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="product-cards">
                  {filtered.map((product) => (
                    <article
                      className="product-card"
                      key={product.id}
                    >
                      <ProductCell product={product} />

                      <div className="product-card-details">
                        <div>
                          <span>Category</span>
                          <strong>{product.category}</strong>
                        </div>

                        <div className="product-card-variants">
                          <span>Measurements & Prices</span>

                          <div className="product-variants">
                            {product.variants.map((variant) => (
                              <div
                                className="product-variant"
                                key={variant.id}
                              >
                                <span>
                                  {variant.measurement}
                                </span>

                                <strong>
                                  {formatNaira(variant.price)}
                                </strong>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span>Availability</span>

                          <Availability
                            available={product.available}
                          />
                        </div>
                      </div>

                      <div className="product-card-actions">
                        <button
                          className="button button-secondary"
                          onClick={() => openEdit(product)}
                        >
                          <Icon name="edit" size={16} />
                          Edit
                        </button>

                        <button
                          className="button button-danger-quiet"
                          onClick={() =>
                            setDeleteTarget(product)
                          }
                        >
                          <Icon name="trash" size={16} />
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>

      {drawer && (
        <ProductDrawer
          product={drawer === 'edit' ? activeProduct : null}
          onClose={closeDrawer}
          onSave={save}
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          product={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  )
}

function ProductCell({ product }: { product: Product }) {
  return (
    <div className="product-cell">
      <img src={product.image_url || ''} alt="" />

      <div>
        <strong>{product.name}</strong>
        <small>{product.description}</small>
      </div>
    </div>
  )
}

function Availability({ available }: { available: boolean }) {
  return (
    <span
      className={`status-badge ${
        available ? 'available' : 'unavailable'
      }`}
    >
      <i />
      {available ? 'Available' : 'Unavailable'}
    </span>
  )
}