import React, { useEffect, useState } from 'react';

export interface MaterialThemeBuilderLinkProps {
  readonly children?: React.ReactNode;
}

const MaterialThemeBuilderLink: React.FC<MaterialThemeBuilderLinkProps> = ({ children }) => {
  const [href, setHref] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const style = window.getComputedStyle(document.body);
      const primary: string = style.getPropertyValue('--esds-material-builder-color-primary');
      const secondary: string = style.getPropertyValue('--esds-material-builder-color-secondary');
      const tertiary: string = style.getPropertyValue('--esds-material-builder-color-tertiary');
      const error: string = style.getPropertyValue('--esds-material-builder-color-error');
      const neutral: string = style.getPropertyValue('--esds-material-builder-color-neutral');
      const neutralVariant: string = style.getPropertyValue(
        '--esds-material-builder-color-neutral-variant',
      );

      const url = new URL('https://material-foundation.github.io/material-theme-builder');
      url.searchParams.set('primary', primary);
      url.searchParams.set('secondary', secondary);
      url.searchParams.set('tertiary', tertiary);
      url.searchParams.set('error', error);
      url.searchParams.set('neutral', neutral);
      url.searchParams.set('neutralVariant', neutralVariant);
      url.searchParams.set('colorMatch', 'false');

      setHref(url.toString());
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
};

export default MaterialThemeBuilderLink;
