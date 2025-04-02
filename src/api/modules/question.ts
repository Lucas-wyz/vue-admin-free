import { request } from '../request'
import type { Question } from '@/api'
import type { ApiPromise } from '../constants/responseCode'

export const questionApi = {
  getQuestionList(): ApiPromise<Question[]> {
    return request.get('/api/Questions')
  },
  createUser(user: Omit<Question, 'id'>): ApiPromise<Question> {
    return request.post('/api/Questions', user)
  },
  deleteQuestion(id: string): ApiPromise<Question> {
    return request.delete(`/api/Questions/${id}`)
  },
  updateUser(id: string, user: Partial<Question>): ApiPromise<Question> {
    return request.put(`/api/Questions/${id}`, user)
  },

  getRandom(): ApiPromise<Question> {
    return request.get(`/api/Questions/GetRandom`)
  },

  verify(id: string, user: Partial<Question>): ApiPromise<Question> {
    return request.post(`/api/Questions/verify/${id}`, user)
  },
}
