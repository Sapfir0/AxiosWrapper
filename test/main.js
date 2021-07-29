const BaseInteractionService = require('api_interaction_services').BaseInteractionService;

const api = new BaseInteractionService('https://axoltlapi.herokuapp.com/');

async function getAxotle() {
    const response = await api.get('/');
    console.log(response);
}

getAxotle();
