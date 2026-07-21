import { css } from 'lit';

export const iconStyles = css`
  :host {
    display: inline-block;
    vertical-align: 0;
  }

  :host([inline]),
  :host([inline='']),
  :host([inline='true']) {
    vertical-align: -0.125em;
  }

  svg {
    display: block;
    margin: auto;
  }
`;
