import { useCallback, useRef } from 'react';
import { layers, layerMap } from '../data/layers';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 70;

const COL_W = 220;
const ROW_H = 140;
const ZONE_GAP = 8;

/**
 * Pipeline view: left-to-right horizontal flow with storage as foundation at the bottom.
 *
 *  Ingestion ──→ Catalog → Processing → Transform → Query → Serving
 *       ↓                                  ↕            ↕
 *                    Orchestration (spans all)
 *            Storage            |         Table Format
 */
const pipelineZones = {
  ingestion:     { col: 0, row: 0, colSpan: 2, rowSpan: 1 },
  catalog:       { col: 2, row: 0, colSpan: 1, rowSpan: 1 },
  processing:    { col: 3, row: 0, colSpan: 1, rowSpan: 1 },
  transform:     { col: 4, row: 0, colSpan: 1, rowSpan: 1 },
  query:         { col: 5, row: 0, colSpan: 1, rowSpan: 1 },
  serving:       { col: 6, row: 0, colSpan: 2, rowSpan: 1 },
  orchestration: { col: 0, row: 1, colSpan: 8, rowSpan: 1 },
  storage:       { col: 0, row: 2, colSpan: 4, rowSpan: 1 },
  tableformat:   { col: 4, row: 2, colSpan: 4, rowSpan: 1 },
};

/**
 * Infra view: full architecture with all layers.
 */
const infraZones = {
  ingestion:     { col: 0, row: 0, colSpan: 2, rowSpan: 1 },
  catalog:       { col: 2, row: 0, colSpan: 1, rowSpan: 1 },
  processing:    { col: 3, row: 0, colSpan: 1, rowSpan: 1 },
  transform:     { col: 4, row: 0, colSpan: 1, rowSpan: 1 },
  query:         { col: 5, row: 0, colSpan: 1, rowSpan: 1 },
  datacatalog:   { col: 6, row: 0, colSpan: 1, rowSpan: 1 },
  serving:       { col: 7, row: 0, colSpan: 1, rowSpan: 1 },
  orchestration: { col: 0, row: 1, colSpan: 8, rowSpan: 1 },
  auth:          { col: 0, row: 2, colSpan: 4, rowSpan: 1 },
  networking:    { col: 4, row: 2, colSpan: 4, rowSpan: 1 },
  storage:       { col: 0, row: 3, colSpan: 4, rowSpan: 1 },
  tableformat:   { col: 4, row: 3, colSpan: 4, rowSpan: 1 },
};

/**
 * Ingestion detail view: streaming vs batch tree.
 */
const ingestionZones = {
  ing_streaming:   { col: 0, row: 0, colSpan: 1, rowSpan: 1 },
  ing_full:        { col: 0, row: 1, colSpan: 1, rowSpan: 1 },
  ing_incremental: { col: 0, row: 2, colSpan: 1, rowSpan: 1 },
  ing_cdc:         { col: 0, row: 3, colSpan: 1, rowSpan: 1 },
  storage:         { col: 1, row: 0, colSpan: 1, rowSpan: 4 },
};

