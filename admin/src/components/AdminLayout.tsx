import { useEffect, useState } from 'react'

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { Icon, type IconName } from './Icons'

import { Logo } from './Logo'

import { supabase } from '../lib/supabase'

const navigation: {
  to: string
  label: string
  icon: IconName
}[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
  },
  {
    to: '/products',
    label: 'Products',
    icon: 'products',
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: 'settings',
  },
]

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        navigate('/login', {
          replace: true,
        })
        return
      }

      setCheckingAuth(false)
    }

    void checkAuth()
  }, [navigate])

  useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login', {
          replace: true,
        })
      }
    },
  )

  return () => {
    subscription.unsubscribe()
  }
}, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()

    navigate('/login', {
      replace: true,
    })
  }

  const title =
    navigation.find((item) =>
      location.pathname.startsWith(item.to),
    )?.label ?? 'Admin portal'

  const closeMobile = () => setMobileOpen(false)

  if (checkingAuth) {
    return (
      <div className="auth-loading">
        Checking authentication...
      </div>
    )
  }

  return (
    <div
      className={`app-shell ${
        collapsed ? 'is-collapsed' : ''
      }`}
    >
      {mobileOpen && (
        <button
          className="mobile-backdrop"
          aria-label="Close navigation"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen ? 'mobile-open' : ''
        }`}
      >
        <div className="sidebar-top">
          <Logo compact={collapsed} />

          <button
            className="collapse-button"
            onClick={() =>
              setCollapsed((value) => !value)
            }
            title={
              collapsed
                ? 'Expand sidebar'
                : 'Collapse sidebar'
            }
            aria-label={
              collapsed
                ? 'Expand sidebar'
                : 'Collapse sidebar'
            }
          >
            <Icon
              name={
                collapsed
                  ? 'chevronRight'
                  : 'chevronLeft'
              }
            />
          </button>
        </div>

        <nav
          className="sidebar-nav"
          aria-label="Main navigation"
        >
          {navigation.map(
            ({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMobile}
                title={
                  collapsed
                    ? label
                    : undefined
                }
                className={({ isActive }) =>
                  `nav-item ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                <Icon name={icon} />
                <span>{label}</span>
              </NavLink>
            ),
          )}
        </nav>

        <div className="sidebar-bottom">
          <div
            className="admin-profile"
            title={
              collapsed
                ? 'Admin profile'
                : undefined
            }
          >
            <span className="profile-avatar">
              AO
            </span>

            <span className="profile-copy">
              <strong>Admin</strong>
              <small>Owner account</small>
            </span>
          </div>

          <button
            className="nav-item logout-button"
            title={
              collapsed ? 'Logout' : undefined
            }
            onClick={() =>
              void handleLogout()
            }
          >
            <Icon name="logout" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="workspace">
        <header className="app-header">
          <button
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() =>
              setMobileOpen(true)
            }
          >
            <Icon name="menu" />
          </button>

          <div>
            <p className="eyebrow">
              ZORCH FARMS
            </p>

            <h1>{title}</h1>
          </div>

          <div className="header-profile">
            <span className="profile-avatar">
              AO
            </span>

            <span>Admin</span>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}