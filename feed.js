const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = 'es-ES';
recognition.interimResult = false;

const API_Nacionales = "";
const API_Internacionales = "";
const API_Deportes = "./noticias-deportes.json";
const API_Tecnologia = "./noticias-tecnologia.json";
const API_Economia = "./noticias-economia.json";

let voces = [];
let paginaActual = 1;
let noticiasPorPagina = 6;

let flagCargandoNoticias = false; // Variable para evitar llamadas múltiples

function getSitePosts(POSTS){

    const loader = document.getElementById('loader');
    loader.classList.remove("d-none");

    const $posts = document.getElementById("cards-container");

    if (flagCargandoNoticias) return; // Evita que se ejecute si ya está cargando

    flagCargandoNoticias = true; // Marca que estamos cargando publicaciones

    fetch(`${POSTS}&page=${paginaActual}&per_page=${noticiasPorPagina}`)
    .then(res => res.ok ?res.json() :Promise.reject())
    .then(json => {
        console.log(json);

        json.forEach( (el) => {

            const cardNoticia = document.createElement('div');
            cardNoticia.className = 'col-md-4 my-5';

            cardNoticia.innerHTML = `
                <div class="card news-card">

                    <div class="card-header">

                        <span class="news-date pb-3">${new Date(el.date).toLocaleString()}</span>
                        <a href="${el.link}" class="post-link" target="_blank" tabindex="-1"><span class="news-title" title="${el.title.rendered}">${el.title.rendered}</span></a>

                    </div>

                    <div class="card-body" data-card${el.id}>

                        <img src="${el._embedded["wp:featuredmedia"] ?el._embedded["wp:featuredmedia"][0].source_url :""}" alt="${el.title.rendered}" class="img-fluid news-image">
                        <div class="news-description mt-2"><p class="p">${el.excerpt.rendered.replace("[&hellip;]", "...")}</p></div>

                    </div>
                </div>
            `;

            // Recibo el contenido en formato de string html desde la API
            const htmlString = el.content.rendered;

            // Creo un elemento temporal para parsear el HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlString;

            // Selecciono solo los elementos que sean textuales
            const elements = tempDiv.querySelectorAll('p, span');

            // Extraigo el texto de cada elemento y lo almaceno en un array
            const textoExtraido = Array.from(elements).map(element => element.textContent);

            const resumenBtn = document.createElement("button");
            resumenBtn.className = "btn btn-dark btn-resumen";
            resumenBtn.setAttribute("data-bs-toggle", "modal");
            resumenBtn.setAttribute("data-bs-target", "#modalContenidoNoticia");
            resumenBtn.textContent = "Resumen";

            resumenBtn.addEventListener("click", function (){
                document.querySelector(".modal-new-title").innerHTML = el.title.rendered; 
                document.querySelector(".modal-new-date").innerHTML = new Date(el.date).toLocaleString(); 
                document.querySelector(".modal-new-content").innerHTML = textoExtraido;
                document.querySelector(".modal-new-link").href = el.link;
            });

            $posts.appendChild(cardNoticia);

            document.querySelector(`[data-card${el.id}]`).appendChild(resumenBtn);

        });

        paginaActual++;
        loader.classList.add("d-none");
    })
    .catch(err => {
        let message = err.statusText || "Ocurrió un error";
        $posts.innerHTML = `Error ${err.status}: ${message}`;
        loader.classList.add("d-none");
    })
    .finally( function() {
        flagCargandoNoticias = false; // Restablece la variable cuando finaliza la carga
    });
};

