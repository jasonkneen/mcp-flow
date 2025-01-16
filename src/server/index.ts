#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ErrorCode,
    ListToolsRequestSchema,
    McpError,
} from '@modelcontextprotocol/sdk/types.js';

class FlowServer {
    private server: Server;

    constructor() {
        this.server = new Server(
            {
                name: 'mcp-flow',
                version: '1.0.0',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.setupToolHandlers();

        // Error handling
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }

    private setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'create_flow',
                    description: 'Create a new flow diagram',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                description: 'Name of the flow',
                            },
                            nodes: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        type: { type: 'string' },
                                        position: {
                                            type: 'object',
                                            properties: {
                                                x: { type: 'number' },
                                                y: { type: 'number' },
                                            },
                                        },
                                        data: { type: 'object' },
                                    },
                                },
                            },
                            edges: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        source: { type: 'string' },
                                        target: { type: 'string' },
                                    },
                                },
                            },
                        },
                        required: ['name'],
                    },
                },
            ],
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            if (request.params.name !== 'create_flow') {
                throw new McpError(
                    ErrorCode.MethodNotFound,
                    `Unknown tool: ${request.params.name}`
                );
            }

            // Implementation for create_flow would go here
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            flowId: 'flow_' + Date.now(),
                            ...request.params.arguments,
                        }, null, 2),
                    },
                ],
            };
        });
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Flow MCP server running on stdio');
    }
}

const server = new FlowServer();
server.run().catch(console.error);