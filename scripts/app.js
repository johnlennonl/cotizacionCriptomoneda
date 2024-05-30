// Obtener los precios de Binance
fetch('https://api.binance.com/api/v3/ticker/price')
  .then(response => response.json())
  .then(binanceData => {
    // Convertir los datos de Binance a un mapa para acceso rápido
    const binanceMap = {};
    binanceData.forEach(crypto => {
      binanceMap[crypto.symbol] = {
        price: parseFloat(crypto.price).toFixed(3),
        hourChange: null,
        dayChange: null
      };
    });

    // Obtener los cambios de precio de Binance para el último día
    fetch('https://api.binance.com/api/v3/ticker/24hr')
      .then(response => response.json())
      .then(binanceChangeData => {
        // Variables para calcular el cambio promedio en las últimas 24 horas
        let totalChangePercent = 0;
        let totalCryptos = 0;

        // Actualizar el mapa de Binance con los cambios de precio para la última hora y el último día
        binanceChangeData.forEach(crypto => {
          if (binanceMap[crypto.symbol]) {
            binanceMap[crypto.symbol].hourChange = parseFloat(crypto.priceChangePercent);
            binanceMap[crypto.symbol].dayChange = parseFloat(crypto.priceChangePercent); // Utilizando el mismo valor para ambos

            // Sumar el cambio porcentual al total
            totalChangePercent += binanceMap[crypto.symbol].dayChange;
            totalCryptos++;
          }
        });

        // Calcular el cambio promedio en las últimas 24 horas
        const averageChangePercent = totalChangePercent / totalCryptos;

        // Actualizar el encabezado con el cambio porcentual promedio
        const marketChangeHeader = document.getElementById('market-change');
        marketChangeHeader.innerHTML = `En las últimas 24 h, el mercado ${averageChangePercent >= 0 ? 'subió' : 'bajó'} un <span style="color: ${averageChangePercent >= 0 ? 'green' : 'red'};">${averageChangePercent.toFixed(2)}%</span>`;

        // Obtener la lista de criptomonedas más conocidas de CoinGecko
        return fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
          .then(response => response.json())
          .then(geckoData => {
            // Obtener la tabla HTML
            const tableBody = document.querySelector('#crypto-table tbody');

            // Limpiar la tabla antes de llenarla
            tableBody.innerHTML = '';

            // Filtrar y llenar la tabla con los datos de las criptomonedas que tienen precio en Binance
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

                // Crear el elemento de la imagen del icono
                const img = document.createElement('img');
                img.src = crypto.image;
                img.width = 20;
                img.height = 20;

                // Crear el elemento de texto para el símbolo
                const symbolText = document.createTextNode(crypto.symbol.toUpperCase());
                const nameText = document.createTextNode(` (${crypto.name})`);

                // Agregar la imagen y el texto al primer célula
                cell1.appendChild(img);
                cell1.appendChild(symbolText);
                cell1.appendChild(nameText);
                cell1.style.marginRight = '5px'; // Agregar un poco de margen entre la imagen y el texto

                cell2.textContent = `$${binancePriceData.price}`; // Precio de Binance
                cell3.textContent = `$${crypto.market_cap.toLocaleString()}`; // Capitalización de mercado

                // Movimiento en porcentaje de la última hora
                const hourChange = binancePriceData.hourChange;
                cell4.textContent = `${hourChange}%`;
                cell4.style.color = hourChange >= 0 ? 'green' : 'red';

                // Movimiento en porcentaje del último día
                const dayChange = binancePriceData.dayChange;
                cell5.textContent = `${dayChange}%`;
                cell5.style.color = dayChange >= 0 ? 'green' : 'red';

                // Añadir atributos para facilitar la búsqueda
                row.setAttribute('data-symbol', crypto.symbol.toUpperCase());
                row.setAttribute('data-name', crypto.name.toUpperCase());
              }
            });
          });
      });
  })
  .catch(error => console.error('Error al obtener los datos de la API de Binance o CoinGecko:', error));

// Funcionalidad de búsqueda
document.getElementById('search').addEventListener('input', function() {
  const searchValue = this.value.toUpperCase();
  const table = document.getElementById('crypto-table');
  const rows = table.getElementsByTagName('tr');

  for (let i = 1; i < rows.length; i++) { // Comienza en 1 para omitir el encabezado
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