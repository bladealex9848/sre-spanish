import { AccessCandidate, ConnectorService, IAccessCandidate, IVaultRequest, VaultConnector } from '@smythos/sre';
import { SRE } from '@smythos/sre';
import { SDKObject } from '../Core/SDKObject.class';

export class VaultInstance extends SDKObject {
    #candidate: IAccessCandidate;
    #vaultRequester: IVaultRequest;
    constructor(candidate?: AccessCandidate) {
        super();
        this.#candidate = candidate || AccessCandidate.team('default');
    }

    protected async init() {
        //if the SRE instance is not initializing, initialize it with default settings
        if (!SRE.initializing) SRE.init({});
        await SRE.ready();
        const vaultConnector = ConnectorService.getVaultConnector();
        this.#vaultRequester = vaultConnector.requester(this.#candidate);

        this._readyPromise.resolve(true);
    }

    /**
     * Get a value from the vault
     * @param key - The key to get the value for
     * @returns The value of the key
     */
    public async get(key: string) {
        const value = await this.#vaultRequester.get(key);
        return value;
    }

    /**
     * List all keys in the vault
     * @returns An array of keys
     */
    public async listKeys() {
        const keys = await this.#vaultRequester.listKeys();
        return keys;
    }
}
