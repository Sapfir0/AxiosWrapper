import { AxiosRequestConfig } from 'axios';
import { BaseInteractionService } from 'BaseInteractionService';
import { BaseInteractionError } from 'errors/BaseInteractionError';
import { Either } from 'fp-ts/lib/Either';
import { injectable } from 'inversify';
import { IData, RequestSettings } from 'typings/common';

@injectable()
export class ApiInteractionService {
    constructor(private API_URL: string, private baseApiInteractionService: BaseInteractionService) {}

    public async get<T = any>(
        url: string,
        data?: IData,
        host: string = this.API_URL,
        config?: AxiosRequestConfig,
    ): Promise<Either<BaseInteractionError, T>> {
        return this.baseApiInteractionService.get<T>(url, data, host, config);
    }

    public async post<T = any>(
        url: string,
        data?: IData,
        host: string = this.API_URL,
        settings?: RequestSettings,
        config?: AxiosRequestConfig,
    ): Promise<Either<BaseInteractionError, T>> {
        return this.baseApiInteractionService.post<T>(url, data, host, settings, config);
    }

    public async put<T = any>(
        url: string,
        data?: IData,
        host: string = this.API_URL,
        config?: AxiosRequestConfig,
    ): Promise<Either<BaseInteractionError, T>> {
        return this.baseApiInteractionService.put<T>(url, data, host, config);
    }

    public async delete<T = any>(
        url: string,
        data?: IData,
        host: string = this.API_URL,
        config?: AxiosRequestConfig,
    ): Promise<Either<BaseInteractionError, T>> {
        return this.baseApiInteractionService.delete<T>(url, data, host, config);
    }
}
