import { request } from '../request'
import type { Role } from '../types/role'
import type { ApiPromise } from '../constants/responseCode'

export const roleApi = {
  getRoleList(): ApiPromise<Role[]> {
    return request.get('/roles.json')
  },

  getRole(id: number): ApiPromise<Role> {
    return request.get(`/roles/${id}`)
  },

  createRole(role: Omit<Role, 'id' | 'created_at'>): ApiPromise<Role> {
    return request.post('/roles', role)
  },

  updateRole(id: number, role: Partial<Role>): ApiPromise<Role> {
    return request.put(`/roles/${id}`, role)
  },

  deleteRole(id: number): ApiPromise<void> {
    return request.delete(`/roles/${id}`)
  },
}
