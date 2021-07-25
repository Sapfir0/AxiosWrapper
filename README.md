
# Api interaction service

All services use `fp-ts` library, http methods wrapper return `fp-ts` either.
## Simple api interaction class
    import { ApiInteractionService } from 'api_interaction_services';

So you can use it as

    const fetcher = new ApiInteractionService("http://localhost:3300)


### Inversify

Or you can use this with inverisify in a few steps:

1. Declare SERVICE_IDENTIFIER name for service
    
        export const SERVICE_IDENTIFIER = {
            ApiInteractionService: Symbol.for('ApiInteractionService'),
        };

1. Bind this name to class with throwing url to API

        container.bind<ApiInteractionService>(SERVICE_IDENTIFIER.ApiInteractionService).toConstantValue(new ApiInteractionService(API_URL));

1. And now you can inject this service to your class

        constructor(@inject(SERVICE_IDENTIFIER.ApiInteractionService) protected _apiService: ApiInteractionService) {}


## Indendity interaction service

A more powerful tool that allows you to communicate with a closed API that requires access and refresh tokens.


    import { IdentityServerInteractionService } from 'api_interaction_services';

