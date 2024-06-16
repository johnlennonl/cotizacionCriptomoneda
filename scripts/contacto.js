//btn de contacto! 
document.getElementById('contactBtn').addEventListener('click', function() {
    Swal.fire({
        title: 'Contactanos',
        imageUrl: "../img/undraw_personal_email_re_4lx7.svg",
        imageWidth: 200,
        imageHeight: 180,
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
            '<input id="swal-input2" class="swal2-input" placeholder="Correo">' +
            '<input id="swal-input3" class="swal2-input" placeholder="Número de teléfono">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Aceptar",
      confirmButtonColor: "#7838d3",
      cancelButtonText: "Cancelar",
        
        preConfirm: () => {
            const nombre = document.getElementById('swal-input1').value;
            const correo = document.getElementById('swal-input2').value;
            const telefono = document.getElementById('swal-input3').value;
            
            if (!nombre || !correo || !telefono) {
                Swal.showValidationMessage('Por favor, completa todos los campos');
                return false;
            }
            
            return { nombre: nombre, correo: correo, telefono: telefono };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            console.log(result.value); // datos ingresados
            Swal.fire({
                title: 'Datos enviados',
                text: ` Gracias por contactarnos ${result.value.nombre}, en un lapso de 30 minutos recibiras un mensaje de nuestro soporte a tu correo electronico:
                ${result.value.correo} o mediante Whatsapp al numero ingresado: ${result.value.telefono} le agradecemos su paciencia✅`,
                icon: 'success'
            });
        }
    });
});
