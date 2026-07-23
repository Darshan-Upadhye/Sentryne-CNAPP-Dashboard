import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dashboardConfig from '../data/dashboardConfig.json';

const makeId = (prefix = 'widget') => {
  const random =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${random}`;
};

export const useDashboardStore = create(
  persist(
    (set, get) => ({
      categories: dashboardConfig.categories,
      searchQuery: '',

      setSearchQuery: (query) => set({ searchQuery: query }),

      /** Toggle */
      setWidgetActive: (categoryId, widgetId, active) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id !== categoryId
              ? category
              : {
                  ...category,
                  widgets: category.widgets.map((widget) =>
                    widget.id !== widgetId ? widget : { ...widget, active }
                  ),
                }
          ),
        })),

      /** Cross-icon */
      removeWidget: (categoryId, widgetId) =>
        get().setWidgetActive(categoryId, widgetId, false),

      /** brand-new, user-authored widget */
      addCustomWidget: (categoryId, { name, text }) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id !== categoryId
              ? category
              : {
                  ...category,
                  widgets: [
                    ...category.widgets,
                    {
                      id: makeId('custom'),
                      name: name.trim(),
                      type: 'text',
                      active: true,
                      custom: true,
                      data: { text: text.trim() },
                    },
                  ],
                }
          ),
        })),

      /** Bulk-apply. */
      applyWidgetSelection: (categoryId, selection) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id !== categoryId
              ? category
              : {
                  ...category,
                  widgets: category.widgets.map((widget) =>
                    widget.id in selection
                      ? { ...widget, active: selection[widget.id] }
                      : widget
                  ),
                }
          ),
        })),

      resetDashboard: () => set({ categories: dashboardConfig.categories, searchQuery: '' }),
    }),
    {
      name: 'sentryne-cnapp-dashboard',
    }
  )
);
