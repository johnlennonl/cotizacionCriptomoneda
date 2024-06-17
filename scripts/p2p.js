// Obtener precios de criptomonedas desde CoinGecko y llenar el select de criptomonedas
fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false")
    .then(response => response.json())
    .then(data => {
        const seleccionCripto = document.getElementById('seleccion-cripto');
        data.forEach(cripto => {
            const opcion = document.createElement('option');
            opcion.value = cripto.id;
            opcion.text = `${cripto.name} (${cripto.symbol.toUpperCase()})`;
            opcion.setAttribute('data-price', cripto.current_price);
            seleccionCripto.appendChild(opcion);
        });

        // Carga de las solicitudes pendientes del almacenamiento local
        cargarSolicitudesPendientes();
    })
    .catch(error => console.error("Error al obtener los datos de CoinGecko:", error));

// Manejar el evento de cálculo de solicitud
document.getElementById('calcular-btn').addEventListener('click', function() {
    const seleccionCripto = document.getElementById('seleccion-cripto');
    const montoInput = document.getElementById('monto');
    const resultadoCalculo = document.getElementById('resultado-calculo');

    const opcionSeleccionada = seleccionCripto.options[seleccionCripto.selectedIndex];
    const precioCripto = parseFloat(opcionSeleccionada.getAttribute('data-price'));
    const monto = parseFloat(montoInput.value.replace(/,/g, ''));

    if (isNaN(monto) || monto <= 0) {
        resultadoCalculo.innerHTML = `<div class="alert alert-danger">Por favor, ingrese un monto válido.</div>`;
        return;
    }

    const totalUSD = monto * precioCripto;
    const totalConTarifa = totalUSD * 1.05; // Añadimos el 5%

    resultadoCalculo.innerHTML = `
        <div class="alert alert-info">
            <p>Monto en Criptomoneda: ${monto.toLocaleString('es-VE')} ${opcionSeleccionada.text}</p>
            <p>Total en USD sin tarifa: $${totalUSD.toFixed(2)}</p>
            <p><strong>Total en USD con tarifa del 5%: $${totalConTarifa.toFixed(2)}</strong></p>
        </div>
    `;
});

// evento de envío del formulario de compra
document.getElementById('formulario-compra').addEventListener('submit', function(event) {
    event.preventDefault();

    const seleccionCripto = document.getElementById('seleccion-cripto');
    const montoInput = document.getElementById('monto');
    const nombreInput = document.getElementById('nombre');
    const telefonoInput = document.getElementById('telefono');
    const walletInput = document.getElementById('wallet');

    const opcionSeleccionada = seleccionCripto.options[seleccionCripto.selectedIndex];
    const precioCripto = parseFloat(opcionSeleccionada.getAttribute('data-price'));
    const monto = parseFloat(montoInput.value.replace(/,/g, ''));
    const nombre = nombreInput.value;
    const telefono = telefonoInput.value;
    const wallet = walletInput.value;

    if (isNaN(monto) || monto <= 0 || nombre.trim() === '' || telefono.trim() === '' || wallet.trim() === '') {
        Swal.fire('Error', 'Por favor, complete todos los campos correctamente.', 'error');
        return;
    }

    const totalUSD = monto * precioCripto;
    const totalConTarifa = totalUSD * 1.05; // Añadimos el 5%

    const solicitud = {
        cripto: opcionSeleccionada.text,
        monto: monto.toLocaleString('es-VE'),
        totalUSD: totalUSD.toFixed(2),
        totalConTarifa: totalConTarifa.toFixed(2),
        nombre: nombre,
        telefono: telefono,
        wallet: wallet
    };

    guardarSolicitudPendiente(solicitud);
    agregarSolicitudPendienteDOM(solicitud);

    Swal.fire('Solicitud Creada', 'La solicitud ha sido creada con éxito.', 'success');

    // Limpiar el formulario y el resultado del cálculo
    document.getElementById('formulario-compra').reset();
    document.getElementById('resultado-calculo').innerHTML = '';

    // Actualizar el contador de solicitudes
    actualizarContadorSolicitudes();
});

// Función para guardar una solicitud pendiente en el almacenamiento local
function guardarSolicitudPendiente(solicitud) {
    let solicitudes = JSON.parse(localStorage.getItem('solicitudesPendientes')) || [];
    solicitudes.push(solicitud);
    localStorage.setItem('solicitudesPendientes', JSON.stringify(solicitudes));
}

