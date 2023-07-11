import type { Meta, StoryObj } from '@storybook/react';

import DitherButton from './DitherButton';

const meta = {
  title: 'Dither Button',
  component: DitherButton,
} satisfies Meta<typeof DitherButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "squiggly",
  },
};
