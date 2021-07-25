import { BaseApiInteractionService } from 'BaseApiInteractionService';
import IdentityServerInteractionService from 'IdentityServerInteractionService';
import { Container } from 'inversify';
import 'reflect-metadata';
import TokenService from 'TokenService';
import { IAuthInteractionService } from 'typings/ApiTypes';
import { SERVICE_IDENTIFIER } from './inversifyTypes';

const container = new Container();
container
    .bind<BaseApiInteractionService>(SERVICE_IDENTIFIER.BaseInteractionService)
    .to(BaseApiInteractionService)
    .inSingletonScope();

container.bind<TokenService>(SERVICE_IDENTIFIER.TokenService).to(TokenService);
container.bind<BaseApiInteractionService>(SERVICE_IDENTIFIER.BaseInteractionService).to(BaseApiInteractionService);

container
    .bind<IAuthInteractionService>(SERVICE_IDENTIFIER.IdentityServerInteractionService)
    .to(IdentityServerInteractionService);

export default container;
