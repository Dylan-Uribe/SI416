// Selectors
const form = document.querySelector('#agregar-gasto');
const expensesList = document.querySelector('#gastos ul');
let budget;

// Budget Class
class Budget {
    constructor(budget) {
        this.budget = Number(budget);
        this.remaining = Number(budget);
        this.expenses = [];
    }

    addExpense(expense) {
        this.expenses = [...this.expenses, expense];
        this.calculateRemaining();
    }

    calculateRemaining() {
        const totalExpenses = this.expenses.reduce((total, expense) => total + expense.amount, 0);
        this.remaining = this.budget - totalExpenses;
    }

    removeExpense(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.calculateRemaining();
    }
}

// UI Class
class UI {
    insertBudget(amount) {
        const { budget, remaining } = amount;
        document.querySelector('#total').textContent = budget;
        document.querySelector('#restante').textContent = remaining;
    }

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('text-center', 'alert', type === 'error' ? 'alert-danger' : 'alert-success');
        alertDiv.textContent = message;
        document.querySelector('.contenido.primario').insertBefore(alertDiv, form);

        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    addExpenseToList(expense) {
        const { name, amount, id } = expense;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.dataset.id = id;

        li.innerHTML = `${name} <span class="badge badge-primary badge-pill">$${amount}</span>`;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-danger', 'borrar-gasto');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => {
            budget.removeExpense(id);
            li.remove();
            this.updateRemaining(budget.remaining);
            this.saveExpensesToLocalStorage();
        };

        li.appendChild(deleteBtn);
        expensesList.appendChild(li);
    }

    updateRemaining(remaining) {
        document.querySelector('#restante').textContent = remaining;
    }

    saveExpensesToLocalStorage() {
        localStorage.setItem('expenses', JSON.stringify(budget.expenses));
    }

    loadExpensesFromLocalStorage() {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.forEach(expense => {
            budget.addExpense(expense);
            this.addExpenseToList(expense);
        });
    }
}

// Initialize UI
const ui = new UI();
eventListeners();

// Event Listeners
function eventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
        askBudget();
        ui.loadExpensesFromLocalStorage();
    });
    form.addEventListener('submit', addExpense);
}

// Ask for Budget
function askBudget() {
    const userBudget = prompt('What is your budget?');
    if (isInvalidBudget(userBudget)) {
        window.location.reload();
    }

    budget = new Budget(userBudget);
    ui.insertBudget(budget);
}

// Validate Budget
function isInvalidBudget(userBudget) {
    return userBudget === '' || userBudget === null || isNaN(userBudget) || userBudget <= 0;
}

// Add Expense
function addExpense(e) {
    e.preventDefault();

    const expenseName = document.querySelector('#gasto').value;
    const expenseAmount = Number(document.querySelector('#cantidad').value);

    if (expenseName === '' || isNaN(expenseAmount) || expenseAmount <= 0) {
        ui.showAlert('Both fields are mandatory and amount must be a positive number', 'error');
        return;
    }

    if (expenseAmount > budget.remaining) {
        ui.showAlert('Amount exceeds remaining budget', 'error');
        return;
    }

    const expense = { name: expenseName, amount: expenseAmount, id: Date.now() };
    budget.addExpense(expense);

    ui.addExpenseToList(expense);
    ui.updateRemaining(budget.remaining);
    ui.saveExpensesToLocalStorage();

    form.reset();
}