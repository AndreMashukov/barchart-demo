import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import BarChart from '../components/BarChart';

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

// Wrapper component to provide MUI theme
const ThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <div style={{ padding: '20px' }}>
      {children}
    </div>
  </ThemeProvider>
);

const meta: Meta<typeof BarChart> = {
  title: 'Components/BarChart',
  component: BarChart,
  decorators: [
    (Story) => (
      <ThemeWrapper>
        <Story />
      </ThemeWrapper>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A bar chart component that combines Material-UI components with D3.js for data visualization.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array of data points with label and value',
      control: { type: 'object' },
    },
    width: {
      description: 'Width of the chart',
      control: { type: 'number', min: 200, max: 800 },
    },
    height: {
      description: 'Height of the chart',
      control: { type: 'number', min: 200, max: 600 },
    },
    title: {
      description: 'Chart title',
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BarChart>;

// Sample data for stories
const sampleData = [
  { label: 'Jan', value: 65 },
  { label: 'Feb', value: 78 },
  { label: 'Mar', value: 90 },
  { label: 'Apr', value: 45 },
  { label: 'May', value: 88 },
  { label: 'Jun', value: 73 },
];

const salesData = [
  { label: 'Product A', value: 120 },
  { label: 'Product B', value: 98 },
  { label: 'Product C', value: 86 },
  { label: 'Product D', value: 145 },
  { label: 'Product E', value: 67 },
];

const performanceData = [
  { label: 'Q1', value: 25 },
  { label: 'Q2', value: 45 },
  { label: 'Q3', value: 38 },
  { label: 'Q4', value: 52 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    title: 'Monthly Revenue',
    width: 500,
    height: 300,
  },
};

export const ProductSales: Story = {
  args: {
    data: salesData,
    title: 'Product Sales Comparison',
    width: 600,
    height: 350,
  },
};

export const QuarterlyPerformance: Story = {
  args: {
    data: performanceData,
    title: 'Quarterly Performance',
    width: 400,
    height: 250,
  },
};

export const LargeChart: Story = {
  args: {
    data: [
      { label: 'Category 1', value: 234 },
      { label: 'Category 2', value: 187 },
      { label: 'Category 3', value: 298 },
      { label: 'Category 4', value: 156 },
      { label: 'Category 5', value: 321 },
      { label: 'Category 6', value: 276 },
      { label: 'Category 7', value: 198 },
      { label: 'Category 8', value: 245 },
    ],
    title: 'Large Dataset Visualization',
    width: 700,
    height: 400,
  },
};

export const SmallChart: Story = {
  args: {
    data: [
      { label: 'A', value: 10 },
      { label: 'B', value: 25 },
      { label: 'C', value: 15 },
    ],
    title: 'Small Chart',
    width: 300,
    height: 200,
  },
};