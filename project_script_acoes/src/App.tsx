import StockChart from './StockChart';
import TradingFAQ from './TradingFAQ';
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Bell,
  Search,
  ChevronDown,
} from 'lucide-react';

const STOCKS = {
  'Ações dos EUA': {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'META': 'Meta Platforms Inc.',
    'TSLA': 'Tesla Inc.',
    'NVDA': 'NVIDIA Corporation',
    'JPM': 'JPMorgan Chase & Co.',
    'PYPL': 'PayPal Holdings',
    'INTC': 'Intel Corporation',
    'AMD': 'Advanced Micro Devices',
    'NFLX': 'Netflix Inc.',
    'DIS': 'The Walt Disney Company',
    'UBER': 'Uber Technologies Inc.',
    'COIN': 'Coinbase Global Inc.',
    'SHOP': 'Shopify Inc.',
    'ZM': 'Zoom Video Communications',
    'PLTR': 'Palantir Technologies'
  },
  'Ações Brasileiras': {
    'PETR4.SA': 'Petrobras PN',
    'VALE3.SA': 'Vale ON',
    'ITUB4.SA': 'Itaú Unibanco PN',
    'BBDC4.SA': 'Bradesco PN',
    'ABEV3.SA': 'Ambev ON',
    'WEGE3.SA': 'WEG ON',
    'RENT3.SA': 'Localiza ON',
    'BBAS3.SA': 'Banco do Brasil ON',
    'CIEL3.SA': 'Cielo ON',
    'SUZB3.SA': 'Suzano ON',
    'EMBR3.SA': 'Embraer ON',
    'GGBR4.SA': 'Gerdau PN',
    'MGLU3.SA': 'Magazine Luiza ON',
    'VIVA3.SA': 'Vivara ON',
    'TOTS3.SA': 'Totvs ON',
    'LWSA3.SA': 'Locaweb ON'
  },
  'ETFs': {
    'SPY': 'SPDR S&P 500 ETF',
    'QQQ': 'Invesco QQQ Trust',
    'IWM': 'iShares Russell 2000 ETF',
    'EEM': 'iShares MSCI Emerging Markets ETF',
    'BOVA11.SA': 'iShares Ibovespa',
    'SMAL11.SA': 'iShares Small Cap',
    'IVVB11.SA': 'iShares S&P 500',
    'URTH': 'iShares MSCI World ETF',
    'ACWI': 'iShares MSCI ACWI ETF',
    'VTI': 'Vanguard Total Stock Market ETF'
  }
};

const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period + 1) return 50;
  
  const deltas = prices.slice(1).map((price, i) => price - prices[i]);
  const gains = deltas.map(change => change > 0 ? change : 0);
  const losses = deltas.map(change => change < 0 ? -change : 0);

  const avgGain = gains.slice(-period).reduce((sum, gain) => sum + gain, 0) / period;
  const avgLoss = losses.slice(-period).reduce((sum, loss) => sum + loss, 0) / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

const calculateMA = (prices: number[], period: number): number => {
  if (prices.length < period) return 0;
  return prices.slice(-period).reduce((sum, price) => sum + price, 0) / period;
};

interface Trade {
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  type: 'buy' | 'sell';
  date: string;
}

interface Indicators {
  rsi: number;
  ma20: number;
  ma50: number;
}

