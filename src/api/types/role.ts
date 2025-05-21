export interface RoleView {
  id: string
  name: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string
  created_at?: string
  updated_at?: string
  is_active: boolean
  statusLoading: boolean
}

export interface RoleFormData {
  id: string
  name: string
  description: string
  permissions: string
  is_active: boolean
  statusLoading: boolean
}
