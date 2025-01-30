export default function TradingFAQ() {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">FAQ - Análise Técnica</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">RSI (Índice de Força Relativa)</h3>
          <p className="text-gray-600 text-sm">
            Mede a velocidade e mudança de movimentos de preços. Varia entre 0-100.
            <br />• Acima de 70: Sobrecompra
            <br />• Abaixo de 30: Sobrevenda
          </p>
        </div>

        <div>
          <h3 className="font-medium">Médias Móveis (MA)</h3>
          <p className="text-gray-600 text-sm">
            Média de preços em um período específico:
            <br />• MA20: Média de 20 períodos (curto prazo)
            <br />• MA50: Média de 50 períodos (médio prazo)
            <br />Quando a MA20 cruza acima da MA50: sinal de compra
          </p>
        </div>

        <div>
          <h3 className="font-medium">Estratégia Usada</h3>
          <p className="text-gray-600 text-sm">
            Combina RSI e cruzamento de médias:
            <br />• Compra: MA20 {'>'} MA50 E RSI {'<'} 70
            <br />• Venda: MA20 {'<'} MA50 E RSI {'>'} 30
          </p>
        </div>
      </div>
    </div>
  );
}