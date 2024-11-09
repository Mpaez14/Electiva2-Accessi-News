document.addEventListener("DOMContentLoaded", e => {

    verificarSeccion();
    
    window.addEventListener('hashchange', function () {
        manejarContenido(location.hash);
    });
    
});

function verificarSeccion(){
    // Obtenengo el fragmento de la URL después del #
    const seccion = location.hash;

    // Verificar si existe el fragmento de la URL
    if (seccion) {
        manejarContenido(seccion);
    }else{
        manejarContenido('#');
    }
};

function mostrarLoader(segundos) {
    // Mostrar el loader
    const loader = document.getElementById('loader');
    const cardsContainer = document.getElementById('cards-container');

    loader.classList.remove('d-none');

    // Ocultar el loader y mostrar las cards después del tiempo especificado
    setTimeout(() => {
        loader.classList.add('d-none');
      cardsContainer.classList.remove('d-none');
    }, segundos * 1000);
}

function manejarContenido(seccion){

    const tabNacionales = document.getElementById("tab-nacionales");
    const tabInternacionales = document.getElementById("tab-internacionales");
    const tabOtros = document.getElementById("tab-otros");

    const cardsContainer = document.getElementById('cards-container');

    switch (seccion) {

        case '#nacionales':
            tabNacionales.classList.add("isactive");
            tabInternacionales.classList.remove("isactive");
            tabOtros.classList.remove("isactive");

            cardsContainer.classList.add('d-none');
            mostrarLoader(2);
            break;

        case '#internacionales':
                
            tabNacionales.classList.remove("isactive");
            tabInternacionales.classList.add("isactive");
            tabOtros.classList.remove("isactive");

            cardsContainer.classList.add('d-none');
            mostrarLoader(2);
            break;

        case '#otros':
            tabNacionales.classList.remove("isactive");
            tabInternacionales.classList.remove("isactive");
            tabOtros.classList.add("isactive");

            cardsContainer.classList.add('d-none');
            mostrarLoader(2);
            break;

        default:

            location.hash = "#nacionales";

            break;
    }
}