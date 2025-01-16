import type { McpServer, SearchOptions, InstallOptions, McpTools } from './types';

const mcpTools: McpTools = {
  searchMcpServers: async (options: SearchOptions): Promise<McpServer[]> => {
    try {
      const query = options.query ? 
        `${options.query} MCP Model Context Protocol in:name,description` : 
        'MCP Model Context Protocol in:name,description';
        
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.items.map((repo: any) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        stars: repo.stargazers_count
      }));
    } catch (error) {
      console.error('Error searching repositories:', error);
      return [];
    }
  },

  installMcpServer: async (options: InstallOptions): Promise<void> => {
    try {
      console.log('Installing server from:', options.url);
      // For now, just log the installation attempt
      // We'll implement actual installation later
    } catch (error) {
      console.error('Error installing MCP server:', error);
      throw error;
    }
  }
};

window.mcpTools = mcpTools;

export default mcpTools;
