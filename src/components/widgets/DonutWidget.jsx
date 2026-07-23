import { toneColor, formatNumber } from '../../utils/tone';

export default function DonutWidget({ data }) {
  const { total, segments } = data;

  let cursor = 0;
  const stops = segments
    .map((segment) => {
      const share = total > 0 ? (segment.value / total) * 100 : 0;
      const start = cursor;
      const end = cursor + share;
      cursor = end;
      return `${toneColor(segment.tone)} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <div className="donut-widget">
      <div className="donut-shape" style={{ background: `conic-gradient(${stops})` }}>
        <div className="donut-center">
          <span className="donut-center-value">{formatNumber(total)}</span>
          <span className="donut-center-label">Total</span>
        </div>
      </div>
      <ul className="legend-list">
        {segments.map((segment) => (
          <li className="legend-row" key={segment.label}>
            <span className="legend-swatch" style={{ background: toneColor(segment.tone) }} />
            <span>
              {segment.label} (<strong>{formatNumber(segment.value)}</strong>)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
