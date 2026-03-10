import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ControlPanel from './components/ControlPanel';
import ArchitectureNode from './components/ArchitectureNode';
import LayerBand from './components/LayerBand';
import DetailPanel from './components/DetailPanel';
import { useArchitecture } from './hooks/useArchitecture';
import { useElkLayout } from './hooks/useElkLayout';
import { getTechDetail } from './data/techDetails';
import './styles/detail-panel.css';

const nodeTypes = {
  architecture: ArchitectureNode,
  layerBand: LayerBand,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: 'rgba(148, 163, 184, 0.25)', strokeWidth: 1.5 },
  markerEnd: {
    type: 'arrowclosed',
    color: 'rgba(148, 163, 184, 0.4)',
    width: 14,
    height: 14,
  },
};

const defaultSelections = {
  provider: 'aws',
  tableFormat: 'iceberg',
  scale: 'sme',
  dataSize: 'small',
};

const validViews = ['pipeline', 'ingestion', 'infra'];
const validProviders = ['aws', 'azure', 'gcp', 'self'];
const validFormats = ['iceberg', 'delta'];
const validScales = ['sme', 'enterprise'];
const validSizes = ['small', 'big'];

function parseURL() {
  const params = new URLSearchParams(window.location.search);
  const view = validViews.includes(params.get('view')) ? params.get('view') : 'pipeline';
  const provider = validProviders.includes(params.get('provider')) ? params.get('provider') : defaultSelections.provider;
  const tableFormat = validFormats.includes(params.get('tableFormat')) ? params.get('tableFormat') : defaultSelections.tableFormat;
  const scale = validScales.includes(params.get('scale')) ? params.get('scale') : defaultSelections.scale;
  const dataSize = validSizes.includes(params.get('dataSize')) ? params.get('dataSize') : defaultSelections.dataSize;
  return { view, selections: { provider, tableFormat, scale, dataSize } };
}

function Flow() {
  const initial = parseURL();
  const [selections, setSelections] = useState(initial.selections);
  const [selectedTech, setSelectedTech] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState(initial.view);
  const { nodes: rawNodes, edges: rawEdges } = useArchitecture(selections, view);
  const getLayout = useElkLayout(view);
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const animFrameRef = useRef(null);

  const handleNodeClick = useCallback((_event, node) => {
    if (node.type !== 'architecture') return;
    const detail = getTechDetail(node.data.label);
    if (detail) setSelectedTech(detail);
  }, []);

  const applyLayout = useCallback(async () => {
    const result = await getLayout(rawNodes, rawEdges);
    if (!result) return;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const prevPositions = {};
    setNodes((prev) => {
      prev.forEach((n) => { prevPositions[n.id] = n.position; });
      return prev;
    });

    const duration = 400;
    const start = performance.now();

    function animate(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      const interpolated = result.nodes.map((node) => {
        const prev = prevPositions[node.id];
        if (prev) {
          return {
            ...node,
            position: {
              x: prev.x + (node.position.x - prev.x) * ease,
              y: prev.y + (node.position.y - prev.y) * ease,
            },
          };
        }
        return node;
      });

      setNodes(interpolated);
      setEdges(result.edges);

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setNodes(result.nodes);
        setTimeout(() => fitView({ padding: 0.05, duration: 200 }), 50);
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, [rawNodes, rawEdges, getLayout, setNodes, setEdges, fitView]);

  useEffect(() => {
    applyLayout();
  }, [applyLayout]);

  // Sync state to URL query params
  useEffect(() => {
    const params = new URLSearchParams();
    if (view !== 'pipeline') params.set('view', view);
    if (selections.provider !== defaultSelections.provider) params.set('provider', selections.provider);
    if (selections.tableFormat !== defaultSelections.tableFormat) params.set('tableFormat', selections.tableFormat);
    if (selections.scale !== defaultSelections.scale) params.set('scale', selections.scale);
    if (selections.dataSize !== defaultSelections.dataSize) params.set('dataSize', selections.dataSize);
    const qs = params.toString();
    const url = window.location.pathname + (qs ? `?${qs}` : '');
    window.history.replaceState(null, '', url);
  }, [view, selections]);

  return (
    <div className="app" data-theme={theme}>
      <ControlPanel
        selections={selections}
        onChange={setSelections}
        theme={theme}
        onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        view={view}
        onViewChange={setView}
      />
      <div className="flow-container">
        {selectedTech && (
          <DetailPanel detail={selectedTech} onClose={() => setSelectedTech(null)} />
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          colorMode={theme}
          fitView
          proOptions={{ hideAttribution: true }}
          minZoom={0.2}
          maxZoom={1.5}
          onNodeClick={handleNodeClick}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          panOnDrag
          zoomOnScroll
        >
          <Background color={theme === 'dark' ? '#1a1a2e' : '#e2e8f0'} gap={24} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
