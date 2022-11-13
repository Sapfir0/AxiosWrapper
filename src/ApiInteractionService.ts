import * as qs from 'querystring'

import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import type { TaskEither } from 'fp-ts/lib/TaskEither'
import { bimap } from 'fp-ts/lib/TaskEither'
import { flow } from 'fp-ts/function'

import { ApiHelper } from './ApiHelper'
import { BaseInteractionError } from './errors/BaseInteractionError'
import type { NetworkError } from './errors/NetworkError'
import type { IBaseInteractionService } from './typings/ApiTypes'
import type { IData, IRequestSettings } from './typings/common'

export class ApiInteractionService<URL extends string = string> implements IBaseInteractionService<URL> {
  protected readonly defaultSettings = {
    host: this.API_URL,
  }

  private readonly _fetcher: ApiHelper

  constructor(private readonly API_URL: string) {
    this._fetcher = new ApiHelper()
  }

  public get<T = any>(
    url: URL,
    data?: any,
    settings: IRequestSettings = this.defaultSettings,
  ): TaskEither<BaseInteractionError, T> {
    return this.query<T>({
      method: 'get',
      url,
      params: data,
      baseURL: settings?.host,
      ...settings?.config,
    })
  }

  public post<T = any>(
    url: URL,
    data?: any,
    settings: IRequestSettings = this.defaultSettings,
  ): TaskEither<BaseInteractionError, T> {
    const parsedData = settings?.stringify ? qs.stringify(data) : data
    const parsedConfig = settings?.multipartData ? this.setMultipartDataHeader(settings.config) : settings.config

    return this.query<T>({
      method: 'post',
      url,
      baseURL: settings.host,
      data: parsedData,
      ...parsedConfig,
    })
  }

  public put<T = any>(
    url: URL,
    data?: IData,
    settings: IRequestSettings = this.defaultSettings,
  ): TaskEither<BaseInteractionError, T> {
    return this.query<T>({
      method: 'put',
      url,
      baseURL: settings.host,
      data,
      ...settings.config,
    })
  }

  public delete<T = any>(
    url: URL,
    data?: IData,
    settings: IRequestSettings = this.defaultSettings,
  ): TaskEither<BaseInteractionError, T> {
    return this.query<T>({
      method: 'delete',
      url,
      data,
      baseURL: settings.host,
      ...settings.config,
    })
  }

  private readonly query = <T>(config: AxiosRequestConfig) => flow<
            [AxiosRequestConfig],
            Promise<AxiosResponse<T>>,
            TaskEither<NetworkError, AxiosResponse<T>>,
            TaskEither<BaseInteractionError, T>
        >(
          axios.request,
          this._fetcher.request,
          bimap(
            (e: NetworkError) => new BaseInteractionError(e.message),
            (res: AxiosResponse<T>) => res.data,
          ),
        )(config)

  private readonly setMultipartDataHeader = (config?: AxiosRequestConfig) => {
    const newConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    }

    return newConfig
  }
}
