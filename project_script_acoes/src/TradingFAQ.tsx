import React from 'react';

interface TradingFAQProps {
  darkMode: boolean;
}

const TradingFAQ: React.FC<TradingFAQProps> = ({ darkMode }) => {
  const faqItems = [
    {
      title: 'RSI (Índice de Força Relativa)',
      description: 'Mede a velocidade e mudança de movimentos de preços. Varia entre 0-100.',
      items: ['Acima de 70: Sobrecompra', 'Abaixo de 30: Sobrevenda']
    },
    {
      title: 'Médias Móveis (MA)',
      description: 'Média de preços em um período específico:',
      items: [
        'MA20: Média de 20 períodos (curto prazo)',
        'MA50: Média de 50 períodos (médio prazo)'
      ],
      additionalInfo: 'Quando a MA20 cruza acima da MA50: sinal de compra'
    },
    {
      title: 'Estratégia Usada',
      description: 'Combina RSI e cruzamento de médias:',
      items: [
        'Compra: MA20 > MA50 E RSI < 70',
        'Venda: MA20 < MA50 E RSI > 30'
      ]
    }
  ];

  return (
    <div className={`mt-8 p-4 md:p-6 rounded-lg shadow transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
    }`}>
      <h2 className="text-lg md:text-xl font-semibold mb-4">FAQ - Análise Técnica</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {faqItems.map((item, index) => (
          <div key={index} className={`p-4 rounded-lg ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
          } transition-colors duration-200`}>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {item.description}
            </p>
            <ul className={`list-disc list-inside text-sm space-y-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {item.items.map((listItem, i) => (
                <li key={i}>{listItem}</li>
              ))}
            </ul>
            {item.additionalInfo && (
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.additionalInfo}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradingFAQ;