import { AccessCandidate } from '../..';
import { ConnectorService } from '../../Core/ConnectorsService';

export type TCredentialsRequest = {
    vaultProvider?: string;
    keyName: string;
    mapping?: {
        [key: string]: string;
    };
};

/**
 * Get credentials from a vault
 *
 * @param candidate - The candidate requesting the credentials
 * @param credentialsRequest - The credentials request
 * @returns The credentials
 */
export async function getCredentials(
    candidate: AccessCandidate,
    credentialsRequest: TCredentialsRequest | string
): Promise<string | Record<string, any>> {
    if (typeof credentialsRequest === 'string') {
        credentialsRequest = {
            vaultProvider: '', //default vault provider
            keyName: credentialsRequest, //default key name
        };
    }

    const vaultConnector = ConnectorService.getVaultConnector(credentialsRequest.vaultProvider || '');
    const vaultRequester = vaultConnector.requester(candidate);
    const credentials = await vaultRequester.get(credentialsRequest.keyName);

    if (!credentialsRequest.mapping) return credentials;

    const mappedCredentials = {};
    for (const [key, value] of Object.entries(credentialsRequest.mapping)) {
        mappedCredentials[key] = JSONExpression(credentials, value);
    }

    return mappedCredentials;
}

/**
 * @param obj - The object to extract the property from
 * @param propertyString - The property to extract from the object
 * @returns The property value
 */
function JSONExpression(obj, propertyString) {
    const properties = propertyString.split(/\.|\[|\]\.|\]\[|\]/).filter(Boolean);
    let currentProperty = obj;

    for (let property of properties) {
        if (currentProperty === undefined || currentProperty === null) {
            return undefined;
        }

        currentProperty = currentProperty[property];
    }

    return currentProperty;
}
