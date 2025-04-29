export interface Paper {
  id: number
  title: string
  description: string
  duration_minutes: number
  total_score: number
  pass_score: number
  questions: {
    question_id: number
    score: number
    sort_order: number
  }[]
  category_id: number
  category_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PaperResponse {
  code: number
  data: Paper[]
  message: string
}

export interface PaperDetail extends Paper {
  questionList: import('./question').Question[]
}

export interface PaperDetailResponse {
  code: number
  data: PaperDetail
  message: string
}
