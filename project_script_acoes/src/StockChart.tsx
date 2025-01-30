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

const StockChart = ({ data, indicators, showMA20, showMA50, showRSI }) => {
  if (!data || data.length === 0 || !indicators) return null;

  const chartData = data.map((item, index) => ({
    name: new Date(item.timestamp).toLocaleTimeString(), // Remove *1000
    price: item.close,
    ma20: indicators.ma20,
    ma50: indicators.ma50,
    rsi: indicators.rsi
  }));

  return (
    <div className="w-full h-96 bg-white p-4 rounded-lg shadow">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
          <Tooltip />
          <Legend />
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