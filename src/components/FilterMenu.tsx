import React, { useState } from 'react';
import { FilterPreset, Filter } from '../types/filters';

interface FilterMenuProps {
  filters: Filter[];
  presets: FilterPreset[];
  onFiltersChange: (newFilters: Filter[]) => void;
  onPresetApply: (preset: FilterPreset) => void;
}

export const FilterMenu: React.FC<FilterMenuProps> = ({
  presets,
  onPresetApply,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="filter-menu">
      <button
        className="filter-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        menu de filtros
      </button>

      {isOpen && (
        <div
          className="filter-panel"
          style={{
            position: 'absolute',
            top: '60px',
            left: '10px',
            width: '350px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            padding: '20px',
          }}
        >

          <div className="presets-list">
            {presets.map(preset => (
              <div
                key={preset.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  padding: '15px',
                  marginBottom: '15px',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <button
                  onClick={() => onPresetApply(preset)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0056b3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#007bff';
                  }}
                >
                   {preset.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
