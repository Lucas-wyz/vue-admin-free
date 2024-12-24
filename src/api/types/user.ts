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
 