import Joi from 'joi';

import { IAgent as Agent } from '@sre/types/Agent.types';
import { Component } from './Component.class';
import { ConnectorService } from '@sre/Core/ConnectorsService';
import { TemplateString } from '@sre/helpers/TemplateString.helper';
import { ICacheRequest } from '@sre/MemoryManager/Cache.service/CacheConnector';

const memory = {};
export class MemoryWriteKeyVal extends Component {
    protected configSchema = Joi.object({
        memoryName: Joi.string().max(255).allow('').label('Memory Name'),
        key: Joi.string().max(255).allow('').label('Key'),
        value: Joi.string().max(100000).allow('').label('Value'),
        scope: Joi.string().max(20).allow('').label('Scope'),
        ttl: Joi.number().min(300).max(604800).allow('').label('TTL'),
    });
    constructor() {
        super();
    }
    init() {}
    async process(input, config, agent: Agent) {
        await super.process(input, config, agent);

        const logger = this.createComponentLogger(agent, config);

        try {
            const cacheConnector = ConnectorService.getCacheConnector();
            const connectorRequester: ICacheRequest = cacheConnector.agent(agent.id);
            const teamId = agent.teamId;
            const agentId = agent.id;

            const memoryName = config.data.memoryName;
            const key = TemplateString(config.data.key).parse(input).result;
            const value = TemplateString(config.data.value).parse(input).result;
            const scope = config.data.scope;
            const ttl = scope === 'ttl' ? config?.data?.ttl : 3 * 60 * 60; // 3 hours default ttl

            const sessionId = agent.sessionId;
            const workflowId = agent.agentRuntime.workflowReqId;

            let scopeKey = '';
            if (scope === 'session') {
                scopeKey = sessionId;
            } else if (scope === 'request') {
                scopeKey = workflowId;
            } else if (scope === 'ttl') {
                scopeKey = 'ttl';
            }

            const scopeKeyId = `${agentId}:${memoryName}:${key}_scope`;
            await connectorRequester.set(scopeKeyId, JSON.stringify({ scope, value: scopeKey }), null, null, ttl);

            const fullKey = `${agentId}:${scopeKey}:${memoryName}:${key}`;
            await connectorRequester.set(fullKey, value, null, null, ttl);

            return { Key: key, _debug: logger.output };
        } catch (error: any) {
            return { _error: error.message, _debug: logger.output };
        }
    }
}