export function useElkLayout(view = 'pipeline') {
  const runningRef = useRef(0);

  const getLayout = useCallback(async (nodes, edges) => {
    const runId = ++runningRef.current;
    const zoneLayouts = { pipeline: pipelineZones, infra: infraZones, ingestion: ingestionZones };
    const zoneLayout = zoneLayouts[view] || pipelineZones;

    // Group nodes by layer
    const groups = {};
    for (const node of nodes) {
      const layerId = node.id.split('-')[0];
      if (!groups[layerId]) groups[layerId] = [];
      groups[layerId].push(node);
    }

    const positionedNodes = [];
    const bandNodes = [];

    for (const layer of layers) {
      const layerId = layer.id;
      const layerNodes = groups[layerId];
      if (!layerNodes || layerNodes.length === 0) continue;

      const zone = zoneLayout[layerId];
      if (!zone) continue;

      const zoneX = zone.col * (COL_W + ZONE_GAP);
      const zoneY = zone.row * (ROW_H + ZONE_GAP);
      const zoneW = zone.colSpan * COL_W + (zone.colSpan - 1) * ZONE_GAP;
      const zoneH = zone.rowSpan * ROW_H + (zone.rowSpan - 1) * ZONE_GAP;

      bandNodes.push({
        id: `band-${layerId}`,
        type: 'layerBand',
        position: { x: zoneX, y: zoneY },
        data: { label: layer.label, color: layer.color, width: zoneW, height: zoneH },
        selectable: false,
        draggable: false,
        connectable: false,
        style: { width: zoneW, height: zoneH, zIndex: -1 },
      });

      const nodeGap = 16;
      const padX = 20;
      const padTop = 30;

      // Calculate node width: shrink if needed to fit within zone
      const availW = zoneW - 2 * padX;
      const nodeW = Math.min(NODE_WIDTH, Math.floor((availW - (layerNodes.length - 1) * nodeGap) / layerNodes.length));

      const isVertical = zoneH > zoneW || zone.rowSpan > zone.colSpan;

      if (isVertical) {
        const clusterH = layerNodes.length * NODE_HEIGHT + (layerNodes.length - 1) * nodeGap;
        const startY = zoneY + padTop + (zoneH - padTop - clusterH) / 2;
        const centerX = zoneX + (zoneW - nodeW) / 2;

        for (let i = 0; i < layerNodes.length; i++) {
          positionedNodes.push({
            ...layerNodes[i],
            position: { x: centerX, y: startY + i * (NODE_HEIGHT + nodeGap) },
            style: { ...layerNodes[i].style, width: nodeW, height: NODE_HEIGHT },
          });
        }
      } else {
        const clusterW = layerNodes.length * nodeW + (layerNodes.length - 1) * nodeGap;
        const startX = zoneX + padX + (availW - clusterW) / 2;
        const centerY = zoneY + padTop + (zoneH - padTop - NODE_HEIGHT) / 2;

        for (let i = 0; i < layerNodes.length; i++) {
          positionedNodes.push({
            ...layerNodes[i],
            position: { x: startX + i * (nodeW + nodeGap), y: centerY },
            style: { ...layerNodes[i].style, width: nodeW, height: NODE_HEIGHT },
          });
        }
      }
    }

    // Add "Batch" visual group band wrapping Full Load / Incremental / CDC
    if (view === 'ingestion') {
      const batchLayer = layerMap['ing_batch'];
      if (batchLayer) {
        const subZones = ['ing_full', 'ing_incremental', 'ing_cdc']
          .map(id => zoneLayout[id]).filter(Boolean);
        if (subZones.length) {
          const minRow = Math.min(...subZones.map(z => z.row));
          const maxRow = Math.max(...subZones.map(z => z.row + z.rowSpan - 1));
          const minCol = Math.min(...subZones.map(z => z.col));
          const maxCol = Math.max(...subZones.map(z => z.col + z.colSpan - 1));
          const pad = 10;
          const labelH = 28;
          const x = minCol * (COL_W + ZONE_GAP) - pad;
          const y = minRow * (ROW_H + ZONE_GAP) - pad - labelH;
          const w = (maxCol - minCol + 1) * COL_W + (maxCol - minCol) * ZONE_GAP + 2 * pad;
          const h = (maxRow - minRow + 1) * ROW_H + (maxRow - minRow) * ZONE_GAP + 2 * pad + labelH;

          bandNodes.unshift({
            id: 'band-ing_batch',
            type: 'layerBand',
            position: { x, y },
            data: { label: batchLayer.label, color: batchLayer.color, width: w, height: h },
            selectable: false,
            draggable: false,
            connectable: false,
            style: { width: w, height: h, zIndex: -2 },
          });
        }
      }
    }

    if (runId !== runningRef.current) return null;

    // Assign sourceHandle / targetHandle based on zone positions
    const nodePositions = {};
    const nodeZones = {};
    for (const n of positionedNodes) {
      nodePositions[n.id] = n.position;
      const layerId = n.id.split('-')[0];
      nodeZones[n.id] = zoneLayout[layerId];
    }

    const resolvedEdges = edges.map((edge) => {
      const srcPos = nodePositions[edge.source];
      const tgtPos = nodePositions[edge.target];
      if (!srcPos || !tgtPos) return edge;

      const srcZone = nodeZones[edge.source];
      const tgtZone = nodeZones[edge.target];

      let sourceHandle, targetHandle;

      if (srcZone && tgtZone) {
        const rowDiff = tgtZone.row - srcZone.row;
        const colDiff = tgtZone.col - srcZone.col;

        // Prioritize vertical for different rows, horizontal for same row
        if (rowDiff !== 0) {
          if (rowDiff > 0) {
            sourceHandle = 's-bottom';
            targetHandle = 't-top';
          } else {
            sourceHandle = 's-top';
            targetHandle = 't-bottom';
          }
        } else if (colDiff !== 0) {
          if (colDiff > 0) {
            sourceHandle = 's-right';
            targetHandle = 't-left';
          } else {
            sourceHandle = 's-left';
            targetHandle = 't-right';
          }
        } else {
          // Same zone: use node positions
          const dy = tgtPos.y - srcPos.y;
          if (dy >= 0) {
            sourceHandle = 's-bottom';
            targetHandle = 't-top';
          } else {
            sourceHandle = 's-top';
            targetHandle = 't-bottom';
          }
        }
      }

      const resolved = { ...edge, sourceHandle, targetHandle };

      // Apply bidirectional styling
      if (edge.data?.bidirectional) {
        resolved.style = {
          stroke: 'rgba(148, 163, 184, 0.35)',
          strokeWidth: 1.5,
          strokeDasharray: '6 3',
        };
        resolved.markerStart = {
          type: 'arrowclosed',
          color: 'rgba(148, 163, 184, 0.5)',
          width: 12,
          height: 12,
        };
      }

      return resolved;
    });

    return { nodes: [...bandNodes, ...positionedNodes], edges: resolvedEdges };
  }, [view]);

  return getLayout;
}
