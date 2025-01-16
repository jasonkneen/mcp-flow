import React, { useState } from 'react';
import type { McpServer } from '../types';
import { ServerCard } from './ServerCard';

interface SidebarProps {
  onSearch: (query: string) => void;
  onInstall: (url: string, configPath: string) => void;
  searchResults: McpServer[];
  isLoading?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onSearch,
  onInstall,
  searchResults,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServer, setSelectedServer] = useState<McpServer | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleServerClick = (server: McpServer) => {
    setSelectedServer(server);
  };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>MCP Servers</h2>
          <form onSubmit={handleSubmit}>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                {isLoading ? '...' : 'Search'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="servers-list">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Searching for MCP servers...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="empty-state">
              <p>No MCP servers found.</p>
              <p className="empty-state-subtitle">Try adjusting your search terms.</p>
            </div>
          ) : searchResults.map((server, index) => (
            <div key={index} className="server-card">
              <div className="server-info">
                <h3 
                  onClick={() => handleServerClick(server)}
                  style={{ cursor: 'pointer' }}
                >
                  {server.name}
                </h3>
                {server.description && (
                  <p className="server-description">{server.description}</p>
                )}
                <div className="server-meta">
                  {server.stars !== undefined && (
                    <div className="server-stars">
                      {server.stars.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleServerClick(server)}
                className="install-button"
              >
                <span>View Details</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedServer && (
        <ServerCard
          server={selectedServer}
          isOpen={true}
          onClose={() => setSelectedServer(null)}
          onInstall={onInstall}
        />
      )}
    </>
  );
};
