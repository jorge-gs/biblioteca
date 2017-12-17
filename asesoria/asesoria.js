let contenedorPrincipal;
let datosP1;
let datosP2;

window.onload = () => {
    contenedorPrincipal = document.getElementById('principal');

    solicitarNavegacion();
    cargarPasoUno();
}

function solicitarNavegacion() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../plantillas/navegacion.html');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            mostrarNavegacion(solicitud.responseText);
        }
    }
    solicitud.send();
}

function mostrarNavegacion(html) {
    document.body.insertAdjacentHTML('afterbegin', html);
    document.getElementById('nav-asesoria').classList.add('active');
}

function cargarPasoUno() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', 'paso-1.html');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const html = solicitud.responseText;
            contenedorPrincipal.innerHTML = '';
            contenedorPrincipal.insertAdjacentHTML('afterbegin', html);
            cargarP1();
        }
    }
    solicitud.send();
}

function cargarPasoDos() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', 'paso-2.html');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const html = solicitud.responseText;
            contenedorPrincipal.innerHTML = '';
            contenedorPrincipal.insertAdjacentHTML('afterbegin', html);
            cargarP2();
        }
    }
    solicitud.send();
}

function cargarPasoTres() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', 'paso-3.html');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const html = solicitud.responseText;
            contenedorPrincipal.innerHTML = '';
            contenedorPrincipal.insertAdjacentHTML('afterbegin', html);
            cargarP3();
        }
    }
    solicitud.send();
}