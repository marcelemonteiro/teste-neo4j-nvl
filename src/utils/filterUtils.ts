import { Node, Relationship } from "@neo4j-nvl/base";
import { Filter, NodeFilter, RelationshipFilter, FilterPreset } from "../types/filters";

export const applyFilters = (
  nodes: Node[],
  relationships: Relationship[],
  filters: Filter[]
): { filteredNodes: Node[]; filteredRelationships: Relationship[] } => {
  // filtros ativos e não vazios
  const enabledFilters = filters.filter(filter => filter.enabled && filter.value.trim() !== '');
  // se não houver filtros ativos, retornar os nós e relacionamentos originais
  if (enabledFilters.length === 0) {
    return { filteredNodes: nodes, filteredRelationships: relationships };
  }

  // é usado para verificar se os nós e relacionamentos existem e utiliza map para criar um conjunto de IDs únicos
  const existingNodeIds = new Set(nodes.map(node => node.id));
  const validRelationships = relationships.filter(rel => 
    existingNodeIds.has(rel.from) && existingNodeIds.has(rel.to)
  );

  // Separar filtros por tipo: nós e relacionamentos
  const nodeFilters = enabledFilters.filter((filter): filter is NodeFilter => filter.type === 'node');
  const relationshipFilters = enabledFilters.filter((filter): filter is RelationshipFilter => filter.type === 'relationship');

  // Aplicar filtros de nós: filtrar os nós com base nos filtros de nós
  let filteredNodes = nodes;
  if (nodeFilters.length > 0) {
    filteredNodes = nodes.filter(node => {
      return nodeFilters.some(filter => {
        const fieldValue = String(node[filter.field] || '');
        return matchesFilter(fieldValue, filter.operator, filter.value);
      });
    });
  }

  // Aplicar filtros de relacionamentos: filtrar os relacionamentos com base nos filtros de relacionamentos
  let filteredRelationships = validRelationships;
  if (relationshipFilters.length > 0) {
    filteredRelationships = validRelationships.filter(rel => {
      return relationshipFilters.some(filter => {
        // é usado para obter o valor do campo do relacionamento
        let fieldValue = '';
        
        // se o campo for 'from', obter o nó de origem
        if (filter.field === 'from') {
          const fromNode = nodes.find(n => n.id === rel.from);
          // se o nó de origem for encontrado, obter o valor do campo 'caption'
          fieldValue = fromNode?.caption || rel.from;
        } else if (filter.field === 'to') {
          // se o campo for 'to', obter o nó de destino
          const toNode = nodes.find(n => n.id === rel.to);
          // se o nó de destino for encontrado, obter o valor do campo 'caption'
          fieldValue = toNode?.caption || rel.to;
        } else {
          // se o campo for outro, obter o valor do campo do relacionamento
          fieldValue = String(rel[filter.field] || '');
        }
        
        // retorna true se o valor do campo do relacionamento corresponder ao filtro
        return matchesFilter(fieldValue, filter.operator, filter.value);
      });
    });
  }

  const finalValidNodeIds = new Set(filteredNodes.map(node => node.id));
  // filtra os relacionamentos com base nos IDs dos nós finais
  filteredRelationships = filteredRelationships.filter(rel => 
    finalValidNodeIds.has(rel.from) && finalValidNodeIds.has(rel.to)
  );

  return { filteredNodes, filteredRelationships };
};

// é usado para verificar se o valor do campo do relacionamento corresponde ao filtro
const matchesFilter = (fieldValue: string, operator: string, filterValue: string): boolean => {
  // normaliza o valor do campo do relacionamento e do filtro para letras minúsculas
  const normalizedFieldValue = fieldValue.toLowerCase();
  const normalizedFilterValue = filterValue.toLowerCase();

  // compara o valor do campo do relacionamento e do filtro com base no operador
  switch (operator) {
    // se o operador for 'contains', retorna true se o valor do campo do relacionamento incluir o valor do filtro
    case 'contains':
      return normalizedFieldValue.includes(normalizedFilterValue);
    // se o operador for 'equals', retorna true se o valor do campo do relacionamento for igual ao valor do filtro
    case 'equals':
      // compara o valor do campo do relacionamento e do filtro com base no operador
      return normalizedFieldValue === normalizedFilterValue;
    case 'startsWith':
      // se o operador for 'startsWith', retorna true se o valor do campo do relacionamento iniciar com o valor do filtro
      return normalizedFieldValue.startsWith(normalizedFilterValue);
    // se o operador for 'endsWith', retorna true se o valor do campo do relacionamento terminar com o valor do filtro
    case 'endsWith':
      return normalizedFieldValue.endsWith(normalizedFilterValue);
    default:
      return true;
  }
};

// é usado para criar os filtros predefinidos
export const createFilterPresets = (): FilterPreset[] => {
  return [
    {
      id: 'actors-only',
      name: 'Apenas Atores',
      nodeFilters: [
        {
          id: 'actor-filter-1',
          type: 'node',
          field: 'caption',
          operator: 'contains',
          value: 'Leonardo',
          enabled: true,
        },
        {
          id: 'actor-filter-2',
          type: 'node',
          field: 'caption',
          operator: 'contains',
          value: 'Kate',
          enabled: true,
        },
        {
          id: 'actor-filter-3',
          type: 'node',
          field: 'caption',
          operator: 'contains',
          value: 'Billy',
          enabled: true,
        },
        {
          id: 'actor-filter-4',
          type: 'node',
          field: 'caption',
          operator: 'contains',
          value: 'Kathy',
          enabled: true,
        },
        {
          id: 'actor-filter-5',
          type: 'node',
          field: 'caption',
          operator: 'contains',
          value: 'Frances',
          enabled: true,
        },
      ],
      relationshipFilters: [],
    },
    {
      id: 'titanic-related',
      name: 'Relacionado ao Titanic',
      nodeFilters: [
        {
          id: 'titanic-filter',
          type: 'node',
          field: 'caption',
          operator: 'contains',
          value: 'Titanic',
          enabled: true,
        },
      ],
      relationshipFilters: [
        {
          id: 'titanic-rel-filter',
          type: 'relationship',
          field: 'caption',
          operator: 'equals',
          value: 'ATUOU EM',
          enabled: true,
        },
      ],
    },
    {
      id: 'directors-only',
      name: 'Apenas Diretores',
      nodeFilters: [
        {
          id: 'director-filter',
          type: 'node',
          field: 'caption',
          operator: 'contains',
          value: 'Christopher',
          enabled: true,
        },
      ],
      relationshipFilters: [
        {
          id: 'director-rel-filter',
          type: 'relationship',
          field: 'caption',
          operator: 'equals',
          value: 'DIRIGIU',
          enabled: true,
        },
      ],
    },
    {
      id: 'movies-only',
      name: 'Apenas Filmes',
      nodeFilters: [
        {
          id: 'movie-filter-1',
          type: 'node',
          field: 'caption',
          operator: 'equals',
          value: 'Titanic',
          enabled: true,
        },
        {
          id: 'movie-filter-2',
          type: 'node',
          field: 'caption',
          operator: 'equals',
          value: 'Inception',
          enabled: true,
        },
      ],
      relationshipFilters: [],
    },
  ];
};
