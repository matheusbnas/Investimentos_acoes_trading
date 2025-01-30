from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import threading
import time

app = Flask(__name__)
CORS(app)

TRADING_ACTIVE = False
SYMBOL = 'AAPL'

VALID_SYMBOLS = {
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM',
    'PETR4.SA', 'VALE3.SA', 'ITUB4.SA', 'BBDC4.SA', 'ABEV3.SA',
    'WEGE3.SA', 'RENT3.SA', 'BBAS3.SA', 'BOVA11.SA', 'SPY', 'QQQ'
}

def calculate_rsi(prices, period=14):
    if len(prices) < period + 1:
        return 50
    
    deltas = [prices[i+1] - prices[i] for i in range(len(prices)-1)]
    gains = [max(d, 0) for d in deltas]
    losses = [abs(min(d, 0)) for d in deltas]

    avg_gain = sum(gains[:period]) / period
    avg_loss = sum(losses[:period]) / period

    if avg_loss == 0:
        return 100
        
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))

def trading_strategy(prices):
    if len(prices) < 50:
        return {'should_buy': False, 'should_sell': False}
    
    ordered_prices = sorted(prices, reverse=True)
    
    ma20 = sum(ordered_prices[:20]) / 20
    ma50 = sum(ordered_prices[:50]) / 50
    rsi = calculate_rsi(ordered_prices[:15])
    
    return {
        'should_buy': ma20 > ma50 and rsi < 70,
        'should_sell': ma20 < ma50 and rsi > 30
    }

@app.route('/')
def home():
    return "Servidor Flask está rodando. Use o endpoint /api/stock para buscar dados."

@app.route('/api/stock')
def get_stock_data():
    symbol = request.args.get('symbol', 'AAPL')
    
    try:
        # Busca dados em tempo real
        ticker = yf.Ticker(symbol)
        stock = ticker.fast_info

        # Busca dados históricos (para indicadores)
        hist = ticker.history(period="5d", interval="15m")
        prices = hist['Close'].tolist() if not hist.empty else []

        return jsonify({
            'stockInfo': {
                'price': stock.last_price,
                'volume': stock.last_volume,
                'change': stock.last_price - stock.previous_close,
            },
            'prices': prices
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Erro ao buscar dados para {symbol}: {str(e)}'
        }), 500

@app.route('/api/trading', methods=['POST'])
def control_trading():
    global TRADING_ACTIVE, SYMBOL
    
    try:
        data = request.get_json()
        
        if not data or 'active' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Campo "active" é obrigatório'
            }), 400

        if 'symbol' in data and data['symbol'] not in VALID_SYMBOLS:
            return jsonify({
                'status': 'error',
                'message': 'Símbolo inválido'
            }), 400

        TRADING_ACTIVE = data['active']
        SYMBOL = data.get('symbol', SYMBOL)

        return jsonify({
            'status': 'success',
            'symbol': SYMBOL,
            'active': TRADING_ACTIVE
        })

    except Exception as e:
        print(f"Erro na requisição: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Erro interno do servidor'
        }), 500

def auto_trade_loop():
    while True:
        if TRADING_ACTIVE:
            prices = get_historical_prices()
            if len(prices) >= 50:
                decision = trading_strategy(prices)
                print(f"\n--- Decisão para {SYMBOL} ---")
                print(f"MA20: {sum(prices[:20])/20:.2f}")
                print(f"MA50: {sum(prices[:50])/50:.2f}")
                print(f"RSI: {calculate_rsi(prices[:15]):.2f}")
                print(f"Ação: {decision}")
        time.sleep(60)

if __name__ == '__main__':
    threading.Thread(target=auto_trade_loop, daemon=True).start()
    app.run(port=5000)