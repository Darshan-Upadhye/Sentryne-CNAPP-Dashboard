import { X } from 'lucide-react';
import DonutWidget from './widgets/DonutWidget';
import StackedBarWidget from './widgets/StackedBarWidget';
import ProgressBarWidget from './widgets/ProgressBarWidget';
import EmptyWidget from './widgets/EmptyWidget';
import TextWidget from './widgets/TextWidget';

const RENDERERS = {
  donut: DonutWidget,
  stackedBar: StackedBarWidget,
  bar: ProgressBarWidget,
  empty: EmptyWidget,
  text: TextWidget,
};

export default function WidgetCard({ widget, accent, onRemove }) {
  const Renderer = RENDERERS[widget.type] || EmptyWidget;

  return (
    <article className="widget-card" data-accent={accent} data-widget-id={widget.id}>
      <div className="widget-card-head">
        <h3 className="widget-card-title">{widget.name}</h3>
        <button
          type="button"
          className="widget-remove-btn"
          onClick={() => onRemove(widget.id)}
          aria-label={`Remove ${widget.name} widget`}
          title="Remove widget"
        >
          <X size={14} />
        </button>
      </div>
      <div className="widget-card-body">
        <Renderer data={widget.data} />
      </div>
    </article>
  );
}
