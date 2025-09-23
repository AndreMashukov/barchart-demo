# BarChart Demo - React Storybook Project

A React TypeScript project featuring a customizable BarChart component, built with Vite and documented with Storybook.

![Storybook BarChart Demo](https://github.com/user-attachments/assets/81d66eca-644c-4f1d-8b57-a260ca5e0800)

## Features

- 🎨 **Customizable BarChart Component** - SVG-based bar chart with full customization
- 📚 **Storybook Documentation** - Interactive component playground with live examples
- ⚡ **Vite + TypeScript** - Fast development with type safety
- 🎭 **Multiple Chart Variants** - Different sizes, colors, and configurations
- 🔧 **Interactive Controls** - Real-time component customization in Storybook
- 📱 **Responsive Design** - Clean, modern styling that works everywhere

## BarChart Component

The `BarChart` component is a fully customizable data visualization component built with SVG. It supports:

### Props

- **`data`** (required): Array of data points with `label`, `value`, and optional `color`
- **`width`**: Chart width in pixels (default: 400)
- **`height`**: Chart height in pixels (default: 300) 
- **`title`**: Chart title (optional)
- **`showValues`**: Show values on top of bars (default: true)
- **`colorScheme`**: Predefined color scheme - 'blue', 'green', 'purple', or 'mixed'

### Example Usage

```tsx
import { BarChart } from './components/BarChart';

const data = [
  { label: 'Jan', value: 30 },
  { label: 'Feb', value: 45 },
  { label: 'Mar', value: 60 },
  { label: 'Apr', value: 40 },
  { label: 'May', value: 75 }
];

<BarChart 
  data={data}
  width={400}
  height={300}
  title="Monthly Data"
  showValues={true}
  colorScheme="blue"
/>
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AndreMashukov/barchart-demo.git
   cd barchart-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

#### Run Storybook (Recommended)
Start the Storybook development server to explore and interact with components:

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the Storybook interface.

#### Run React App
Start the React development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the React app.

### Building

#### Build Storybook
Build Storybook for production:

```bash
npm run build-storybook
```

#### Build React App
Build the React app for production:

```bash
npm run build
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── BarChart.tsx       # Main BarChart component
│   │   ├── BarChart.css       # Component styles
│   │   └── index.ts           # Component exports
│   ├── stories/
│   │   ├── BarChart.stories.ts # Storybook stories for BarChart
│   │   └── ...                 # Other example stories
│   ├── App.tsx                # Main React app
│   └── main.tsx               # React app entry point
├── .storybook/                # Storybook configuration
│   ├── main.ts                # Main config
│   └── preview.ts             # Preview config
├── package.json
└── README.md
```

## Available Scripts

- **`npm run dev`** - Start React development server
- **`npm run build`** - Build React app for production
- **`npm run preview`** - Preview production build
- **`npm run lint`** - Run ESLint
- **`npm run storybook`** - Start Storybook development server
- **`npm run build-storybook`** - Build Storybook for production

## Storybook Stories

The BarChart component includes comprehensive Storybook stories showcasing different use cases:

- **Default** - Basic bar chart with monthly data
- **With Custom Colors** - Chart with individual bar colors
- **Large Chart** - Wider chart with more data points
- **Without Values** - Chart without value labels on bars
- **Small Chart** - Compact version for smaller spaces
- **Empty Chart** - Handling empty data gracefully

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Storybook 9** - Component documentation and testing
- **SVG** - Scalable vector graphics for charts
- **ESLint** - Code linting and formatting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).