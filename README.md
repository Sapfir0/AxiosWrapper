
# Api interaction services

All services use `fp-ts` library, http methods wrapper return `fp-ts` either.
## Simple api interaction class
    import { ApiInteractionService } from 'api_interaction_services';

So you can use it as

```ts
    const fetcher = new ApiInteractionService("http://localhost:3300");
    fetcher.get('/');
```

## Indendity interaction service

A more powerful tool that allows you to communicate with a closed API that requires access and refresh tokens.

```ts
import { IdentityServerInteractionService } from 'api_interaction_services';
```


## Inversify

Or you can use this classes with inverisify in a few steps:

1. Declare SERVICE_IDENTIFIER name for service
```ts
export const SERVICE_IDENTIFIER = {
    ApiInteractionService: Symbol.for("ApiInteractionService"),
};
```

2. Bind this name to class with url to your API
```ts
container.bind<ApiInteractionService>(SERVICE_IDENTIFIER.ApiInteractionService).toConstantValue(new ApiInteractionService(API_URL));
```

3. And now you can inject this service to your class

```ts
constructor(@inject(SERVICE_IDENTIFIER.ApiInteractionService) protected _apiService: ApiInteractionService) {}
```

