const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = 'es-ES';
recognition.interimResult = false;

const API_Nacionales = "https://www.elciudadanoweb.com/wp-json/wp/v2/posts?_embed";
const API_Internacionales = "https://www.eldiario.com/wp-json/wp/v2/posts?_embed";
const API_Deportes = "./json/noticias-deportes.json";
const API_Tecnologia = "./json/noticias-tecnologia.json";
const API_Economia = "./json/noticias-economia.json";

let voces = [];
let paginaActual = 1;
let noticiasPorPagina = 6;


function narrarContenido(el) {
    detenerNarracion(); // Asegúrate de que no se superpongan narraciones.
    if (!document.getElementById("enableNarrator").checked) return; // Si el narrador está desactivado, no hacer nada.

    const narrador = new SpeechSynthesisUtterance();
    const vocesDisponibles = window.speechSynthesis.getVoices();
    const vozSeleccionada = vocesDisponibles.find((voz) => voz.name === document.getElementById("speech-select").value);

    if (vozSeleccionada) narrador.voice = vozSeleccionada;


    narrador.text = `
        Título: ${el.titulo}. 
        Fecha: ${el.fecha}. 
        Descripción: ${el.descripcion}.
        Botón, ver resumen de : ${el.titulo}.
    `;
    narrador.rate = parseFloat(document.getElementById("voiceSpeed").value) || 1;
    narrador.volume = parseFloat(document.getElementById("voiceVolume").value) || 1;

    window.speechSynthesis.speak(narrador);
}

function narrarContenido2(el) {
    detenerNarracion(); // Asegúrate de que no se superpongan narraciones.
    if (!document.getElementById("enableNarrator").checked) return; // Si el narrador está desactivado, no hacer nada.

    const narrador = new SpeechSynthesisUtterance();
    const vocesDisponibles = window.speechSynthesis.getVoices();
    const vozSeleccionada = vocesDisponibles.find((voz) => voz.name === document.getElementById("speech-select").value);

    if (vozSeleccionada) narrador.voice = vozSeleccionada;

    const fechaFormateada = new Intl.DateTimeFormat("es-ES", {
        weekday: "long", // Nombre del día
        year: "numeric", // Año
        month: "long",  // Nombre completo del mes
        day: "numeric", // Día del mes
        hour: "numeric", // Hora
        minute: "numeric", // Minuto
        second: "numeric", // Segundo
    }).format(new Date(el.date));

    narrador.text = `
        Título: ${el.title.rendered}. 
        Fecha: ${fechaFormateada}. 
        Descripción: ${el.excerpt.rendered.replace("[&hellip;]", "...")}.
        Botón, ver resumen de : ${el.title.rendered}.
    `;
    narrador.rate = parseFloat(document.getElementById("voiceSpeed").value) || 1;
    narrador.volume = parseFloat(document.getElementById("voiceVolume").value) || 1;

    window.speechSynthesis.speak(narrador);
}


// Añadir eventos de narración a modales
function configurarNarracionModales() {
    document.querySelectorAll(".modal").forEach((modal) => {
        // Al abrir el modal, no narrar automáticamente todo el contenido
        modal.addEventListener("shown.bs.modal", () => {
            console.log(`Modal "${modal.id}" abierto. Narración desactivada al cargar.`);
        });

        // Configurar eventos en elementos dentro del modal
        modal.querySelectorAll(".modal-body *, .modal-footer *").forEach((elemento) => {
            elemento.addEventListener("mouseenter", () => narrarTexto(elemento.textContent.trim()));
            elemento.addEventListener("focus", () => narrarTexto(elemento.textContent.trim()));
        });
    });
}

// Narrador universal
function narrarTexto(texto) {
    detenerNarracion(); // Asegúrate de que no se superpongan narraciones.

    if (!document.getElementById("enableNarrator").checked) return; // Si el narrador está desactivado, no hacer nada.

    const narrador = new SpeechSynthesisUtterance();
    const vocesDisponibles = window.speechSynthesis.getVoices();
    const vozSeleccionada = vocesDisponibles.find((voz) => voz.name === document.getElementById("speech-select").value);

    if (vozSeleccionada) narrador.voice = vozSeleccionada;

    narrador.text = texto;
    narrador.rate = parseFloat(document.getElementById("voiceSpeed").value) || 1;
    narrador.volume = parseFloat(document.getElementById("voiceVolume").value) || 1;

    window.speechSynthesis.speak(narrador);
}

