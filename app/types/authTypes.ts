import type { Role } from "~/constants/roles"

export type UserState = {
  id: string
  name: string
  email: string
  csrf: string
  loading: boolean
}

export type LoginInput = {
  email: string
  password: string
}

export type me = {
  id: number
  email: string
  govUsername: string
  role: Role
  firstName: string
  lastName: string
  assignedOperationId?: number | null
}

export type LoginResponse = {
  message: string
  upload: boolean
  sessionTime: number
  user: me
}

export type RegisterInput = {
  email: string
  password: string
  govUsername: string
  firstName: string
  lastName: string
  phone: string
}

export type RegisterResponse = {
  Register: string
  newUser: string
}

export type RouteParams = {
  id?: string
}
