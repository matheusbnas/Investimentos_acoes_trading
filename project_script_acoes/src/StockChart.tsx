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

interface StockChartProps {
  data: any[];
  indicators: {
    ma20: number;
    ma50: number;
    ma100: number;
    rsi: number;
  };
  showMA20: boolean;
  showMA50: boolean;
  showMA100: boolean;
  showRSI: boolean;
  showVolume: boolean;
  darkMode: boolean;
}

const StockChart: React.FC<StockChartProps> = ({
  data,
  indicators,
  showMA20,
  showMA50,
  showMA100,
  showRSI,
  showVolume,
  darkMode
}) => {
  if (!data?.length || !indicators) return null;

  const chartData = data.map((item) => ({
    ...item,
    ma20: indicators.ma20,
    ma50: indicators.ma50,
    ma100: indicators.ma100,
    rsi: indicators.rsi,
    price: item.close
  }));

  const chartColors = {
    price: '#2563eb',
    volume: '#F59E0B',
    ma20: '#059669',
    ma50: '#9333ea',
    ma100: '#10B981',
    rsi: '#dc2626'
  };

  return (
    <div className={`w-full h-[300px] md:h-[400px] lg:h-[500px] p-2 md:p-4 rounded-lg shadow transition-colors duration-300 ${
      darkMode ? 'bg-gray-700' : 'bg-white'
    }`}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={darkMode ? '#4A5568' : '#E2E8F0'} 
          />
          <XAxis
            dataKey="name"
            stroke={darkMode ? '#CBD5E0' : '#718096'}
            fontSize={12}
          />
          <YAxis
            yAxisId="left"
            stroke={darkMode ? '#CBD5E0' : '#718096'}
            domain={['auto', 'auto']}
            tickFormatter={(value) => value.toFixed(2)}
            fontSize={12}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            stroke={darkMode ? '#CBD5E0' : '#718096'}
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
              borderColor: darkMode ? '#4A5568' : '#E2E8F0',
              fontSize: '12px'
            }}
            itemStyle={{ color: darkMode ? '#CBD5E0' : '#1A202C' }}
          />
          <Legend
            wrapperStyle={{ 
              color: darkMode ? '#CBD5E0' : '#1A202C',
              fontSize: '12px'
            }}
          />

          <Line
            type="monotone"
            dataKey="close"
            stroke={chartColors.price}
            yAxisId="left"
            name="Preço"
            dot={false}
            strokeWidth={2}
          />

          {showVolume && (
            <Line
              type="monotone"
              dataKey="volume"
              stroke={chartColors.volume}
              yAxisId="left"
              name="Volume"
              dot={false}
              strokeWidth={1}
            />
          )}

          {showMA20 && (
            <Line
              type="monotone"
              dataKey="ma20"
              stroke={chartColors.ma20}
              yAxisId="left"
              name="MA20"
              dot={false}
              strokeWidth={1}
            />
          )}

          {showMA50 && (
            <Line
              type="monotone"
              dataKey="ma50"
              stroke={chartColors.ma50}
              yAxisId="left"
              name="MA50"
              dot={false}
              strokeWidth={1}
            />
          )}

          {showMA100 && (
            <Line
              type="monotone"
              dataKey="ma100"
              stroke={chartColors.ma100}
              yAxisId="left"
              name="MA100"
              dot={false}
              strokeWidth={1}
            />
          )}

          {showRSI && (
            <Line
              type="monotone"
              dataKey="rsi"
              stroke={chartColors.rsi}
              yAxisId="right"
              name="RSI"
              dot={false}
              strokeWidth={1}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;