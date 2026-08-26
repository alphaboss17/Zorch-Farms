import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import { Navigate } from 'react-router-dom'

import { supabase } from '../lib/supabase'

export function ProtectedRoute({
  children,
}: {
  children: ReactNode
}) {
  const [loading, setLoading] = useState(true)

  const [authenticated, setAuthenticated] =
    useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setAuthenticated(Boolean(session))
      setLoading(false)
    }

    void checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthenticated(
          Boolean(session),
        )
      },
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="loading-state">
        <span
          className="loading-spinner"
          aria-hidden="true"
        />

        <h3>Checking authentication...</h3>

        <p>
          Please wait while we verify your
          session.
        </p>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return <>{children}</>
}