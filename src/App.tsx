import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from 'reactflow';
import { Sidebar } from './components/Sidebar';
import type { McpServer } from './types';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [searchResults, setSearchResults] = useState<McpServer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchResults([]); // Clear previous results while loading
    setNodes([]); // Clear previous nodes

    try {
      const result = await window.mcpTools.searchMcpServers({
        query,
        sort: 'stars'
      });
      
      setSearchResults(result);

      // Create nodes for search results with staggered positions
      const newNodes = result.map((server, index) => ({
        id: `server-${index}`,
        type: 'default',
        data: { 
          label: server.name,
          url: server.url
        },
        // Position nodes in a grid layout
        position: { 
          x: 400 + (Math.floor(index / 3) * 250),
          y: (index % 3) * 150 + 50
        },
      }));

      setNodes(newNodes);

      // Create edges connecting nodes if needed
      const newEdges = newNodes.slice(1).map((node, index) => ({
        id: `edge-${index}`,
        source: newNodes[index].id,
        target: node.id,
        type: 'smoothstep'
      }));

      setEdges(newEdges);
    } catch (error) {
      console.error('Error searching MCP servers:', error);
      setSearchResults([]); // Clear results on error
      setNodes([]); // Clear nodes on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstall = async (url: string, configPath: string) => {
    try {
      console.log(`Installing MCP server from ${url} to ${configPath}`);
      await window.mcpTools.installMcpServer({
        url,
        configPath
      });
      console.log('Installation completed successfully');
    } catch (error) {
      console.error('Error installing MCP server:', error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        onSearch={handleSearch}
        onInstall={handleInstall}
        searchResults={searchResults}
        isLoading={isLoading}
      />
      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
