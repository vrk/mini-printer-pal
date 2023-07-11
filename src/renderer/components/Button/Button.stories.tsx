import type { Meta, StoryObj } from '@storybook/react';

import Button from './Button';

const meta = {
  title: 'Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicYellowButton: Story = {
  args: {
    label: 'click me!',
  },
};

export const SmallYellowButton: Story = {
  args: {
    label: 'more',
    leftRightPadding: 5,
    topBottomPadding: 0
  },
};

export const BasicPinkButton: Story = {
  args: {
    label: 'print',
    color: 'pink'
  },
};

export const BigPinkButton: Story = {
  args: {
    label: 'PRINT!',
    color: 'pink',
    fontSize: 36,
    leftRightPadding: 60,
    topBottomPadding: 15
  },
};