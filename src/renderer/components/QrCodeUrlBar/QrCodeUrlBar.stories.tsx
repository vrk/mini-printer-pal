import type { Meta, StoryObj } from '@storybook/react';

import QrCodeUrlBarProps from './QrCodeUrlBar';

const meta = {
  title: 'QrCodeUrlBar',
  component: QrCodeUrlBarProps,
} satisfies Meta<typeof QrCodeUrlBarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
