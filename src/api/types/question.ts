export interface QuestionList {
  label: string
  value: string | number
}

export interface Question {
  type: 'single' | 'multiple'
  title: string
  options: QuestionList[]
  correctAnswer: string | number | (string | number)[]
  explanation: string
}
