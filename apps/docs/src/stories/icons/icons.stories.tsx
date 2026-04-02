import type { Meta } from '@storybook/react';
import IconGallery from '../../components/IconGallery.tsx';
import { IconGalleryErrorBoundary } from '../../components/IconGalleryErrorBoundary.tsx';

const meta = {
  title: 'Icons/All Icons',
  component: IconGallery,
} satisfies Meta<typeof IconGallery>;

export default meta;

export const Default = {
  render: () => (
    <IconGalleryErrorBoundary>
      <IconGallery />
    </IconGalleryErrorBoundary>
  ),
};
