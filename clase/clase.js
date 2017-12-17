let clases = Array();
let clase;
let seccion;
let horario;

let mostrandoSeccion = false;
let mostrandoHorario = false;

let botonAgregar;
let maestro;
let detalleClaseMaestroSecciones;
let detalleSeccionMeastroHorarios;
let detalleClaseAgregarSeccion;
let detalleSeccionAgregarHorario;

let detalleClase;
let $detalleClase;
let detalleClaseCodigo;
let detalleClaseNombre;
let detalleClaseHoras;
let detalleClaseUVs;
let detalleClaseSecciones;
let detalleClaseAceptar;
let detalleClaseCancelar;

let detalleSeccion;
let $detalleSeccion;
let detalleSeccionTitulo;
let detalleSeccionCatedratico;
let detalleSeccionLetra;
let detalleSeccionHorario;
let detalleSeccionAceptar;
let detalleSeccionCancelar;

let detalleHorario;
let $detalleHorario;
let detalleHorarioTitulo;
let detalleHorarioAula;
let detalleHorarioDia;
let detalleHorarioInicio;
let detalleHorarioFin;
let detalleHorarioAceptar;
let detalleHorarioCancelar;

window.onload = () => {
    botonAgregar = document.getElementById('boton-agregar');
    maestro = document.getElementById('maestro');
    detalleClaseMaestroSecciones = document.getElementById('maestro-secciones');
    detalleSeccionMeastroHorarios = document.getElementById('detalle-seccion-maestro-horarios');
    detalleClaseAgregarSeccion = document.getElementById('detalle-clase-agregar-seccion');
    detalleSeccionAgregarHorario = document.getElementById('detalle-seccion-agregar-horario');

    detalleClase = document.getElementById('detalle-clase');
    $detalleClase = $('#detalle-clase');
    detalleClaseCodigo = document.getElementById('detalle-clase-codigo');
    detalleClaseNombre = document.getElementById('detalle-clase-nombre');
    detalleClaseHoras = document.getElementById('detalle-clase-horas');
    detalleClaseUVs = document.getElementById('detalle-clase-uvs');
    detalleClaseSecciones = document.getElementById('detalle-clase-secciones');
    detalleClaseAceptar = document.getElementById('detalle-clase-aceptar');
    detalleClaseCancelar = document.getElementById('detalle-clase-cancelar');

    detalleSeccion = document.getElementById('detalle-seccion');
    $detalleSeccion = $('#detalle-seccion');
    detalleSeccionTitulo = document.getElementById('detalle-seccion-titulo');
    detalleSeccionCatedratico = document.getElementById('detalle-seccion-catedratico');
    detalleSeccionLetra = document.getElementById('detalle-seccion-letra');
    detalleSeccionHorario = document.getElementById('detalle-seccion-horario');
    detalleSeccionAceptar = document.getElementById('detalle-seccion-aceptar');
    detalleSeccionCancelar = document.getElementById('detalle-seccion-cancelar');

    detalleHorario = document.getElementById('detalle-horario');
    $detalleHorario = $('#detalle-horario');
    detalleHorarioTitulo = document.getElementById('detalle-horario-codigo');
    detalleHorarioAula = document.getElementById('detalle-horario-aula');
    detalleHorarioDia = document.getElementById('detalle-horario-dia');
    detalleHorarioInicio = document.getElementById('detalle-horario-inicio');
    detalleHorarioFin = document.getElementById('detalle-horario-fin');
    detalleHorarioAceptar = document.getElementById('detalle-horario-aceptar');
    detalleHorarioCancelar = document.getElementById('detalle-horario-cancelar');

    botonAgregar.onclick = () => { detalleClaseAbrir(null); }
    $detalleClase.on('hide.bs.modal', () => { detalleClaseCerrar() });
    detalleClaseCodigo.oninput = () => { validarClase(); }
    detalleClaseNombre.oninput = () => { validarClase(); }
    detalleClaseHoras.oninput = () => { validarClase(); }
    detalleClaseUVs.oninput = () => { validarClase(); }
    detalleClaseAceptar.onclick = () => { aceptarDetalleClase(); }
    detalleClaseAgregarSeccion.onclick = () => { detalleSeccionAbrir(null); }
    $detalleSeccion.on('hide.bs.modal', () => { detalleSeccionCerrar() });
    detalleSeccionLetra.oninput = () => { validarSeccion(); }
    detalleSeccionAceptar.onclick = () => { aceptarDetalleSeccion(); }
    detalleSeccionAgregarHorario.onclick = () => { detalleHorarioAbrir(null); }
    $detalleHorario.on('hide.bs.modal', () => { detalleHorarioCerrar(); });
    detalleHorarioInicio.oninput = () => { validarHorario(); }
    detalleHorarioFin.oninput = () => { validarHorario(); }
    detalleHorarioAceptar.onclick = () => { aceptarDetalleHorario(); }

    solicitarNavegacion();
    solicitarClases();
    solicitarCatedraticos();
    solicitarAulas();
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
    document.getElementById('nav-clase').classList.add('active');
}

