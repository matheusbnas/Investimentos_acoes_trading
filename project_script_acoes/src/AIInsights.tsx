const AIInsights = ({ indicators, darkMode }) => {
    const analyzeMarket = () => {
      const { rsi, ma20, ma50 } = indicators;
      let analysis = [];
      
      if (rsi < 30) analysis.push("RSI indica possível reversão de tendência");
      if (ma20 > ma50) analysis.push("Tendência de alta no médio prazo");
      if (ma50 > ma100) analysis.push("Tendência de alta consolidada");
  
      return analysis.length > 0 ? analysis : ["Mercado estável sem sinais fortes"];
    };
  
    return (
      <div className={`mt-8 p-6 rounded-lg shadow transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
      }`}>
        <h2 className="text-xl font-semibold mb-4">Análise DeepSeek AI</h2>
        <ul className="space-y-2 list-disc list-inside">
          {analyzeMarket().map((item, index) => (
            <li key={index} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };