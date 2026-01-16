//==[ SRE: ACL Types ]======================
export type AgentCallLog = {
    sourceId?: any;
    componentId?: any;
    domain?: any;
    input?: any;
    output?: any;
    inputTimestamp?: any;
    outputTimestamp?: any;
    result?: any;
    error?: any;
    sessionID?: any;
    tags?: string;
    step?: number;
    workflowID?: string;
    processID?: string;
};
