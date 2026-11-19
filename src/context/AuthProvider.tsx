
import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { AuthContext } from './AuthContext'
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '../services/authService'
import type {
  AuthCredentials,
  RegisterData,
  User,
} from '../types/auth'

const TOKEN_KEY = 'blog-token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const [isLoading, setIsLoading] = useState(
    () => Boolean(localStorage.getItem(TOKEN_KEY)),
  )

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (!token) return

    async function restoreUser() {
      try {
        const data = await getCurrentUser(token!)
        setUser(data.user)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
      } finally {
        setIsLoading(false)
      }
    }

    restoreUser()
  }, [])

  async function login(data: AuthCredentials) {
    const response = await loginUser(data)

    localStorage.setItem(TOKEN_KEY, response.user.token)
    setUser(response.user)
  }

  async function register(data: RegisterData) {
    const response = await registerUser(data)

    localStorage.setItem(TOKEN_KEY, response.user.token)
    setUser(response.user)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
