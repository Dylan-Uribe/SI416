document.addEventListener('DOMContentLoaded', function() {
    // Objeto para almacenar valores del formulario validado
    const objEmail = {
        email: '',
        asunto: '',
        mensaje: ''
    }

    // Definir las variables del formulario
    const inputEmail = document.querySelector('#email');
    const inputAsunto = document.querySelector('#asunto');
    const inputMensaje = document.querySelector('#mensaje');
    const formulario = document.querySelector('#formulario');
    const btnEnviar = document.querySelector('#formulario button[type="submit"]');
    const btnReset = document.querySelector('#formulario button[type="reset"]');

    // Asignar eventos
    inputEmail.addEventListener('blur', validarInput);
    inputAsunto.addEventListener('blur', validarInput);
    inputMensaje.addEventListener('blur', validarInput);
    btnReset.addEventListener('click', resetFormulario);
    formulario.addEventListener('submit', enviarEmail);

    // Funciones
    function validarInput(e) {
        if (e.target.value === '') {
            mostrarAlerta('Todos los campos son obligatorios', e.target.parentElement);
            return;
        }
        limpiarAlerta(e.target.parentElement);

        if (e.target.id === 'email') {
            const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!er.test(e.target.value)) {
                mostrarAlerta('Email no valido', e.target.parentElement);
                return;
            }
        }

        objEmail[e.target.id] = e.target.value;

        if (Object.values(objEmail).includes('')) {
            btnEnviar.disabled = true;
            btnEnviar.classList.add('opacity-50');
        } else {
            btnEnviar.disabled = false;
            btnEnviar.classList.remove('opacity-50');
        }
    }

    function limpiarAlerta(referencia) {
        const alerta = referencia.querySelector('.bg-red-100');
        if (alerta) {
            alerta.remove();
        }
    }

    function mostrarAlerta(mensaje, referencia) {
        limpiarAlerta(referencia);

        const error = document.createElement('p');
        error.textContent = mensaje;
        error.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');

        referencia.appendChild(error);
    }

    function resetFormulario(e) {
        e.preventDefault();
        formulario.reset();
        objEmail.email = '';
        objEmail.asunto = '';
        objEmail.mensaje = '';
        btnEnviar.disabled = true;
        btnEnviar.classList.add('opacity-50');
        limpiarAlerta(formulario);
    }

    function enviarEmail(e) {
        e.preventDefault();
        console.log('Enviando email...');
        // Aquí puedes agregar la lógica para enviar el email
        resetFormulario(e);
    }
});