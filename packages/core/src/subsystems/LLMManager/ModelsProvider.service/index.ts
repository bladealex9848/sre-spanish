//==[ SRE: ModelsProvider ]======================

import { ConnectorService, ConnectorServiceProvider } from '@sre/Core/ConnectorsService';
import { TConnectorService } from '@sre/types/SRE.types';
import { JSONModelsProvider } from './connectors/JSONModelsProvider.class';

export class ModelsProviderService extends ConnectorServiceProvider {
    public register() {
        ConnectorService.register(TConnectorService.ModelsProvider, 'JSONModelsProvider', JSONModelsProvider);
    }
}
