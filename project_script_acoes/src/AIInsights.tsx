import React from 'react';

interface Indicators {
  rsi: number[];
  ma20: number[];
  ma50: number[];
  ma100: number[];
}

interface AIInsightsProps {
  indicators: Indicators;
  darkMode: boolean;
}

const AIInsights: React.FC<AIInsightsProps> = ({ indicators, darkMode }) => {
  const analyzeMarket = () => {
    if (!indicators) return ["Carregando análise..."];
    
    const last = indicators.rsi.length - 1;
    const analysis = [];
    
    // Análise RSI
    if (indicators.rsi[last] < 30) {
      analysis.push("RSI em região de sobrevenda - possível reversão de baixa");
    } else if (indicators.rsi[last] > 70) {
      analysis.push("RSI em região de sobrecompra - possível reversão de alta");
    }
    
    // Análise de Tendências
    if (indicators.ma20[last] > indicators.ma50[last]) {
      analysis.push("Tendência de alta no médio prazo - MA20 acima da MA50");
    } else if (indicators.ma20[last] < indicators.ma50[last]) {
      analysis.push("Tendência de baixa no médio prazo - MA20 abaixo da MA50");
    }
    
    // Análise de Longo Prazo
    if (indicators.ma50[last] > indicators.ma100[last]) {
      analysis.push("Tendência de alta consolidada no longo prazo");
    } else if (indicators.ma50[last] < indicators.ma100[last]) {
      analysis.push("Tendência de baixa consolidada no longo prazo");
    }
    
    return analysis.length > 0 ? analysis : ["Mercado em equilíbrio - sem sinais claros de tendência"];
  };

  return (
    <div className={`mt-8 p-4 md:p-6 rounded-lg shadow transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
    }`}>
      <h2 className="text-lg md:text-xl font-semibold mb-4">Análise DeepSeek AI</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {analyzeMarket().map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;