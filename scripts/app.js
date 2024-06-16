// Obtenemos los precios de las criptomonedas desde la Api de Binance
fetch("https://api.binance.com/api/v3/ticker/price")
  .then((response) => response.json()) // Parsear la respuesta JSON
  .then((binanceData) => {
    const binanceMap = {}; // Crear un objeto para mapear los datos de Binance
    binanceData.forEach((crypto) => {
      binanceMap[crypto.symbol] = {
        price: parseFloat(crypto.price).toFixed(3), // Guardar el precio con tres decimales
        hourChange: null,
        dayChange: null,
      };
    });

    // Obtenemos cambios porcentuales de las últimas 24 horas desde Binance
    fetch("https://api.binance.com/api/v3/ticker/24hr")
      .then((response) => response.json()) // Parsear la respuesta JSON
      .then((binanceChangeData) => {
        let totalChangePercent = 0; // Inicializar la suma de los cambios porcentuales
        let totalCryptos = 0; // Inicializar el contador de criptomonedas

        binanceChangeData.forEach((crypto) => {
          if (binanceMap[crypto.symbol]) {
            binanceMap[crypto.symbol].hourChange = parseFloat(
              crypto.priceChangePercent
            );
            binanceMap[crypto.symbol].dayChange = parseFloat(
              crypto.priceChangePercent
            );

            totalChangePercent += binanceMap[crypto.symbol].dayChange; // Acumular el cambio porcentual diario
            totalCryptos++; // Incrementar el contador de criptomonedas
          }
        });

        const averageChangePercent = totalChangePercent / totalCryptos; // Calcular el cambio porcentual promedio
        const marketChangeHeader = document.getElementById("market-change"); // Obtener el elemento del encabezado del cambio de mercado
        marketChangeHeader.innerHTML = `En las últimas 24 h, el mercado ${
          averageChangePercent >= 0 ? "subió" : "bajó"
        } un <span style="color: ${
          averageChangePercent >= 0 ? "#5ccb5f" : "red"
        };">${averageChangePercent.toFixed(2)}%</span>`;

        // Obtener datos de la Api CoinGecko para mas información sobre las criptomonedas
        return fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        )
          .then((response) => response.json()) // Parsear la respuesta JSON
          .then((geckoData) => {
            const tableBody = document.querySelector("#crypto-table tbody"); // Obtener el cuerpo de la tabla
            tableBody.innerHTML = ""; // Limpiar el contenido actual de la tabla

            const initialLimit = 20; // Límite inicial de criptomonedas a mostrar
            let isExpanded = false; // Estado de la expansión

            // Función para renderizar la tabla
            const renderTable = (limit) => {
              tableBody.innerHTML = ""; // Limpiar el contenido actual de la tabla

              geckoData.slice(0, limit).forEach((crypto) => {
                const binanceSymbol = crypto.symbol.toUpperCase() + "USDT"; // Construir el simbolo Binance
                const binancePriceData = binanceMap[binanceSymbol]; // Obtener los datos de precio de Binance

                if (binancePriceData) {
                  const row = tableBody.insertRow(); // Insertar una nueva fila en la tabla
                  const cell1 = row.insertCell(0); // Insertar celdas en la fila
                  const cell2 = row.insertCell(1);
                  const cell3 = row.insertCell(2);
                  const cell4 = row.insertCell(3);
                  const cell5 = row.insertCell(4);

                  // Crear y añadir imagen de la criptomoneda
                  const img = document.createElement("img");
                  img.src = crypto.image;
                  img.width = 15;
                  img.height = 15;

                  // Crear y añadir el texto del símbolo y nombre de la criptomoneda
                  const symbolText = document.createTextNode(
                    crypto.symbol.toUpperCase()
                  );
                  const nameText = document.createTextNode(` ${crypto.name}`);

                  cell1.appendChild(img); // Añadir la imagen a la celda
                  cell1.appendChild(symbolText); // Añadir el símbolo a la celda
                  cell1.appendChild(nameText); // Añadir el nombre a la celda/

                  // Añadir los datos de precio y cambios porcentuales a las celdas correspondientes
                  cell2.textContent = `$${binancePriceData.price}`;
                  cell3.textContent = `$${crypto.market_cap.toLocaleString()}`;
                  cell3.classList.add("desktop-only"); // Añadir clase CSS para ocultar en dispositivos móviles
                  cell4.textContent = `${binancePriceData.hourChange}%`;
                  cell4.style.color =
                    binancePriceData.hourChange >= 0 ? "#5ccb5f" : "red"; // Cambia el color según el valor
                  cell5.textContent = `${binancePriceData.dayChange}%`;
                  cell5.style.color =
                    binancePriceData.dayChange >= 0 ? "#5ccb5f" : "red"; // Cambia el color según el valor

                  // Añadir atributos de datos para búsqueda y filtrado
                  row.setAttribute("data-symbol", crypto.symbol.toUpperCase());
                  row.setAttribute("data-name", crypto.name.toUpperCase());
                }
              });
            };

            // Renderizar las primeras 20 criptomonedas
            renderTable(initialLimit);

            // Evento para el botón "Ver Más"
            const loadMoreButton = document.getElementById("load-more");
            loadMoreButton.addEventListener("click", () => {
              if (isExpanded) {
                renderTable(initialLimit);
                loadMoreButton.textContent = "Ver Más";
              } else {
                renderTable(geckoData.length);
                loadMoreButton.textContent = "Ver Menos";
              }
              isExpanded = !isExpanded;
            });
          });
      });
  })
  .catch((error) =>
    console.error(
      "Error al obtener los datos de la API de Binance o CoinGecko:",
      error
    )
  );

// Añadir evento de búsqueda
document.getElementById("search").addEventListener("input", function () {
  const searchValue = this.value.toUpperCase(); // Obtener el valor de búsqueda y convertirlo a mayúsculas
  const table = document.getElementById("crypto-table"); // Obtener la tabla de criptomonedas
  const rows = table.getElementsByTagName("tr"); // Obtener todas las filas de la tabla

  for (let i = 1; i < rows.length; i++) {
    const symbol = rows[i].getAttribute("data-symbol"); // Obtener el símbolo de la criptomoneda
    const name = rows[i].getAttribute("data-name"); // Obtener el nombre de la criptomoneda
    // Mostrar u ocultar filas según el valor de búsqueda
    if (symbol.indexOf(searchValue) > -1 || name.indexOf(searchValue) > -1) {
      rows[i].style.display = ""; // Mostrar la fila
      rows[i].classList.add("highlight"); // Añadir clase de resaltado
    } else {
      rows[i].style.display = "none"; // Ocultar la fila
      rows[i].classList.remove("highlight"); // Eliminar clase de resaltado
    }
  }
});
