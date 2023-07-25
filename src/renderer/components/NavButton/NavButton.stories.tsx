import type { Meta, StoryObj } from '@storybook/react';

import NavButton from './NavButton';

const meta = {
  title: 'Nav Button',
  component: NavButton,
} satisfies Meta<typeof NavButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Help: Story = {
  args: {
    type: "help",
  },
};

export const Home: Story = {
  args: {
    type: "home",
  },
};
