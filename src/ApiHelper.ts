import type { AxiosResponse } from 'axios'
import * as TE from 'fp-ts/lib/TaskEither'

import { NetworkError } from './errors/NetworkError'

export class ApiHelper {
  public request = <T>(promise: Promise<AxiosResponse<T>>) => TE.tryCatch(
    () => promise,
    (reason) => new NetworkError(`${reason}`),
  )
}