// Detener narración
function detenerNarracion() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
}



// Añadir eventos de narración a configuraciones y navegación
function configurarNarracion() {
    // Narrar secciones del menú (hover y foco)
    document.querySelectorAll("#header-nav a").forEach((enlace) => {
        enlace.addEventListener("focus", () => narrarTexto(enlace.textContent.trim()));
        enlace.addEventListener("mouseenter", () => narrarTexto(enlace.textContent.trim()));
    });

    // Narrar configuraciones del dropdown (hover y foco)
    document.querySelectorAll(".dropdown-item").forEach((item) => {
        item.addEventListener("focus", () => narrarTexto(item.textContent.trim()));
        item.addEventListener("mouseenter", () => narrarTexto(item.textContent.trim()));
    });

    // Narrar contenido de las cards
    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("focus", () => narrarTexto(card.textContent.trim()));
        card.addEventListener("mouseenter", () => narrarTexto(card.textContent.trim()));
    });
    configurarNarracionModales();

    // Narrar botones u otros elementos al usar Tab
    document.querySelectorAll("button, input").forEach((elemento) => {
        elemento.addEventListener("focus", () => narrarTexto(elemento.getAttribute("aria-label") || elemento.textContent.trim()));
        elemento.addEventListener("mouseenter", () => narrarTexto(elemento.getAttribute("aria-label") || elemento.textContent.trim()));
    
    }); 
}

function narrarContenidoBoton(titulo) {
    detenerNarracion();
    if (!document.getElementById("enableNarrator").checked) return;  // Si el narrador está desactivado, no hacer nada

    const narrador = new SpeechSynthesisUtterance();
    const vocesDisponibles = window.speechSynthesis.getVoices();
    const vozSeleccionada = vocesDisponibles.find((voz) => voz.name === document.getElementById("speech-select").value);

    if (vozSeleccionada) narrador.voice = vozSeleccionada;

    narrador.text = `Botón: Resumen de la noticia: ${titulo}`; 
    narrador.rate = parseFloat(document.getElementById("voiceSpeed").value) || 1;
    narrador.volume = parseFloat(document.getElementById("voiceVolume").value) || 1;

    window.speechSynthesis.speak(narrador);
}

// Función para narrar el contenido del modal
function narrarContenidoModal(post) {
    detenerNarracion();
    if (!document.getElementById("enableNarrator").checked) return;  // Si el narrador está desactivado, no hacer nada

    const narrador = new SpeechSynthesisUtterance();
    const vocesDisponibles = window.speechSynthesis.getVoices();
    const vozSeleccionada = vocesDisponibles.find((voz) => voz.name === document.getElementById("speech-select").value);

    if (vozSeleccionada) narrador.voice = vozSeleccionada;

    narrador.text = `
        Noticia ampliada, Título: ${post.titulo}.
        Fecha: ${post.fecha}.
        Contenido completo: ${post.texto_completo}.
        Para más detalles, visite el enlace.
    `;
    narrador.rate = parseFloat(document.getElementById("voiceSpeed").value) || 1;
    narrador.volume = parseFloat(document.getElementById("voiceVolume").value) || 1;

    window.speechSynthesis.speak(narrador);
}

