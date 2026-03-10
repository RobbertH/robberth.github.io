import React, { useState, useRef, useEffect } from 'react';
import SegmentedControl from './SegmentedControl';

const resources = [
  { label: 'Platform Guidebook', url: 'https://guidebooks-1054541444034.europe-west1.run.app/' },
  { label: 'Azure Data Platform Architectures', url: 'https://learn.microsoft.com/en-us/azure/architecture/browse/?terms=data%20platform' },
  { label: 'AWS Data Analytics Reference', url: 'https://docs.aws.amazon.com/whitepapers/latest/building-data-lakes/building-data-lake-aws.html' },
  { label: 'GCP Data Analytics', url: 'https://cloud.google.com/architecture/data-analytics' },
  { label: 'Conveyor Docs', url: 'https://docs.conveyordata.com' },
  { label: 'Apache Iceberg', url: 'https://iceberg.apache.org' },
  { label: 'dbt Documentation', url: 'https://docs.getdbt.com' },
];

const viewOptions = [
  { value: 'pipeline', label: 'Data Pipeline' },
  { value: 'ingestion', label: 'Ingestion' },
  { value: 'infra', label: 'Cloud Infra' },
];

const providerOptions = [
  { value: 'aws', label: 'AWS' },
  { value: 'azure', label: 'Azure' },
  { value: 'gcp', label: 'GCP' },
  { value: 'self', label: 'Self-Hosted' },
];

const formatOptions = [
  { value: 'iceberg', label: 'Iceberg' },
  { value: 'delta', label: 'Delta' },
];

const scaleOptions = [
  { value: 'sme', label: 'SME' },
  { value: 'enterprise', label: 'Enterprise' },
];

const sizeOptions = [
  { value: 'small', label: 'Small Data' },
  { value: 'big', label: 'Big Data' },
];

function InfoPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="info-wrapper" ref={ref}>
      <button
        className="info-toggle"
        onClick={() => setOpen(o => !o)}
        aria-label="Additional resources"
      >
        i
      </button>
      {open && (
        <div className="info-popover">
          <div className="info-popover-title">Resources</div>
          {resources.map(r => (
            <a key={r.url} className="info-link" href={r.url} target="_blank" rel="noopener noreferrer">
              {r.label}
              <span className="info-link-arrow">&rsaquo;</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ControlPanel({ selections, onChange, theme, onThemeToggle, view, onViewChange }) {
  const update = (key) => (val) => onChange({ ...selections, [key]: val });

  return (
    <div className="control-panel">
      <SegmentedControl
        label="View"
        options={viewOptions}
        value={view}
        onChange={onViewChange}
      />
      <div className="control-divider" />
      <SegmentedControl
        label="Provider"
        options={providerOptions}
        value={selections.provider}
        onChange={update('provider')}
      />
      <SegmentedControl
        label="Table Format"
        options={formatOptions}
        value={selections.tableFormat}
        onChange={update('tableFormat')}
      />
      <SegmentedControl
        label="Scale"
        options={scaleOptions}
        value={selections.scale}
        onChange={update('scale')}
      />
      <SegmentedControl
        label="Data Size"
        options={sizeOptions}
        value={selections.dataSize}
        onChange={update('dataSize')}
      />
      <InfoPopover />
      <button
        className="theme-toggle"
        onClick={onThemeToggle}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '\u2600' : '\u263E'}
      </button>
    </div>
  );
}
