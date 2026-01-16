import { ConnectorService } from '@sre/Core/ConnectorsService';
import { SmythRuntime } from '@sre/Core/SmythRuntime.class';
import { ModelsProviderConnector } from '@sre/LLMManager/ModelsProvider.service/ModelsProviderConnector';
import { testData } from './test-data-manager';

export function setupSRE(extendedConfig?: Record<string, any>) {
    const completeConfig = {
        Storage: {
            Connector: 'LocalStorage',
        },
        Cache: {
            Connector: 'RAM',
        },
        AgentData: {
            Connector: 'Local',
            Settings: {
                devDir: testData.getDataPath('AgentData'),
                prodDir: testData.getDataPath('AgentData'),
            },
        },
        Account: {
            Connector: 'JSONFileAccount',
            Settings: {
                file: testData.getDataPath('account.json'),
            },
        },
        Vault: {
            Connector: 'JSONFileVault',
            Settings: {
                file: testData.getVaultPath(),
            },
        },

        ...extendedConfig,
    };
    const SREInstance = SmythRuntime.Instance.init(completeConfig);

    return { SREInstance };
}
