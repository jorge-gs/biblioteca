let personas = Array();
let persona;

let botonAgregar;
let maestroPersona;

let detallePersona;
let $detallePersona;
let detallePersonaTitulo;
let detallePersonaIdentidad;
let detallePersonaNombre;
let detallePersonaApellido;
let detallePersonaAceptar;
let detallePersonaCancelar;

window.onload = () => {
    botonAgregar = document.getElementById('boton-agregar');
    maestroPersona = document.getElementById('maestro-persona');

    detallePersona = document.getElementById('detalle-persona');
    $detallePersona = $('#detalle-persona');
    detallePersonaTitulo = document.getElementById('detalle-persona-titulo');
    detallePersonaIdentidad = document.getElementById('detalle-persona-identidad');
    detallePersonaNombre = document.getElementById('detalle-persona-nombre');
    detallePersonaApellido = document.getElementById('detalle-persona-apellido');
    detallePersonaAceptar = document.getElementById('detalle-persona-aceptar');
    detallePersonaCancelar = document.getElementById('detalle-persona-cancelar');

    botonAgregar.onclick = () => { detallePersonaAbrir(null); }
    detallePersonaIdentidad.oninput = () => { validarPersona(); }
    detallePersonaNombre.oninput = () => { validarPersona(); }
    detallePersonaApellido.oninput = () => { validarPersona(); }
    detallePersonaAceptar.onclick = () => { aceptarDetallePersona(); }

    solicitarNavegacion();
    solicitarPersonas();
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
    document.getElementById('nav-persona').classList.add('active');
}

function solicitarPersonas() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../persona.php');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            personas = JSON.parse(solicitud.responseText);

            maestroPersona.innerHTML = '';
            personas.forEach(_persona => {
                const textoIdentidad = document.createElement('span');
                textoIdentidad.appendChild(document.createTextNode(_persona.identidad));
                const texto = document.createTextNode(_persona.nombre + ' ' + _persona.apellido);
                const botonEditar = document.createElement('button');
                botonEditar.appendChild(document.createTextNode('Editar'));
                botonEditar.classList.add('btn', 'btn-secondary');
                botonEditar.onclick = () => { detallePersonaAbrir(_persona); }
                const botonEliminar = document.createElement('button');
                botonEliminar.appendChild(document.createTextNode('Eliminar'));
                botonEliminar.classList.add('btn', 'btn-outline-danger');
                botonEliminar.onclick = () => {
                    const solicitud = new XMLHttpRequest();
                    solicitud.open('DELETE', '../persona.php');
                    solicitud.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    solicitud.onreadystatechange = () => {
                        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
                            solicitarPersonas();
                        }
                    }
                    solicitud.send('id=' + _persona.id);
                }
                const grupoBotones = document.createElement('span');
                grupoBotones.appendChild(botonEditar);
                grupoBotones.appendChild(botonEliminar);
                grupoBotones.classList.add('btn-group');
                const fila = document.createElement('div');
                fila.appendChild(textoIdentidad);
                fila.appendChild(texto);
                fila.appendChild(grupoBotones);
                fila.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                maestroPersona.appendChild(fila);
            });
        }
    }
    solicitud.send();
}

function detallePersonaAbrir(_persona) {
    persona = _persona;

    detallePersonaIdentidad.value = persona ? persona.identidad : '';
    detallePersonaNombre.value = persona ? persona.nombre : '';
    detallePersonaApellido.value = persona ? persona.apellido : '';

    validarPersona();
    $detallePersona.modal();
}

function detallePersonaCerrar() {
    persona = null;
}

function validarPersona() {
    let valido = true;

    valido = valido && detallePersonaIdentidad.value !== '';
    valido = valido && detallePersonaNombre.value !== '';
    valido = valido && detallePersonaApellido.value !== '';

    detallePersonaAceptar.disabled = !valido;
}

function aceptarDetallePersona() {
    let datos = '';
    datos += 'identidad=' + detallePersonaIdentidad.value;
    datos += '&nombre=' + detallePersonaNombre.value;
    datos += '&apellido=' + detallePersonaApellido.value;
    if (persona) { datos += '&id=' + persona.id; }

    const solicitud = new XMLHttpRequest();
    solicitud.open(persona ? 'PUT' : 'POST', '../persona.php');
    solicitud.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            solicitarPersonas();
            $detallePersona.modal('hide');
        }
    }
    solicitud.send(datos);
}