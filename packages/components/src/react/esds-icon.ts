import { createComponent } from '@lit/react';
import * as React from 'react';
import { EsdsIconComponent } from '../components/esds-icon/esds-icon.component.ts';

EsdsIconComponent.define();

export const EsdsIcon = createComponent({
  tagName: 'esds-icon',
  elementClass: EsdsIconComponent,
  react: React,
});
