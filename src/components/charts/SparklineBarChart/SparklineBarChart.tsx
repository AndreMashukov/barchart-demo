import React, {useEffect, useRef} from "react";
import * as d3 from "d3";

interface ISparklineBarChartProps {
  width?: number;
  height?: number;
  color?: string;
  highlightColor?: string;
  data: number[];
  highlightRange?: [number, number]; // [start, end] indices to highlight
}

export const SparklineBarChart: React.FC<ISparklineBarChartProps> = ({
  width = 120,
  height = 54,
  color = "#26bfa6",
  highlightColor = "#2ecc71",
  data,
  highlightRange, // no default value
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const barWidth = Math.floor(width / data.length);
    const barGap = 4;
    const actualBarWidth = barWidth - barGap;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data) || 1])
      .range([height - 4, 6]); // leave some top/bottom padding

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_d, i) => i * barWidth + barGap / 2)
      .attr("y", (d) => yScale(d))
      .attr("width", actualBarWidth)
      .attr("height", (d) => height - 4 - yScale(d))
      .attr("fill", (_d, i) =>
        highlightRange && i >= highlightRange[0] && i <= highlightRange[1]
          ? highlightColor
          : color
      )
      .attr("rx", 2);
  }, [data, width, height, color, highlightColor, highlightRange]);

  return <svg ref={svgRef} />;
};
