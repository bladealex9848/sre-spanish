import { SmythLLMUsage, SmythTaskUsage } from '@sre/types/LLM.types';
import { TServiceRegistry } from '@sre/types/SRE.types';
import { EventEmitter } from 'events';

export type SystemEventMap = {
    'SRE:BootStart': [];
    'SRE:Booted': [TServiceRegistry];
    'SRE:Initialized': [any?];
    'USAGE:LLM': [SmythLLMUsage];
    'USAGE:API': any;
    'USAGE:TASK': [SmythTaskUsage];
};

const SystemEvents = new EventEmitter<SystemEventMap>();

export { SystemEvents };
