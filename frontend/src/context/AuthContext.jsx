import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { currentUser, login as loginRequest } from '../api/authApi'
import { clearToken, getToken, setToken } from '../api/axiosClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!getToken()) {
      setReady(true)
      return
    }
    currentUser()
      .then(setUser)
      .catch(() => {
        clearToken()
        setUser(null)
      })
      .finally(() => setReady(true))
  }, [])

  async function login(email, password) {
    const session = await loginRequest({ email: email.trim(), password })
    setToken(session.token)
    const profile = await currentUser()
    setUser(profile)
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, ready, login, logout }),
    [user, ready],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
