declare global {
  const use_mcp_tool: (params: {
    server_name: string;
    tool_name: string;
    arguments: any;
  }) => Promise<any>;

  interface Window {
    mcpTools: McpTools;
  }
}

export interface McpServer {
  name: string;
  url: string;
  description?: string;
  stars?: number;
}

export interface SearchOptions {
  query?: string;
  sort?: 'stars' | 'updated' | 'best-match';
}

export interface InstallOptions {
  url: string;
  configPath: string;
}

export interface McpTools {
  searchMcpServers: (options: SearchOptions) => Promise<McpServer[]>;
  installMcpServer: (options: InstallOptions) => Promise<void>;
}

export {};
