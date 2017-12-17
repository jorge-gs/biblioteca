let carreras = Array();

let p1Nombre;
let p1Apellido;
let p1Cuenta;
let p1Carrera;
let p1Aceptar;

function cargarP1() {
    p1Nombre = document.getElementById('p1-nombre');
    p1Apellido = document.getElementById('p1-apellido');
    p1Cuenta = document.getElementById('p1-cuenta');
    p1Carrera = document.getElementById('p1-carrera');
    p1Aceptar = document.getElementById('p1-aceptar');

    p1Nombre.oninput = () => { validarP1(); }
    p1Apellido.oninput = () => { validarP1(); }
    p1Cuenta.oninput = () => { validarP1(); }
    p1Aceptar.onclick = () => { aceptarP1(); }

    solicitarCarreras();
}

function mostrarP1() {
    if (datosP1) {
        p1Nombre.value = datosP1.nombre;
        p1Apellido.value = datosP1.apellido;
        p1Cuenta.value = datosP1.cuenta;
        p1Carrera.value = datosP1.carrera.id;
    }
    validarP1();
}

function validarP1() {
    let valido = true;

    valido = valido && p1Nombre.value !== '';
    valido = valido && p1Apellido.value !== '';
    valido = valido && p1Cuenta.value !== '';

    p1Aceptar.disabled = !valido;
}

function solicitarCarreras() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../carrera.php');
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const _carreras = JSON.parse(solicitud.responseText);

            _carreras.forEach(_carrera => {
                const opcion = document.createElement('option');
                opcion.appendChild(document.createTextNode(_carrera.codigo + ' ' + _carrera.nombre));
                opcion.value = _carrera.id;
                p1Carrera.appendChild(opcion);
                carreras.push(_carrera);
            });

            mostrarP1();
        }
    }
    solicitud.send();
}

function aceptarP1() {
    datosP1 = {
        nombre: p1Nombre.value,
        apellido: p1Apellido.value,
        cuenta: p1Cuenta.value,
        carrera: carreras.find(carrera => carrera.id == p1Carrera.value)
    }
    cargarPasoDos();
}