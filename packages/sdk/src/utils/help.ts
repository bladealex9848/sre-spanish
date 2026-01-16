import { SDKLog } from './console.utils';

const console = SDKLog;

export const HELP = {
    SRE: {
        SECURITY_MODEL: '',
    },
    SDK: {
        AGENT_STORAGE_ACCESS: '',
        AGENT_VECTORDB_ACCESS: '',
        CHAT_PERSISTENCE: '',
    },
};

export function showHelp(url: string, message: string = 'Learn more:') {
    if (!url) return;

    console.log(`${message} ${url}\n`);
}
