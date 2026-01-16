import express from 'express';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { ConnectorService, AgentProcess, SRE } from '@smythos/sre';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import fs from 'fs';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, Tool } from '@modelcontextprotocol/sdk/types.js';
import { Agent } from '../Agent/Agent.class';

export enum MCPTransport {
    STDIO = 'stdio',
    SSE = 'sse',
}

export type MCPSettings = {
    transport: MCPTransport;
    port?: number;
};

const DEFAULT_MCP_PORT = 3388;
/**
 * MCP (Model Context Protocol) server
 *
 * The MCP server is a server that can be used to interact with the agent
 *
 * The MCP server can be started in two ways:
 * - STDIO: The MCP server will be started in STDIO mode
 * - SSE: The MCP server will be started in SSE mode, this is case the listening url will be **http://localhost:<port>/mcp**
 *
 *
 */
export class MCP {
    private clientTransports = new Map<string, { transport: SSEServerTransport; server: Server }>();
    private _app: express.Application;
    private _port: number;
    private _server: Server;

    constructor(private agent: Agent) {}

    public async start(settings: MCPSettings): Promise<string> {
        if (settings.transport === MCPTransport.STDIO) {
            return await this.startStdioServer();
        }

        if (settings.transport === MCPTransport.SSE) {
            return await this.starSSEpServer(settings.port);
        }
    }

    public async startStdioServer(): Promise<string> {
        const agentData = this.agent.data;
        await this.getMCPServer(agentData, MCPTransport.STDIO, null);
        return 'stdio';
    }

    public async starSSEpServer(port): Promise<string> {
        const agentData = this.agent.data;
        this._app = express();
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: true }));
        this._app.get('/mcp', async (req, res) => {
            await this.getMCPServer(agentData, MCPTransport.SSE, res);
        });
        this._app.post('/message', async (req: any, res: any) => {
            const sessionId = req.query.sessionId;
            const transport = this.clientTransports.get(sessionId as string)?.transport;
            if (!transport) {
                return res.status(404).send({ error: 'Transport not found' });
            }
            await transport.handlePostMessage(req, res, req.body);
        });
        this._port = port || DEFAULT_MCP_PORT;

        return new Promise((resolve) => {
            this._app.listen(this._port, () => {
                resolve(`http://localhost:${this._port}/mcp`);
            });
        });
    }

    private getMCPServer = async (agentSource, transport: MCPTransport, res: any) => {
        let agentData;
        if (typeof agentSource === 'string') {
            if (!fs.existsSync(agentSource)) {
                throw new Error(`File ${agentSource} does not exist`);
            }

            agentData = JSON.parse(fs.readFileSync(agentSource, 'utf8'));
        } else {
            agentData = agentSource;
        }

        const formattedAgentData = { data: agentData };
        const agentDataConnector = ConnectorService.getAgentDataConnector();
        const openAPISpec = await agentDataConnector
            .getOpenAPIJSON(formattedAgentData, 'http://localhost/', agentData.version, true)
            .catch((error) => {
                console.error('Failed to get OpenAPI JSON:', error);
                return null;
            });
        this._server = new Server(
            {
                name: openAPISpec.info.title,
                version: openAPISpec.info.version,
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        // Extract available endpoints and their methods
        const tools: Tool[] = Object.entries(openAPISpec.paths).map(([path, methods]) => {
            const method = Object.keys(methods)[0];
            const endpoint = path.split('/api/')[1];
            const operation = methods[method];
            const schema = this.extractMCPToolSchema(operation, method);

            const properties = schema?.properties || {};
            for (const property in properties) {
                const propertySchema = properties[property];

                if (propertySchema.type === 'array') {
                    properties[property] = {
                        type: 'array',
                        items: {
                            type: ['string', 'number', 'boolean', 'object', 'array'],
                        },
                    };
                }
            }

            return {
                name: endpoint,
                description:
                    operation.summary || `Endpoint that handles ${method.toUpperCase()} requests to ${endpoint}. ` + `${schema?.description || ''}`,
                inputSchema: {
                    type: 'object',
                    properties: properties,
                    required: schema?.required || [],
                },
            };
        });

        // Tool handlers
        this._server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools,
        }));

        this._server.setRequestHandler(CallToolRequestSchema, async (request) => {
            try {
                const { name, arguments: args } = request.params;
                const agent = this.agent;

                const result = await agent.call(name, args);

                return {
                    content: [{ type: 'text', text: JSON.stringify(result) }],
                    isError: false,
                };
            } catch (error) {
                return {
                    content: [{ type: 'text', text: `Error processing request: ${error.message}` }],
                    isError: true,
                };
            }
        });

        if (transport === MCPTransport.STDIO) {
            const transport = new StdioServerTransport();
            await this._server.connect(transport);
            return this._server;
        }
        if (transport === MCPTransport.SSE) {
            const transport = new SSEServerTransport('/message', res);
            await this._server.connect(transport);
            this.clientTransports.set(transport.sessionId, { transport, server: this._server });
            return this._server;
        }

        throw new Error(`Invalid MCP server transport: ${transport}`);
    };

    /**
     * Stop the MCP server
     *
     * @example
     * ```typescript
     * const mcp = agent.mcp(MCPTransport.SSE, 3389);
     * mcp.stop();
     * ```
     */
    public stop() {
        this._server.close();
    }

    private extractMCPToolSchema(jsonSpec: any, method: string) {
        if (method.toLowerCase() === 'get') {
            const schema = jsonSpec?.parameters;
            if (!schema) return {};

            const properties = {};
            let required = [];

            schema.forEach((param) => {
                if (param.in === 'query') {
                    properties[param.name] = param.schema;
                    if (param.required) {
                        required.push(param.name);
                    }
                }
            });

            //deduplicate required
            required = [...new Set(required)];

            return {
                type: 'object',
                properties,
                required,
            };
        }
        const schema = jsonSpec?.requestBody?.content?.['application/json']?.schema;
        return schema;
    }
}
