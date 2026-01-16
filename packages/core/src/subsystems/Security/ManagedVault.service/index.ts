import { ConnectorService, ConnectorServiceProvider } from '@sre/Core/ConnectorsService';
import { TConnectorService } from '@sre/types/SRE.types';

import { SecretManagerManagedVault } from './connectors/SecretManagerManagedVault';
import { NullManagedVault } from './connectors/NullManagedVault.class';

export class ManagedVaultService extends ConnectorServiceProvider {
    public register() {
        ConnectorService.register(TConnectorService.ManagedVault, 'SecretManagerManagedVault', SecretManagerManagedVault);
        ConnectorService.register(TConnectorService.ManagedVault, 'NullManagedVault', NullManagedVault);
    }
}
