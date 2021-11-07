import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BaseInteractionError } from '../errors/BaseInteractionError';
import { NetworkError } from '../errors/NetworkError';
import { ValidationError } from '../errors/ValidationError';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { TokensData } from './auth';
import { IData, RequestSettings } from './common';

export interface IApiHelper {
    request: <T>(promise: Promise<AxiosResponse>) => TaskEither<NetworkError, T>;
}

export interface IBaseInteractionService<URL extends string = string> {
    get: <T = any>(url: URL, data?: IData, settings?: RequestSettings) => TaskEither<BaseInteractionError, T>;
    post: <T = any>(url: URL, data?: IData, settings?: RequestSettings) => TaskEither<BaseInteractionError, T>;
    delete: <T = any>(url: URL, data?: IData, settings?: RequestSettings) => TaskEither<BaseInteractionError, T>;
    put: <T = any>(url: URL, data?: IData, settings?: RequestSettings) => TaskEither<BaseInteractionError, T>;
}

export interface IIdentityInteractionService<URL extends string = string> extends IBaseInteractionService<URL> {
    login: (username: string, password: string) => TaskEither<ValidationError, TokensData>;
    logout: () => TaskEither<BaseInteractionError, null>;
}
