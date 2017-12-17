let registroCatedratico;
let registroClase;
let registroAula;
let registroCatedraticos;
let registroClases;
let registroAulas;
let registroAceptar;
let reporteCatedratico;
let reporteSeccion;

window.onload = () => {
    registroCatedratico = document.getElementById('catedratico');
    registroCatedraticos = document.getElementById('catedraticos');
    registroClase = document.getElementById('clase');
    registroClases = document.getElementById('clases');
    registroAula = document.getElementById('aula');
    registroAulas = document.getElementById('aulas');
    registroAceptar = document.getElementById('registro-aceptar');
    reporteCatedratico = document.getElementById('reporte-catedratico');

    registroCatedratico.oninput = () => {
        solicitarClases();
        validar();
    }
    registroClase.oninput = () => { validar(); }
    registroAula.oninput = () => { validar(); }

    registroAceptar.onclick = () => { aceptarRegistro(); }
    reporteCatedratico.onclick = () => { generarReporteCatedratico(); }

    solicitarNavegacion();
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
    document.getElementById('nav-registro').classList.add('active');
}

function solicitarCatedraticos() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../persona.php');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const catedraticos = JSON.parse(solicitud.responseText);

            catedraticos.forEach(catedratico => {
                const opcion = document.createElement('option');
                opcion.value = catedratico.nombre + ' ' + catedratico.apellido;
                opcion.dataset.value = catedratico.id;
                registroCatedraticos.appendChild(opcion);
            });
        }
    }
    solicitud.send();
}

function solicitarClases() {
    let _catedratico = document.querySelector('option[value="' + registroCatedratico.value + '"]');
    if (!_catedratico) { return; }

    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../seccion.php?catedratico=' + _catedratico.dataset.value);
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const secciones = JSON.parse(solicitud.responseText);

            registroClases.innerHTML = '';
            secciones.forEach(seccion => {
                const opcion = document.createElement('option');
                opcion.value = seccion.clase.nombre + ' Sección ' + seccion.letra;
                opcion.dataset.value = seccion.id;
                registroClases.appendChild(opcion);
            });
        }
    }
    solicitud.send();
}

function solicitarAulas() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../prestable.php');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const aulas = JSON.parse(solicitud.responseText);

            aulas.forEach(aula => {
                const opcion = document.createElement('option');
                opcion.value = aula.categoria.nombre + ' ' + aula.nombre;
                opcion.dataset.value = aula.id;
                registroAulas.appendChild(opcion);
            });
        }
    }
    solicitud.send();
}

function aceptarRegistro() {
    registroCatedratico.oninput();
    registroClase.oninput();
    registroAula.oninput();

    const _clase = document.querySelector('option[value="' + registroClase.value + '"]');
    const _aula = document.querySelector('option[value="' + registroAula.value + '"]');

    if (!_clase || !_aula) {
        alert('Clase o aula inválida, por favor asegúrese de seleccionar un valor de la lista.');
        return;
    }

    let datos = '';
    datos += 'seccion=' + _clase.dataset.value;
    datos += '&aula=' + _aula.dataset.value;
    datos += '&hora=' + (Date.now() / 1000 | 0);
    
    const solicitud = new XMLHttpRequest();
    solicitud.open('POST', '../registro.php');
    solicitud.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const respuesta = new Number(solicitud.responseText);
            if (isNaN(respuesta)) {
                alert('Se produjo un error, por favor contacte al administrador del sistema');
            }
            alert('El registro se completó');
            location = '';
        }
    }
    solicitud.send(datos);
}

function validar() {
    const _catedratico = document.querySelector('option[value="' + registroCatedratico.value + '"]');

    reporteCatedratico.disabled = registroCatedratico.value === '' || (_catedratico ? false : true);
}

function generarReporteCatedratico() {
    let ventana = window.open('../plantillas/reporte.html', 'Reporte', 'width=600,height=400');
    setTimeout(() => {
        const _catedratico = document.querySelector('option[value="' + registroCatedratico.value + '"]');

        ventana.datos._catedratico = _catedratico.dataset.value;
        ventana.reporteCatedratico();
        ventana.print();
    }, 100);
}