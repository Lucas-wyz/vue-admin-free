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
  id: number
  name: string
  email: string
  phone: string
  address: string
  is_active: boolean
  statusLoading: boolean
}

export interface loginRes {
  authentication: boolean
  token: string
}

export interface loginUser {
  /**
   * 默认用户名
   * @type {string}
   */
  username: string

  /**
   * 默认密码
   * @type {string}
   */
  password: string
}

export interface Accounts {
  id: number | null

  uid: string | null
  Name: string | null
  account: string | null
  password: string | null
}