// Función para cargar solicitudes pendientes del almacenamiento local
function cargarSolicitudesPendientes() {
    let solicitudes = JSON.parse(localStorage.getItem('solicitudesPendientes')) || [];
    const solicitudesPendientes = document.getElementById('solicitudes-pendientes');

    solicitudesPendientes.innerHTML = solicitudes.length > 0 ? '' : '<p class="text-center mt-3">Sin solicitudes actualmente</p>';
    solicitudes.forEach(solicitud => agregarSolicitudPendienteDOM(solicitud));

    // Actualizar el contador de solicitudes
    actualizarContadorSolicitudes();
}

// Función para añadir una solicitud pendiente al DOM
function agregarSolicitudPendienteDOM(solicitud) {
    const solicitudesPendientes = document.getElementById('solicitudes-pendientes');
    const solicitudCard = document.createElement('div');
    solicitudCard.className = 'card mt-2';
    solicitudCard.innerHTML = `
        <div class="card-body">
            <h6 class="card-title">Solicitud Creada</h6>
            <p class="card-text">Nombre: ${solicitud.nombre}</p>
            <p class="card-text">Teléfono: ${solicitud.telefono}</p>
            <p class="card-text">Wallet o BinancePay: ${solicitud.wallet}</p>
            <p class="card-text">Monto en Criptomoneda: ${solicitud.monto}</p>
            <p class="card-text">Total en USD: $${solicitud.totalUSD}</p>
            <p class="card-text"><strong>Total con tarifa: $${solicitud.totalConTarifa}</strong></p>
            <button class="btn btn-danger btn-sm" onclick="cancelarSolicitud(this)">Cancelar Solicitud</button>
            <button class="btn btn-success btn-sm btnSuccess" onclick="completarSolicitud(this)">Solicitud Pagada</button>
        </div>
    `;
    solicitudesPendientes.appendChild(solicitudCard);
}

// Función para cancelar una solicitud
function cancelarSolicitud(boton) {
    const solicitudCard = boton.parentElement.parentElement;
    solicitudCard.remove();
    actualizarAlmacenamientoLocal();
    Swal.fire('Cancelada', 'La solicitud ha sido cancelada.', 'error');
    mostrarMensajeSinSolicitudes();
}

// Función para completar una solicitud
function completarSolicitud(boton) {
    const solicitudCard = boton.parentElement.parentElement;
    solicitudCard.remove();
    actualizarAlmacenamientoLocal();

    Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    }).fire({
        icon: "success",
        title: "Orden Completada Exitosamente"
    });
}

// Función para actualizar el almacenamiento local después de cualquier cambio
function actualizarAlmacenamientoLocal() {
    const solicitudesPendientes = Array.from(document.getElementById('solicitudes-pendientes').children);
    let solicitudes = solicitudesPendientes.map(solicitud => {
        return {
            nombre: solicitud.querySelector('.card-text:nth-child(2)').innerText.replace('Nombre: ', ''),
            telefono: solicitud.querySelector('.card-text:nth-child(3)').innerText.replace('Teléfono: ', ''),
            wallet: solicitud.querySelector('.card-text:nth-child(4)').innerText.replace('Wallet o BinancePay: ', ''),
            monto: solicitud.querySelector('.card-text:nth-child(5)').innerText.replace('Monto en Criptomoneda: ', ''),
            totalUSD: solicitud.querySelector('.card-text:nth-child(6)').innerText.replace('Total en USD: $', ''),
            totalConTarifa: solicitud.querySelector('.card-text:nth-child(7)').innerText.replace('Total con tarifa: $', '')
        };
    });

    localStorage.setItem('solicitudesPendientes', JSON.stringify(solicitudes));
    mostrarMensajeSinSolicitudes();

    // Actualizar el contador de solicitudes
    actualizarContadorSolicitudes();
}

// Función para mostrar el mensaje de "Sin solicitudes actualmente" si no hay solicitudes pendientes dentro de la card de Solicitudes de Compra 
function mostrarMensajeSinSolicitudes() {
    const solicitudesPendientes = document.getElementById('solicitudes-pendientes');
    if (!solicitudesPendientes.hasChildNodes()) {
        solicitudesPendientes.innerHTML = '<p class="text-center mt-3">Sin solicitudes actualmente</p>';
    }
}


function actualizarContadorSolicitudes() {
    let solicitudes = JSON.parse(localStorage.getItem('solicitudesPendientes')) || [];
    const tarjetaContenedor = document.querySelector('.contenedorDeComprasPendientes'); // Seleccionar el contenedor de la tarjeta
    const contadorSolicitudes = document.getElementById('contador-solicitudes');
  
    contadorSolicitudes.innerText = `Tienes ${solicitudes.length} Solicitud de Compra pendiente..`;
    tarjetaContenedor.style.display = solicitudes.length > 0 ? 'block' : 'none'; // Mostrar o ocultar la tarjeta mientras haya solicitudes pendientes
  }