import React from 'react'
import type { Meta, StoryObj } from '@storybook/react';

import Select from './Select';

const meta = {
  title: 'Select',
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  "hi",
  "bye"
]

export const Selection: Story = {
  args: {
    children: options.map(option => <option value={option}>{option}</option>)
  }
};
