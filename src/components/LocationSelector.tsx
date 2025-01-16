import React, { useState } from 'react';

interface LocationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: string) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [customPath, setCustomPath] = useState('');

  const defaultLocations = [
    {
      label: 'VSCode Settings (Recommended)',
      path: '/Users/jamesspalding/Library/Application Support/Code/User/settings.json'
    },
    {
      label: 'Claude Desktop Settings',
      path: '/Users/jamesspalding/Library/Application Support/Claude/claude_desktop_config.json'
    }
  ];

  const handleConfirm = () => {
    const location = customPath || selectedLocation;
    if (location) {
      onConfirm(location);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="location-selector-overlay" onClick={onClose}>
      <div className="location-selector" onClick={e => e.stopPropagation()}>
        <div className="location-selector-header">
          <h3>Select Installation Location</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="location-selector-content">
          <p className="location-description">
            Choose where to install the MCP server configuration:
          </p>

          <div className="location-options">
            {defaultLocations.map((location, index) => (
              <label key={index} className="location-option">
                <input
                  type="radio"
                  name="location"
                  value={location.path}
                  checked={selectedLocation === location.path}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setCustomPath('');
                  }}
                />
                <div className="location-details">
                  <span className="location-label">{location.label}</span>
                  <span className="location-path">{location.path}</span>
                </div>
              </label>
            ))}

            <label className="location-option custom">
              <input
                type="radio"
                name="location"
                value="custom"
                checked={!!customPath}
                onChange={() => {
                  setSelectedLocation('');
                  setCustomPath(customPath || '/');
                }}
              />
              <div className="location-details">
                <span className="location-label">Custom Location</span>
                <input
                  type="text"
                  className="custom-path-input"
                  value={customPath}
                  onChange={(e) => {
                    setCustomPath(e.target.value);
                    setSelectedLocation('');
                  }}
                  placeholder="Enter custom path..."
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="location-selector-footer">
          <button className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="primary-button"
            onClick={handleConfirm}
            disabled={!selectedLocation && !customPath}
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
};
