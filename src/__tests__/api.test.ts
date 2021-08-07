import { ApiInteractionService } from '../ApiInteractionService';

const api = new ApiInteractionService('https://axoltlapi.herokuapp.com/');

async function getAxotle() {
    const response = await api.get('/');
    console.log(response);
}

test('basic', () => {
    getAxotle();
    expect(1 - 1).toBe(0);
});

export {};
