import React from 'react';
import { withReset } from 'storybook/internal/components';
import { styled, type CSSObject, type StorybookTheme } from 'storybook/theming';

export interface CollapsibleProps {
  readonly summary: React.ReactNode;
  readonly children?: React.ReactNode;
}

const withResetStyles = (theme: StorybookTheme): CSSObject => withReset({ theme }) as CSSObject;

const StyledDetails = styled.details(({ theme }) => ({
  ...withResetStyles(theme),
  fontSize: theme.typography.size.s2,
  lineHeight: '24px',
  color: theme.color.defaultText,
  margin: '16px 0',
  '& > :first-child': {
    marginTop: 0,
  },
  '& > :last-child': {
    marginBottom: 0,
  },
}));

const StyledSummary = styled.summary(({ theme }) => ({
  cursor: 'pointer',
  fontWeight: 600,
  color: theme.color.defaultText,
}));

const Collapsible: React.FC<CollapsibleProps> = ({ summary, children }) => (
  <StyledDetails>
    <StyledSummary>{summary}</StyledSummary>
    {children}
  </StyledDetails>
);

export default Collapsible;
