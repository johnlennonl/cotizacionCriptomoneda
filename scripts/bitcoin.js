async function fetchBitcoinData() {
    try {
        // Obtener el precio actual de Bitcoin desde la API de Binance
        const priceResponse = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
        const priceData = await priceResponse.json();
        
        //  información relevante sobre Bitcoin
        const info = {
            nombre: "Bitcoin",
            simbolo: "BTC",
            descripcion: "Bitcoin es una criptomoneda descentralizada creada en 2009 por una persona o grupo de personas bajo el seudónimo de Satoshi Nakamoto."
             + "Se considera la primera criptomoneda descentralizada, que permite la transferencia de valor entre personas",
            creacion: "3 de enero de 2009",
            maximaCantidad: "21 millones de BTC",
            algoritmo: "SHA-256",
            tiempoBloque: "10 minutos",
            precioActual: priceData.price,
            sitioWeb: "https://bitcoin.org/"
        };

        // Mostrar el contenido del DOM con la informacion obtenida
        const bitcoinInfoDiv = document.getElementById('bitcoin-info');
        bitcoinInfoDiv.innerHTML = `
            <p><strong>Nombre:</strong> ${info.nombre}</p>
            <p><strong>Simbolo:</strong> ${info.simbolo}</p>
            <p><strong>Descripción:</strong> ${info.descripcion}</p>
            <p><strong>Fecha de Creación:</strong> ${info.creacion}</p>
            <p><strong>Máxima Cantidad:</strong> ${info.maximaCantidad}</p>
            <p><strong>Algoritmo:</strong> ${info.algoritmo}</p>
            <p><strong>Tiempo de Bloque:</strong> ${info.tiempoBloque}</p>
            <p><strong>Precio Actual:</strong> $${parseFloat(info.precioActual).toFixed(2)} USD</p>
            <p><strong>Sitio Web:</strong> <a href="${info.sitioWeb}" target="_blank">${info.sitioWeb}</a></p>
        `;
    } catch (error) {
        console.error("Error al obtener los datos de Bitcoin:", error);
        document.getElementById('bitcoin-info').innerHTML = '<p>Error al cargar la información sobre Bitcoin.</p>';
    }
}

// Ejecutar la función para obtener y mostrar la información de Bitcoin
fetchBitcoinData();