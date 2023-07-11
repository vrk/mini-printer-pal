import type { Meta, StoryObj } from '@storybook/react';

import Slider from './Slider';

const meta = {
  title: 'Slider',
  component: Slider,
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImageSize: Story = {
  args: {
    min: 1,
    max: 100
  },
};

export const Brightness: Story = {
  args: {
    icon: "brightness"
  },
};

export const contrast: Story = {
  args: {
    icon: "contrast"
  },
};
