import { useState, type ReactNode } from 'react'
import { readString, removeKey, writeString } from '../lib/storage'
import { AuthContext, type User } from './authState'

const AUTH_KEY = 'epasluga-auth'

// Демо-пользователь: в продукте профиль приходит с сервера после входа через МСИ
const MOCK_USER: User = {
  id: '1140390A012PB8',
  name: 'Иванов Алексей Сергеевич',
  email: 'a.ivanov@example.by',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // В прототипе «сессия» — флаг в localStorage. В продукте — httpOnly-cookie сервера
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return readString(AUTH_KEY) === 'true'
  })

  const login = () => {
    writeString(AUTH_KEY, 'true')
    setIsAuthenticated(true)
  }

  const logout = () => {
    removeKey(AUTH_KEY)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user: isAuthenticated ? MOCK_USER : null, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
