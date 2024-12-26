export interface Role {
  id: number
  name: string
  description: string
  permissions?: string[]
  created_at?: string
  updated_at?: string
  is_active: boolean
  statusLoading: boolean
}

export interface RoleFormData {
  name: string
  description: string
  permissions?: string[]
  is_active: boolean
  statusLoading: boolean
}
