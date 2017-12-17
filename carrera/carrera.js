let carrera;
let clases = [];
let clasesCarrera = new Set();
let clase;
let claseCarrera;
let requisitos = new Set();

window.onload = () => {
    //Cargar navegación
    const solicitudNavegacion = new XMLHttpRequest();
    solicitudNavegacion.open('GET', '../plantillas/navegacion.html');
    solicitudNavegacion.onreadystatechange = solicitudNavegacionCallback;
    solicitudNavegacion.send();

    cargarLista();
    cargarClases();

    const botonAgregar = document.getElementById('boton-agregar');
    botonAgregar.onclick = () => { abrirDetalle(null); }

    const botonAceptarDialogo = document.getElementById('aceptar-carrera');
    botonAceptarDialogo.onclick = () => { aceptarDialogo(); }

    const inputCodigo = document.getElementById('input-codigo');
    inputCodigo.onchange = () => { validar(); }

    const inputNombre = document.getElementById('input-nombre');
    inputNombre.onchange = () => { validar(); }

    const botonDialogoClase = document.getElementById('boton-dialogo-clase');
    botonDialogoClase.onclick = () => { abrirDetalleClaseCarrera(); }

    const botonAgregarClase = document.getElementById('boton-agregar-clase');
    botonAgregarClase.onclick = () => { agregarClase(); }

    const botonAgregarRequisito = document.getElementById('boton-agregar-requisito');
    botonAgregarRequisito.onclick = () => { agregarRequisito(); }

    const filtro = document.getElementById('filtro');
    filtro.oninput = () => { filtrar(); }

    const botonAceptarClaseCarrera = document.getElementById('aceptar-clase-carrera');
    botonAceptarClaseCarrera.onclick = aceptarClaseCarrera;
}

function solicitudNavegacionCallback(evento) {
    const consulta = evento.srcElement;
    if (consulta.readyState === XMLHttpRequest.DONE) {
        const navegacion = consulta.responseText;
        document.body.insertAdjacentHTML('afterbegin', navegacion);
        actualizarNavegacion();
    }
}

function actualizarNavegacion() {
    const navCarrera = document.getElementById('nav-carrera');
    navCarrera.classList.add('active');
}

function cargarLista() {
    const solicitudCarreras = new XMLHttpRequest();
    solicitudCarreras.open('GET', '../carrera.php');
    solicitudCarreras.onreadystatechange = soilicitudCarrerasCallback;
    solicitudCarreras.send();
}

function cargarClases() {
    const solicitudClases = new XMLHttpRequest();
    solicitudClases.open('GET', '../clase.php');
    solicitudClases.onreadystatechange = solicitudClasesCallback;
    solicitudClases.send();
}

function solicitudClasesCallback(evento) {
    const solicitud = evento.srcElement;
    if (solicitud.readyState === XMLHttpRequest.DONE) {
        const elementoClase = document.getElementById('select-clase');
        const _clases = JSON.parse(solicitud.responseText);
        _clases.forEach(clase =>  {
            clases.push(clase);
            const texto = document.createTextNode(clase.codigo + ' ' + clase.nombre);
            const opcion = document.createElement('option');
            opcion.appendChild(texto);
            opcion.value = clase.id;
            opcion.classList.add('select-clase');
            elementoClase.appendChild(opcion);
        });
    }
}

