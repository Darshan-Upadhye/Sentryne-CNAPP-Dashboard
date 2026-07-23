import { Plus } from 'lucide-react';
import WidgetCard from './WidgetCard';

export default function CategorySection({
  category,
  widgets,
  isSearching,
  onRemoveWidget,
  onOpenAdd,
}) {
  return (
    <section className="category-section" data-accent={category.accent}>
      <div className="category-heading">
        <span className="category-dot" />
        <h2 className="category-title">{category.name}</h2>
      </div>
      <p className="category-description">{category.description}</p>

      {widgets.length === 0 && !isSearching && (
        <div className="category-empty">
          No widgets in this category yet.{' '}
          <button
            type="button"
            onClick={() => onOpenAdd(category.id)}
            style={{
              border: 'none',
              background: 'none',
              color: 'var(--accent)',
              fontWeight: 600,
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            Add one now &rarr;
          </button>
        </div>
      )}

      {widgets.length > 0 && (
        <div className="widget-grid">
          {widgets.map((widget) => (
            <WidgetCard
              key={widget.id}
              widget={widget}
              accent={category.accent}
              onRemove={(widgetId) => onRemoveWidget(category.id, widgetId)}
            />
          ))}

          {!isSearching && (
            <button type="button" className="widget-ghost" onClick={() => onOpenAdd(category.id)}>
              <span className="widget-ghost-inner">
                <span className="widget-ghost-icon">
                  <Plus size={16} />
                </span>
                Add Widget
              </span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
