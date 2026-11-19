
import { createContext } from 'react'
import type {
    AuthCredentials,
    RegisterData,
    User,
} from '../types/auth'

export interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (data: AuthCredentials) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    logout: () => void
    setUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
