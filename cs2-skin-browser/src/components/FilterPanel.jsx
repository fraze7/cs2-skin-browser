const WEAPONS = [
  { label: 'AK-47',          defIndex: 7   },
  { label: 'M4A4',           defIndex: 16  },
  { label: 'M4A1-S',         defIndex: 60  },
  { label: 'AWP',            defIndex: 9   },
  { label: 'Desert Eagle',   defIndex: 1   },
  { label: 'USP-S',          defIndex: 61  },
  { label: 'Glock-18',       defIndex: 4   },
  { label: 'Five-SeveN',     defIndex: 3   },
  { label: 'MP9',            defIndex: 34  },
  { label: 'P250',           defIndex: 36  },
  { label: 'Karambit',       defIndex: 507 },
  { label: 'Butterfly Knife',defIndex: 515 },
  { label: 'M9 Bayonet',     defIndex: 508 },
]

const SORTS = [
  { label: 'Best deal',            value: 'best_deal'     },
  { label: 'Newest',               value: 'most_recent'   },
  { label: 'Price: low to high',   value: 'lowest_price'  },
  { label: 'Price: high to low',   value: 'highest_price' },
  { label: 'Float: low to high',   value: 'lowest_float'  },
  { label: 'Float: high to low',   value: 'highest_float' },
]

const WEARS = [
  'Factory New',
  'Minimal Wear',
  'Field-Tested',
  'Well-Worn',
  'Battle-Scarred',
]

export default function FilterPanel({ filters, onChange, onReset, isDefault }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value })
  }

  // Keep min ≤ max by dragging the other handle along
  function setMinFloat(value) {
    onChange({ ...filters, minFloat: value, maxFloat: Math.max(value, filters.maxFloat) })
  }

  function setMaxFloat(value) {
    onChange({ ...filters, maxFloat: value, minFloat: Math.min(value, filters.minFloat) })
  }

  const slidersDisabled = filters.wears.length > 0

  function toggleWear(wear) {
    const next = filters.wears.includes(wear)
      ? filters.wears.filter(w => w !== wear)
      : [...filters.wears, wear]
    set('wears', next)
  }

  return (
    <div className="filter-panel">
      <div className="filter-row">
        <input
          className="filter-search"
          type="search"
          placeholder="Search skin name…"
          value={filters.search}
          onChange={e => set('search', e.target.value)}
        />

        <select
          className="filter-select"
          value={filters.defIndex}
          onChange={e => set('defIndex', e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">Any weapon</option>
          {WEAPONS.map(w => (
            <option key={w.defIndex} value={w.defIndex}>{w.label}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.sortBy}
          onChange={e => set('sortBy', e.target.value)}
          aria-label="Sort by"
        >
          {SORTS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <button className="reset-btn" onClick={onReset} disabled={isDefault}>
          Reset filters
        </button>
      </div>

      <div className="filter-row">
        <div className="wear-filters">
          {WEARS.map(wear => (
            <label key={wear} className="wear-label">
              <input
                type="checkbox"
                checked={filters.wears.includes(wear)}
                onChange={() => toggleWear(wear)}
              />
              {wear}
            </label>
          ))}
        </div>
      </div>

      <div className={`filter-row float-row${slidersDisabled ? ' disabled' : ''}`}>
        <label className="float-label">
          Float min
          <input
            type="range"
            min="0" max="1" step="0.01"
            value={filters.minFloat}
            disabled={slidersDisabled}
            onChange={e => setMinFloat(parseFloat(e.target.value))}
          />
          <span>{filters.minFloat.toFixed(2)}</span>
        </label>
        <label className="float-label">
          Float max
          <input
            type="range"
            min="0" max="1" step="0.01"
            value={filters.maxFloat}
            disabled={slidersDisabled}
            onChange={e => setMaxFloat(parseFloat(e.target.value))}
          />
          <span>{filters.maxFloat.toFixed(2)}</span>
        </label>
        {slidersDisabled && (
          <span className="float-hint">Using the float range of the selected wears</span>
        )}
      </div>
    </div>
  )
}
