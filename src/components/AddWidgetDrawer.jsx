import { useEffect, useState } from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';

const TYPE_LABEL = {
  donut: 'donut chart',
  stackedBar: 'stacked bar',
  bar: 'progress bars',
  empty: 'graph',
  text: 'custom note',
};

export default function AddWidgetDrawer({ open, initialCategoryId, onClose }) {
  const categories = useDashboardStore((state) => state.categories);
  const applyWidgetSelection = useDashboardStore((state) => state.applyWidgetSelection);
  const addCustomWidget = useDashboardStore((state) => state.addCustomWidget);

  const [activeTab, setActiveTab] = useState(initialCategoryId || categories[0]?.id);
  const [draftSelection, setDraftSelection] = useState({});
  const [stagedNew, setStagedNew] = useState({});
  const [nameField, setNameField] = useState('');
  const [textField, setTextField] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!open) return;
    const selection = {};
    categories.forEach((category) => {
      category.widgets.forEach((widget) => {
        selection[widget.id] = widget.active;
      });
    });
    setDraftSelection(selection);
    setStagedNew({});
    setNameField('');
    setTextField('');
    setFormError('');
    setActiveTab(initialCategoryId || categories[0]?.id);
  }, [open, initialCategoryId]);

  if (!open) return null;

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];
  const stagedForTab = stagedNew[activeTab] || [];

  const toggleWidget = (widgetId) => {
    setDraftSelection((prev) => ({ ...prev, [widgetId]: !prev[widgetId] }));
  };

  const handleAddStaged = () => {
    if (!nameField.trim()) {
      setFormError('Give the widget a name first.');
      return;
    }
    if (!textField.trim()) {
      setFormError('Add some widget text too.');
      return;
    }
    setStagedNew((prev) => ({
      ...prev,
      [activeTab]: [
        ...(prev[activeTab] || []),
        { tempId: `temp-${Date.now()}`, name: nameField.trim(), text: textField.trim() },
      ],
    }));
    setNameField('');
    setTextField('');
    setFormError('');
  };

  const handleRemoveStaged = (tempId) => {
    setStagedNew((prev) => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).filter((item) => item.tempId !== tempId),
    }));
  };

  const handleConfirm = () => {
    categories.forEach((category) => {
      applyWidgetSelection(category.id, draftSelection);
      (stagedNew[category.id] || []).forEach(({ name, text }) => {
        addCustomWidget(category.id, { name, text });
      });
    });
    onClose();
  };

  return (
    <div
      className="drawer-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="drawer-panel" role="dialog" aria-modal="true" aria-label="Add widget">
        <div className="drawer-header">
          <h2>Add Widget</h2>
          <button type="button" className="drawer-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <p className="drawer-subtitle">Personalise your dashboard by adding widgets below.</p>

        <div className="drawer-tabs" role="tablist">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={activeTab === category.id}
              className={`drawer-tab${activeTab === category.id ? ' is-active' : ''}`}
              onClick={() => setActiveTab(category.id)}
            >
              {category.tabLabel}
            </button>
          ))}
        </div>

        <div className="drawer-body">
          {currentCategory && (
            <>
              <p className="drawer-section-label">{currentCategory.name}</p>
              <div className="checklist">
                {currentCategory.widgets.map((widget) => (
                  <label className="checklist-row" key={widget.id}>
                    <input
                      type="checkbox"
                      checked={!!draftSelection[widget.id]}
                      onChange={() => toggleWidget(widget.id)}
                    />
                    <span className="checklist-row-text">
                      <span>{widget.name}</span>
                      <span className="type-tag">{TYPE_LABEL[widget.type] || widget.type}</span>
                    </span>
                  </label>
                ))}
                {currentCategory.widgets.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    No widgets defined for this category yet — create one below.
                  </p>
                )}
              </div>

              {stagedForTab.length > 0 && (
                <>
                  <p className="drawer-section-label">New in this session</p>
                  <div className="checklist">
                    {stagedForTab.map((item) => (
                      <div className="staged-row" key={item.tempId}>
                        <span className="staged-row-text">
                          <span>{item.name}</span>
                          <span className="type-tag">will be added on confirm</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStaged(item.tempId)}
                          aria-label={`Discard ${item.name}`}
                          title="Discard"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="custom-widget-form">
                <p className="drawer-section-label">Create a custom widget</p>
                <div className="form-field">
                  <label htmlFor="widget-name">Widget name</label>
                  <input
                    id="widget-name"
                    type="text"
                    value={nameField}
                    onChange={(event) => setNameField(event.target.value)}
                    placeholder="e.g. Shadow API Exposure"
                    maxLength={60}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="widget-text">Widget text</label>
                  <textarea
                    id="widget-text"
                    rows={3}
                    value={textField}
                    onChange={(event) => setTextField(event.target.value)}
                    placeholder="Short description shown on the widget card…"
                    maxLength={220}
                  />
                </div>
                {formError && <p className="form-field-error">{formError}</p>}
                <button type="button" className="btn-add-staged" onClick={handleAddStaged}>
                  <Plus size={14} />
                  Add to list
                </button>
              </div>
            </>
          )}
        </div>

        <div className="drawer-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-confirm" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
