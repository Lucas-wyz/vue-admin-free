export interface Option {
  id: number
  question_id: number
  option_text: string
  option_value: string | number
  sort_order: number
  is_active: boolean
}

export interface Question {
  id: number
  question_type: 'single' | 'multiple'
  question_title: string
  options: Option[]
  correct_answer: string | number | (string | number)[]
  explanation_text: string
  difficulty_level: 'easy' | 'medium' | 'hard'
  category_id: number
  category_name: string
  tag_ids: number[]
  tag_names: string[]
  is_active: boolean
  score_value: number
}

export interface QuestionResponse {
  code: number
  data: Question[]
  message: string
}

export interface QuestionCategory {
  id: number
  category_name: string
  category_code: string
  parent_id: number | null
  sort_order: number
  is_active: boolean
}

export interface QuestionTag {
  id: number
  tag_name: string
  tag_code: string
  is_active: boolean
}
