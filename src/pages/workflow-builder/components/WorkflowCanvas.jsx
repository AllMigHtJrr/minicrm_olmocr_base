import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';

const nodeTypes = {
  custom: CustomNode
};

const WorkflowCanvas = ({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect,
  onNodeClick,
  onDrop,
  onDragOver
}) => {
  const reactFlowWrapper = useRef(null);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    onDragOver?.(event);
  }, [onDragOver]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');

    if (typeof type === 'undefined' || !type) {
      return;
    }

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    onDrop?.(event, position, JSON.parse(type));
  }, [onDrop]);

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-surface"
        defaultEdgeOptions={{
          style: { strokeWidth: 2, stroke: 'var(--color-primary)' },
          type: 'smoothstep',
          markerEnd: {
            type: 'arrowclosed',
            color: 'var(--color-primary)',
          },
        }}
      >
        <Background 
          color="var(--color-border)" 
          gap={20} 
          size={1}
          variant="dots"
        />
        <Controls 
          className="bg-background border border-border rounded-card shadow-card"
          showInteractive={false}
        />
        <MiniMap 
          className="bg-background border border-border rounded-card"
          nodeColor="var(--color-primary)"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
};

const WorkflowCanvasWrapper = (props) => (
  <ReactFlowProvider>
    <WorkflowCanvas {...props} />
  </ReactFlowProvider>
);

export default WorkflowCanvasWrapper;