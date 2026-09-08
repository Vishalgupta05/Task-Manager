import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password })
    persistAuth(data)
    return data
  }

  const register = async (username, email, password) => {
    const { data } = await api.post('/auth/register', { username, email, password })
    persistAuth(data)
    return data
  }

  const persistAuth = (data) => {
    localStorage.setItem('token', data.token)
    const userInfo = { userId: data.userId, username: data.username, email: data.email }
    localStorage.setItem('user', JSON.stringify(userInfo))
    setUser(userInfo)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
