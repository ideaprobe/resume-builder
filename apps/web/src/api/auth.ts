import { api } from './client'
import type { User } from '../types/resume'

export interface LoginResponse {
  token: string
  user: User
}

export function login(username: string, password: string) {
  return api<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function fetchMe() {
  return api<User>('/api/auth/me')
}
