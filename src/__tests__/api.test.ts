import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { ApiInteractionService } from '../ApiInteractionService';
import { TEST_API_URL } from '../testConfig/config';

const api = new ApiInteractionService(TEST_API_URL);

const dogExample = {
    name: 'doggie',
    photoUrls: ['string'],
    status: 'available',
};

describe('CRUD', () => {
    test('post', async () => {
        const petEither = await api.post('/pet', dogExample)();

        expect(E.isRight(petEither)).toBeTruthy()
        if (E.isLeft(petEither)) return

        const response = await api.get(`/pet/${petEither.right.id}`)();
        expect(E.isRight(response)).toBeTruthy()
    });
});


export {};
