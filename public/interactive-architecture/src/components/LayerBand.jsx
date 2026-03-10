import React, { memo } from 'react';

function LayerBand({ data }) {
  const { label, color, width, height } = data;

  return (
    <div
      className="layer-band"
      style={{
        width,
        height,
        '--band-color': color,
      }}
    >
      <div className="layer-band-label" style={{ color }}>
        {label}
      </div>
      <div className="layer-band-bg" />
    </div>
  );
}

export default memo(LayerBand);
