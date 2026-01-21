import React, { useState } from 'react';
import './DataTable.css';

const DataTable = ({
  columns,
  data,
  onRowClick,
  emptyMessage = "Aucune donnée disponible",
  searchable = true,
  searchPlaceholder = "Rechercher..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = data.filter((row) =>
    columns.some((col) => {
      const value = row[col.key];
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="data-table">
      {searchable && (
        <div className="data-table__search">
          <svg className="data-table__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="data-table__search-input"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="data-table__wrapper">
        <table className="data-table__table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`data-table__th ${col.sortable !== false ? 'data-table__th--sortable' : ''}`}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <span>{col.label}</span>
                  {col.sortable !== false && sortConfig.key === col.key && (
                    <span className="data-table__sort-icon">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="data-table__empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`data-table__row ${onRowClick ? 'data-table__row--clickable' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="data-table__td">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="data-table__footer">
        <span className="data-table__count">
          {sortedData.length} résultat{sortedData.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

export default DataTable;
