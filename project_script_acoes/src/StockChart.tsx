import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const StockChart = ({ data, indicators, showMA20, showMA50, showRSI, darkMode }) => {
  if (!data || data.length === 0 || !indicators) return null;

  const chartData = data.map((item) => ({
    name: new Date(item.timestamp).toLocaleTimeString(),
    price: item.close,
    ma20: indicators.ma20,
    ma50: indicators.ma50,
    rsi: indicators.rsi
  }));

  return (
    <div className={`w-full h-96 p-4 rounded-lg shadow transition-colors duration-300 ${
      darkMode ? 'bg-gray-700' : 'bg-white'
    }`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4A5568' : '#E2E8F0'} />
          <XAxis 
            dataKey="name" 
            stroke={darkMode ? '#CBD5E0' : '#718096'} 
          />
          <YAxis 
            yAxisId="left" 
            stroke={darkMode ? '#CBD5E0' : '#718096'}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            domain={[0, 100]} 
            stroke={darkMode ? '#CBD5E0' : '#718096'}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
              borderColor: darkMode ? '#4A5568' : '#E2E8F0'
            }}
            itemStyle={{ color: darkMode ? '#CBD5E0' : '#1A202C' }}
          />
          <Legend 
            wrapperStyle={{ color: darkMode ? '#CBD5E0' : '#1A202C' }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#2563eb" 
            yAxisId="left"
            name="Preço"
          />
          {showMA20 && (
            <Line 
              type="monotone" 
              dataKey="ma20" 
              stroke="#059669" 
              yAxisId="left"
              name="MA20"
            />
          )}
          {showMA50 && (
            <Line 
              type="monotone" 
              dataKey="ma50" 
              stroke="#9333ea" 
              yAxisId="left"
              name="MA50"
            />
          )}
          {showRSI && (
            <Line 
              type="monotone" 
              dataKey="rsi" 
              stroke="#dc2626" 
              yAxisId="right"
              name="RSI"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;