function App() {
  const [symbol, setSymbol] = useState('AAPL');
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [portfolio, setPortfolio] = useState<Trade[]>([]);
  const [indicators, setIndicators] = useState<Indicators | null>(null);
  const [autoTrading, setAutoTrading] = useState(false);
  const [pythonStatus, setPythonStatus] = useState('');
  const [historicalData, setHistoricalData] = useState<Array<{ timestamp: number; close: number }>>([]);

  useEffect(() => {
    fetchStockData();
    if (autoTrading) {
      const interval = setInterval(fetchStockData, 60000);
      return () => clearInterval(interval);
    }
  }, [symbol, autoTrading]);

  const calculateIndicators = (prices: number[]) => {
    const rsi = calculateRSI(prices);
    const ma20 = calculateMA(prices, 20);
    const ma50 = calculateMA(prices, 50);
    
    setIndicators({ rsi, ma20, ma50 });
  };

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/stock?symbol=${symbol}`
      );
      const data = await response.json();
  
      if (data.error) {
        setError(data.error);
        return;
      }
  
      setStockData(data.stockInfo);
      
      if (data.prices && data.prices.length > 0) {
        calculateIndicators(data.prices);
        setHistoricalData(data.prices.map((price: number, index: number) => ({
          timestamp: Date.now() - (data.prices.length - index) * 900000,
          close: price
        })));
      }
    } catch (err) {
      setError('Erro ao buscar dados.');
      console.error('Detalhes do erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const controlPythonTrading = async (active: boolean) => {
    try {
      const response = await fetch('http://localhost:5000/api/trading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          active,
          symbol 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro na requisição');
      }
  
      const data = await response.json();
      setPythonStatus(active ? 'Conectado ao Python' : 'Desconectado');
      
    } catch (err: any) {
      setPythonStatus(err.message || 'Erro de conexão com o backend');
    }
  };
  
  const executeTrade = (type: 'buy' | 'sell') => {
    if (!stockData) return;
    const price = stockData.price;
    
    setPortfolio([...portfolio, {
      symbol,
      quantity,
      price,
      total: price * quantity,
      type,
      date: new Date().toISOString()
    }]);
  };

  const toggleAutoTrading = () => {
    const newState = !autoTrading;
    setAutoTrading(newState);
    controlPythonTrading(newState);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <LineChart className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold">TradingDash</span>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-gray-600" />
              <Settings className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(STOCKS).map(([category, stocks]) => (
                <optgroup label={category} key={category}>
                  {Object.entries(stocks).map(([symbol, name]) => (
                    <option value={symbol} key={symbol}>
                      {name} ({symbol})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <button
              onClick={fetchStockData}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Buscar
            </button>
            <div className="flex flex-col">
              <button
                onClick={toggleAutoTrading}
                className={`px-4 py-2 ${autoTrading ? 'bg-green-600' : 'bg-gray-600'} text-white rounded-md hover:opacity-90`}
              >
                {autoTrading ? 'Auto ON' : 'Auto OFF'}
              </button>
              <span className="text-xs text-gray-600">{pythonStatus}</span>
            </div>
          </div>

          {loading && <p className="text-gray-600">Carregando...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {stockData && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Dados: {symbol}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Preço</p>
                  <p className="text-2xl font-bold">
                    ${stockData.price.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Variação</p>
                  <p className={`text-2xl font-bold ${
                    stockData.change >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {stockData.change.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Volume</p>
                  <p className="text-2xl font-bold">
                    {stockData.volume.toLocaleString()}
                  </p>
                </div>
              </div>

              {indicators && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">RSI (14)</p>
                    <p className="text-xl font-bold">{indicators.rsi.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">MA20</p>
                    <p className="text-xl font-bold">${indicators.ma20.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Sinal</p>
                    <p className={`text-xl font-bold ${
                      indicators.ma20 > indicators.ma50 && indicators.rsi < 70 
                        ? 'text-green-600' 
                        : indicators.ma20 < indicators.ma50 && indicators.rsi > 30 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                    }`}>
                      {indicators.ma20 > indicators.ma50 && indicators.rsi < 70 
                        ? 'COMPRA' 
                        : indicators.ma20 < indicators.ma50 && indicators.rsi > 30 
                        ? 'VENDA' 
                        : 'NEUTRO'}
                    </p>
                  </div>
                </div>
              )}

              {historicalData.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6 mt-4">
                  <h2 className="text-xl font-semibold mb-4">Gráfico de 15 Minutos (5 dias)</h2>
                  <StockChart 
                  data={historicalData}
                  indicators={indicators || { ma20: 0, ma50: 0, rsi: 50 }} // Fornece fallback
                  showMA20={true}
                  showMA50={true}
                  showRSI={true}
                />
                </div>
              )}

              <div className="flex gap-4 items-center mt-6">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-32 p-2 border rounded-md"
                  placeholder="Quantidade"
                />
                <button
                  onClick={() => executeTrade('buy')}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  disabled={autoTrading}
                >
                  Comprar
                </button>
                <button
                  onClick={() => executeTrade('sell')}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  disabled={autoTrading}
                >
                  Vender
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Histórico</h2>
          </div>
          <div className="divide-y">
            {portfolio.map((trade, index) => (
              <div key={index} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    trade.type === 'buy' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {trade.type === 'buy' ? (
                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{trade.symbol}</p>
                    <p className="text-sm text-gray-500">
                      {trade.type === 'buy' ? 'Compra' : 'Venda'} - {trade.quantity}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">${trade.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    ${trade.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            {portfolio.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                Nenhuma operação realizada
              </div>
            )}
          </div>
        </div>

        <TradingFAQ />
      </main>
    </div>
  );
}

export default App;