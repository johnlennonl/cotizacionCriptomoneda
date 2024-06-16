document.getElementById('registerBtn').addEventListener('click', function() {
    const correo = document.getElementById('emailInput').value;

    if (!correo) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingresa tu correo electrónico',
            icon: 'error'
        });
        return;
    }

    Swal.fire({
        title: 'Registro Exitoso',
        text: `Su correo ${correo} ha sido registrado exitosamente, recibiras informacion sobre nuestros serivicios.`,
        icon: 'success'
    }).then(() => {
        // Limpia el campo de entrada
        document.getElementById('emailInput').value = '';
        // Actualizar la pgina
        location.reload();
    });
});