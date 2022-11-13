import type { AxiosRequestConfig } from 'axios'

export interface IRequestSettings {
  host?: string
  config?: AxiosRequestConfig
  stringify?: boolean
  multipartData?: boolean
}

export interface IDataIndex {
  [name: string]: any
}

export type IData = IDataIndex | FormData
