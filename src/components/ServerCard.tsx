import React, { useState } from 'react';
import type { McpServer } from '../types';
import { ConsoleOutput } from './ConsoleOutput';
import { LocationSelector } from './LocationSelector';

interface ServerCardProps {
  server: McpServer;
  isOpen: boolean;
  onClose: () => void;
  onInstall: (url: string, configPath: string) => void;
}

export const ServerCard: React.FC<ServerCardProps> = ({
  server,
  isOpen,
  onClose,
  onInstall,
}) => {
  const [isConsoleVisible, setIsConsoleVisible] = useState(false);
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);
  const [installLogs, setInstallLogs] = useState<string[]>([]);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstallComplete, setIsInstallComplete] = useState(false);

  const handleInstall = () => {
    setIsLocationSelectorOpen(true);
  };

  const handleLocationConfirm = async (configPath: string) => {
    setIsLocationSelectorOpen(false);
    setIsConsoleVisible(true);
    setIsInstalling(true);
    setInstallLogs(prev => [...prev, `$ Installing ${server.name} to ${configPath}...`]);
    
    try {
      await onInstall(server.url, configPath);
      setInstallLogs(prev => [
        ...prev,
        '$ Installation completed successfully ✓',
        '$ Server is ready to use!'
      ]);
      setIsInstallComplete(true);
    } catch (error) {
      setInstallLogs(prev => [
        ...prev,
        `$ Installation failed: ${error instanceof Error ? error.message : 'Unknown error'} ✗`
      ]);
    } finally {
      setIsInstalling(false);
    }
  };
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="server-modal" onClick={e => e.stopPropagation()}>
        <div className="server-modal-content">
          {/* Header */}
          <div className="server-modal-header">
            <div className="server-modal-title">
              <div className="server-icon">
                {server.name.charAt(0).toUpperCase()}
              </div>
              <div className="server-title-info">
                <h3 className="server-name">{server.name}</h3>
                <a href={server.url} target="_blank" rel="noopener noreferrer" className="server-url">
                  {server.url.replace('https://github.com/', '')}
                </a>
              </div>
            </div>
            <div className="close-section">
              <span className="keyboard-hint">Press Esc to close</span>
              <button className="close-button" onClick={onClose}>×</button>
            </div>
          </div>

          {/* Description */}
          <div className="server-modal-description">
            {server.description}
          </div>

          {/* Stats */}
          <div className="server-modal-stats">
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">{server.stars?.toLocaleString()}</span>
              <span className="stat-label">stars</span>
            </div>
          </div>

          {/* Actions */}
          <div className="server-modal-actions">
            <a 
              href={server.url}
              target="_blank"
              rel="noopener noreferrer"
              className="view-on-github"
            >
              View on GitHub
            </a>
            <button 
              className={`install-server-button ${isInstalling ? 'loading' : ''} ${isInstallComplete ? 'complete' : ''}`}
              onClick={handleInstall}
              disabled={isInstalling}
            >
              {isInstalling ? 'Installing...' : isInstallComplete ? 'Installed ✓' : 'Install Server'}
            </button>

            <ConsoleOutput
              logs={installLogs}
              isVisible={isConsoleVisible}
              onToggle={() => setIsConsoleVisible(!isConsoleVisible)}
            />
          </div>
        </div>
      </div>

      <LocationSelector
        isOpen={isLocationSelectorOpen}
        onClose={() => setIsLocationSelectorOpen(false)}
        onConfirm={handleLocationConfirm}
      />
    </div>
  );
};
