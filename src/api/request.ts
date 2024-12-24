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
  adapter: async (config: AxiosRequestConfig) => {
    const { method = 'GET', headers = {}, data, url } = config
    const fetchConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
      signal,
    }

    try {
      const response = await fetch(`${config.baseURL}${url}`, fetchConfig)
      const res: ApiResponse = await response.json()
      if (res.code !== 200) {
        // 统一错误处理
        throw new Error(res.message || '请求失败')
      }
      return {
        data: res.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config,
        request: response,
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('请求被取消')
        return
      }
      throw error
    }
  },
})

export { request, controller as source }