function solicitarClases() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../clase.php');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            clases = JSON.parse(solicitud.responseText);

            maestro.innerHTML = '';
            clases.forEach(_clase => {
                const textoCodigo = document.createElement('span');
                textoCodigo.appendChild(document.createTextNode(_clase.codigo));
                const botonEditar = document.createElement('button');
                botonEditar.appendChild(document.createTextNode('Editar'));
                botonEditar.classList.add('btn', 'btn-secondary');
                botonEditar.onclick = () => { detalleClaseAbrir(_clase); }
                const botonEliminar = document.createElement('button');
                botonEliminar.appendChild(document.createTextNode('Eliminar'));
                botonEliminar.classList.add('btn', 'btn-outline-danger');
                botonEliminar.onclick = () => {
                    const solicitud = new XMLHttpRequest();
                    solicitud.open('DELETE', '../clase.php');
                    solicitud.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    solicitud.onreadystatechange = () => {
                        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
                            const res = JSON.parse(solicitud.responseText);
                            if (res[0] && res[0].errno === 1451) {
                                alert('Esta clase no puede ser eliminado!');
                            }
                            solicitarClases();
                        }
                    }
                    solicitud.send('id=' + _clase.id);
                }
                const grupoBotones = document.createElement('span');
                grupoBotones.appendChild(botonEditar);
                grupoBotones.appendChild(botonEliminar);
                grupoBotones.classList.add('btn-group');
                const fila = document.createElement('div');
                fila.appendChild(textoCodigo);
                fila.appendChild(document.createTextNode(_clase.nombre));
                fila.appendChild(grupoBotones);
                fila.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                maestro.appendChild(fila);
            });
        }
    }
    solicitud.send();
}

function solicitarCatedraticos() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../persona.php');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const catedraticos = JSON.parse(solicitud.responseText);
            
            catedraticos.forEach(_catedratico => {
                const opcion = document.createElement('option');
                opcion.appendChild(document.createTextNode(_catedratico.nombre + ' ' + _catedratico.apellido));
                opcion.value = _catedratico.id;
                detalleSeccionCatedratico.appendChild(opcion);
            });
        }
    }
    solicitud.send();
}

function solicitarAulas() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../prestable.php?aulas=true');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const aulas = JSON.parse(solicitud.responseText);

            aulas.forEach(_aula => {
                const opcion = document.createElement('option');
                opcion.appendChild(document.createTextNode(_aula.categoria.nombre + ' ' + _aula.nombre));
                opcion.value = _aula.id;
                detalleHorarioAula.appendChild(opcion);
            });
        }
    }
    solicitud.send();
}

function detalleClaseAbrir(_clase) {
    clase = _clase;
    detalleClaseSecciones.hidden = clase ? false : true;
    if (clase) { solicitarSecciones(); }

    detalleClaseCodigo.value = clase ? clase.codigo : '';
    detalleClaseNombre.value = clase ? clase.nombre : '';
    detalleClaseHoras.value = clase ? clase.duracion : '';
    detalleClaseUVs.value = clase ? clase.uvs : '';

    validarClase();
    $detalleClase.modal();
}

