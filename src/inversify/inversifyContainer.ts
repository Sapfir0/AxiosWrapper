import { ApiHelper } from '../ApiHelper';
import IdentityServerInteractionService from '../IdentityServerInteractionService';
import { Container } from 'inversify';
import 'reflect-metadata';
import TokenService from '../TokenService';
import { IAuthInteractionService } from 'typings/ApiTypes';
import { SERVICE_IDENTIFIER } from './inversifyTypes';

const container = new Container();
container
    .bind<ApiHelper>(SERVICE_IDENTIFIER.BaseInteractionService)
    .to(ApiHelper)
    .inSingletonScope();

container.bind<TokenService>(SERVICE_IDENTIFIER.TokenService).to(TokenService);
container.bind<ApiHelper>(SERVICE_IDENTIFIER.BaseInteractionService).to(ApiHelper);

container
    .bind<IAuthInteractionService>(SERVICE_IDENTIFIER.IdentityServerInteractionService)
    .to(IdentityServerInteractionService);

export default container;
