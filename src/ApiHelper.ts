import { AxiosResponse } from 'axios';
import * as TE from 'fp-ts/lib/TaskEither';
import { injectable } from 'inversify';
import { NetworkError } from './errors/NetworkError';

@injectable()
export class ApiHelper {
    public request = <T>(promise: Promise<AxiosResponse<T>>) => {
        return TE.tryCatch(
            () => promise,
            (reason) => new NetworkError(`${reason}`),
        );
    };
}