function soilicitudCarrerasCallback(evento) {
    const solicitud = evento.srcElement;
    if (solicitud.readyState === XMLHttpRequest.DONE) {
        const elementoLista = document.getElementById('lista');
        elementoLista.innerHTML = '';
        const carreras = JSON.parse(solicitud.responseText);
        carreras.forEach(carrera => {
            const textoCodigo = document.createElement('span');
            textoCodigo.appendChild(document.createTextNode(carrera.codigo));
            textoCodigo.style.fontFeatureSettings = 'Monospace';
            textoCodigo.style.color = 'Gray';
            const texto = document.createTextNode(carrera.nombre);
            const botonEditar = document.createElement('button');
            botonEditar.appendChild(document.createTextNode('Editar'));
            botonEditar.classList.add('btn', 'btn-secondary');
            botonEditar.onclick = () => { abrirDetalle(carrera); };
            const botonEliminar = document.createElement('button');
            botonEliminar.appendChild(document.createTextNode('Eliminar'));
            botonEliminar.classList.add('btn', 'btn-outline-danger');
            botonEliminar.onclick = () => { eliminarCarrera(carrera); }
            const grupoBotones = document.createElement('span');
            grupoBotones.appendChild(botonEditar);
            grupoBotones.appendChild(botonEliminar);
            grupoBotones.classList.add('btn-group');
            const fila = document.createElement('div');
            fila.appendChild(textoCodigo);
            fila.appendChild(texto);
            fila.appendChild(grupoBotones);
            fila.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'lista-carrera');
            elementoLista.appendChild(fila);
        });
    }
}

function abrirDetalle(_carrera) {
    prepararDetalle(_carrera);
    $('#detalle-carrera').modal();
}

function prepararDetalle(_carrera) {
    carrera = _carrera;

    const titulo = document.getElementById('titulo-detalle');
    titulo.textContent = carrera ? carrera.nombre : 'Nueva Carrera';

    const inputCodigo = document.getElementById('input-codigo');
    inputCodigo.value = carrera ? carrera.codigo : '';

    const inputNombre = document.getElementById('input-nombre');
    inputNombre.value = carrera ? carrera.nombre : '';

    const botonDialogoClase = document.getElementById('boton-dialogo-clase');
    botonDialogoClase.hidden = carrera ? false : true;

    validar();
}

function validar() {
    let valido = true;

    const inputCodigo = document.getElementById('input-codigo');
    const inputNombre = document.getElementById('input-nombre');
    valido = valido && inputCodigo.value !== '';
    valido = valido && inputNombre.value !== '';

    const botonAceptarDialogo = document.getElementById('aceptar-carrera');
    botonAceptarDialogo.disabled = !valido;
}

function aceptarDialogo() {
    let datos = '';
    datos += 'codigo=' + document.getElementById('input-codigo').value;
    datos += '&nombre=' + document.getElementById('input-nombre').value;
    if (carrera) { datos += '&id=' + carrera.id; }

    let solicitud = new XMLHttpRequest();
    solicitud.open(carrera ? 'PUT' : 'POST', '../carrera.php');
    solicitud.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    solicitud.onreadystatechange = aceptarDialogoCallback;
    solicitud.send(datos);
}

function aceptarDialogoCallback(evento) {
    const solicitud = evento.srcElement;
    if (solicitud.readyState === XMLHttpRequest.DONE) {
        //location.href = 'carrera.html';
        $('#detalle-carrera').modal('hide');
        cargarLista();
    }
}

function eliminarCarrera(_carrera) {
    const datos = 'id=' + _carrera.id;

    let solicitud = new XMLHttpRequest();
    solicitud.open('DELETE', '../carrera.php');
    solicitud.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    solicitud.onreadystatechange = cancelarDialogoCallback;
    solicitud.send(datos);
}

function cancelarDialogoCallback(evento) {
    const solicitud = evento.srcElement;
    if (solicitud.readyState === XMLHttpRequest.DONE) {
        cargarLista();
    }
}

function filtrar() {
    const filtro = document.getElementById('filtro').value;
    const regex = new RegExp(filtro, 'i');

    const lista = Array.from(document.getElementsByClassName('lista-carrera'));
    lista.forEach(fila => {
        let valor = fila.textContent;
        valor = valor.slice(0, valor.length - 14);

        const reg = regex.test(valor);
        fila.style.display = reg ? 'initial' : 'none';
    });
}

function abrirDetalleClaseCarrera() {
    prepararDetalleClaseCarrera();
    $('#detalle-carrera').modal('hide');
    $('#detalle-clase-carrera').modal();
}

