// Obtener los precios de Binance// Obtener los precios de Binance
fetch('https://api.binance.com/api/v3/ticker/price')
.then(response => response.json())
.then(binanceData => {
  const binanceMap = {};
  binanceData.forEach(crypto => {
    binanceMap[crypto.symbol] = {
      price: parseFloat(crypto.price).toFixed(3),
      hourChange: null,
      dayChange: null
    };
  });

  fetch('https://api.binance.com/api/v3/ticker/24hr')
    .then(response => response.json())
    .then(binanceChangeData => {
      let totalChangePercent = 0;
      let totalCryptos = 0;

      binanceChangeData.forEach(crypto => {
        if (binanceMap[crypto.symbol]) {
          binanceMap[crypto.symbol].hourChange = parseFloat(crypto.priceChangePercent);
          binanceMap[crypto.symbol].dayChange = parseFloat(crypto.priceChangePercent);

          totalChangePercent += binanceMap[crypto.symbol].dayChange;
          totalCryptos++;
        }
      });

      const averageChangePercent = totalChangePercent / totalCryptos;
      const marketChangeHeader = document.getElementById('market-change');
      marketChangeHeader.innerHTML = `En las últimas 24 h, el mercado ${averageChangePercent >= 0 ? 'subió' : 'bajó'} un <span style="color: ${averageChangePercent >= 0 ? 'green' : 'red'};">${averageChangePercent.toFixed(2)}%</span>`;

      return fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
        .then(response => response.json())
        .then(geckoData => {
          const tableBody = document.querySelector('#crypto-table tbody');
          tableBody.innerHTML = '';

          geckoData.forEach(crypto => {
            const binanceSymbol = crypto.symbol.toUpperCase() + 'USDT';
            const binancePriceData = binanceMap[binanceSymbol];

            if (binancePriceData) {
              const row = tableBody.insertRow();
              const cell1 = row.insertCell(0);
              const cell2 = row.insertCell(1);
              const cell3 = row.insertCell(2);
              const cell4 = row.insertCell(3);
              const cell5 = row.insertCell(4);

              const img = document.createElement('img');
              img.src = crypto.image;
              img.width = 15;
              img.height = 15;

              const symbolText = document.createTextNode(crypto.symbol.toUpperCase());
              const nameText = document.createTextNode(` (${crypto.name})`);

              cell1.appendChild(img);
              cell1.appendChild(symbolText);
              cell1.appendChild(nameText);
              cell1.style.marginRight = '5px';

              cell2.textContent = `$${binancePriceData.price}`;
              cell3.textContent = `$${crypto.market_cap.toLocaleString()}`;
              cell3.classList.add('desktop-only');
              cell4.textContent = `${binancePriceData.hourChange}%`;
              cell4.style.color = binancePriceData.hourChange >= 0 ? 'green' : 'red';
              cell5.textContent = `${binancePriceData.dayChange}%`;
              cell5.style.color = binancePriceData.dayChange >= 0 ? 'green' : 'red';

              row.setAttribute('data-symbol', crypto.symbol.toUpperCase());
              row.setAttribute('data-name', crypto.name.toUpperCase());
            }
          });
        });
    });
})
.catch(error => console.error('Error al obtener los datos de la API de Binance o CoinGecko:', error));

document.getElementById('search').addEventListener('input', function () {
const searchValue = this.value.toUpperCase();
const table = document.getElementById('crypto-table');
const rows = table.getElementsByTagName('tr');

for (let i = 1; i < rows.length; i++) {
  const symbol = rows[i].getAttribute('data-symbol');
  const name = rows[i].getAttribute('data-name');
  if (symbol.indexOf(searchValue) > -1 || name.indexOf(searchValue) > -1) {
    rows[i].style.display = '';
    rows[i].classList.add('highlight');
  } else {
    rows[i].style.display = 'none';
    rows[i].classList.remove('highlight');
  }
}
});

// Alternar vistas
document.getElementById('full-view').addEventListener('click', function () {
const columns = document.querySelectorAll('.desktop-only');
columns.forEach(column => {
  column.classList.remove('hidden-column');
});
});

document.getElementById('mobile-view').addEventListener('click', function () {
const columns = document.querySelectorAll('.desktop-only');
columns.forEach(column => {
  column.classList.add('hidden-column');
});
});
