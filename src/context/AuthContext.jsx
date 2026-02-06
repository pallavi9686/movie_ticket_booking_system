import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  function signup(email, password, name) {
    setIsLoading(true)
    setError(null)
    
    try {
      // Validate inputs
      if (!email || !password || !name) {
        throw new Error('All fields are required')
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email format')
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      if (users.some(u => u.email === email)) {
        throw new Error('Email already registered')
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        email,
        name,
        password: btoa(password), // Basic encoding (not secure - use proper hashing in production)
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))

      // Set current user
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      setIsLoading(false)
      
      return { success: true }
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      return { success: false, error: err.message }
    }
  }

  function signin(email, password) {
    setIsLoading(true)
    setError(null)
    
    try {
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const foundUser = users.find(u => u.email === email && u.password === btoa(password))

      if (!foundUser) {
        throw new Error('Invalid email or password')
      }

      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      setIsLoading(false)
      
      return { success: true }
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      return { success: false, error: err.message }
    }
  }

  function logout() {
    setUser(null)
    setError(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, error, signup, signin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
