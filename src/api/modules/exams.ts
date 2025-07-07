import { request } from '../request'
import type { exams } from '@/api'
import type { ApiPromise } from '../constants/responseCode'

export const examsApi = {
  getExamList(): ApiPromise<exams[]> {
    return request.get('/api/exams')
  },
}
