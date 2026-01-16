import { Agent, Scope } from '@smythos/sdk';

async function main() {

    const agentNeo = new Agent({
        id: 'agent-neo',
        teamId: 'the-matrix',
        name: 'Agent Neo',
        behavior: 'You are a helpful assistant that can answer questions and help with tasks.',
        model: 'gpt-4o',
    });

    const agentTrinity = new Agent({
        id: 'agent-trinity',
        teamId: 'the-matrix',
        name: 'Agent Trinity',
        behavior: 'You are a helpful assistant that can answer questions and help with tasks.',
        model: 'gpt-4o',
    });



    //in this first part, the scopes are isolated because we use the default storage scope
    const NeoStorage = agentNeo.storage.LocalStorage();
    const TrinityStorage = agentTrinity.storage.LocalStorage();


    await NeoStorage.write('neo.txt', 'Hello, Neo!');


    const neo_data = await NeoStorage.read('neo.txt');
    const trinity_data = await TrinityStorage.read('neo.txt');

    console.log('Neo reading neo.txt', neo_data?.toString()); //data = 'Hello, Neo!'
    console.log('Trinity reading neo.txt', trinity_data?.toString()); //data is empty



    //in this second part, the scopes are shared because we explicitly set the scope to Scope.TEAM
    //this means that all the agents in the same team share the same storage
    const neoSharedStorage = agentNeo.storage.LocalStorage({}, Scope.TEAM);
    const trinitySharedStorage = agentTrinity.storage.LocalStorage({}, Scope.TEAM);

    await neoSharedStorage.write('team.txt', 'Hello, Team!');

    const neo_data2 = await neoSharedStorage.read('team.txt');
    const trinity_data2 = await trinitySharedStorage.read('team.txt');

    console.log('Neo reading neo.txt', neo_data2?.toString()); //data = 'Hello, Team!'
    console.log('Trinity reading neo.txt', trinity_data2?.toString()); //data = 'Hello, Team!'

}

main();