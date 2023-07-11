import type { Meta, StoryObj } from '@storybook/react';

import CloudHeader from './CloudHeader';

const meta = {
  title: 'Cloud Header',
  component: CloudHeader,
} satisfies Meta<typeof CloudHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Even: Story = {
  args: {
    label: "dither style",
    rotate: "3deg"
  },
};

export const PrintSize: Story = {
  args: {
    label: "print size",
    rotate: "-3deg"
  },
};

export const PaperSize: Story = {
  args: {
    label: "paper size",
    rotate: "10deg"
  },
};