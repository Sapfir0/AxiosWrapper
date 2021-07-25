import { isLeft, isRight } from 'fp-ts/lib/These';
import { ApiInteractionService } from '../src/ApiInteractionService';

const api = new ApiInteractionService('https://axoltlapi.herokuapp.com/');

async function getAxotle() {
    const response = await api.get('/');
    if (isRight(response)) {
        console.log(response.right);
    }
    if (isLeft(response)) {
        console.log(response.left);
        
    }
}

getAxotle()