function solicitarSecciones() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../seccion.php?clase=' + clase.id);
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            clase.secciones = JSON.parse(solicitud.responseText);

            detalleClaseMaestroSecciones.innerHTML = '';
            clase.secciones.forEach(_seccion => {
                const botonEditar = document.createElement('button');
                botonEditar.appendChild(document.createTextNode('Editar'));
                botonEditar.classList.add('btn', 'btn-secondary');
                botonEditar.onclick = () => { detalleSeccionAbrir(_seccion); }
                const botonEliminar = document.createElement('button');
                botonEliminar.appendChild(document.createTextNode('Eliminar'));
                botonEliminar.classList.add('btn', 'btn-outline-danger');
                botonEliminar.onclick = () => {
                    const solicitud = new XMLHttpRequest();
                    solicitud.open('DELETE', '../seccion.php');
                    solicitud.onreadystatechange = () => {
                        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
                            const res = JSON.parse(solicitud.responseText);
                            if (res[0]) {
                                alert('Esta sección no puede ser eliminada');
                            }
                            solicitarSecciones();
                        }
                    }
                    solicitud.send('id=' + _seccion.id);
                }
                const grupoBotones = document.createElement('span');
                grupoBotones.appendChild(botonEditar);
                grupoBotones.appendChild(botonEliminar);
                grupoBotones.classList.add('btn-group');
                const fila = document.createElement('div');
                fila.appendChild(document.createTextNode(_seccion.letra + ' ' + _seccion.catedratico.nombre + ' ' + _seccion.catedratico.apellido));
                fila.appendChild(grupoBotones);
                fila.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                detalleClaseMaestroSecciones.appendChild(fila);
            });
        }
    }
    solicitud.send();
}

function validarClase() {
    let valido = true;

    valido = valido && detalleClaseCodigo.value !== '';
    valido = valido && detalleClaseNombre.value !== '';
    valido = valido && detalleClaseHoras.value !== '' && !isNaN(Number(detalleClaseHoras.value));
    valido = valido && detalleClaseUVs.value !== '' && !isNaN(Number(detalleClaseUVs.value));

    detalleClaseAceptar.disabled = !valido;
}

function aceptarDetalleClase() {
    let datos = '';
    datos += 'codigo=' + detalleClaseCodigo.value;
    datos += '&nombre=' + detalleClaseNombre.value;
    datos += '&duracion=' + detalleClaseHoras.value;
    datos += '&uvs=' + detalleClaseUVs.value;
    if (clase) { datos += '&id=' + clase.id; }

    const solicitud = new XMLHttpRequest();
    solicitud.open(clase ? 'PUT' : 'POST', '../clase.php');
    solicitud.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const res = JSON.parse(solicitud.response);
            if (res[0]) {
                alert('Esta clase no pudo ser registrada!');
            }
            solicitarClases();
            $detalleClase.modal('hide');
        }
    }
    solicitud.send(datos);
}

function detalleClaseCerrar() {
    if (mostrandoSeccion) {
        return;
    }

    clase = null;
    detalleClaseMaestroSecciones.innerHTML = '';
}

function detalleSeccionAbrir(_seccion) {
    seccion = _seccion;
    mostrandoSeccion = true;
    detalleSeccionHorario.hidden = seccion ? false : true;
    if (seccion) { solicitarHorarios(); }

    detalleSeccionCatedratico.value = seccion ? seccion.catedratico.id : 1;
    detalleSeccionLetra.value = seccion ? seccion.letra : '';

    validarSeccion();
    $detalleClase.modal('hide');
    $detalleSeccion.modal();
}

function detalleSeccionCerrar() {
    if (mostrandoHorario) {
        return;
    }

    seccion = null;
    mostrandoSeccion = false;

    detalleClaseAbrir(clase);
}

function validarSeccion() {
    let valido = true;

    valido = valido && detalleSeccionLetra.value !== '' && detalleSeccionLetra.value.length === 1;

    detalleSeccionAceptar.disabled = !valido;
}

function aceptarDetalleSeccion() {
    
    let datos = '';
    datos += 'clase=' + clase.id;
    datos += '&catedratico=' + detalleSeccionCatedratico.value;
    datos += '&letra=' + detalleSeccionLetra.value;
    if (seccion) { datos += '&id=' + seccion.id; }

    const solicitud = new XMLHttpRequest();
    solicitud.open(seccion ? 'PUT' : 'POST', '../seccion.php');
    solicitud.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const res = JSON.parse(solicitud.responseText);
            if (res[0]) {
                alert('Esta sección no pudo ser registrada!');
            }
            solicitarSecciones();
            $detalleSeccion.modal('hide');
        }
    }
    solicitud.send(datos); 
}

