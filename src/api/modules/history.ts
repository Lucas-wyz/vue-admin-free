import { request } from '../request'
import type { MenuItem, MenuResponse, questionHistory } from '@/api'
import type { ApiPromise } from '../constants/responseCode'

export const questionHistoryApi = {
  getHistoryList(): ApiPromise<questionHistory[]> {
    return request.get('/apis/history.json')
  },
}
