export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  avatar?: string
  passport?: string
  pinfl?: string
  address?: string
  phone?: string
  createdAt: string
  updatedAt?: string
}

export type UserRole = 'student' | 'instructor' | 'admin'
