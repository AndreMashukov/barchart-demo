import React, {useEffect, useRef} from "react";
import * as d3 from "d3";

interface ISparklineLineChartProps {
  width?: number;
  height?: number;
  color?: string;
  data: Array<{
    date: string;
    value: number;
  }>;
}

export const SparklineLineChart: React.FC<ISparklineLineChartProps> = ({
  width = 600,
  height = 200,
  color = "#2196f3",
  data,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const dimensions = {
      width,
      height,
      marginTop: 8,
    };

    const xAccessor = (d: {date: string; value: number}) => new Date(d.date);
    const yAccessor = (d: {date: string; value: number}) => d.value;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`);

    const xDomain = d3.extent(data, xAccessor) as [Date, Date];
    const yDomain = [0, d3.max(data, yAccessor) as number];

    const xScale = d3.scaleTime().domain(xDomain).range([0, dimensions.width]);

    const yScale = d3
      .scaleLinear()
      .domain(yDomain)
      .range([dimensions.height, dimensions.marginTop]);

    // Area
    const areaGenerator = d3
      .area<{date: string; value: number}>()
      .x((d) => xScale(xAccessor(d)))
      .y1((d) => yScale(yAccessor(d)))
      .y0(dimensions.height)
      .curve(d3.curveBumpX);

    svg
      .append("path")
      .datum(data)
      .attr("d", areaGenerator)
      .attr("fill", color)
      .attr("opacity", 0.2);

    // Line
    const lineGenerator = d3
      .line<{date: string; value: number}>()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)))
      .curve(d3.curveBumpX);

    svg
      .append("path")
      .datum(data)
      .attr("d", lineGenerator)
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("fill", "none");
  }, [data, width, height, color]);

  return <svg ref={svgRef} />;
};
