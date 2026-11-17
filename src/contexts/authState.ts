import { createContext } from 'react'

export type User = {
  id: string
  name: string
  email: string
}

export type AuthContextType = {
  isAuthenticated: boolean
  user: User | null
  login: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
