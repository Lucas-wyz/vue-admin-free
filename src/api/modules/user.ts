import { request } from '../request'
import type { User, loginRes, loginUser } from '../types/user'
import type { ApiPromise } from '../constants/responseCode'

export const userApi = {
  login(data: loginUser): ApiPromise<loginRes> {
    return request.post('/login.json', data)
  },

  getUserList(): ApiPromise<User[]> {
    return request.get('/user.json')
  },

  getUser(id: number): ApiPromise<User> {
    return request.get(`/user/${id}`)
  },

  createUser(user: Omit<User, 'id'>): ApiPromise<User> {
    return request.post('/user', user)
  },

  updateUser(id: number, user: Partial<User>): ApiPromise<User> {
    return request.put(`/user/${id}`, user)
  },

  deleteUser(id: number): ApiPromise<void> {
    return request.delete(`/user/${id}`)
  },
}
