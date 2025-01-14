import { request } from '../request'
import type { MenuItem, MenuResponse } from '@/api'
import type { ApiPromise } from '../constants/responseCode'

export const menuApi = {
  getMenuList(): ApiPromise<MenuItem[]> {
    return request.get('/apis/menu.json')
  },

  getUser(id: number): ApiPromise<MenuItem> {
    return request.get(`/menu/${id}`)
  },

  deleteUser(id: number): ApiPromise<void> {
    return request.delete(`/menu/${id}`)
  },
}
