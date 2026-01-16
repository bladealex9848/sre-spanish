import { Agent, MCPTransport } from '@smythos/sdk';

async function main() {
    const agent = new Agent({
        name: 'CryptoMarket Assistant',
        behavior: 'You are a crypto price tracker. You are given a coin id and you need to get the price of the coin in USD',
        model: 'gpt-4o',
    });

    const skill = agent.addSkill({
        name: 'Price',
        description: 'Use this skill to get the price of a cryptocurrency',
        process: async ({ coin_id }) => {
            const url = `https://api.coingecko.com/api/v3/coins/${coin_id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
            const response = await fetch(url);
            const data = await response.json();
            return data.market_data.current_price;
        },
    });

    //you can describe the input parameters for the skill using skill.in() method
    skill.in({
        coin_id: {
            type: 'Text',
            description: 'The id of the coin to get the price of',            
        }
    });
    

    //run the agent as an MCP server
    const mcpUrl = await agent.mcp(MCPTransport.SSE, 3399);
    console.log(`MCP server started on ${mcpUrl}`);
}

main();
