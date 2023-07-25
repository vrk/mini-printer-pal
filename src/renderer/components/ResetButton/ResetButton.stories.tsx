import type { Meta, StoryObj } from '@storybook/react';

import ResetButton from './ResetButton';

const meta = {
  title: 'File',
  component: ResetButton,
} satisfies Meta<typeof ResetButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "default",
  },
};
