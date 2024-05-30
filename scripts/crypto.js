// Array de criptomonedas con sus símbolos y nombres
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

// Obtener elementos del DOM (Document Object Model)
const seleccionarCriptomoneda = document.getElementById("seleccionarCriptomoneda");
const montoCriptomoneda = document.getElementById("montoCriptomoneda");
const botonCalcular = document.getElementById("botonCalcular");
const mostrarValor = document.getElementById("mostrarValor");

// Llenar el elemento de selección con las opciones de criptomonedas
cryptocurrencies.forEach((crypto) => {
  // Crear un nuevo elemento <option> para cada criptomoneda
  const option = document.createElement("option");
  option.value = crypto.symbol; // Establecer el valor del <option> al símbolo de la criptomoneda
  option.text = crypto.name; // Establecer el texto del <option> al nombre de la criptomoneda
  seleccionarCriptomoneda.appendChild(option); // Añadir el <option> al elemento de selección
});

// Función para calcular el valor de una criptomoneda en USD
const calcularValorCriptomoneda = (symbol, amount) => {
  // Construir la URL de la API de Binance para obtener el precio de la criptomoneda
  const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`;

  // Realizar una solicitud fetch a la API de Binance
  fetch(url)
    .then((resp) => resp.json()) // Parsear la respuesta JSON
    .then((data) => {
      const precioUSD = parseFloat(data.price); // Obtener el precio en USD y convertirlo a número
      const valorUSD = amount * precioUSD; // Calcular el valor total en USD
      // Mostrar el resultado en el DOM
      mostrarValor.innerHTML = `<p class="mostrar_resultado">El valor de ${amount} ${symbol} es de $${valorUSD.toFixed(2)} USD.</p>`;
    })
    .catch((error) => {
      // Manejar errores de la solicitud
      mostrarValor.innerHTML = "Ha ocurrido un error al obtener los datos.";
      console.error("Error:", error); // Imprimir el error en la consola para depuración
    });
};

// Agregar un evento al botón de calcular
botonCalcular.addEventListener("click", () => {
  const symbol = seleccionarCriptomoneda.value; // Obtener el símbolo de la criptomoneda seleccionada
  const amount = parseFloat(montoCriptomoneda.value); // Obtener y convertir el monto ingresado a número

  // Validar que el monto ingresado sea un número positivo
  if (isNaN(amount) || amount <= 0) {
    mostrarValor.innerHTML = "Por favor, ingrese un monto válido."; // Mostrar mensaje de error en el DOM
    return; // Salir de la función si el monto no es válido
  }

  // Llamar a la función para calcular el valor de la criptomoneda
  calcularValorCriptomoneda(symbol, amount);
});