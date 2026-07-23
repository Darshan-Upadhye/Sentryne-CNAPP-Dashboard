import { useMemo, useState } from 'react';
import { SearchX } from 'lucide-react';
import Navbar from './components/Navbar';
import CategorySection from './components/CategorySection';
import AddWidgetDrawer from './components/AddWidgetDrawer';
import { useDashboardStore } from './store/useDashboardStore';

function matchesQuery(widget, query) {
  const haystack = `${widget.name} ${widget.data?.text || ''}`.toLowerCase();
  return haystack.includes(query);
}

export default function App() {
  const categories = useDashboardStore((state) => state.categories);
  const searchQuery = useDashboardStore((state) => state.searchQuery);
  const setSearchQuery = useDashboardStore((state) => state.setSearchQuery);
  const removeWidget = useDashboardStore((state) => state.removeWidget);
  const resetDashboard = useDashboardStore((state) => state.resetDashboard);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCategoryId, setDrawerCategoryId] = useState(null);

  const isSearching = searchQuery.trim().length > 0;
  const query = searchQuery.trim().toLowerCase();

  const visibleCategories = useMemo(
    () =>
      categories.map((category) => {
        const active = category.widgets.filter((w) => w.active);
        const widgets = isSearching ? active.filter((w) => matchesQuery(w, query)) : active;
        return { category, widgets };
      }),
    [categories, isSearching, query]
  );

  const totalMatches = visibleCategories.reduce((sum, c) => sum + c.widgets.length, 0);

  const openDrawer = (categoryId) => {
    setDrawerCategoryId(categoryId || categories[0]?.id);
    setDrawerOpen(true);
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Reset the dashboard back to its default widgets? This clears anything you added or removed.'
      )
    ) {
      resetDashboard();
    }
  };

  return (
    <div className="app-shell">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdd={openDrawer}
        onReset={handleReset}
      />

      <main className="app-main">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Home / Dashboard V2</p>
            <h1 className="page-title">CNAPP Dashboard</h1>
            <p className="page-subtitle">
              Cloud posture, workload risk, and image findings — configured the way your team needs it.
            </p>
          </div>
          <div className="page-header-meta">
            <span className="live-dot" />
            Live · last synced 2 minutes ago
          </div>
        </div>

        {isSearching && (
          <div className="search-banner">
            <span>
              <strong>{totalMatches}</strong> widget{totalMatches === 1 ? '' : 's'} match &ldquo;
              {searchQuery}&rdquo;
            </span>
            <button type="button" onClick={() => setSearchQuery('')}>
              Clear search
            </button>
          </div>
        )}

        {isSearching && totalMatches === 0 ? (
          <div
            className="category-empty"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              padding: '48px 20px',
            }}
          >
            <SearchX size={28} strokeWidth={1.5} />
            <span>No widgets match &ldquo;{searchQuery}&rdquo;. Try a different name, or add a new widget.</span>
          </div>
        ) : (
          visibleCategories.map(({ category, widgets }) =>
            !isSearching || widgets.length > 0 ? (
              <CategorySection
                key={category.id}
                category={category}
                widgets={widgets}
                isSearching={isSearching}
                onRemoveWidget={removeWidget}
                onOpenAdd={openDrawer}
              />
            ) : null
          )
        )}
      </main>

      <footer className="app-footer text-center p-4 text-gray-600 text-sm mt-8 border-t">
  Sentryne CNAPP Dashboard by{' '}
  <a 
    href="https://darshan-upadhye-portfolio.vercel.app/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-blue-900 font-semibold hover:underline transition-colors"
  >
    Darshan Akshay Upadhye
  </a>
</footer>

      <AddWidgetDrawer
        open={drawerOpen}
        initialCategoryId={drawerCategoryId}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
