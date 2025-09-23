# BarChart Demo - React Storybook with MUI and D3

A React Storybook project featuring an interactive bar chart component that combines Material-UI styling with D3.js data visualization.

![Storybook BarChart Demo](https://github.com/user-attachments/assets/74c189d7-6ab0-4f6a-a094-83ff5efd7485)

## 🚀 Features

- **React + TypeScript**: Built with Create React App and TypeScript for type safety
- **Storybook**: Interactive component development and documentation
- **Material-UI (MUI)**: Modern React UI framework for consistent styling
- **D3.js**: Powerful data visualization library for creating interactive charts
- **Interactive Controls**: Real-time component customization through Storybook controls
- **Multiple Stories**: Various chart configurations and use cases

## 📦 What's Included

### Components
- **BarChart**: A reusable bar chart component that combines MUI's Card layout with D3.js visualization
  - Responsive design
  - Customizable dimensions
  - Interactive hover effects
  - Value labels on bars
  - Clean Material Design styling

### Stories
- **Default**: Monthly revenue chart
- **Product Sales**: Product comparison chart
- **Quarterly Performance**: Quarterly data visualization
- **Large Chart**: Chart with more data points
- **Small Chart**: Compact chart layout

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd barchart-demo
```

2. Install dependencies:
```bash
npm install
```

### Development

#### Run Storybook
```bash
npm run storybook
```
This will start Storybook at `http://localhost:6006` where you can:
- View all component stories
- Interact with component controls
- Test different configurations
- Read auto-generated documentation

#### Run React App
```bash
npm start
```
This starts the React development server at `http://localhost:3000`

#### Build for Production
```bash
npm run build
npm run build-storybook
```

## 🎨 Component Usage

```tsx
import BarChart from './components/BarChart';

const data = [
  { label: 'Jan', value: 65 },
  { label: 'Feb', value: 78 },
  { label: 'Mar', value: 90 },
  // ... more data points
];

function App() {
  return (
    <BarChart
      data={data}
      title="Monthly Revenue"
      width={500}
      height={300}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `DataPoint[]` | Required | Array of data points with `label` and `value` |
| `title` | `string` | `'Bar Chart'` | Chart title displayed in the MUI Card header |
| `width` | `number` | `500` | Chart width in pixels |
| `height` | `number` | `300` | Chart height in pixels |

### DataPoint Interface

```tsx
interface DataPoint {
  label: string;  // X-axis label
  value: number;  // Y-axis value
}
```

## 🏗️ Project Structure

```
src/
├── components/
│   └── BarChart.tsx          # Main bar chart component
├── stories/
│   └── BarChart.stories.tsx  # Storybook stories
└── ... (Create React App files)

.storybook/
├── main.ts                   # Storybook configuration
└── preview.ts                # Global decorators and parameters
```

## 🎯 Technologies Used

- **React 19.1.1**: UI library
- **TypeScript 4.9.5**: Type safety
- **Storybook 9.1.7**: Component development environment
- **Material-UI 7.3.2**: React UI framework
- **D3.js 7.9.0**: Data visualization
- **Emotion**: CSS-in-JS library (used by MUI)

## 📱 Features Demonstration

The Storybook interface provides:

1. **Interactive Controls**: Modify component props in real-time
2. **Multiple Stories**: See different use cases and configurations
3. **Auto-generated Documentation**: Props tables and descriptions
4. **Responsive Preview**: Test component at different viewport sizes
5. **Accessibility Testing**: Built-in a11y checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Update stories if adding new features
5. Test in Storybook
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.