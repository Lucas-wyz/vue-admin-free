import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiResponse } from './constants/responseCode'

// 创建取消令牌源
const controller = new AbortController()
const signal = controller.signal

const request = axios.create({
  //   baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: '',
  timeout: 5000,
  adapter: 'fetch',
})

export { request, controller as source }
