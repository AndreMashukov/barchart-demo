import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';

interface DataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  title?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 500,
  height = 300,
  title = 'Bar Chart'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([innerHeight, 0]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.label) || 0)
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.value))
      .attr('fill', '#1976d2')
      .attr('rx', 4)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', '#1565c0');
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('fill', '#1976d2');
      });

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-family', 'Roboto, sans-serif')
      .style('font-size', '12px');

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-family', 'Roboto, sans-serif')
      .style('font-size', '12px');

    // Add value labels on bars
    g.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Roboto, sans-serif')
      .style('font-size', '12px')
      .style('fill', '#333')
      .text(d => d.value);

  }, [data, width, height]);

  return (
    <Card sx={{ maxWidth: width + 50, margin: 'auto' }}>
      <CardHeader
        title={
          <Typography variant="h6" component="h2" color="primary">
            {title}
          </Typography>
        }
      />
      <CardContent>
        <Box display="flex" justifyContent="center">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            style={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default BarChart;