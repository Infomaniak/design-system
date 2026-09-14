import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { ensure, ThemeProvider, themes } from 'storybook/theming';
import { describe, expect, it } from 'vitest';
import Collapsible from './Collapsible.tsx';

const renderCollapsible = (ui: ReactElement) =>
  render(<ThemeProvider theme={ensure(themes.light)}>{ui}</ThemeProvider>);

describe('Collapsible', () => {
  it('renders summary and children', () => {
    renderCollapsible(
      <Collapsible summary="Where can I report a bug in a component ?">
        <p>Report in the dedicated kChat channel (internal).</p>
      </Collapsible>,
    );

    expect(screen.getByText('Where can I report a bug in a component ?')).toBeInTheDocument();
    expect(
      screen.getByText('Report in the dedicated kChat channel (internal).'),
    ).toBeInTheDocument();
  });

  it('is closed by default and opens when the summary is clicked', () => {
    renderCollapsible(<Collapsible summary="Question">Answer</Collapsible>);

    const details = screen.getByText('Question').closest('details')!;
    expect(details).not.toHaveAttribute('open');

    fireEvent.click(screen.getByText('Question'));
    expect(details).toHaveAttribute('open');
  });

  it('styles the summary with a pointer cursor and medium weight', () => {
    renderCollapsible(<Collapsible summary="Question">Answer</Collapsible>);

    const summary = screen.getByText('Question');
    expect(summary).toHaveStyle('cursor: pointer');
    expect(summary).toHaveStyle('font-weight: 600');
  });
});
