import React from 'react';

export default function SegmentedControl({ label, options, value, onChange }) {
  return (
    <div className="segmented-control">
      <span className="segmented-label">{label}</span>
      <div className="segmented-buttons">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`segmented-btn ${value === opt.value ? 'active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
