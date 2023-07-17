import type { Meta, StoryObj } from '@storybook/react';

import Preset from './Preset';

const meta = {
  title: 'Preset',
  component: Preset,
} satisfies Meta<typeof Preset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    label: "light bg sticker",
    type: "light"
  },
};

export const Dark: Story = {
  args: {
    label: "dark bg sticker",
    type: "dark"
  },
};

export const Photo: Story = {
  args: {
    label: "photo",
    type: "photo"
  },
};
