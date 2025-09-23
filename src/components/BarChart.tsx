import './BarChart.css';

export interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  /** Array of data points to display */
  data: BarChartData[];
  /** Width of the chart in pixels */
  width?: number;
  /** Height of the chart in pixels */
  height?: number;
  /** Title of the chart */
  title?: string;
  /** Whether to show value labels on bars */
  showValues?: boolean;
  /** Color scheme for bars */
  colorScheme?: 'blue' | 'green' | 'purple' | 'mixed';
}

const defaultColors = {
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  mixed: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4']
};

export const BarChart = ({
  data,
  width = 400,
  height = 300,
  title,
  showValues = true,
  colorScheme = 'blue'
}: BarChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div 
        style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        className="bar-chart-empty"
      >
        <p>No data to display</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const chartHeight = height - 80; // Leave space for title and labels
  const chartWidth = width - 60; // Leave space for margins
  const barWidth = chartWidth / data.length * 0.8;
  const barSpacing = chartWidth / data.length * 0.2;

  const getBarColor = (index: number, item: BarChartData) => {
    if (item.color) return item.color;
    if (colorScheme === 'mixed') {
      return defaultColors.mixed[index % defaultColors.mixed.length];
    }
    return defaultColors[colorScheme];
  };

  return (
    <div className="bar-chart" style={{ width, height }}>
      {title && (
        <h3 style={{ 
          margin: '0 0 20px 0', 
          textAlign: 'center', 
          fontSize: '18px',
          fontWeight: 'bold' 
        }}>
          {title}
        </h3>
      )}
      
      <svg width={width} height={chartHeight + 60}>
        {/* Chart area background */}
        <rect 
          x={30} 
          y={20} 
          width={chartWidth} 
          height={chartHeight} 
          fill="transparent" 
          stroke="#e5e7eb" 
          strokeWidth={1}
        />
        
        {/* Y-axis grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <g key={index}>
            <line
              x1={30}
              y1={20 + chartHeight * ratio}
              x2={30 + chartWidth}
              y2={20 + chartHeight * ratio}
              stroke="#f3f4f6"
              strokeWidth={1}
            />
            <text
              x={25}
              y={25 + chartHeight * ratio}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {Math.round(maxValue * (1 - ratio))}
            </text>
          </g>
        ))}
        
        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = 30 + index * (barWidth + barSpacing) + barSpacing / 2;
          const y = 20 + chartHeight - barHeight;
          
          return (
            <g key={index}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={getBarColor(index, item)}
                rx={2}
                ry={2}
              />
              
              {/* Value label */}
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#374151"
                  fontWeight="500"
                >
                  {item.value}
                </text>
              )}
              
              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={20 + chartHeight + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};