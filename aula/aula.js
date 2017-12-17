//Modelos
let aulas = Array();
let aula; //Modelo de detalle

//Maestro
let botonAgregar;
let maestro;

//Detalle
let detalleAula;
let $detalleAula;
let detalleAulaTitulo;
let detalleAulaCategoria;
let detalleAulaNombre;
let detalleAulaAceptar;
let detalleAulaCancelar;

window.onload = () => {
    //Maestro
    botonAgregar = document.getElementById('boton-agregar');
    maestro = document.getElementById('maestro');

    //Detalle
    detalleAula = document.getElementById('detalle-aula');
    $detalleAula = $('#detalle-aula');
    detalleAulaTitulo = document.getElementById('detalle-aula-titulo');
    detalleAulaCategoria = document.getElementById('detalle-aula-categoria');
    detalleAulaNombre = document.getElementById('detalle-aula-nombre');
    detalleAulaAceptar = document.getElementById('detalle-aula-aceptar');
    detalleAulaCancelar = document.getElementById('detalle-aula-cancelar');

    //Asignar eventos
    botonAgregar.onclick = () => { detalleAulaAbrir(null); }
    detalleAulaAceptar.onclick = () => { aceptarDetalleAula(); }
    $detalleAula.on('hide.bs.modal', () => { detalleAulaCerrar() });
    detalleAulaNombre.oninput = () => { validar(); }

    solicitarNavegacion();
    solicitarAulas();
    solicitarCategorias();
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
    document.getElementById('nav-aula').classList.add('active');
}

function solicitarAulas() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../prestable.php?aulas=true');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            aulas = JSON.parse(solicitud.responseText);

            //Actualizar lista
            maestro.innerHTML = '';
            aulas.forEach(_aula => {
                const fila = document.createElement('div');
                fila.appendChild(document.createTextNode(_aula.categoria.nombre + ' ' + _aula.nombre));
                fila.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                const botonEditar = document.createElement('button');
                botonEditar.appendChild(document.createTextNode('Editar'));
                botonEditar.classList.add('btn', 'btn-secondary');
                botonEditar.onclick = () => { detalleAulaAbrir(_aula); };
                const botonEliminar = document.createElement('button');
                botonEliminar.appendChild(document.createTextNode('Eliminar'));
                botonEliminar.classList.add('btn', 'btn-outline-danger');
                botonEliminar.onclick = () => {
                    const solicitud = new XMLHttpRequest();
                    solicitud.open('DELETE', '../prestable.php');
                    solicitud.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    solicitud.onreadystatechange = () => {
                        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
                            solicitarAulas();
                        }
                    }
                    solicitud.send('id=' + _aula.id);
                 };
                const grupoBoton = document.createElement('span');
                grupoBoton.appendChild(botonEditar);
                grupoBoton.appendChild(botonEliminar);
                grupoBoton.classList.add('btn-group');
                fila.appendChild(grupoBoton);
                maestro.appendChild(fila);
            });
        }
    }
    solicitud.send();
}

function solicitarCategorias() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../categoria.php');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const categorias = JSON.parse(solicitud.responseText);

            categorias.forEach(_categoria => {
                const opcion = document.createElement('option');
                opcion.appendChild(document.createTextNode(_categoria.nombre));
                opcion.value = _categoria.id;
                detalleAulaCategoria.appendChild(opcion);
            });
        }
    }
    solicitud.send();
}

function detalleAulaAbrir(_aula) {
    aula = _aula;

    detalleAulaTitulo.textContent = aula ? aula.categoria.nombre + ' ' + aula.nombre : 'Nueva Aula';
    detalleAulaCategoria.value = aula ? aula.categoria.id : 1;
    detalleAulaNombre.value = aula ? aula.nombre : '';
    validar();

    $('#detalle-aula').modal();
}

function detalleAulaCerrar() {
    aula = null;
}

function validar() {
    detalleAulaAceptar.disabled = detalleAulaNombre.value === '';
}

function aceptarDetalleAula() {
    let datos = '';
    datos += 'categoria=' + detalleAulaCategoria.value;
    datos += '&nombre=' + detalleAulaNombre.value;
    if (aula) { datos += '&id=' + aula.id; }
    
    const solicitud = new XMLHttpRequest();
    solicitud.open(aula ? 'PUT' : 'POST', '../prestable.php');
    solicitud.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const respuesta = JSON.parse(solicitud.responseText);
            if (respuesta[0]) {
                alert('No se puede agregar este registro');
            }
            solicitarAulas();
            $detalleAula.modal('hide');
        }
    }
    solicitud.send(datos);
}