function narrarContenidoModal2(el, descripcioncompleta) {
    detenerNarracion();
    if (!document.getElementById("enableNarrator").checked) return;  // Si el narrador está desactivado, no hacer nada

    const narrador = new SpeechSynthesisUtterance();
    const vocesDisponibles = window.speechSynthesis.getVoices();
    const vozSeleccionada = vocesDisponibles.find((voz) => voz.name === document.getElementById("speech-select").value);

    if (vozSeleccionada) narrador.voice = vozSeleccionada;
    const fechaFormateada = new Intl.DateTimeFormat("es-ES", {
        weekday: "long", // Nombre del día
        year: "numeric", // Año
        month: "long",  // Nombre completo del mes
        day: "numeric", // Día del mes
        hour: "numeric", // Hora
        minute: "numeric", // Minuto
        second: "numeric", // Segundo
    }).format(new Date(el.date));

    narrador.text = `
        Noticia ampliada, Título: ${el.title.rendered}.
        Fecha: ${fechaFormateada}.
        Contenido completo: ${descripcioncompleta}.
        Para más detalles, visite el enlace.
    `;
    narrador.rate = parseFloat(document.getElementById("voiceSpeed").value) || 1;
    narrador.volume = parseFloat(document.getElementById("voiceVolume").value) || 1;

    window.speechSynthesis.speak(narrador);
}

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
            <div class="card news-card" tabindex="0" aria-labelledby="card-title-${el.id}">
        
                <div class="card-header">
                    <span class="news-date pb-3">${new Date(el.date).toLocaleString()}</span>
                    <a href="${el.link}" class="post-link" target="_blank" tabindex="-1">
                        <span id="card-title-${el.id}" class="news-title" title="${el.title.rendered}">
                            ${el.title.rendered}
                        </span>
                    </a>
                </div>
        
                <div class="card-body" data-card${el.id}>
                    <img src="${el._embedded["wp:featuredmedia"] ? el._embedded["wp:featuredmedia"][0].source_url : ""}" 
                        alt="${el.title.rendered}" class="img-fluid news-image">
                    <div class="news-description mt-2">
                        <p class="p">${el.excerpt.rendered.replace("[&hellip;]", "...")}</p>
                    </div>
                </div>
            </div>
        `;

cardNoticia.addEventListener('mouseenter', () => narrarContenido2(el));
cardNoticia.addEventListener('mouseleave', detenerNarracion);

cardNoticia.addEventListener('focusin', () => narrarContenido2(el)); // Cuando el card recibe el foco
cardNoticia.addEventListener('focusout', detenerNarracion); // Cuando se pierde el foco



                const resumenBtn = document.createElement("button");
                resumenBtn.className = "btn btn-dark btn-resumen";
                resumenBtn.setAttribute("data-bs-toggle", "modal");
                resumenBtn.setAttribute("data-bs-target", "#modalContenidoNoticia");
                resumenBtn.setAttribute("aria-label", `Resumen: ${el.title.rendered}`);
                resumenBtn.setAttribute("aria-labelledby", "modalLabelNoticia");
                resumenBtn.setAttribute("tabindex", "0");
                resumenBtn.textContent = "Resumen";


                resumenBtn.addEventListener("focusin", (e) => {
                    e.stopPropagation();  // Evita que el evento se propague y afecte a otros elementos
                    narrarContenidoBoton(el.title.rendered);
                });
                
                
                // Cuando el foco se pierde en el botón
                resumenBtn.addEventListener("focusout", () => {
                    detenerNarracion();
                });

                // Recibo el contenido en formato de string html desde la API
            const htmlString = el.content.rendered;

            // Creo un elemento temporal para parsear el HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlString;

            // Selecciono solo los elementos que sean textuales
            const elements = tempDiv.querySelectorAll('p, span');

                const textoExtraido = Array.from(elements).map(element => element.textContent);
                
                resumenBtn.addEventListener("click", function (e){
                    document.querySelector(".modal-new-title").innerHTML = el.title.rendered; 
                    document.querySelector(".modal-new-date").innerHTML = el.date; 
                    document.querySelector(".modal-new-content").innerHTML = textoExtraido;
                    document.querySelector(".modal-new-link").href = el.link;
                    e.stopPropagation();

                    // Retraso para esperar que el modal se haya abierto completamente y el contenido esté cargado
                    setTimeout(() => {
                        narrarContenidoModal2(el, textoExtraido); // Iniciar la narración después de que el modal se haya abierto
                    }, 500);  // Ajusta el tiempo de espera si es necesario
                    
                });
                document.getElementById("modalContenidoNoticia").addEventListener("mouseenter", function (e) {
                    e.stopPropagation();
                    narrarContenidoModal2(el);  // Llama a la función para narrar el contenido
                });
                $posts.appendChild(cardNoticia);
                document.querySelector(`[data-card${el.id}]`).appendChild(resumenBtn);

        });

        paginaActual++;
        loader.classList.add("d-none");
    })
    .catch(err => {
        /* let message = err.statusText || "Ocurrió un error"; */
        /* $posts.innerHTML = `Error ${err.status}: ${message}`; */
        console.log(err);
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
    <div class="card news-card" tabindex="0" aria-labelledby="card-title-${post.id}">

        <div class="card-header">
            <span class="news-date pb-3">${post.fecha}</span>
            <a href="${post.link_fuente}" class="post-link" target="_blank" tabindex="-1">
                <span id="card-title-${post.id}" class="news-title" title="${post.titulo}">
                    ${post.titulo}
                </span>
            </a>
        </div>

        <div class="card-body" data-card${post.id}>
            <img src="${post.link_imagen_portada}" alt="${post.titulo}" class="img-fluid news-image">
            <div class="news-description mt-2">${post.descripcion}</div>
        </div>
    </div>
`;

