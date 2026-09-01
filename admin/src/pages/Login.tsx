import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icons'
import { Logo } from '../components/Logo'
import { supabase } from '../lib/supabase'

export function Login() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const checkExistingSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        navigate('/dashboard', {
          replace: true,
        })
      }
    }

    void checkExistingSession()
  }, [navigate])

  const signIn = async (
    event: FormEvent,
  ) => {
    event.preventDefault()

    if (loading) {
      return
    }

    setError('')
    setLoading(true)

    try {
      const {
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        throw signInError
      }

      navigate('/dashboard', {
        replace: true,
      })
    } catch (error) {
      console.error(
        'Failed to sign in:',
        error,
      )

      setError(
        'Invalid email or password. Please check your details and try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async () => {
  if (!email.trim()) {
    setError('Enter your email address first.')
    return
  }

  setError('')
  setLoading(true)

  try {
    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/login`,
        },
      )

    if (resetError) {
      throw resetError
    }

    setError(
      'Password reset email sent. Check your inbox.',
    )
  } catch (error) {
    console.error(
      'Failed to send password reset email:',
      error,
    )

    setError(
      'Unable to send the reset email. Please check your email and try again.',
    )
  } finally {
    setLoading(false)
  }
}

  return (
    <main className="login-page">
      <section className="login-card">
        <Logo />

        <div className="login-intro">
          <p className="eyebrow">
            WELCOME BACK
          </p>

          <h1>Admin Portal</h1>

          <p>
            Sign in to manage products on your
            Zorch Farms store.
          </p>
        </div>

        <form
          onSubmit={signIn}
          className="login-form"
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
            Email

            <input
              type="email"
              placeholder="admin@zorchfarms.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password

            <div className="password-field">
              <input
                type={
                  visible
                    ? 'text'
                    : 'password'
                }
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setVisible(
                    (value) => !value,
                  )
                }
                aria-label={
                  visible
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                <Icon
                  name={
                    visible
                      ? 'eyeOff'
                      : 'eye'
                  }
                  size={18}
                />
              </button>
            </div>
          </label>

          <div className="login-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(
                    event.target.checked,
                  )
                }
              />

              Remember me
            </label>

          <button
  type="button"
  className="link-button"
  onClick={forgotPassword}
  disabled={loading}
>
  Forgot password?
</button>
          </div>

          <button
            className="button button-primary login-submit"
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span
                  className="button-spinner"
                  aria-hidden="true"
                />

                Signing in…
              </>
            ) : (
              <>
                Sign In

                <Icon
                  name="arrowRight"
                  size={18}
                />
              </>
            )}
          </button>
        </form>

        <p className="prototype-note">
          <Icon
            name="lock"
            size={15}
          />

          Secured by Supabase
          Authentication.
        </p>
      </section>

      <aside className="login-aside">
        <div>
          <span className="leaf-mark">
            ✦
          </span>

          <p className="eyebrow">
            PRODUCT CATALOG
          </p>

          <h2>
            Good food begins with a
            well-managed catalog.
          </h2>

          <p>
            Keep your products, prices and
            availability up to date in one
            simple place.
          </p>
        </div>
      </aside>
    </main>
  )
}