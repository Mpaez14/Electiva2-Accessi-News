const recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.lang = 'es-ES';
recognition.interimResult = false;

let voces = [];

document.addEventListener("DOMContentLoaded", () => {

    const $speechSelect = document.getElementById("speech-select"),
    speechMessage = new SpeechSynthesisUtterance();

    console.log(window.speechSynthesis.getVoices());

    $speechSelect.addEventListener("change", function() {
    
        speechMessage.voice = voces.find( (voice) => voice.name === $speechSelect.value);

    });

    window.speechSynthesis.addEventListener("voiceschanged", function() {

        voces = window.speechSynthesis.getVoices();
        let vocesEnEspanol = voces.filter(voz => voz.lang.startsWith("es"));

        vocesEnEspanol.forEach( (voz) => {
            const $option = document.createElement("option");
            $option.value = voz.name;
            $option.textContent = `${voz.name} - ${voz.lang}`;
            $speechSelect.appendChild($option);
        });

    });

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
document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            // Encuentra el botón "Resumen" dentro de esta tarjeta y actívalo
            const resumenButton = card.querySelector('.btn-resumen');
            if (resumenButton) {
                resumenButton.click();
            }
        }
    });
});
