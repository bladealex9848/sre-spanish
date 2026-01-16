import { Agent } from '@smythos/sdk';
import { SRE } from '@smythos/sre';
import util from 'util';

export default async function runSkill(args: any, flags: any) {
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

    //Importing the agent workflow
    const agent = Agent.import(agentPath);

    const result = await agent.call(flags.skill, flags.input);
    console.log(util.inspect(result, { showHidden: true, depth: null, colors: true }));
}
