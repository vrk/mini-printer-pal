import type { Meta, StoryObj } from '@storybook/react';

import TextBoxProps from './TextBox';

const meta = {
  title: 'TextBox',
  component: TextBoxProps,
} satisfies Meta<typeof TextBoxProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
