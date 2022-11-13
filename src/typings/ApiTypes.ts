import type { AxiosResponse } from 'axios'
import { AxiosRequestConfig } from 'axios'
import type { TaskEither } from 'fp-ts/lib/TaskEither'

import type { BaseInteractionError } from '../errors/BaseInteractionError'
import type { NetworkError } from '../errors/NetworkError'
import type { ValidationError } from '../errors/ValidationError'

import type { ITokensData } from './auth'
import type { IData, IRequestSettings } from './common'

export interface IApiHelper {
  request<T>(promise: Promise<AxiosResponse>): TaskEither<NetworkError, T>
}

export interface IBaseInteractionService<URL extends string = string> {
  get<T>(url: URL, data?: IData, settings?: IRequestSettings): TaskEither<BaseInteractionError, T>
  post<T>(url: URL, data?: IData, settings?: IRequestSettings): TaskEither<BaseInteractionError, T>
  delete<T>(url: URL, data?: IData, settings?: IRequestSettings): TaskEither<BaseInteractionError, T>
  put<T>(url: URL, data?: IData, settings?: IRequestSettings): TaskEither<BaseInteractionError, T>
}

export interface IIdentityInteractionService<URL extends string = string> extends IBaseInteractionService<URL> {
  login(username: string, password: string): TaskEither<ValidationError, ITokensData>
  logout(): TaskEither<BaseInteractionError, null>
}
