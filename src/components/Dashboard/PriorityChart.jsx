import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const PriorityChart = ({ data }) => {
  // Add a check for empty data
  if (!data || data.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100%',
        minHeight: 200
      }}>
        <Typography variant="body2" color="text.secondary">
          No job data available
        </Typography>
      </Box>
    );
  }

  // Custom label renderer to ensure labels don't get cut off
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    // Reduce the radius to move labels inward
    const radius = outerRadius * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Paper sx={{ p: 2, height: '100%', minHeight: 300 }}>
      <Typography variant="h6" gutterBottom>
        Jobs by Priority
      </Typography>
      
      <Box sx={{ 
        width: '100%', 
        height: 250, 
        position: 'relative',
        margin: '0 auto' // Center the chart
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="45%" // Move pie chart up slightly to make room for legend
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={70} // Reduce radius to fit better
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} jobs`, 'Count']} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              layout="horizontal"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default PriorityChart;
