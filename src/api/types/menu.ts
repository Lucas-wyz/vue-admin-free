export interface MenuItem {
  path: string
  title: string
  icon?: string
  children?: MenuItem[]
}

export interface MenuResponse {
  code: number
  data: MenuItem[]
  message: string
}
