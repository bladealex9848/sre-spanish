import { ConnectorService } from '@sre/Core/ConnectorsService';
import { Logger } from '@sre/helpers/Log.helper';
//import { SmythRuntime } from '@sre/Core/SmythRuntime.class';
import { AccessRequest } from '@sre/Security/AccessControl/AccessRequest.class';
import { ACL } from '@sre/Security/AccessControl/ACL.class';
import { SecureConnector } from '@sre/Security/SecureConnector.class';
import { IAccessCandidate, TAccessLevel } from '@sre/types/ACL.types';

import { ManagedVaultConnector } from '../ManagedVaultConnector';

const console = Logger('NullManagedVault');
export class NullManagedVault extends ManagedVaultConnector {
    public name: string = 'NullManagedVault';

    constructor(protected _settings: any) {
        super(_settings);
    }

    @SecureConnector.AccessControl
    protected async get(acRequest: AccessRequest, keyId: string) {
        console.debug(`Ignored operation:NullManagedVault.get: ${keyId}`);
        return undefined;
    }

    @SecureConnector.AccessControl
    protected async set(acRequest: AccessRequest, keyId: string, value: string) {
        console.debug(`Ignored operation:NullManagedVault.set: ${keyId} = ${value}`);
    }

    @SecureConnector.AccessControl
    protected async delete(acRequest: AccessRequest, keyId: string) {
        console.debug(`Ignored operation:NullManagedVault.delete: ${keyId}`);
    }

    @SecureConnector.AccessControl
    protected async exists(acRequest: AccessRequest, keyId: string) {
        console.debug(`Ignored operation:NullManagedVault.exists: ${keyId}`);
        return false;
    }

    public async getResourceACL(resourceId: string, candidate: IAccessCandidate) {
        const accountConnector = ConnectorService.getAccountConnector();
        const teamId = await accountConnector.getCandidateTeam(candidate);

        const acl = new ACL();

        //give just read access by default
        //Cannot write to null vault
        acl.addAccess(candidate.role, candidate.id, TAccessLevel.Read);

        return acl;
    }
}
