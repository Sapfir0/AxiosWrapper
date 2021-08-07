import { Container } from 'inversify';
import 'reflect-metadata';
import { ApiHelper } from '../ApiHelper';
import { BaseInteractionService } from '../BaseInteractionService';
import { IdentityServerInteractionService } from '../IdentityServerInteractionService';
import TokenService from '../TokenService';
import { IIdentityInteractionService } from '../typings/ApiTypes';
import { SERVICE_IDENTIFIER } from './inversifyTypes';

const container = new Container();

container.bind<BaseInteractionService>(SERVICE_IDENTIFIER.BaseInteractionService).to(BaseInteractionService);

container.bind<TokenService>(SERVICE_IDENTIFIER.TokenService).to(TokenService);
container.bind<ApiHelper>(SERVICE_IDENTIFIER.ApiHelper).to(ApiHelper);

container
    .bind<IIdentityInteractionService>(SERVICE_IDENTIFIER.IdentityServerInteractionService)
    .to(IdentityServerInteractionService);

    

export default container;