async function obtenerNoticiasSimuladas(link){
    try {
        const response = await fetch(link); // Ruta al archivo JSON
        const data = await response.json();

        /* console.log(data); */
    
        // Simular paginación seleccionando las publicaciones que correspondan
        const startIndex = (paginaActual - 1) * noticiasPorPagina;
        const endIndex = startIndex + noticiasPorPagina;
        const pageData = data.slice(startIndex, endIndex);

        const $posts = document.getElementById("cards-container");
    
        // Si hay datos, agrégalos al contenedor
        if (pageData.length > 0) {

            pageData.forEach(post => {
                
                const cardNoticia = document.createElement('div');
                cardNoticia.className = 'col-lg-4 col-md-6 col-sm-12 my-5';
                /* cardNoticia.className = 'col-md-4 my-5'; */

                cardNoticia.innerHTML = `
                    <div class="card news-card">

                        <div class="card-header">

                            <span class="news-date pb-3">${post.fecha}</span>
                            <a href="${post.link_fuente}" class="post-link" target="_blank" tabindex="-1"><span class="news-title" title="${post.titulo}">${post.titulo}</span></a>

                        </div>

                        <div class="card-body" data-card${post.id}>

                            <img src="${post.link_imagen_portada}" alt="${post.titulo}" class="img-fluid news-image">
                            <div class="news-description mt-2">${post.descripcion}</div>

                        </div>
                    </div>
                `;

                const resumenBtn = document.createElement("button");
                resumenBtn.className = "btn btn-dark btn-resumen";
                resumenBtn.setAttribute("data-bs-toggle", "modal");
                resumenBtn.setAttribute("data-bs-target", "#modalContenidoNoticia");
                resumenBtn.textContent = "Resumen";

                resumenBtn.addEventListener("click", function (){
                    document.querySelector(".modal-new-title").innerHTML = post.titulo; 
                    document.querySelector(".modal-new-date").innerHTML = post.fecha; 
                    document.querySelector(".modal-new-content").innerHTML = post.texto_completo;
                    document.querySelector(".modal-new-link").href = post.link_fuente;
                });

                $posts.appendChild(cardNoticia);

                document.querySelector(`[data-card${post.id}]`).appendChild(resumenBtn);
            });

            paginaActual++;

        } else {
          console.log("No hay más publicaciones para cargar.");
        }

    } catch (error) {
        console.error("Error al cargar publicaciones:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const $speechSelect = document.getElementById("speech-select"),
    speechMessage = new SpeechSynthesisUtterance();

    /* console.log(window.speechSynthesis.getVoices()); */

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

    window.addEventListener("scroll", function() {

        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

        if( (scrollTop + clientHeight) == scrollHeight){
            
            switch (location.hash) {
                case "#nacionales":
                    /* getSitePosts(API_Nacionales); */
                    obtenerNoticiasSimuladas(API_Tecnologia);
                    break;
                case "#internacionales":
                    /* getSitePosts(API_Internacionales); */
                    obtenerNoticiasSimuladas(API_Economia);
                    break;
                case "#deportes":
                    obtenerNoticiasSimuladas(API_Deportes);
                    break;
                case "#tecnologia":
                    obtenerNoticiasSimuladas(API_Tecnologia);
                    break;
                case "#economia":
                    obtenerNoticiasSimuladas(API_Economia);
                    break;
            
                default:
                    break;
            }
        }
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
    const tabDeportes = document.getElementById("tab-deportes");
    const tabTecnologia = document.getElementById("tab-tecnologia");
    const tabEconomia = document.getElementById("tab-economia");

    const $posts = document.getElementById("cards-container");

    switch (seccion) {

        case '#nacionales':

            paginaActual = 1;

            tabNacionales.classList.add("isactive");
            tabInternacionales.classList.remove("isactive");
            tabDeportes.classList.remove("isactive");
            tabTecnologia.classList.remove("isactive");
            tabEconomia.classList.remove("isactive");

            $posts.innerHTML = ``;

            /* getSitePosts(API_Nacionales); */
            obtenerNoticiasSimuladas(API_Economia);

        break;

        case '#internacionales':

            paginaActual = 1;
                
            tabNacionales.classList.remove("isactive");
            tabInternacionales.classList.add("isactive");
            tabDeportes.classList.remove("isactive");
            tabTecnologia.classList.remove("isactive");
            tabEconomia.classList.remove("isactive");

            $posts.innerHTML = ``;

            /* getSitePosts(API_Internacionales); */
            obtenerNoticiasSimuladas(API_Tecnologia);

        break;

        case '#deportes':

            paginaActual = 1;

            tabNacionales.classList.remove("isactive");
            tabInternacionales.classList.remove("isactive");
            tabDeportes.classList.add("isactive");
            tabTecnologia.classList.remove("isactive");
            tabEconomia.classList.remove("isactive");

            $posts.innerHTML = ``;

            obtenerNoticiasSimuladas(API_Deportes);

        break;

        case '#tecnologia':

            paginaActual = 1;

            tabNacionales.classList.remove("isactive");
            tabInternacionales.classList.remove("isactive");
            tabDeportes.classList.remove("isactive");
            tabTecnologia.classList.add("isactive");
            tabEconomia.classList.remove("isactive");

            $posts.innerHTML = ``;
    
            obtenerNoticiasSimuladas(API_Tecnologia);

        break;

        case '#economia':

            paginaActual = 1;

            tabNacionales.classList.remove("isactive");
            tabInternacionales.classList.remove("isactive");
            tabDeportes.classList.remove("isactive");
            tabTecnologia.classList.remove("isactive");
            tabEconomia.classList.add("isactive");

            $posts.innerHTML = ``;
        
            obtenerNoticiasSimuladas(API_Economia);

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