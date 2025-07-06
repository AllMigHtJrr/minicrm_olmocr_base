import React, { useState, useCallback, useRef } from 'react';
import { useNodesState, useEdgesState, addEdge } from 'reactflow';
import Header from '../../components/ui/Header';
import { Toast } from '../../components/ui/Toast';
import NodePalette from './components/NodePalette';
import WorkflowCanvas from './components/WorkflowCanvas';
import NodeConfigPanel from './components/NodeConfigPanel';
import WorkflowToolbar from './components/WorkflowToolbar';

const WorkflowBuilder = () => {
  // Initial nodes with the required "Lead Created" trigger
  const initialNodes = [
    {
      id: 'trigger-1',
      type: 'custom',
      position: { x: 400, y: 100 },
      data: { 
        type: 'trigger',
        label: 'Lead Created',
        configured: true
      },
      deletable: false
    }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toast, setToast] = useState(null);
  const reactFlowWrapper = useRef(null);
  const nodeIdCounter = useRef(1);

  // Handle node connections
  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      id: `edge-${Date.now()}`,
      type: 'smoothstep',
      style: { strokeWidth: 2, stroke: 'var(--color-primary)' },
      markerEnd: {
        type: 'arrowclosed',
        color: 'var(--color-primary)',
      }
    };
    setEdges((eds) => addEdge(newEdge, eds));
    setHasUnsavedChanges(true);
  }, [setEdges]);

  // Handle node clicks for configuration
  const onNodeClick = useCallback((event, node) => {
    if (node.data?.type !== 'trigger') {
      setSelectedNode(node);
      setShowConfigPanel(true);
    }
  }, []);

  // Handle drag and drop from palette
  const onDrop = useCallback((event, position, nodeData) => {
    nodeIdCounter.current += 1;
    const newNode = {
      id: `${nodeData.type}-${nodeIdCounter.current}`,
      type: 'custom',
      position,
      data: {
        ...nodeData,
        configured: false
      }
    };

    setNodes((nds) => nds.concat(newNode));
    setHasUnsavedChanges(true);
  }, [setNodes]);

  // Handle node configuration updates
  const onUpdateNode = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
    setHasUnsavedChanges(true);
  }, [setNodes]);

  // Save workflow
  const handleSaveWorkflow = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const workflowData = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.data?.type,
          position: node.position,
          data: node.data
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target
        }))
      };

      console.log('Saving workflow:', workflowData);
      
      setHasUnsavedChanges(false);
      setToast({
        message: 'Workflow saved successfully!',
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Failed to save workflow. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Clear workflow
  const handleClearWorkflow = () => {
    setNodes(initialNodes);
    setEdges([]);
    setSelectedNode(null);
    setShowConfigPanel(false);
    setHasUnsavedChanges(false);
    setToast({
      message: 'Workflow cleared',
      type: 'info'
    });
  };

  // Zoom controls
  const handleZoomIn = () => {
    // React Flow zoom functionality would be handled by the Controls component
  };

  const handleZoomOut = () => {
    // React Flow zoom functionality would be handled by the Controls component
  };

  const handleFitView = () => {
    // React Flow fit view functionality would be handled by the Controls component
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 h-screen flex flex-col">
        <WorkflowToolbar
          onSave={handleSaveWorkflow}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
          onClear={handleClearWorkflow}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        <div className="flex-1 flex overflow-hidden">
          <NodePalette />
          
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onDrop={onDrop}
          />

          {showConfigPanel && (
            <NodeConfigPanel
              selectedNode={selectedNode}
              onUpdateNode={onUpdateNode}
              onClose={() => {
                setShowConfigPanel(false);
                setSelectedNode(null);
              }}
            />
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default WorkflowBuilder;