function prepararDetalleClaseCarrera() {
    const titulo = document.getElementById('titulo-detalle-clase-carrera');
    titulo.textContent = carrera.nombre;

    clasesCarrera = new Set();
    cargarClaseCarrera();
}

function cargarClaseCarrera() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../claseCarrera.php?carrera=' + carrera.id);
    solicitud.onreadystatechange = solicitudClaseCarreraCallback;
    solicitud.send();
}

function solicitudClaseCarreraCallback(evento) {
    clasesCarrera = new Set();
    const solicitud = evento.srcElement;
    if (solicitud.readyState === XMLHttpRequest.DONE) {
        const listaClases = document.getElementById('lista-clases');
        listaClases.innerHTML = '';
        const _clases = JSON.parse(solicitud.responseText);
        listaClases.innerHTML = '';
        _clases.forEach(clase => {
            const solicitudClases = new XMLHttpRequest();
            solicitudClases.open('GET', '../clase.php?id=' + clase.clase);
            solicitudClases.onreadystatechange = () => {
                if (solicitudClases.readyState === XMLHttpRequest.DONE) {
                    const clase = JSON.parse(solicitudClases.responseText);
                    clasesCarrera.add(clase);
                    
                    const fila = document.createElement('div');
                    const botonAceptar = document.createElement('button');
                    botonAceptar.appendChild(document.createTextNode('Requisito'));
                    botonAceptar.classList.add('btn', 'btn-secondary');
                    botonAceptar.onclick = () => { abrirDetalleRequisito(clase); };
                    const botonEliminar = document.createElement('button');
                    botonEliminar.appendChild(document.createTextNode('Eliminar'));
                    botonEliminar.classList.add('btn', 'btn-outline-danger');
                    botonEliminar.onclick = () => { eliminarClase(clase); }
                    const grupoBotones = document.createElement('span');
                    grupoBotones.appendChild(botonAceptar);
                    grupoBotones.appendChild(botonEliminar);
                    grupoBotones.classList.add('btn-group');
                    fila.appendChild(document.createTextNode(clase.codigo + ' ' + clase.nombre));
                    fila.appendChild(grupoBotones);
                    fila.classList.add('select-clase', 'list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                    listaClases.appendChild(fila);
                }
            }
            solicitudClases.send();
        });
    }
}

function filtrarClase() {
    const filtro = document.getElementById('filtro-clase').value;
    const regex = new RegExp(filtro, 'i');

    const lista = Array.from(document.getElementsByClassName('select-clase'));
    lista.forEach(fila => {
        const valor = fila.textContent;

        const reg = regex.test(valor);
        fila.hidden = reg;
    });
}

function agregarClase() {
    const elementoClases = document.getElementById('select-clase');
    const listaClases = document.getElementById('lista-clases');

    const clase = clases.find(clase => clase.id === elementoClases.value);

    let datos = '';
    datos += 'carrera=' + carrera.id;
    datos += '&clase=' + clase.id;

    const solicitud = new XMLHttpRequest();
    solicitud.open('POST', '../claseCarrera.php');
    solicitud.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE) {
            cargarClaseCarrera();
        }
    }
    solicitud.send(datos);
}

function eliminarClase(_clase) {

    const solicitudClaseCarrera = new XMLHttpRequest();
    solicitudClaseCarrera.open('GET', '../claseCarrera.php?clase=' + _clase.id + '&carrera=' + carrera.id);
    solicitudClaseCarrera.onreadystatechange = () => {
        if (solicitudClaseCarrera.readyState === XMLHttpRequest.DONE) {
            const claseCarrera = JSON.parse(solicitudClaseCarrera.responseText);

            let datos = '';
            datos += 'id=' + claseCarrera.id;
        
            const solicitud = new XMLHttpRequest();
            solicitud.open('DELETE', '../claseCarrera.php');
            solicitud.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            solicitud.onreadystatechange = () => {
                if (solicitud.readyState === XMLHttpRequest.DONE) {
                    cargarClaseCarrera();
                }
            }
            solicitud.send(datos);
        }
    }
    solicitudClaseCarrera.send();

    
}

