const STORAGE_KEY = 'controle-financeiro-pessoal:v1';
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });

const $ = (selector) => document.querySelector(selector);
const form = $('#transaction-form');
const initialBalanceInput = $('#initial-balance');
const list = $('#transaction-list');
const emptyState = $('#empty-state');
const message = $('#form-message');

function today() { return new Date().toISOString().slice(0, 10); }
function parseLegacyData() {
  try {
    const expenses = JSON.parse(localStorage.getItem('gastos') || '[]');
    const initialBalance = Number(localStorage.getItem('saldoInicial')) || 0;
    return { initialBalance, transactions: expenses.map((expense) => ({ id: crypto.randomUUID(), type: 'expense', description: expense.categoria || 'Despesa', category: expense.categoria || 'Outros', date: expense.data || today(), amount: Number(expense.valor) || 0 })) };
  } catch { return { initialBalance: 0, transactions: [] }; }
}
function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.transactions)) return saved;
  } catch { /* Dados corrompidos não impedem o uso do app. */ }
  return parseLegacyData();
}
let state = loadData();

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function formatDate(value) { return dateFormatter.format(new Date(`${value}T00:00:00Z`)); }
function totals() {
  const income = state.transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const expense = state.transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  return { income, expense, balance: state.initialBalance + income - expense };
}
function renderSummary() {
  const { income, expense, balance } = totals();
  $('#current-balance').textContent = currency.format(balance);
  $('#total-income').textContent = currency.format(income);
  $('#total-expense').textContent = currency.format(expense);
  $('#balance-description').textContent = balance < 0 ? 'Atenção: seu saldo está negativo.' : 'Saldo disponível para o período.';
}
function renderTransactions() {
  list.replaceChildren();
  const transactions = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date));
  emptyState.hidden = transactions.length > 0;
  transactions.forEach((transaction) => {
    const row = document.createElement('tr');
    const name = document.createElement('td');
    name.innerHTML = `<span class="transaction-name"></span><span class="transaction-type"></span>`;
    name.querySelector('.transaction-name').textContent = transaction.description;
    name.querySelector('.transaction-type').textContent = transaction.type === 'income' ? 'Receita' : 'Despesa';
    const category = document.createElement('td'); category.textContent = transaction.category;
    const date = document.createElement('td'); date.textContent = formatDate(transaction.date);
    const amount = document.createElement('td'); amount.className = `amount ${transaction.type}`; amount.textContent = `${transaction.type === 'income' ? '+' : '−'} ${currency.format(transaction.amount)}`;
    const action = document.createElement('td'); const button = document.createElement('button'); button.className = 'delete-button'; button.type = 'button'; button.textContent = 'Excluir'; button.dataset.id = transaction.id; button.setAttribute('aria-label', `Excluir ${transaction.description}`); action.append(button);
    row.append(name, category, date, amount, action); list.append(row);
  });
}
function render() { initialBalanceInput.value = state.initialBalance || ''; renderSummary(); renderTransactions(); save(); }

form.addEventListener('submit', (event) => {
  event.preventDefault(); message.textContent = '';
  const values = new FormData(form); const amount = Number(values.get('amount'));
  if (!Number.isFinite(amount) || amount <= 0) { message.textContent = 'Informe um valor maior que zero.'; return; }
  state.transactions.push({ id: crypto.randomUUID(), type: values.get('type'), description: values.get('description').trim(), category: values.get('category'), date: values.get('date'), amount });
  form.reset(); $('#transaction-date').value = today(); render();
});
initialBalanceInput.addEventListener('input', () => { state.initialBalance = Number(initialBalanceInput.value) || 0; renderSummary(); save(); });
list.addEventListener('click', (event) => { const button = event.target.closest('.delete-button'); if (!button) return; state.transactions = state.transactions.filter((item) => item.id !== button.dataset.id); render(); });
$('#clear-transactions').addEventListener('click', () => { if (!state.transactions.length || !window.confirm('Deseja excluir todos os lançamentos? Esta ação não pode ser desfeita.')) return; state.transactions = []; render(); });
$('#transaction-date').value = today(); render();
