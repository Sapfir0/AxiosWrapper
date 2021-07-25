import 'reflect-metadata';
import { ApiHelper } from '../ApiHelper';
import IdentityServerInteractionService from '../IdentityServerInteractionService';
import { Container } from 'inversify';
import TokenService from '../TokenService';
import { IAuthInteractionService } from '../typings/ApiTypes';
import { SERVICE_IDENTIFIER } from './inversifyTypes';
import { BaseInteractionService } from '../BaseInteractionService';

const container = new Container();

container.bind<BaseInteractionService>(SERVICE_IDENTIFIER.BaseInteractionService).to(BaseInteractionService);

container.bind<TokenService>(SERVICE_IDENTIFIER.TokenService).to(TokenService);
container.bind<ApiHelper>(SERVICE_IDENTIFIER.ApiHelper).to(ApiHelper);

container
    .bind<IAuthInteractionService>(SERVICE_IDENTIFIER.IdentityServerInteractionService)
    .to(IdentityServerInteractionService);

export default container;
