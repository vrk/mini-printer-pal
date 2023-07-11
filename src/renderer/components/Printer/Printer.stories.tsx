import type { Meta, StoryObj } from '@storybook/react';
import aaron from "./aaron.png";

import Printer from './Printer';

const meta = {
  title: 'Printer',
  component: Printer,
} satisfies Meta<typeof Printer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imgSrc: aaron,
  },
};
