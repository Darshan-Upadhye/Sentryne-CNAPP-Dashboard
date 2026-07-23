import { toneColor, formatNumber } from '../../utils/tone';

export default function StackedBarWidget({ data }) {
  const { total, totalLabel, segments } = data;
  const sum = segments.reduce((acc, s) => acc + s.value, 0) || 1;

  return (
    <div>
      <div className="stacked-widget-total">
        <span className="value">{formatNumber(total)}</span>
        <span className="label">{totalLabel}</span>
      </div>
      <div className="stacked-bar-track">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="stacked-bar-segment"
            style={{
              width: `${(segment.value / sum) * 100}%`,
              background: toneColor(segment.tone),
            }}
            title={`${segment.label}: ${segment.value}`}
          />
        ))}
      </div>
      <div className="legend-grid">
        {segments.map((segment) => (
          <span className="legend-chip" key={segment.label}>
            <span className="legend-swatch" style={{ background: toneColor(segment.tone) }} />
            {segment.label} (<strong>{formatNumber(segment.value)}</strong>)
          </span>
        ))}
      </div>
    </div>
  );
}
