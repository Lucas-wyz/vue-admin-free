import { request } from '../request'
import type { User, loginRes, loginUser, Accounts, UserView } from '../types/user'
import type { ApiPromise } from '../constants/responseCode'

export const userApi = {
  login(data: loginUser): ApiPromise<loginRes> {
    return request.post('/login.json', data)
  },

  loginJwtTest(data: loginUser): ApiPromise<loginRes> {
    return request.post('/api/login/JwtTest', data)
  },
  loginJwt(data: loginUser): ApiPromise<loginRes> {
    return request.post('/api/login/Jwt', data)
  },
  loginAnonymousJwt(data: loginUser): ApiPromise<loginRes> {
    return request.post('/api/login/AnonymousUsersJwt', data)
  },

  getUserList(): ApiPromise<UserView[]> {
    return request.get('/api/Users')
  },

  getUser(id: number): ApiPromise<User> {
    return request.get(`/user/${id}`)
  },

  createUser(user: Omit<User, 'id'>): ApiPromise<User> {
    return request.post('/api/Users', user)
  },

  updateUser(id: number, user: Partial<User>): ApiPromise<User> {
    return request.put(`/api/Users/${id}`, user)
  },

  deleteUser(id: number): ApiPromise<void> {
    return request.delete(`/api/Users/${id}`)
  },

  getEdit(id: string): ApiPromise<Accounts> {
    return request.get(`/api/Users/EditPassword/${id}`)
  },

  postEdit(id: string, accounts: Accounts): ApiPromise<Accounts> {
    return request.post(`/api/Users/EditPassword/${id}`, accounts)
  },
  postEditRole(id: string, list: string[]): ApiPromise<Accounts> {
    return request.post(`/api/Users/EditRole/${id}`, list)
  },
}
