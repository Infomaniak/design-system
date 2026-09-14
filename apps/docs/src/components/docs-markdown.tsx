import Markdown, { type MarkdownToJSX } from 'markdown-to-jsx';
import React from 'react';
import DocsLink from './docs-link.tsx';

export interface DocsMarkdownProps {
  readonly children: string;
}

const options: MarkdownToJSX.Options = {
  overrides: {
    a: DocsLink,
  },
};

/**
 * Renders raw markdown (e.g. generated token docs) with docs-wide link
 * conventions applied — see DocsLink.
 */
const DocsMarkdown: React.FC<DocsMarkdownProps> = ({ children }) => (
  <Markdown options={options}>{children}</Markdown>
);

export default DocsMarkdown;
