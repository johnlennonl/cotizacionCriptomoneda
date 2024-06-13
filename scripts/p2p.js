// Obtener precios de criptomonedas desde CoinGecko y llenar el select de criptomonedas
fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false")
  .then(response => response.json())
  .then(data => {
    const cryptoSelect = document.getElementById('crypto-select');
    data.forEach(crypto => {
      const option = document.createElement('option');
      option.value = crypto.id;
      option.text = `${crypto.name} (${crypto.symbol.toUpperCase()})`;
      option.setAttribute('data-price', crypto.current_price);
      cryptoSelect.appendChild(option);
    });

    // Cargar solicitudes pendientes del almacenamiento local
    loadPendingRequests();
  })
  .catch(error => console.error("Error al obtener los datos de CoinGecko:", error));

// Manejar el evento de cálculo de solicitud
document.getElementById('calculate-btn').addEventListener('click', function() {
  const cryptoSelect = document.getElementById('crypto-select');
  const amountInput = document.getElementById('amount');
  const calculationResult = document.getElementById('calculation-result');

  const selectedOption = cryptoSelect.options[cryptoSelect.selectedIndex];
  const cryptoPrice = parseFloat(selectedOption.getAttribute('data-price'));
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    calculationResult.innerHTML = `<div class="alert alert-danger">Por favor, ingrese un monto válido.</div>`;
    return;
  }

  const totalAmount = amount / cryptoPrice;
  const fee = totalAmount * 0.07; // Tarifa del 7%
  const totalWithFee = totalAmount + fee;

  calculationResult.innerHTML = `
    <div class="alert alert-info">
      <p>Monto en USD: $${amount.toFixed(2)}</p>
      <p>Precio por unidad: $${cryptoPrice.toFixed(2)}</p>
      <p>Total sin tarifa: ${totalAmount.toFixed(6)} ${selectedOption.text}</p>
      <p>Tarifa (7%): ${fee.toFixed(6)} ${selectedOption.text}</p>
      <p><strong>Total con tarifa: ${totalWithFee.toFixed(6)} ${selectedOption.text}</strong></p>
    </div>
  `;
});

// Manejar el evento de envío del formulario de compra
document.getElementById('buy-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const cryptoSelect = document.getElementById('crypto-select');
  const amountInput = document.getElementById('amount');
  const selectedOption = cryptoSelect.options[cryptoSelect.selectedIndex];
  const cryptoPrice = parseFloat(selectedOption.getAttribute('data-price'));
  const amount = parseFloat(amountInput.value);

  const totalAmount = amount / cryptoPrice;
  const fee = totalAmount * 0.07; // Tarifa del 7%
  const totalWithFee = totalAmount + fee;

  const request = {
    crypto: selectedOption.text,
    amountUSD: amount.toFixed(2),
    totalWithFee: totalWithFee.toFixed(6)
  };

  savePendingRequest(request);
  addPendingRequestToDOM(request);

  // Limpiar el formulario y el resultado del cálculo
  document.getElementById('buy-form').reset();
  document.getElementById('calculation-result').innerHTML = '';
});

// Función para guardar una solicitud pendiente en el almacenamiento local
function savePendingRequest(request) {
  let requests = JSON.parse(localStorage.getItem('pendingRequests')) || [];
  requests.push(request);
  localStorage.setItem('pendingRequests', JSON.stringify(requests));
}

// Función para cargar solicitudes pendientes del almacenamiento local
function loadPendingRequests() {
  let requests = JSON.parse(localStorage.getItem('pendingRequests')) || [];
  requests.forEach(request => addPendingRequestToDOM(request));
}

// Función para añadir una solicitud pendiente al DOM
function addPendingRequestToDOM(request) {
  const pendingRequests = document.getElementById('pending-requests');
  const requestCard = document.createElement('div');
  requestCard.className = 'card mt-2';
  requestCard.innerHTML = `
    <div class="card-body">
      <h6 class="card-title">${request.crypto}</h6>
      <p class="card-text">Monto en USD: $${request.amountUSD}</p>
      <p class="card-text">Total con tarifa: ${request.totalWithFee}</p>
      <p class="card-text"><span class="badge bg-warning">Solicitud Pendiente</span></p>
    </div>
  `;
  pendingRequests.appendChild(requestCard);
}
