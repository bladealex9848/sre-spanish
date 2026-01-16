import { Hook } from '@oclif/core';

const hook: Hook.Preparse = async function (opts) {
    const argv = opts.argv;
    // Find the index of --chat or -c
    const chatFlagIndex = argv.findIndex((arg) => arg === '--chat' || arg === '-c');

    if (chatFlagIndex !== -1) {
        const nextArg = argv[chatFlagIndex + 1];

        // If --chat is present, but has no value after it
        // (either it's the last argument or the next one is a flag)
        if (nextArg === undefined || nextArg.startsWith('-')) {
            // It was called as `--chat` without a value.
            // We insert a default value for the model.
            argv.splice(chatFlagIndex + 1, 0, 'DEFAULT_MODEL');
        }
    }

    const mcpFlagIndex = argv.findIndex((arg) => arg === '--mcp');
    if (mcpFlagIndex !== -1) {
        const nextArg = argv[mcpFlagIndex + 1];
        if (nextArg === undefined || nextArg.startsWith('-')) {
            argv.splice(mcpFlagIndex + 1, 0, 'stdio');
        }
    }

    return argv;
};

export default hook;
