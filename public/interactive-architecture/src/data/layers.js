export const layers = [
  { id: 'networking',      label: 'Networking',      color: '#6366f1', order: 0 },
  { id: 'auth',            label: 'Auth / IAM',      color: '#8b5cf6', order: 1 },
  { id: 'ingestion',       label: 'Ingestion',       color: '#06b6d4', order: 2 },
  { id: 'orchestration',   label: 'Orchestration',   color: '#f59e0b', order: 3 },
  { id: 'storage',         label: 'Storage',         color: '#10b981', order: 4 },
  { id: 'tableformat',     label: 'Table Format',    color: '#14b8a6', order: 5 },
  { id: 'catalog',         label: 'Catalog',         color: '#0ea5e9', order: 6 },
  { id: 'processing',      label: 'Processing',      color: '#f97316', order: 7 },
  { id: 'transform',       label: 'Transformation',  color: '#ec4899', order: 8 },
  { id: 'query',           label: 'Query Engine',    color: '#a855f7', order: 9 },
  { id: 'serving',          label: 'Serving',         color: '#f43f5e', order: 10 },
  { id: 'datacatalog',      label: 'Data Product Catalog', color: '#7c3aed', order: 11 },
  // Ingestion detail view
  { id: 'ing_streaming',   label: 'Streaming',       color: '#06b6d4', order: 10 },
  { id: 'ing_batch',       label: 'Batch',           color: '#3b82f6', order: 11 },
  { id: 'ing_full',        label: 'Full Load',       color: '#10b981', order: 12 },
  { id: 'ing_incremental', label: 'Incremental',     color: '#14b8a6', order: 13 },
  { id: 'ing_cdc',         label: 'CDC',             color: '#f97316', order: 14 },
];

export const layerMap = Object.fromEntries(layers.map((l) => [l.id, l]));
