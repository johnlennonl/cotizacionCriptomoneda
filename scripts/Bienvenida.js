document.addEventListener("DOMContentLoaded", function () {
  // Verifica si el usuario ya ha aceptado los terminos y condiciones
  if (!localStorage.getItem("terminosAceptados")) {
    // Muestra la ventana de bienvenida con terminos y condiciones
    Swal.fire({
      title:'Bienvenido a CoinPreeview',
      text: "Por favor, acepta nuestros términos y condiciones para continuar.",
      imageUrl: "img/cpreview.gif",
      imageWidth: 200,
      imageHeight: 180,
      imageAlt: "logo",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#7838d3",
      cancelButtonText: "Cancelar",
      customClass: "swalCustom",  
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario acepta, guardamos la información en localStorage.
        localStorage.setItem("terminosAceptados", "true");
        Swal.fire(
          "Aceptado",
          "Gracias por aceptar nuestros términos y condiciones.",
          "success"
        );
      } else {
        // Si el usuario no acepta, mostramos mensaje de rechazo y redirigimos a la página de inicio.
        Swal.fire(
          "Rechazado",
          "Debe aceptar los términos y condiciones para continuar.",
          "error"
        ).then(() => {
          window.location.href = "./index.html";
        });
      }
    });
  }
});


