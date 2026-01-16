import { Agent, Component, Model } from '@smythos/sdk';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
async function main() {
    const agent = new Agent({
        name: 'Web Search Assistant',
        behavior: 'You are a web search assistant. You are given a search query and you need to get the results from the web',
        model: 'gpt-4o',
    });

    //#region [ Web Search Skill ] ================

    //Declaring a web search skill entry
    const wsSkill = agent.addSkill({
        name: 'WebSearch',
        description: 'Use this skill to get comprehensive web search results',
    });

    //Defining the inputs of the skill
    wsSkill.in({
        userQuery: {
            description: 'The search query to get the web search results of',
        },
    });

    //Creating a Tavily Web Search component
    const wsTavily = Component.TavilyWebSearch({
        searchTopic: 'general',
        sourcesLimit: 10,
        includeImages: false,
        includeQAs: false,
        timeRange: 'None',
    });

    //Connecting the default Tavily input (SearchQuery) to the skill "userQuery"
    wsTavily.in({
        SearchQuery: wsSkill.out.userQuery,
    });

    const wsOutput = Component.APIOutput({ format: 'minimal' });
    wsOutput.in({ WebSearch: wsTavily.out.Results });

    //#endregion

    console.log(agent.data);

    //const result = await agent.prompt('Hello, what is the price of bitcoin in USD');

    const result = await agent.call('MarketData', { coin_id: 'bitcoin' });

    console.log(result);
}

main();
