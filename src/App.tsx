import React, { useState } from "react";
import { InteractiveNvlWrapper } from "@neo4j-nvl/react";
import { Node, Relationship } from "@neo4j-nvl/base";

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

  return (
    <div
      style={{ width: "100%", height: "95vh", border: "1px solid lightgray" }}
    >
      <InteractiveNvlWrapper
        nvlOptions={{ initialZoom: 2 }}
        nodes={nodes}
        rels={relationships}
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
          onNodeClick: (node: Node) => {
            if (node.caption === "Titanic") {
              setNodes((prevNodes) => [...prevNodes, ...titanicActors]);
              setRelationships((prevRels) => [
                ...prevRels,
                ...titanicActorsRels,
              ]);
            }
          },
        }}
      />
    </div>
  );
};
