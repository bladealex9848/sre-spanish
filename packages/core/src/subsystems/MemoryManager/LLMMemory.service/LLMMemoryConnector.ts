import { AccessCandidate } from '@sre/Security/AccessControl/AccessCandidate.class';
import { AccessRequest } from '@sre/Security/AccessControl/AccessRequest.class';
import { ACL } from '@sre/Security/AccessControl/ACL.class';
import { SecureConnector } from '@sre/Security/SecureConnector.class';
import { IAccessCandidate } from '@sre/types/ACL.types';

export interface ILLMMemoryRequest {
    load: (messages: any[]) => Promise<any>;


}

export abstract class LLMMemoryConnector extends SecureConnector {
    public abstract getResourceACL(resourceId: string, candidate: IAccessCandidate): Promise<ACL>;
    public requester(candidate: AccessCandidate): ILLMMemoryRequest {
        return {
            load: async (messages: any[]) => {
                return await this.load(candidate.readRequest, messages);
            },            
        };
    }

    abstract load(acRequest: AccessRequest, messages: any[]): Promise<any>;


}
