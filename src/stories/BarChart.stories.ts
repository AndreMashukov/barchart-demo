import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from '../components/BarChart';

const meta: Meta<typeof BarChart> = {
  title: 'Components/BarChart',
  component: BarChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable bar chart component for displaying data visualizations.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array of data points to display in the chart',
      control: 'object'
    },
    width: {
      description: 'Chart width in pixels',
      control: { type: 'range', min: 200, max: 800, step: 50 }
    },
    height: {
      description: 'Chart height in pixels',
      control: { type: 'range', min: 150, max: 600, step: 50 }
    },
    title: {
      description: 'Chart title',
      control: 'text'
    },
    showValues: {
      description: 'Show values on top of bars',
      control: 'boolean'
    },
    colorScheme: {
      description: 'Color scheme for the bars',
      control: { type: 'select' },
      options: ['blue', 'green', 'purple', 'mixed']
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { label: 'Jan', value: 30 },
  { label: 'Feb', value: 45 },
  { label: 'Mar', value: 60 },
  { label: 'Apr', value: 40 },
  { label: 'May', value: 75 }
];

const salesData = [
  { label: 'Q1', value: 120 },
  { label: 'Q2', value: 150 },
  { label: 'Q3', value: 180 },
  { label: 'Q4', value: 200 }
];

const productData = [
  { label: 'Product A', value: 85 },
  { label: 'Product B', value: 120 },
  { label: 'Product C', value: 95 },
  { label: 'Product D', value: 140 },
  { label: 'Product E', value: 110 },
  { label: 'Product F', value: 75 }
];

export const Default: Story = {
  args: {
    data: sampleData,
    width: 400,
    height: 300,
    title: 'Monthly Data',
    showValues: true,
    colorScheme: 'blue'
  }
};

export const WithCustomColors: Story = {
  args: {
    data: [
      { label: 'Red', value: 30, color: '#ef4444' },
      { label: 'Blue', value: 45, color: '#3b82f6' },
      { label: 'Green', value: 60, color: '#10b981' },
      { label: 'Purple', value: 40, color: '#8b5cf6' }
    ],
    width: 400,
    height: 300,
    title: 'Custom Colors Chart',
    showValues: true
  }
};

export const LargeChart: Story = {
  args: {
    data: productData,
    width: 600,
    height: 400,
    title: 'Product Performance',
    showValues: true,
    colorScheme: 'mixed'
  }
};

export const WithoutValues: Story = {
  args: {
    data: salesData,
    width: 400,
    height: 300,
    title: 'Quarterly Sales',
    showValues: false,
    colorScheme: 'green'
  }
};

export const SmallChart: Story = {
  args: {
    data: [
      { label: 'A', value: 10 },
      { label: 'B', value: 25 },
      { label: 'C', value: 15 }
    ],
    width: 250,
    height: 200,
    title: 'Compact Chart',
    showValues: true,
    colorScheme: 'purple'
  }
};

export const EmptyChart: Story = {
  args: {
    data: [],
    width: 400,
    height: 300,
    title: 'No Data Available'
  }
};