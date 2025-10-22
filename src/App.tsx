import React, { useState, useMemo } from "react";
import { InteractiveNvlWrapper } from "@neo4j-nvl/react";
import { Node, Relationship } from "@neo4j-nvl/base";
import { FilterMenu } from "./components/FilterMenu";
import { Filter, FilterPreset } from "./types/filters";
import { applyFilters, createFilterPresets } from "./utils/filterUtils";

export const App = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "0", caption: "Leonardo DiCaprio" },
    { id: "1", caption: "Kate Winslet" },
    { id: "2", caption: "Titanic" },
    { id: "3", caption: "Christopher Nolan" },
    { id: "4", caption: "Inception" },
  ]);

  const [relationships, setRelationships] = useState<Relationship[]>([
    { id: "02", from: "0", to: "2", caption: "ATUOU EM" },
    { id: "12", from: "1", to: "2", caption: "ATUOU EM" },
    { id: "04", from: "0", to: "4", caption: "ATUOU EM" },
    { id: "11", from: "3", to: "4", caption: "DIRIGIU" },
  ]);

  // Estado dos filtros
  const [filters, setFilters] = useState<Filter[]>([]);
  const [presets] = useState<FilterPreset[]>(createFilterPresets());

  // Estado de nós expandidos (por id)
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set());

  const titanicActors = [
    { id: "5", caption: "Billy Zane" },
    { id: "6", caption: "Kathy Bates" },
    { id: "7", caption: "Frances Fisher" },
  ];

  const titanicActorsRels = [
    { id: "25", from: "5", to: "2", caption: "ATUOU EM" },
    { id: "26", from: "6", to: "2", caption: "ATUOU EM" },
    { id: "27", from: "7", to: "2", caption: "ATUOU EM" },
  ];

  // Expande o nó Titanic adicionando atores e relacionamentos
  const expandTitanic = () => {
    setNodes((prevNodes) => {
      const existingIds = new Set(prevNodes.map((n) => n.id));
      const toAdd = titanicActors.filter((n) => !existingIds.has(n.id));
      return [...prevNodes, ...toAdd];
    });
    setRelationships((prevRels) => {
      const existingIds = new Set(prevRels.map((r) => r.id));
      const toAdd = titanicActorsRels.filter((r) => !existingIds.has(r.id));
      return [...prevRels, ...toAdd];
    });
  };

  // Retrai o nó Titanic removendo os atores adicionados e seus relacionamentos
  const retractTitanic = () => {
    setRelationships((prevRels) =>
      prevRels.filter((r) => !titanicActorsRels.some((tr) => tr.id === r.id))
    );
    setNodes((prevNodes) =>
      prevNodes.filter((n) => !titanicActors.some((ta) => ta.id === n.id))
    );
  };

  // Aplica filtros aos dados
  const { filteredNodes, filteredRelationships } = useMemo(() => {
    return applyFilters(nodes, relationships, filters);
  }, [nodes, relationships, filters]);

  // Callbacks para o FilterMenu
  const handleFiltersChange = (newFilters: Filter[]) => {
    setFilters(newFilters);
  };

  const handlePresetApply = (preset: FilterPreset) => {
    const allFilters = [...preset.nodeFilters, ...preset.relationshipFilters];
    setFilters(allFilters);
  };

  return (
    <div
      style={{ width: "100%", height: "95vh", border: "1px solid lightgray", position: "relative" }}
    >
      <FilterMenu
        filters={filters}
        presets={presets}
        onFiltersChange={handleFiltersChange}
        onPresetApply={handlePresetApply}
      />
      
      <InteractiveNvlWrapper
        nvlOptions={{ initialZoom: 2 }}
        nodes={filteredNodes}
        rels={filteredRelationships}
        mouseEventCallbacks={{
          onZoom: true,
          onPan: true,
          onDrag: true,
          onDragStart: (nodes: Node[]) => {
            nodes.map((node) => (node.selected = true));
          },
          onDragEnd: (nodes: Node[]) => {
            nodes.map((node) => (node.selected = false));
          },
          // Alterna expandir/retrair com duplo clique
          onNodeDoubleClick: (node: Node) => {
            if (node.caption !== "Titanic") return;
            setExpandedNodeIds((prev) => {
              const next = new Set(prev);
              if (next.has(node.id)) {
                // já expandido -> retrair
                next.delete(node.id);
                retractTitanic();
              } else {
                // expandir
                next.add(node.id);
                expandTitanic();
              }
              return next;
            });
          },
        }}
      />
    </div>
  );
};
