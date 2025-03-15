const form = document.querySelector('#nueva-cita');
const dateInput = document.querySelector('#fecha');
const appointmentsContainer = document.querySelector('#citas');
const submitButton = form.querySelector('button[type="submit"]');
const phoneInput = document.querySelector('#telefono');

let appointments = [];
let editing = false;
let currentAppointmentId = null;

document.addEventListener('DOMContentLoaded', () => {
    setMinDate();
    renderAppointments();
});
form.addEventListener('submit', handleFormSubmit);
phoneInput.addEventListener('input', validatePhoneNumber);

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

function handleFormSubmit(e) {
    e.preventDefault();
    clearMessages();
    const errors = validateData();
    if (errors.length === 0) {
        if (editing) {
            updateAppointment();
            showSuccess('Appointment updated successfully');
            submitButton.textContent = 'Create Appointment';
        } else {
            const appointment = createAppointment();
            appointments.push(appointment);
            showSuccess('Appointment created successfully');
        }
        renderAppointments();
        form.reset();
        editing = false;
        currentAppointmentId = null;
    } else {
        showError(errors.join(', '));
    }
}

function validateData() {
    const variables = {
        name: document.querySelector('#mascota'),
        date: document.querySelector('#fecha'),
        owner: document.querySelector('#propietario'),
        phone: document.querySelector('#telefono'),
        hour: document.querySelector('#hora'),
        symptoms: document.querySelector('#sintomas')
    };

    const errors = [];

    for (const key in variables) {
        if (variables[key].value === '') {
            errors.push(`The field ${key} is required`);
        }
    }

    if (errors.length === Object.keys(variables).length) {
        return ['All fields are required'];
    }

    if (!isValidHour(variables.hour.value)) {
        errors.push('The hour must be between 8:00-12:00 or 14:30-18:30');
    }

    return errors;
}

function isValidHour(hour) {
    const [hours, minutes] = hour.split(':').map(Number);
    const time = hours * 60 + minutes;

    const morningStart = 8 * 60;
    const morningEnd = 12 * 60;
    const afternoonStart = 14 * 60 + 30;
    const afternoonEnd = 18 * 60 + 30;

    return (time >= morningStart && time <= morningEnd) || 
           (time >= afternoonStart && time <= afternoonEnd);
}

function validatePhoneNumber(e) {
    const phone = e.target.value;
    e.target.value = phone.replace(/[^0-9]/g, '');
}

function createAppointment() {
    return {
        id: Date.now(),
        name: document.querySelector('#mascota').value,
        date: document.querySelector('#fecha').value,
        owner: document.querySelector('#propietario').value,
        phone: document.querySelector('#telefono').value,
        hour: document.querySelector('#hora').value,
        symptoms: document.querySelector('#sintomas').value
    };
}

function updateAppointment() {
    const updatedAppointment = {
        id: currentAppointmentId,
        name: document.querySelector('#mascota').value,
        date: document.querySelector('#fecha').value,
        owner: document.querySelector('#propietario').value,
        phone: document.querySelector('#telefono').value,
        hour: document.querySelector('#hora').value,
        symptoms: document.querySelector('#sintomas').value
    };

    appointments = appointments.map(appointment => 
        appointment.id === currentAppointmentId ? updatedAppointment : appointment
    );
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('alert', 'alert-danger', 'text-center');
    errorDiv.textContent = message;
    document.querySelector('.container').insertBefore(errorDiv, document.querySelector('#contenido'));
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.classList.add('alert', 'alert-success', 'text-center');
    successDiv.textContent = message;
    document.querySelector('.container').insertBefore(successDiv, document.querySelector('#contenido'));

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function clearMessages() {
    const messages = document.querySelectorAll('.alert');
    messages.forEach(message => message.remove());
}

function renderAppointments() {
    appointmentsContainer.innerHTML = '';
    appointments.forEach(appointment => {
        const appointmentDiv = document.createElement('div');
        appointmentDiv.classList.add('appointment', 'p-3');
        appointmentDiv.innerHTML = `
            <h2 class="card-title font-weight-bolder">${appointment.name}</h2>
            <p><span class="font-weight-bolder">Owner: </span> ${appointment.owner}</p>
            <p><span class="font-weight-bolder">Phone: </span> ${appointment.phone}</p>
            <p><span class="font-weight-bolder">Date: </span> ${appointment.date}</p>
            <p><span class="font-weight-bolder">Hour: </span> ${appointment.hour}</p>
            <p><span class="font-weight-bolder">Symptoms: </span> ${appointment.symptoms}</p>
            <button class="btn btn-danger" onclick="deleteAppointment(${appointment.id})">Delete</button>
            <button class="btn btn-warning" onclick="editAppointment(${appointment.id})">Edit</button>
        `;
        appointmentsContainer.appendChild(appointmentDiv);
    });
}

function deleteAppointment(id) {
    appointments = appointments.filter(appointment => appointment.id !== id);
    renderAppointments();
    showSuccess('Appointment deleted successfully');
}

function editAppointment(id) {
    const appointment = appointments.find(appointment => appointment.id === id);
    document.querySelector('#mascota').value = appointment.name;
    document.querySelector('#fecha').value = appointment.date;
    document.querySelector('#propietario').value = appointment.owner;
    document.querySelector('#telefono').value = appointment.phone;
    document.querySelector('#hora').value = appointment.hour;
    document.querySelector('#sintomas').value = appointment.symptoms;

    editing = true;
    currentAppointmentId = id;
    submitButton.textContent = 'Save Changes';
}