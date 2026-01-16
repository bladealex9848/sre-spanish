import { Agent } from '@smythos/sdk';
import { SRE } from '@smythos/sre';
import ora from 'ora';

export default async function runPrompt(args: any, flags: any) {
    const sreConfigs: any = {};
    if (flags.vault) {
        sreConfigs.Vault = {
            Connector: 'JSONFileVault',
            Settings: {
                file: flags.vault,
            },
        };
    }
    if (flags.models) {
        sreConfigs.ModelsProvider = {
            Connector: 'JSONModelsProvider',
            Settings: {
                models: flags.models,
                mode: 'merge',
            },
        };
    }
    SRE.init(sreConfigs);
    await SRE.ready();
    const agentPath = args.path;
    const prompt = flags.prompt;
    const model = flags.promptModel || 'gpt-4o';

    //Importing the agent workflow
    const agent = Agent.import(agentPath, {
        model,
    });

    const spinner = ora({
        text: 'Thinking...',
        //spinner: 'moon',
    }).start();

    try {
        const result = await agent.prompt(prompt);
        spinner.stop();

        console.log(`\n${result}\n`);
    } catch (error) {
        spinner.fail('An error occurred.');
        console.error(error);
    }
}
