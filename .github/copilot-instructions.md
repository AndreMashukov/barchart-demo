# Copilot Instructions for BarChart Demo

## Project Overview
React + TypeScript dashboard application featuring D3.js data visualizations, Material-UI components, and Storybook for component development. The app showcases both a standalone bar chart component and a dynamic tile-based dashboard with configurable widgets.

## Architecture & Key Patterns

### Component Structure
- **Page Layout System**: Three-layer architecture
  - `Page` → wraps `PageContextProvider` → renders `PageComponent` (layout with Header/Sidebar/Main)
  - All pages should be children of `<Page>` component (see `src/App.tsx`)
  - Header is fixed, sidebar is collapsible with state managed via `PageContext`

- **Tile System**: Configuration-driven widget dashboard with composite slot architecture
  - Tile configs in `src/config/availableTiles.ts` define: `id`, `type`, `component`, `label`, `color`, `backgroundColor`, `dataSource`
  - Two tile types: `Type1` (simple tiles placed in quadrants) and `Type2` (full composite slot tiles)
  - Composite slots can hold either 4 Type1 tiles (in quadrants) or 1 Type2 tile (filling entire slot)
  - State managed by `TileEditContext` with localStorage persistence
  - Mock data fetched via `useTileData` hook with simulated API delays (300-600ms)

### State Management Patterns
- **useBaseReducer**: Custom hook that auto-generates setter actions from initial state keys
  - Creates actions like `setOpenSidebar`, `setEditMode` from state properties
  - Used by `PageContext`, `TileEditContext` for consistent state management
  - Example: `{state, actions} = useBaseReducer({initialState: {editMode: false}})`

- **Context Providers**: Always separate context definition from provider implementation
  - Pattern: `Context.ts` (interface) + `ContextProvider.tsx` (implementation) + `index.ts` (exports)
  - See `src/context/TileEditContext/` and `src/components/Page/context/` for examples

### D3.js Integration
- All D3 charts use `useRef<SVGSVGElement>` + `useEffect` pattern
- Always clear previous SVG content: `d3.select(svgRef.current).selectAll('*').remove()`
- Three chart types:
  - `BarChart`: Full-featured chart with MUI Card wrapper, axes, hover effects
  - `SparklineBarChart`: Minimal bar chart for dashboard tiles (no axes)
  - `SparklineLineChart`: Area + line chart with d3.curveBumpX for smooth curves

## Development Workflows

### Running the Application
```bash
npm start              # React dev server on :3000
npm run storybook      # Storybook on :6006
npm test              # Jest tests
npm run build         # Production build
```

### Component Development
- New reusable components → create in `src/components/` with index.ts export
- Storybook stories → create alongside components as `*.stories.tsx`
- Always wrap D3 components in MUI theme provider for consistent styling (see `BarChart.stories.tsx`)

### Adding New Dashboard Tiles
1. Define tile config in `src/config/availableTiles.ts`
2. Add mock data generator in `src/hooks/useTileData.ts`
3. Create tile component in `src/components/Tiles/` if new type needed
4. Tile will automatically appear in selector modal based on `type` property

## Code Conventions

### TypeScript
- Strict mode enabled
- Prefer interfaces over types for component props
- Use discriminated unions for tile configs (see `TileConfig` types)
- Type guards for conditional rendering (e.g., `(id): id is string => id !== null`)

### Material-UI
- Use MUI v7 syntax: `@mui/material` imports
- Color palette: Primary `#fc7b00` (orange), use MUI color presets for tiles (`indigo[900]`, `purple[700]`, etc.)
- Styled components pattern: Create separate `.styled.ts` files for complex styled components (see `Sidebar.styled.ts`)
- Always use `sx` prop over inline styles for MUI components

### File Organization
- Component structure: `ComponentName/ComponentName.tsx` + `index.ts`
- Shared utilities in `shared/` subdirectories
- Stories co-located with components in `src/stories/` for Storybook examples

### Naming Conventions
- Context hooks: `use[ContextName]` (e.g., `useTileEdit`, not `useTileEditContext`)
- Tile IDs: kebab-case with prefix `tile-*` (e.g., `tile-total-charts`)
- Data sources: camelCase enum values (e.g., `totalCharts`, `websiteTraffic`)

## Common Gotchas

### localStorage Integration
- `TileEditContext` persists row1CompositeSlots/row2CompositeSlots to localStorage key `dashboard-tile-configuration`
- Backward compatibility: reads old `row1Tiles`/`row2Tiles` keys if new keys not found
- Always handle SSR/hydration: check `typeof window !== 'undefined'` before accessing localStorage
- Edit mode state (`editMode`) is NOT persisted - always starts false

### D3 + React Pitfalls
- Never manipulate D3-rendered DOM with React state updates
- Dependency arrays matter: include `[data, width, height, color]` in useEffect
- Use `d3.max(data) || 0` to avoid null/undefined in domain calculations

### Context Usage
- `PageContext` manages sidebar/drawer state - don't create duplicate sidebar state
- `TileEditContext` must wrap dashboard pages - see `Dashboard.tsx` for pattern
- Always use `useContext` through custom hooks (e.g., `useTileEdit()`) for better error messages

## Testing
- Jest + React Testing Library configured
- Test setup in `src/setupTests.ts` imports `@testing-library/jest-dom`
- Current test coverage minimal - focus on critical paths for new features

## External Dependencies
- React 19.1.1, TypeScript 4.9.5, MUI 7.3.2, D3 7.9.0, Storybook 9.1.7
- Create React App 5.0.1 (not ejected)
- Emotion CSS-in-JS (via MUI)

## Future Considerations
- The `docs/` directory contains legacy frontend files (likely from migration) - ignore for new work
- Storybook stories exist for example components in `src/stories/` - use as templates
- No routing implemented yet - single page app structure
