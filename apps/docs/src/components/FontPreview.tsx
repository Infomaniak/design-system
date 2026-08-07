import React from 'react';

const FontPreview: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '1rem',
    }}
  >
    <div
      style={{
        fontSize: '3.5rem',
        lineHeight: '1.5',
        color: 'var(--esds-color-content-secondary)',
        fontFamily: 'var(--esds-font-family-base), sans-serif',
      }}
    >
      Aa
    </div>
    <div
      style={{
        fontSize: '1rem',
        lineHeight: '1.5',
        color: 'var(--esds-color-content-primary)',
        fontFamily: 'var(--esds-font-family-base), sans-serif',
      }}
    >
      ABCDEFGHIJKLMNOPQRSTUVWXYZ
      <br />
      abcdefghijklmnopqrstuvwxyz
      <br />
      1234567890(,.;:?!$&*)
    </div>
  </div>
);

export default FontPreview;
