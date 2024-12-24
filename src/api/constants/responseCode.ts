export enum ResponseCode {
  SUCCESS = 200,
  PARAM_ERROR = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export const ResponseMessage: Record<ResponseCode, string> = {
  [ResponseCode.SUCCESS]: '请求成功',
  [ResponseCode.PARAM_ERROR]: '参数错误',
  [ResponseCode.UNAUTHORIZED]: '未授权',
  [ResponseCode.FORBIDDEN]: '禁止访问',
  [ResponseCode.NOT_FOUND]: '资源不存在',
  [ResponseCode.SERVER_ERROR]: '服务器错误',
}

export interface ApiResponse<T = any> {
  code: ResponseCode
  data: T
  message: string
}

export type ApiPromise<T> = Promise<ApiResponse<T>>