function solicitarHorarios() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../horario.php?seccion=' + seccion.id);
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            seccion.horarios = JSON.parse(solicitud.responseText);

            detalleSeccionMeastroHorarios.innerHTML = '';
            seccion.horarios.forEach(_horario => {
                const aula = document.createTextNode(_horario.dia.nombre + ' ' + _horario.aula.categoria.nombre + ' ' + _horario.aula.nombre + ' ' + _horario.inicio + ':00 - ' + (_horario.inicio + _horario.duracion) + ':00');
                const botonEditar = document.createElement('button');
                botonEditar.appendChild(document.createTextNode('Editar'));
                botonEditar.classList.add('btn', 'btn-secondary');
                botonEditar.onclick = () => { detalleHorarioAbrir(_horario); }
                const botonEliminar = document.createElement('button');
                botonEliminar.appendChild(document.createTextNode('Eliminar'));
                botonEliminar.classList.add('btn', 'btn-outline-danger');
                botonEliminar.onclick = () => {
                    const solicitud = new XMLHttpRequest();
                    solicitud.open('DELETE', '../horario.php');
                    solicitud.onreadystatechange = () => {
                        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
                            solicitarHorarios();
                        }
                    }
                    solicitud.send('id=' + _horario.id);
                }
                const grupoBotones = document.createElement('span');
                grupoBotones.appendChild(botonEditar);
                grupoBotones.appendChild(botonEliminar);
                grupoBotones.classList.add('btn-group');
                const fila = document.createElement('div');
                fila.appendChild(aula);
                fila.appendChild(grupoBotones);
                fila.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                detalleSeccionMeastroHorarios.appendChild(fila);
            });
        }
    }
    solicitud.send();
}

function detalleHorarioAbrir(_horario) {
    horario = _horario;
    mostrandoHorario = true;

    detalleHorarioDia.value = horario ? horario.dia.id : 1;
    detalleHorarioAula.value = horario ? horario.aula.id : 1;
    detalleHorarioInicio.value = horario ? horario.inicio : 7;
    detalleHorarioFin.value = horario ? (horario.inicio + horario.duracion) : 8;

    validarHorario();
    $detalleSeccion.modal('hide');
    $detalleHorario.modal();
}

function detalleHorarioCerrar() {
    horario = null;
    mostrandoHorario = false;
    detalleSeccionAbrir(seccion);
}

function aceptarDetalleHorario() {
    let datos = '';
    datos += 'seccion=' + seccion.id;
    datos += '&dia=' + detalleHorarioDia.value;
    datos += '&aula=' + detalleHorarioAula.value;
    datos += '&inicio=' + detalleHorarioInicio.value;
    datos += '&duracion=' + (detalleHorarioFin.value - detalleHorarioInicio.value);
    if (horario) { datos += '&id=' + horario.id; }

    const solicitud = new XMLHttpRequest();
    solicitud.open(horario ? 'PUT' : 'POST', '../horario.php');
    solicitud.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            console.log(solicitud.responseText);
            const res = JSON.parse(solicitud.responseText);
            if (res[0]) {
                if (res[0].sqlstate === '45000') {
                    alert('El horario del catedrático tiene conflictos y no puede ser agregado');
                } else if (res[0].sqlstate === '45001') {
                    alert('El horario del aula tiene conflictos y no puede ser agregado');
                } else if (res[0].sqlstate === '45010') {
                    alert('El numero de horas semanales progrmadas exede el maximo');
                }
            }
            $detalleHorario.modal('hide');
        }
    }
    solicitud.send(datos);
}

function validarHorario() {
    let valido = true;
    
    const a = Number(detalleHorarioInicio.value);
    const b = Number(detalleHorarioFin.value);
    valido = valido && !isNaN(a);
    valido = valido && !isNaN(b);
    valido = valido && a < b;
    
    detalleHorarioAceptar.disabled = !valido;
}