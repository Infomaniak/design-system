import React from 'react';

interface TableProps {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}

const Table: React.FC<TableProps> = ({ headers, rows }) => (
  <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th
            key={index}
            style={{
              textAlign: 'left',
              padding: '8px',
              borderBottom: '1px solid #e5e7eb',
              fontWeight: '600',
            }}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <td
              key={cellIndex}
              style={{
                padding: '8px',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
