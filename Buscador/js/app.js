const resultado = document.querySelector('#resultado');
const selectYear = document.querySelector('#year');

const selectMarca = document.querySelector('#marca');
const selectMinimo = document.querySelector('#minimo');
const selectMaximo = document.querySelector('#maximo');
const selectPuertas = document.querySelector('#puertas');
const selectTransmision = document.querySelector('#transmision');
const selectColor = document.querySelector('#color');

const _max = new Date().getFullYear();
const _min = _max - 10;

const filtroBusqueda = {
    marca: '',
    year: '',
    minimo: '',
    maximo: '',
    puertas: '',
    transmision: '',
    color: ''
};

document.addEventListener('DOMContentLoaded', () => {
    fetchData(autos);
    llenarSelect();
});

selectMarca.addEventListener('change', e => {
    filtroBusqueda.marca = e.target.value;
    filtrarAuto();
});

selectYear.addEventListener('change', e => {
    filtroBusqueda.year = e.target.value;
    filtrarAuto();
});

selectMinimo.addEventListener('change', e => {
    filtroBusqueda.minimo = e.target.value;
    filtrarAuto();
});

selectMaximo.addEventListener('change', e => {
    filtroBusqueda.maximo = e.target.value;
    filtrarAuto();
});

selectPuertas.addEventListener('change', e => {
    filtroBusqueda.puertas = e.target.value;
    filtrarAuto();
});

selectTransmision.addEventListener('change', e => {
    filtroBusqueda.transmision = e.target.value;
    filtrarAuto();
});

selectColor.addEventListener('change', e => {
    filtroBusqueda.color = e.target.value;
    filtrarAuto();
});

function limpiarHTML() {
	while (resultado.firstChild) {
		resultado.removeChild(resultado.firstChild);
	}
}

function noResultado() {
	limpiarHTML();
	const noResultado = document.createElement('div');
	noResultado.classList.add('error', 'alerta');
	noResultado.textContent =
		'No hay resultados, intenta con diferentes opciones';
	resultado.appendChild(noResultado);
}


function fetchData(autos) {

    limpiarHTML();

    autos.forEach(auto =>{
        const {marca, modelo, year, precio, puertas, color, transmision} = auto
        
        const autoHTML = document.createElement('p');
        autoHTML.textContent = `
            Marca: ${marca} -
            Modelo: ${modelo} - 
            Año: ${year} - 
            Precio: ${precio} - 
            Puertas: ${puertas} - 
            Color: ${color} -
            Transmisión: ${transmision}
        `;

        resultado.appendChild(autoHTML);
    })
}

function filtrarAuto() {

    const resultado = autos
    .filter(filtrarMarca)
    .filter(filtrarYear)
    .filter(filtrarMinimo)
    .filter(filtrarMaximo)
    .filter(filtrarPuertas)
    .filter(filtrarTransmision)
    .filter(filtrarColor);

    if (resultado.length) {
		fetchData(resultado);
	} else {
		noResultado();
	}
}


function llenarSelect() {
    for (let i = _max; i >= _min; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

function filtrarMarca(auto) {
    if (filtroBusqueda.marca) {
        return auto.marca === filtroBusqueda.marca;
    }
    return auto;
}

function filtrarYear(auto) {
    if (filtroBusqueda.year) {
        return auto.year === parseInt(filtroBusqueda.year);
    }
    return auto;
}

function filtrarMinimo(auto) {
    if (filtroBusqueda.minimo) {
        return auto.precio >= filtroBusqueda.minimo;
    }
    return auto;
}

function filtrarMaximo(auto) {
    if (filtroBusqueda.maximo) {
        return auto.precio <= filtroBusqueda.maximo;
    }
    return auto;
}

function filtrarPuertas(auto) {
    if (filtroBusqueda.puertas) {
        return auto.puertas === parseInt(filtroBusqueda.puertas);
    }
    return auto;
}

function filtrarTransmision(auto) {
    if (filtroBusqueda.transmision) {
        return auto.transmision === filtroBusqueda.transmision;
    }
    return auto;
}

function filtrarColor(auto) {
    if (filtroBusqueda.color) {
        return auto.color === filtroBusqueda.color;
    }
    return auto;
}