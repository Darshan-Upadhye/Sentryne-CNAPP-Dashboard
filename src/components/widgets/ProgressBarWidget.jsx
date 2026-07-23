import { toneColor } from '../../utils/tone';

export default function ProgressBarWidget({ data }) {
  const { segments } = data;

  return (
    <div className="progress-rows">
      {segments.map((segment) => (
        <div key={segment.label}>
          <div className="progress-row-head">
            <span>{segment.label}</span>
            <strong>{segment.value}%</strong>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${segment.value}%`, background: toneColor(segment.tone) }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
