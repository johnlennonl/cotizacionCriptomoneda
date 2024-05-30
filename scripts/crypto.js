const cryptocurrencies = [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "LTC", name: "Litecoin" },
    { symbol: "BNB", name: "BNB" },
    { symbol: "SOL", name: "Solana" },
    { symbol: "DOGE", name: "Dogecoin" },
    { symbol: "SHIB", name: "SHIBA INU" },
    { symbol: "XRP", name: "XRP" },
    { symbol: "ADA", name: "Cardano" },
    { symbol: "XLM", name: "Stellar" },
    { symbol: "AVAX", name: "Avalanche" },
    { symbol: "ATOM", name: "Cosmos" }
  ];
  
  // Obtener elementos del DOM
  const seleccionarCriptomoneda = document.getElementById("seleccionarCriptomoneda");
  const montoCriptomoneda = document.getElementById("montoCriptomoneda");
  const botonCalcular = document.getElementById("botonCalcular");
  const mostrarValor = document.getElementById("mostrarValor");
  
  // Llenar opciones de selección de criptomonedas
  cryptocurrencies.forEach((crypto) => {
    const option = document.createElement("option");
    option.value = crypto.symbol;
    option.text = crypto.name;
    seleccionarCriptomoneda.appendChild(option);
  });
  
  // Función para calcular el valor de una criptomoneda en USD
  const calcularValorCriptomoneda = (symbol, amount) => {
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`;
    
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        const precioUSD = parseFloat(data.price);
        const valorUSD = amount * precioUSD;
        mostrarValor.innerHTML = `<p class="mostrar_resultado">El valor de ${amount} ${symbol} es de $${valorUSD.toFixed(2)} USD.</p>`;
      })
      .catch((error) => {
        mostrarValor.innerHTML = "Ha ocurrido un error al obtener los datos.";
        console.error("Error:", error);
      });
  };
  
  // Agregar evento al botón de calcular
  botonCalcular.addEventListener("click", () => {
    const symbol = seleccionarCriptomoneda.value;
    const amount = parseFloat(montoCriptomoneda.value);
  
    if (isNaN(amount) || amount <= 0) {
      mostrarValor.innerHTML = "Por favor, ingrese un monto válido.";
      return;
    }
  
    calcularValorCriptomoneda(symbol, amount);
  });