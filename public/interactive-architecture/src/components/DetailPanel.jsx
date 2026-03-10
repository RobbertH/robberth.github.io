import React, { useEffect, useRef } from 'react';

export default function DetailPanel({ detail, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!detail) return null;

  const { title, description, alternatives, snippet } = detail;

  return (
    <div className="detail-panel-overlay">
      <div className="detail-panel" ref={panelRef}>
        <button className="detail-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <h2 className="detail-title">{title}</h2>

        <p className="detail-description">{description}</p>

        {snippet && (
          <div className="detail-snippet">
            <div className="snippet-header">{snippet.label}</div>
            <pre className="snippet-code"><code>{snippet.code}</code></pre>
          </div>
        )}

        {alternatives && alternatives.length > 0 && (
          <div className="detail-alternatives">
            <h3 className="alternatives-heading">Alternatives</h3>
            <div className="alternatives-list">
              {alternatives.map((alt) => (
                <span key={alt} className="alternative-tag">{alt}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
