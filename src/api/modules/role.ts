import { request } from '../request'
import type { Role, RoleView } from '../types/role'
import type { ApiPromise } from '../constants/responseCode'

export const roleApi = {
 
  getRoleList(): ApiPromise<Role[]> {
    return request.get('api/Roles', { params: { Page: 1, Size: 50 } })
  },

  getRole(id: string): ApiPromise<Role> {
    return request.get(`api/roles/${id}`)
  },

  createRole(role: Omit<Role, 'id' | 'created_at'>): ApiPromise<Role> {
    return request.post('api/roles', role)
  },

  updateRole(id: string, role: Partial<Role>): ApiPromise<Role> {
    return request.put(`api/roles/${id}`, role)
  },

  deleteRole(id: string): ApiPromise<void> {
    return request.delete(`api/roles/${id}`)
  },

  getRoleViewList(): ApiPromise<RoleView[]> {
    return request.get('api/Roles/list')
  },
}
