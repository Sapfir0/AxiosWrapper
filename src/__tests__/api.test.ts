import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { ApiInteractionService } from '../ApiInteractionService';

const API_URL = 'https://axoltlapi.herokuapp.com/';

const api = new ApiInteractionService(API_URL);

test('basic', async () => {
    const response = await api.get('/')();
    expect(E.isRight(response)).toBe(true);
});

export {};
