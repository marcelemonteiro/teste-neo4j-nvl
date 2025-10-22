export interface NodeFilter {
  id: string;
  type: 'node';
  field: 'caption' | 'id';
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith';
  value: string;
  enabled: boolean;
}

export interface RelationshipFilter {
  id: string;
  type: 'relationship';
  field: 'caption' | 'from' | 'to';
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith';
  value: string;
  enabled: boolean;
}

export interface FilterPreset {
  id: string;
  name: string;
  nodeFilters: NodeFilter[];
  relationshipFilters: RelationshipFilter[];
}

export type Filter = NodeFilter | RelationshipFilter;

export interface FilterState {
  activeFilters: Filter[];
  presets: FilterPreset[];
}
