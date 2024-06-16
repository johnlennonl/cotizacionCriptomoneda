// loader
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('main-content').classList.add('hidden-content');

    // quitar loader y mostrar contenido 
    setTimeout(function(){
        document.getElementById('loader-wrapper').style.display = 'none';
        document.getElementById('main-content').classList.remove('hidden-content');
    },1000);
});