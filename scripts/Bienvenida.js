document.addEventListener("DOMContentLoaded", function () {
  // Verifica si el usuario ya ha aceptado los términos y condiciones
  if (!localStorage.getItem("terminosAceptados")) {
    // Muestra la ventana de bienvenida con términos y condiciones
    Swal.fire({
      text: "Por favor, acepta nuestros términos y condiciones para continuar.",
      image:"../img/CryptoLogotipo.png",
      imageWidth: 150,
      imageHeight: 150,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#7838d3",
      cancelButtonText: "Cancelar",
      customClass: "swalCustom",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario acepta, guarda la información en localStorage
        localStorage.setItem("terminosAceptados", "true");
        Swal.fire(
          "Aceptado",
          "Gracias por aceptar nuestros términos y condiciones.",
          "success"
        );
      } else {
        // Si el usuario no acepta, puedes redirigirlo o mostrar un mensaje
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


