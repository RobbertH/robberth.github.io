import { useMemo } from 'react';
import { resolveTechnologies } from '../data/architectures';
import { layerMap } from '../data/layers';
import { getIcon } from '../data/icons';

/**
 * Pipeline view: left-to-right data flow with storage as foundation at the bottom.
 * Entries can be [src, tgt] or [src, tgt, { bidirectional: true }].
 */
const pipelineEdges = [
  ['ingestion', 'catalog'],
  ['ingestion', 'storage'],
  ['storage', 'tableformat'],
  ['catalog', 'processing'],
  ['processing', 'transform'],
  ['transform', 'query'],
  ['query', 'serving'],
  ['processing', 'storage', { bidirectional: true }],
  ['query', 'storage', { bidirectional: true }],
];

/**
 * Infra view: more connections showing how components relate.
 */
const infraEdges = [
  ['networking', 'auth'],
  ['auth', 'ingestion'],
  ['ingestion', 'catalog'],
  ['ingestion', 'storage'],
  ['storage', 'tableformat'],
  ['catalog', 'processing'],
  ['processing', 'transform'],
  ['transform', 'query'],
  ['query', 'serving'],
  ['orchestration', 'ingestion'],
  ['orchestration', 'processing'],
  ['orchestration', 'transform'],
  ['datacatalog', 'serving'],
  ['query', 'datacatalog'],
  ['processing', 'storage', { bidirectional: true }],
  ['query', 'storage', { bidirectional: true }],
];

/**
 * Ingestion detail view: streaming vs batch patterns.
 */
const ingestionEdges = [
  ['ing_streaming', 'storage'],
  ['ing_full', 'storage'],
  ['ing_incremental', 'storage'],
  ['ing_cdc', 'storage'],
];

/**
 * Which layers to show per view.
 */
const viewLayers = {
  pipeline: ['ingestion', 'storage', 'tableformat', 'catalog', 'processing', 'transform', 'query', 'serving', 'orchestration'],
  infra: ['networking', 'auth', 'ingestion', 'storage', 'tableformat', 'catalog', 'processing', 'transform', 'query', 'serving', 'datacatalog', 'orchestration'],
  ingestion: ['ing_streaming', 'ing_full', 'ing_incremental', 'ing_cdc', 'storage'],
};

/**
 * Derives ReactFlow nodes + edges from the current selections and view.
 */
export function useArchitecture(selections, view = 'pipeline') {
  return useMemo(() => {
    const resolved = resolveTechnologies(selections);
    const allowedLayers = viewLayers[view];
    const flowDefs = { pipeline: pipelineEdges, infra: infraEdges, ingestion: ingestionEdges };
    const flowDef = flowDefs[view] || pipelineEdges;

    const nodes = [];
    const nodesByLayer = {};

    for (const { layerId, techs } of resolved) {
      if (allowedLayers && !allowedLayers.includes(layerId)) continue;
      const layer = layerMap[layerId];
      if (!layer) continue;

      nodesByLayer[layerId] = [];
      for (let i = 0; i < techs.length; i++) {
        const tech = techs[i];
        const nodeId = `${layerId}-${i}`;
        const node = {
          id: nodeId,
          type: 'architecture',
          data: {
            label: tech,
            icon: getIcon(tech),
            layerLabel: layer.label,
            layerColor: layer.color,
            layerOrder: layer.order,
          },
          position: { x: 0, y: 0 },
        };
        nodes.push(node);
        nodesByLayer[layerId].push(node);
      }
    }

    // Build edges
    const edges = [];
    for (const entry of flowDef) {
      const srcLayer = entry[0];
      const tgtLayer = entry[1];
      const opts = entry[2] || {};
      const srcNodes = nodesByLayer[srcLayer];
      const tgtNodes = nodesByLayer[tgtLayer];
      if (!srcNodes?.length || !tgtNodes?.length) continue;

      if (view === 'pipeline' || view === 'ingestion') {
        // Single clean connection
        const edge = {
          id: `${srcNodes[0].id}__${tgtNodes[0].id}`,
          source: srcNodes[0].id,
          target: tgtNodes[0].id,
        };
        if (opts.bidirectional) edge.data = { bidirectional: true };
        edges.push(edge);
      } else {
        // Fan out/in for infra view
        if (srcNodes.length === 1 || tgtNodes.length === 1) {
          for (const src of srcNodes) {
            for (const tgt of tgtNodes) {
              const edge = {
                id: `${src.id}__${tgt.id}`,
                source: src.id,
                target: tgt.id,
              };
              if (opts.bidirectional) edge.data = { bidirectional: true };
              edges.push(edge);
            }
          }
        } else {
          for (let i = 0; i < srcNodes.length; i++) {
            const tgtIdx = Math.min(i, tgtNodes.length - 1);
            const edge = {
              id: `${srcNodes[i].id}__${tgtNodes[tgtIdx].id}`,
              source: srcNodes[i].id,
              target: tgtNodes[tgtIdx].id,
            };
            if (opts.bidirectional) edge.data = { bidirectional: true };
            edges.push(edge);
          }
        }
      }
    }

    return { nodes, edges };
  }, [selections, view]);
}
