import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Icon } from '../components/Icons'
import { useCatalog } from '../context/CatalogContext'
import { categories } from '../types'

export function Dashboard() {
  const { products, activities, loading } = useCatalog()

  const navigate = useNavigate()

  const available = products.filter(
    (product) => product.available,
  ).length

  const unavailable = products.length - available

  const totalMeasurements = useMemo(
    () =>
      products.reduce(
        (total, product) => total + product.variants.length,
        0,
      ),
    [products],
  )

  const categoriesUsed = useMemo(
    () => new Set(products.map((product) => product.category)).size,
    [products],
  )

  const categoryBreakdown = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          count: products.filter(
            (product) => product.category === category,
          ).length,
        }))
        .filter((item) => item.count > 0),
    [products],
  )

  const summaries = [
    {
      label: 'Total Products',
      value: products.length,
      icon: 'products' as const,
      detail: 'Products in your catalog',
    },
    {
      label: 'Available Products',
      value: available,
      icon: 'check' as const,
      detail: 'Visible to customers',
    },
    {
      label: 'Unavailable Products',
      value: unavailable,
      icon: 'x' as const,
      detail: 'Hidden from customers',
    },
  ]

  const overview = [
    {
      label: 'Total Measurements',
      value: totalMeasurements,
      detail: 'Sizes and quantities across your catalog',
    },
    {
      label: 'Categories Used',
      value: categoriesUsed,
      detail: 'Categories currently containing products',
    },
  ]

  if (loading) {
    return (
      <div className="page dashboard-page">
        <div className="page-intro">
          <div>
            <h2>Welcome back, Admin</h2>
            <p>
              Here’s a quick view of your Zorch Farms
              product catalog.
            </p>
          </div>
        </div>

        <div className="loading-state dashboard-loading">
          <div className="loading-spinner" />

          <h3>Loading your catalog</h3>

          <p>
            Fetching the latest product information...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page dashboard-page">
      <div className="page-intro">
        <div>
          <h2>Welcome back, Admin</h2>

          <p>
            Here’s a quick view of your Zorch Farms
            product catalog.
          </p>
        </div>
      </div>

      <section className="summary-grid">
        {summaries.map((summary) => (
          <article
            className="summary-card"
            key={summary.label}
          >
            <span className="summary-icon">
              <Icon name={summary.icon} />
            </span>

            <div>
              <p>{summary.label}</p>
              <strong>{summary.value}</strong>
              <small>{summary.detail}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-overview">
        {overview.map((item) => (
          <article
            className="overview-card"
            key={item.label}
          >
            <div>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </div>

            <small>{item.detail}</small>
          </article>
        ))}
      </section>

      {products.length === 0 ? (
        <section className="panel dashboard-empty-state">
          <span className="empty-icon">
            <Icon name="products" />
          </span>

          <h3>Your catalog is empty</h3>

          <p>
            Add your first product to start building
            your Zorch Farms catalog.
          </p>

          <button
            className="button button-primary"
            onClick={() =>
              navigate('/products', {
                state: { openAdd: true },
              })
            }
          >
            <Icon name="plus" size={18} />
            Add Your First Product
          </button>
        </section>
      ) : (
        <>
          <section className="panel category-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">CATALOG BREAKDOWN</p>
                <h3>Products by category</h3>
              </div>

              <button
                className="link-button"
                onClick={() => navigate('/products')}
              >
                Manage products
              </button>
            </div>

            {categoryBreakdown.length === 0 ? (
              <div className="category-empty">
                <p>No product categories available.</p>
              </div>
            ) : (
              <div className="category-list">
                {categoryBreakdown.map((item) => {
                  const percentage =
                    products.length > 0
                      ? Math.round(
                          (item.count / products.length) * 100,
                        )
                      : 0

                  return (
                    <div
                      className="category-row"
                      key={item.category}
                    >
                      <div className="category-row-heading">
                        <strong>{item.category}</strong>

                        <span>
                          {item.count}{' '}
                          {item.count === 1
                            ? 'product'
                            : 'products'}
                        </span>
                      </div>

                      <div className="category-progress">
                        <span
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section className="dashboard-grid">
            <article className="panel quick-actions">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">CATALOG</p>
                  <h3>Quick actions</h3>
                </div>
              </div>

              <p>
                Make changes to what customers can see
                in your store.
              </p>

              <div className="quick-action-buttons">
                <button
                  className="button button-primary"
                  onClick={() =>
                    navigate('/products', {
                      state: { openAdd: true },
                    })
                  }
                >
                  <Icon name="plus" size={18} />
                  Add Product
                </button>

                <button
                  className="button button-secondary"
                  onClick={() => navigate('/products')}
                >
                  Manage Products
                  <Icon name="arrowRight" size={17} />
                </button>
              </div>
            </article>

            <article className="panel updates-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">
                    CATALOG ACTIVITY
                  </p>

                  <h3>Recent Product Updates</h3>
                </div>

                <button
                  className="link-button"
                  onClick={() => navigate('/products')}
                >
                  View products
                </button>
              </div>

              {activities.length === 0 ? (
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-dot" />

                    <div>
                      <strong>No recent activity</strong>

                      <p>
                        Product changes will appear
                        here.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="activity-list">
                  {activities
                    .slice(0, 4)
                    .map((activity) => (
                      <div
                        className="activity-item"
                        key={activity.id}
                      >
                        <span className="activity-dot" />

                        <div>
                          <strong>
                            {activity.title}
                          </strong>

                          <p>{activity.detail}</p>
                        </div>

                        <small>{activity.time}</small>
                      </div>
                    ))}
                </div>
              )}
            </article>
          </section>
        </>
      )}
    </div>
  )
}