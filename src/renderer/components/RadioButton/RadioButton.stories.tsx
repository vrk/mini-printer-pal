import type { Meta, StoryObj } from '@storybook/react';

import RadioButton from './RadioButton';

const meta = {
  title: 'Radio Button',
  component: RadioButton,
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IsOff: Story = {
  args: {
    isOn: false,
    name: "choices",
    label: "Use my printer",
    value: "mine"
  },
};

export const IsOn: Story = {
  args: {
    isOn: true,
    name: "choices",
    label: "Use my printer",
    value: "mine"
  },
};
