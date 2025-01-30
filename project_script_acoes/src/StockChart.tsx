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

const StockChart = ({ 
  data, 
  indicators, 
  showMA20, 
  showMA50, 
  showMA100, // Novo indicador
  showRSI,
  showVolume, // Novo indicador
  darkMode 
}) => {
  if (!data || data.length === 0 || !indicators) return null;

  const chartData = data.map((item) => ({
    ...item,
    ma20: indicators.ma20,
    ma50: indicators.ma50,
    ma100: indicators.ma100, // Novo indicador
    rsi: indicators.rsi,
    price: item.close // Adicione esta linha
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
            domain={['auto', 'auto']}
            tickFormatter={(value) => value.toFixed(2)}
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
          
          {/* Preço */}
          <Line 
            type="monotone" 
            dataKey="close"  // Alterado de "price" para "close"
            stroke="#2563eb" 
            yAxisId="left"
            name="Preço"
          />

          {/* Volume (Novo) */}
          {showVolume && (
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#F59E0B"
              yAxisId="left"
              name="Volume"
              dot={false}
            />
          )}

          {/* Médias Móveis */}
          {showMA20 && (
            <Line 
              type="monotone" 
              dataKey="ma20" 
              stroke="#059669" 
              yAxisId="left"
              name="MA20"
              dot={false}
            />
          )}
          {showMA50 && (
            <Line 
              type="monotone" 
              dataKey="ma50" 
              stroke="#9333ea" 
              yAxisId="left"
              name="MA50"
              dot={false}
            />
          )}
          {showMA100 && (
            <Line 
              type="monotone" 
              dataKey="ma100" 
              stroke="#10B981" 
              yAxisId="left"
              name="MA100"
              dot={false}
            />
          )}

          {/* RSI */}
          {showRSI && (
            <Line 
              type="monotone" 
              dataKey="rsi" 
              stroke="#dc2626" 
              yAxisId="right"
              name="RSI"
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;