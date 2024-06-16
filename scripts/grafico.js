document.addEventListener('DOMContentLoaded', async function() {
    const ctx = document.getElementById('crypto-chart').getContext('2d');
    const cryptoInfo = document.getElementById('crypto-info');
    const cryptoIcon = document.getElementById('crypto-icon');
    const cryptoSymbol = document.getElementById('crypto-symbol');
    const cryptoPrice = document.getElementById('crypto-price');
    const cryptoMarketCap = document.getElementById('crypto-market-cap');
    let chart;

    // Fetch Bitcoin de CoinGecko
    const coingeckoResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin');
    const coinGeckoInfo = await coingeckoResponse.json();

    // Fetch historial  de Bitcoin desde Binance
    const klinesResponse = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30`);
    const klinesData = await klinesResponse.json();

    const dates = klinesData.map(kline => new Date(kline[0]));
    const prices = klinesData.map(kline => parseFloat(kline[4])); 

    cryptoIcon.src = coinGeckoInfo.image.large;
    cryptoSymbol.textContent = `${coinGeckoInfo.name} (${coinGeckoInfo.symbol.toUpperCase()})`;
    cryptoPrice.textContent = coinGeckoInfo.market_data.current_price.usd.toFixed(2);
    cryptoMarketCap.textContent = coinGeckoInfo.market_data.market_cap.usd.toLocaleString();
    cryptoInfo.style.display = 'flex';

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'BTC Precio (USD)',
                data: prices,
                borderColor: '#7838d3 ',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
});