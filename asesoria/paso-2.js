let clases = Array();
let clasesSeleccionadas = Array();

let p2Nombre;
let p2Apellido;
let p2Cuenta;
let p2Carrera;
let p2Clases;
let p2Aceptar;
let p2Cancelar;
let p2restablecer = false;

function cargarP2() {
    p2Nombre = document.getElementById('p2-nombre');
    p2Cuenta = document.getElementById('p2-cuenta');
    p2Carrera = document.getElementById('p2-carrera');
    p2Clases = document.getElementById('p2-clases');
    p2Aceptar = document.getElementById('p2-aceptar');
    p2Cancelar = document.getElementById('p2-cancelar');

    p2Aceptar.onclick = () => { aceptarP2(); }
    p2Cancelar.onclick = () => { cancelarP2(); }

    solicitarClases();

    p2Nombre.textContent = datosP1.nombre + ' ' + datosP1.apellido;
    p2Cuenta.textContent = datosP1.cuenta;
    p2Carrera.textContent = datosP1.carrera.nombre;

    validarP2();
}

function validarP2() {
    let valido = true;

    valido = clasesSeleccionadas.length > 0;

    p2Aceptar.disabled = !valido;
}

function solicitarClases() {
    const solicitud = new XMLHttpRequest();
    solicitud.open('GET', '../clase.php?carrera=' + datosP1.carrera.id);
    solicitud.onreadystatechange = () => {
        if (solicitud.readyState === XMLHttpRequest.DONE && solicitud.status === 200) {
            const _clases = JSON.parse(solicitud.responseText);

            _clases.forEach(_clase => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.onchange = () => {
                    if (checkbox.checked) {
                        if (!p2restablecer) {
                            if (_clase.requisito) {
                                let requisitos = '';
                                _clase.requisito.forEach(__clase => {
                                    requisitos += __clase.nombre + '\n';
                                });

                                if (!confirm('Para matrícular ' + _clase.nombre + ' necesita haber cursado:\n' + requisitos  + 'Está seguro que cumple con este requisito?')) {
                                    checkbox.checked = false;
                                    return;
                                }
                            }
                            clasesSeleccionadas.push(_clase);
                            console.log(clasesSeleccionadas);
                        }
                    } else {
                        const i = clasesSeleccionadas.findIndex(__clase => __clase.id === _clase.id);
                        clasesSeleccionadas.splice(i, 1);
                        console.log(clasesSeleccionadas);
                        console.log(i);
                    }

                    comprobarRequisitos(_clase, checkbox.checked, true, true);
                    validarP2();
                }
                const texto = document.createTextNode(' ' + _clase.codigo + ' ' + _clase.nombre);
                const fila = document.createElement('div');
                fila.appendChild(checkbox);
                fila.appendChild(texto);
                fila.classList.add('list-group-item');
                p2Clases.appendChild(fila);
                _clase.checkbox = checkbox;
                _clase.div = fila;
                clases.push(_clase);
            });
            restablecerSeleccionesPrevias();
        }
    }
    solicitud.send();
}

function restablecerSeleccionesPrevias() {
    p2restablecer = true;
    clases.forEach(_clase => {
        _clase.checkbox.checked = clasesSeleccionadas.find(clase => clase.id == _clase.id) ? true : false;
        if (_clase.checkbox.checked) {
             _clase.checkbox.onchange();
        }
    });
    p2restablecer = false;
}

function comprobarRequisitos(_clase, seleccionada, pre, post) {
    clases.forEach(__clase => {
        //Deshabilitar clases anteriores
        if (pre && _clase.requisito) {
            _clase.requisito.forEach(_req => {
                if (__clase.id == _req.id) {
                    __clase.checkbox.disabled = seleccionada;
                    if (seleccionada) { __clase.div.classList.add('text-muted'); }
                    else { __clase.div.classList.remove('text-muted'); }
                    comprobarRequisitos(__clase, seleccionada, true, false);
                    return;
                }
            });
        }

        //Deshabilitar clases posteriores
        if (post && __clase.requisito) {
            __clase.requisito.forEach(_req => {
                if (_req.id == _clase.id) {
                    __clase.checkbox.disabled = seleccionada;
                    if (seleccionada) { __clase.div.classList.add('text-muted'); }
                    else { __clase.div.classList.remove('text-muted'); }
                    comprobarRequisitos(__clase, seleccionada, false, true);
                    return;
                }
            });
        }
    });
}

function aceptarP2() {
    let uvs = 0;
    let stringRequisitos = '';
    clasesSeleccionadas.forEach(_clase => {
        uvs += Number(_clase.uvs);
        if (_clase.requisito) {
            _clase.requisito.forEach(_req => {
                stringRequisitos += '-' + _req.nombre + '\n';
            });
        }
    });
    if (confirm('Está por matricular ' + uvs + ' unidades valorativas, está de acuerdo?')) {
        cargarPasoTres();
    }
}

function cancelarP2() {
    cargarPasoUno();
}