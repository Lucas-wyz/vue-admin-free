import { request } from '../request'
import type { Paper, PaperDetail } from '../types/paper'
import type { ApiPromise } from '../constants/responseCode'

export const paperApi = {
  getPaperList(): ApiPromise<Paper[]> {
    return request.get('/paper.json')
  },

  getPaperDetail(id: number): ApiPromise<PaperDetail> {
    return request.get(`/paper/${id}.json`)
  },
}
