import { AccessCandidate, ConnectorService } from '@smythos/sre';

export class Vault {
    /**
     * Get a value from the vault
     * @param key - The key to get the value for
     * @param candidate - The candidate to get the value for
     * @returns The value of the key
     */
    static async get(key: string, candidate?: AccessCandidate) {
        if (!candidate) candidate = AccessCandidate.team('default');
        const vaultConnector = ConnectorService.getVaultConnector();
        const vaultRequester = vaultConnector.requester(candidate);

        const value = await vaultRequester.get(key);
        return value;
    }

    /**
     * List all keys in the vault
     * @param candidate - The candidate to list the keys for
     * @returns An array of keys
     */
    static async listKeys(candidate?: AccessCandidate) {
        if (!candidate) candidate = AccessCandidate.team('default');

        const vaultConnector = ConnectorService.getVaultConnector();
        const vaultRequester = vaultConnector.requester(candidate);

        const keys = await vaultRequester.listKeys();
        return keys;
    }
}
