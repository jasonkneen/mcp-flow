import React, { useState } from 'react';

interface ConsoleOutputProps {
  logs: string[];
  isVisible: boolean;
  onToggle: () => void;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  logs,
  isVisible,
  onToggle,
}) => {
  return (
    <div className="console-container">
      <button 
        className="console-toggle"
        onClick={onToggle}
      >
        {isVisible ? 'Hide Console' : 'Show Console'} 
        <span className="console-toggle-icon">
          {isVisible ? '▼' : '▶'}
        </span>
      </button>
      
      {isVisible && (
        <div className="console-output">
          {logs.map((log, index) => (
            <div key={index} className="console-line">
              <span className="console-prompt">$</span>
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
