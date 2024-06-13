const irArriba = document.getElementById("btnIrArriba");
window.addEventListener("scroll", checkHeight);

function checkHeight() {
    if (window.scrollY > 200) {
        irArriba.style.display = "flex"
    }    else {
        irArriba.style.display = "none"
    }
}

irArriba.addEventListener("click" ,() => {
    window.scrollTo(0,0)
})