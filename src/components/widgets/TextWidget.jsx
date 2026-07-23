import { Sparkles } from 'lucide-react';

export default function TextWidget({ data }) {
  return (
    <div>
      <span className="widget-custom-badge">
        <Sparkles size={11} />
        Custom
      </span>
      <p className="widget-custom-text">{data?.text}</p>
    </div>
  );
}