function aceptarClaseCarrera() {
    $('#detalle-clase-carrera').modal('hide');
}

function abrirDetalleRequisito(_clase) {
    prepararDetalleRequisito(_clase);
    $('#detalle-clase-carrera').modal('hide');
    $('#detalle-requisito').modal();
}

function prepararDetalleRequisito(_clase) {
    clase = _clase;
    let claseCarrera;

    const titulo = document.getElementById('titulo-requisito');
    titulo.textContent = carrera.nombre + ' - ' + clase.nombre;

    const selectRequisitos = document.getElementById('select-requisito');
    selectRequisitos.innerHTML = '';
    clasesCarrera.forEach(_claseCarrera => {
        if (_claseCarrera.id !== clase.id) {
            const opcion = document.createElement('option');
            opcion.appendChild(document.createTextNode(_claseCarrera.codigo + ' ' + _claseCarrera.nombre));
            opcion.value = _claseCarrera.id;
            selectRequisitos.appendChild(opcion);
        }
    });

    cargarListaRequisitos();
}

function cargarListaRequisitos() {
    const solicitudClaseCarrera = new XMLHttpRequest();
    solicitudClaseCarrera.open('GET', '../claseCarrera.php?clase=' + clase.id + '&carrera=' + carrera.id);
    solicitudClaseCarrera.onreadystatechange = () => {
        if (solicitudClaseCarrera.readyState === XMLHttpRequest.DONE) {
            const _claseCarrera = JSON.parse(solicitudClaseCarrera.responseText);
            claseCarrera = _claseCarrera;
            const solicitudRequisito = new XMLHttpRequest();
            solicitudRequisito.open('GET', '../requisito.php?clase_carrera=' + _claseCarrera.id);
            solicitudRequisito.onreadystatechange = () => {
                if (solicitudRequisito.readyState === XMLHttpRequest.DONE) {
                    const listaRequisitos = document.getElementById('lista-requisitos');
                    listaRequisitos.innerHTML = '';
                    const _requisitos = JSON.parse(solicitudRequisito.responseText);
                    _requisitos.forEach(_requisito => {
                        let __clase;
                        clasesCarrera.forEach(_claseCarrera => {
                            if (_claseCarrera.id == _requisito.clase) {
                                __clase = _claseCarrera;
                            }
                        });
                        const fila = document.createElement('div');
                        const botonEliminar = document.createElement('button');
                        botonEliminar.appendChild(document.createTextNode('Eliminar'));
                        botonEliminar.classList.add('btn', 'btn-outline-danger');
                        botonEliminar.onclick = () => { eliminarRequisito(__clase); }
                        fila.appendChild(document.createTextNode(__clase.codigo + ' ' + __clase.nombre));
                        fila.appendChild(botonEliminar);
                        fila.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                        listaRequisitos.appendChild(fila);
                    });
                }
            }
            solicitudRequisito.send();
        }
    }
    solicitudClaseCarrera.send();
}

function agregarRequisito() {
    const elementoRequisito = document.getElementById('select-requisito');

    let datos = '';
    datos += 'clase_carrera=' + claseCarrera.id;
    datos += '&clase=' + elementoRequisito.value;

    const solicitud = new XMLHttpRequest();
    solicitud.open('POST', '../requisito.php');
    solicitud.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE) {
            cargarListaRequisitos();
        }
    }
    solicitud.send(datos);
}

function eliminarRequisito(clase) {
    let datos = '';
    datos += 'clase_carrera=' + claseCarrera.id;
    datos += '&clase=' + clase.id;

    const solicitud = new XMLHttpRequest();
    solicitud.open('DELETE', '../requisito.php');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE) {
            console.log(datos);
            cargarListaRequisitos();
        }
    }
    solicitud.send(datos);
}