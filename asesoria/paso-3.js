let p3Nombre;
let p3Apellido;
let p3Cuenta;
let p3Carrera;
let p3Clases;
let p3Aceptar;
let p3Cancelar;
let p3restablecer = false;

function cargarP3() {
    p3Nombre = document.getElementById('p3-nombre');
    p3Cuenta = document.getElementById('p3-cuenta');
    p3Carrera = document.getElementById('p3-carrera');
    p3Clases = document.getElementById('p3-clases');
    p3Aceptar = document.getElementById('p3-aceptar');
    p3Cancelar = document.getElementById('p3-cancelar');

    p3Aceptar.onclick = () => { aceptarP3(); }
    p3Cancelar.onclick = () => { cancelarP3(); }

    solicitarSecciones();

    p3Nombre.textContent = datosP1.nombre + ' ' + datosP1.apellido;
    p3Cuenta.textContent = datosP1.cuenta;
    p3Carrera.textContent = datosP1.carrera.nombre;

    validarP3();
}

function validarP3() {
    let valido = true;

    p3Aceptar.disabled = !valido;
}

function solicitarSecciones() {
    clasesSeleccionadas.forEach(_clase => {
        const solicitud = new XMLHttpRequest();
        solicitud.open('GET', '../seccion.php?clase=' + _clase.id);
        solicitud.onreadystatechange = () => {
            if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
                const _secciones = JSON.parse(solicitud.responseText);
                _clase.secciones = Array();
                
                let marcarPrimero = true;
                _secciones.forEach(_seccion => {
                    _seccion.clase = _clase;
                    const divSeccion = document.createElement('div');
                    const divRadio = document.createElement('div');
                    const radio = document.createElement('input');
                    radio.onchange = () => {
                        if (radio.checked) {
                            _clase.seccion = _seccion;
                        }
                    }
                    if (marcarPrimero) {
                        radio.checked = true;
                        marcarPrimero = false;
                    }
                    radio.onchange();
                    const texto = document.createTextNode('Sección ' + _seccion.letra);
                    const divHorario = document.createElement('div');
                    divRadio.classList.add('col-1');
                    divHorario.classList.add('col-11');
                    divRadio.appendChild(radio);
                    radio.type = 'radio';
                    radio.name = 'radio' + _clase.nombre;
                    divSeccion.classList.add('row');
                    divHorario.appendChild(texto);
                    divSeccion.appendChild(divRadio);
                    _seccion.horario.forEach(_horario => {
                        const span = document.createElement('div');
                        span.appendChild(document.createTextNode(_horario.dia.nombre + ' ' + _horario.inicio + ':00 - ' + (Number(_horario.inicio) + Number(_horario.duracion)) +':00' ));
                        divHorario.appendChild(span);
                    });
                    divSeccion.appendChild(divHorario);
                    _clase.divSecciones.appendChild(divSeccion);
                    _clase.secciones.push(_seccion);
                });
            }
        }
        solicitud.send();

        const div = document.createElement('div');
        const nombreClase = document.createTextNode(_clase.nombre);
        const divSecciones = document.createElement('div');
        div.appendChild(nombreClase);
        div.appendChild(divSecciones);
        div.classList.add('list-group-item');
        p3Clases.appendChild(div);
        _clase.divSecciones = divSecciones;
    });
}

function aceptarP3() {
    let horarios = Array();
    clasesSeleccionadas.forEach(_clase => {
        _clase.seccion.horario.forEach(_horario => {
            _horario.clase = _clase;
            horarios.push(_horario);
        });
    });

    for (let i = 0; i < horarios.length; i++) {
        const horario = horarios[i];
        for (let j = i + 1; j < horarios.length; j++) {
            const _horario = horarios[j];
            if (horario.seccion == _horario.seccion) { continue; }
            if (horario.dia.id != _horario.dia.id) { continue; }
            if (horario.inicio > (_horario.inicio + _horario.duracion)) { continue; }
            if ((horario.inicio + horario.duracion) < _horario.inicio) { continue; }

            alert('Existe un problema con los horarios de ' + horario.clase.nombre + ' y ' + _horario.clase.nombre + '!');
            return;
        }
    }
    imprimir();
}

function imprimir() {
    let ventana = window.open('../plantillas/asesoria.html', 'Asesoría', 'width=600,height=400');
    setTimeout(() => {
        ventana.datos = datosP1;
        ventana.datos.clases = clasesSeleccionadas;
        ventana.cargar();
        ventana.print();
    }, 100);
}

function cancelarP3() {
    cargarPasoDos();
}