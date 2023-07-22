import type { Meta, StoryObj } from '@storybook/react';

import QrCodeControls from './QrCodeControls';

const meta = {
  title: 'QrCodeControls',
  component: QrCodeControls,
} satisfies Meta<typeof QrCodeControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "default",
  },
};
