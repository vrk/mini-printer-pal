import type { Meta, StoryObj } from '@storybook/react';

import File from './Advanced';

const meta = {
  title: 'File',
  component: File,
} satisfies Meta<typeof File>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "default",
  },
};
