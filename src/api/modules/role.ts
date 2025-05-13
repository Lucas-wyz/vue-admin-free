import { request } from '../request'
import type { Role } from '../types/role'
import type { ApiPromise } from '../constants/responseCode'

export const roleApi = {
 
  getRoleList(): ApiPromise<Role[]> {
    return request.get('api/Roles', { params: { Page: 1, Size: 50 } })
  },

  getRole(id: number): ApiPromise<Role> {
    return request.get(`api/roles/${id}`)
  },

  createRole(role: Omit<Role, 'id' | 'created_at'>): ApiPromise<Role> {
    return request.post('api/roles', role)
  },

  updateRole(id: number, role: Partial<Role>): ApiPromise<Role> {
    return request.put(`api/roles/${id}`, role)
  },

  deleteRole(id: number): ApiPromise<void> {
    return request.delete(`api/roles/${id}`)
  },
}
