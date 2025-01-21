import { request } from '../request'
import type { Question } from '@/api'
import type { ApiPromise } from '../constants/responseCode'

export const questionApi = {
  getQuestionList(): ApiPromise<Question[]> {
    return request.get('/question.json')
  },
}
