// Show loader and hide content on page load
document.addEventListener("DOMContentLoaded", function() {
    // Add hidden-content class to main content
    document.getElementById('main-content').classList.add('hidden-content');

    // Remove loader and show content after 4 seconds
    setTimeout(function(){
        document.getElementById('loader-wrapper').style.display = 'none';
        document.getElementById('main-content').classList.remove('hidden-content');
    },1000);
});