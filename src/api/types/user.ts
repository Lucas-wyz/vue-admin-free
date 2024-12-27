export interface User {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

export interface UserListResponse {
  data: User[]
}

export interface UserFormData {
  name: string
  email: string
  phone: string
  address: string
  is_active: boolean
  statusLoading: boolean
}
