import { IAccessCandidate, IAccessRequest, TAccessLevel } from '@sre/types/ACL.types';
import { uid } from '@sre/utils/index';

export class AccessRequest implements IAccessRequest {
    public id: string;
    public resourceId: string;

    public level: TAccessLevel[] = [];
    public candidate: IAccessCandidate;

    constructor(object?: IAccessRequest | IAccessCandidate) {
        if (!object) {
            this.id = 'aclR:' + uid();
        }
        if (['role', 'id'].every((k) => k in object)) {
            //this is a candidate
            this.id = 'aclR:' + uid();
            this.candidate = object as IAccessCandidate;
        } else {
            const acReq: AccessRequest = object as AccessRequest;
            this.id = acReq.id;
            //this.resourceId = acReq.resourceId;
            this.level = acReq.level;
            this.candidate = acReq.candidate;
        }

        this.resourceId = undefined;
    }

    public static clone(request: IAccessRequest): AccessRequest {
        return new AccessRequest(request);
    }

    public setLevel(level: TAccessLevel | TAccessLevel[]): AccessRequest {
        this.level = Array.isArray(level) ? level : [level];
        return this;
    }
    public addLevel(level: TAccessLevel | TAccessLevel[]): AccessRequest {
        this.level = [...this.level, ...(Array.isArray(level) ? level : [level])];
        return this;
    }
    public resource(resourceId: string): AccessRequest {
        this.resourceId = resourceId;

        return this;
    }
    public setCandidate(candidate: IAccessCandidate): AccessRequest {
        this.candidate = candidate;

        return this;
    }
}
