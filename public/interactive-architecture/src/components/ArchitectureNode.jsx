import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

function ArchitectureNode({ data }) {
  const { label, icon, layerColor } = data;

  return (
    <div
      className="architecture-node"
      style={{ '--layer-color': layerColor }}
    >
      <Handle type="target" position={Position.Top} id="t-top" className="node-handle" />
      <Handle type="target" position={Position.Left} id="t-left" className="node-handle" />
      <Handle type="source" position={Position.Bottom} id="s-bottom" className="node-handle" />
      <Handle type="source" position={Position.Right} id="s-right" className="node-handle" />
      <Handle type="target" position={Position.Right} id="t-right" className="node-handle" />
      <Handle type="source" position={Position.Left} id="s-left" className="node-handle" />
      <Handle type="source" position={Position.Top} id="s-top" className="node-handle" />
      <Handle type="target" position={Position.Bottom} id="t-bottom" className="node-handle" />
      <div className="node-content">
        {icon && <img className="node-icon" src={icon} alt={label} width="22" height="22" />}
        <span className="node-label">{label}</span>
      </div>
    </div>
  );
}

export default memo(ArchitectureNode);