// Eventos para hover
cardNoticia.addEventListener('mouseenter', () => narrarContenido(post));
cardNoticia.addEventListener('mouseleave', detenerNarracion);

cardNoticia.addEventListener('focusin', () => narrarContenido(post)); 
cardNoticia.addEventListener('focusout', detenerNarracion); 



                const resumenBtn = document.createElement("button");
                resumenBtn.className = "btn btn-dark btn-resumen";
                resumenBtn.setAttribute("data-bs-toggle", "modal");
                resumenBtn.setAttribute("data-bs-target", "#modalContenidoNoticia");
                resumenBtn.setAttribute("aria-label", `Resumen: ${post.titulo}`);
                resumenBtn.setAttribute("aria-labelledby", "modalLabelNoticia");
                resumenBtn.setAttribute("tabindex", "0");
                resumenBtn.textContent = "Resumen";


                resumenBtn.addEventListener("focusin", (e) => {
                    e.stopPropagation();  // Evita que el evento se propague y afecte a otros elementos
                    narrarContenidoBoton(post.titulo);
                });
                
                
                resumenBtn.addEventListener("focusout", () => {
                    detenerNarracion();
                });

                
                resumenBtn.addEventListener("click", function (e){
                    document.querySelector(".modal-new-title").innerHTML = post.titulo; 
                    document.querySelector(".modal-new-date").innerHTML = post.fecha; 
                    document.querySelector(".modal-new-content").innerHTML = post.texto_completo;
                    document.querySelector(".modal-new-link").href = post.link_fuente;
                    e.stopPropagation();

                    // Retraso para esperar que el modal se haya abierto completamente y el contenido esté cargado
                    setTimeout(() => {
                        narrarContenidoModal(post); // Iniciar la narración después de que el modal se haya abierto
                    }, 500);  // Ajusta el tiempo de espera si es necesario
                    
                });
                document.getElementById("modalContenidoNoticia").addEventListener("mouseenter", function (e) {
                    e.stopPropagation();
                    narrarContenidoModal(post);
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
                    getSitePosts(API_Nacionales);
                    /* obtenerNoticiasSimuladas(API_Tecnologia); */
                    break;
                case "#internacionales":
                    getSitePosts(API_Internacionales);
                    /* obtenerNoticiasSimuladas(API_Economia); */
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
    configurarNarracion();
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

            getSitePosts(API_Nacionales);
            /* obtenerNoticiasSimuladas(API_Economia); */

        break;

        case '#internacionales':

            paginaActual = 1;
                
            tabNacionales.classList.remove("isactive");
            tabInternacionales.classList.add("isactive");
            tabDeportes.classList.remove("isactive");
            tabTecnologia.classList.remove("isactive");
            tabEconomia.classList.remove("isactive");

            $posts.innerHTML = ``;

            getSitePosts(API_Internacionales);
            /* obtenerNoticiasSimuladas(API_Tecnologia); */

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