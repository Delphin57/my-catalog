import React from 'react';

const CATEGORIES = [
  { value: 'electronics', label: 'Электроника' },
  { value: 'jewelery', label: 'Ювелирные изделия' },
  { value: "men's clothing", label: 'Мужская одежда' },
  { value: "women's clothing", label: 'Женская одежда' },
];

// Границы ползунков. Можно вынести в пропсы, если нужно.
const PRICE_MIN = 0;
const PRICE_MAX = 9999;

export function Filters({ onFilterChange, initialFilters }) {
  const [localCategories, setLocalCategories] = React.useState(
    Array.isArray(initialFilters.categories) ? initialFilters.categories : []
  );
  const [localMinPrice, setLocalMinPrice] = React.useState(
    String(initialFilters.minPrice ?? '')
  );
  const [localMaxPrice, setLocalMaxPrice] = React.useState(
    String(initialFilters.maxPrice ?? '')
  );

  const [errors, setErrors] = React.useState({});

  // Числовые значения (для слайдеров). Пустая строка → граница по умолчанию.
  const minNum = localMinPrice === '' ? PRICE_MIN : Number(localMinPrice);
  const maxNum = localMaxPrice === '' ? PRICE_MAX : Number(localMaxPrice);

  const validate = () => {
    const errs = {};
    const min = localMinPrice ? Number(localMinPrice) : undefined;
    const max = localMaxPrice ? Number(localMaxPrice) : undefined;

    if (min !== undefined && min < 0) {
      errs.min = 'Цена не может быть отрицательной';
    }
    if (max !== undefined && max < 0) {
      errs.max = 'Цена не может быть отрицательной';
    }
    if (
      min !== undefined && max !== undefined &&
      min >= 0 && max >= 0 &&
      min > max
    ) {
      errs.min = 'Цена «от» не может быть больше цены «до»';
      errs.max = 'Цена «до» не может быть меньше цены «от»';
    }
    return errs;
  };

  const handleCategoryToggle = (value) => {
    setLocalCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  // Общий обработчик для числового поля и ползунка «Цена от»
  const handleMinChange = (value) => {
    setLocalMinPrice(value);
    setErrors((prev) => ({ ...prev, min: '' }));
  };

  // Общий обработчик для числового поля и ползунка «Цена до»
  const handleMaxChange = (value) => {
    setLocalMaxPrice(value);
    setErrors((prev) => ({ ...prev, max: '' }));
  };

  const handleApply = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onFilterChange({
      categories: localCategories,
      minPrice: localMinPrice ? Number(localMinPrice) : undefined,
      maxPrice: localMaxPrice ? Number(localMaxPrice) : undefined,
    });
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {/* -------- Категории -------- */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px' }}>
            Категории
          </label>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              textAlign: 'left',
            }}
          >
            {CATEGORIES.map((cat) => (
              <label
                key={cat.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={localCategories.includes(cat.value)}
                  onChange={() => handleCategoryToggle(cat.value)}
                />
                {cat.label}
              </label>
            ))}
          </div>
        </div>

        {/* -------- Цена от -------- */}
        <div>
          <label>Цена от</label>
          <input
            type="number"
            value={localMinPrice}
            onChange={(e) => handleMinChange(e.target.value)}
            placeholder={String(PRICE_MIN)}
            min={PRICE_MIN}
            max={PRICE_MAX}
            style={{
              width: '100%',
              padding: '8px',
              border: errors.min ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
              marginBottom: '6px',
            }}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={maxNum}                 // не даём «от» превысить «до»
            step="1"
            value={minNum}
            onChange={(e) => handleMinChange(e.target.value)}
            style={{ width: '100%' }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: '#888',
            }}
          >
            <span>{PRICE_MIN}</span>
            <span>{maxNum}</span>
          </div>
          {errors.min && (
            <span
              style={{
                color: 'red',
                fontSize: '0.85rem',
                marginTop: '4px',
                display: 'block',
              }}
            >
              {errors.min}
            </span>
          )}
        </div>

        {/* -------- Цена до -------- */}
        <div>
          <label>Цена до</label>
          <input
            type="number"
            value={localMaxPrice}
            onChange={(e) => handleMaxChange(e.target.value)}
            placeholder={String(PRICE_MAX)}
            min={PRICE_MIN}
            max={PRICE_MAX}
            style={{
              width: '100%',
              padding: '8px',
              border: errors.max ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
              marginBottom: '6px',
            }}
          />
          <input
            type="range"
            min={minNum}                 // не даём «до» стать меньше «от»
            max={PRICE_MAX}
            step="1"
            value={maxNum}
            onChange={(e) => handleMaxChange(e.target.value)}
            style={{ width: '100%' }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: '#888',
            }}
          >
            <span>{minNum}</span>
            <span>{PRICE_MAX}</span>
          </div>
          {errors.max && (
            <span
              style={{
                color: 'red',
                fontSize: '0.85rem',
                marginTop: '4px',
                display: 'block',
              }}
            >
              {errors.max}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleApply}
        style={{
          padding: '10px 24px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Применить фильтры
      </button>
    </div>
  );
}