import type { Meta, StoryObj } from '@storybook/react';

import PaperIcon from './PaperIcon';

const meta = {
  title: 'Paper Icon',
  component: PaperIcon,
} satisfies Meta<typeof PaperIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Big: Story = {
  args: {
    size: "large",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
  },
};

export const Small: Story = {
  args: {
    size: "small"
  },
};