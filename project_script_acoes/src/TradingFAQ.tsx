const TradingFAQ = ({ darkMode }) => {
  return (
    <div className={`mt-8 p-6 rounded-lg shadow transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
    }`}>
      <h2 className="text-xl font-semibold mb-4">FAQ - Análise Técnica</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">RSI (Índice de Força Relativa)</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Mede a velocidade e mudança de movimentos de preços. Varia entre 0-100.
          </p>
          <ul className={`list-disc list-inside text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>Acima de 70: Sobrecompra</li>
            <li>Abaixo de 30: Sobrevenda</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Médias Móveis (MA)</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Média de preços em um período específico:
          </p>
          <ul className={`list-disc list-inside text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>MA20: Média de 20 períodos (curto prazo)</li>
            <li>MA50: Média de 50 períodos (médio prazo)</li>
          </ul>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Quando a MA20 cruza acima da MA50: sinal de compra
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Estratégia Usada</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Combina RSI e cruzamento de médias:
          </p>
          <ul className={`list-disc list-inside text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>Compra: MA20 &gt; MA50 E RSI &lt; 70</li>
            <li>Venda: MA20 &lt; MA50 E RSI &gt; 30</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TradingFAQ;