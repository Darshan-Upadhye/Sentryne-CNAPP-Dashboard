import { Search, X, Plus, RotateCcw } from 'lucide-react';

function BrandMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 2 L28 7 V15 C28 22.5 22.8 28.3 16 30 C9.2 28.3 4 22.5 4 15 V7 Z"
        fill="#1D2666"
        stroke="#17C3B2"
        strokeWidth="1.2"
      />
      <path
        d="M10 16.5 L14 20.5 L22 11"
        stroke="#17C3B2"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Navbar({ searchQuery, onSearchChange, onOpenAdd, onReset }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-brand-mark">
          <BrandMark />
        </span>
        <span className="navbar-brand-name">Sentryne</span>
      </div>

      <nav className="navbar-crumb" aria-label="Breadcrumb">
        <span>Home</span>
        <span>/</span>
        <strong>Dashboard V2</strong>
      </nav>

      <div className="navbar-search">
        <Search size={15} />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search widgets by name…"
          aria-label="Search widgets"
        />
        {searchQuery && (
          <button
            type="button"
            className="navbar-search-clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="navbar-actions">
        <button
          type="button"
          className="btn btn-ghost-inverse btn-icon"
          onClick={onReset}
          title="Reset dashboard to defaults"
          aria-label="Reset dashboard to defaults"
        >
          <RotateCcw size={15} />
        </button>
        <button type="button" className="btn btn-primary" onClick={() => onOpenAdd()}>
          <Plus size={15} />
          Add Widget
        </button>
      </div>
    </header>
  );
}
