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

// Add a request interceptor
request.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Add a response interceptor
request.interceptors.response.use(
  function (response) {
    let data: ApiResponse = response.data
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return { ...response, data: data.data }
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export { request, controller as source }
