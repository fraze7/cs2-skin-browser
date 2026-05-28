const WEAPONS = [
  'AK-47', 'M4A4', 'M4A1-S', 'AWP', 'Desert Eagle',
  'USP-S', 'Glock-18', 'MP9', 'P250', 'Five-SeveN',
  'Karambit', 'Butterfly Knife', 'M9 Bayonet',
]

const WEARS = [
  'Factory New',
  'Minimal Wear',
  'Field-Tested',
  'Well-Worn',
  'Battle-Scarred',
]

export default function FilterPanel({ filters, onChange }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value })
  }

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
          value={filters.weapon}
          onChange={e => set('weapon', e.target.value)}
        >
          <option value="">Any weapon</option>
          {WEAPONS.map(w => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
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

      <div className="filter-row float-row">
        <label className="float-label">
          Float min
          <input
            type="range"
            min="0" max="1" step="0.01"
            value={filters.minFloat}
            onChange={e => set('minFloat', parseFloat(e.target.value))}
          />
          <span>{filters.minFloat.toFixed(2)}</span>
        </label>
        <label className="float-label">
          Float max
          <input
            type="range"
            min="0" max="1" step="0.01"
            value={filters.maxFloat}
            onChange={e => set('maxFloat', parseFloat(e.target.value))}
          />
          <span>{filters.maxFloat.toFixed(2)}</span>
        </label>
      </div>
    </div>
  )
}
