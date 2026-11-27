// FinanzaPro - Lógica Principal con Gestor y Simulador de Deudas

// Categorías predefinidas
const CATEGORIES = {
  gasto: [
    { id: 'alimentacion', name: 'Alimentación', icon: '🛒', color: '#f97316' },
    { id: 'vivienda', name: 'Vivienda y Servicios', icon: '🏠', color: '#06b6d4' },
    { id: 'transporte', name: 'Transporte', icon: '🚗', color: '#3b82f6' },
    { id: 'deudas', name: 'Pago de Deudas / Créditos', icon: '💳', color: '#ef4444' },
    { id: 'ocio', name: 'Ocio y Entretenimiento', icon: '🍿', color: '#a855f7' },
    { id: 'salud', name: 'Salud y Cuidado', icon: '💊', color: '#ec4899' },
    { id: 'compras', name: 'Ropa y Compras', icon: '🛍️', color: '#eab308' },
    { id: 'educacion', name: 'Educación', icon: '📚', color: '#14b8a6' },
    { id: 'otros_gastos', name: 'Otros Gastos', icon: '📦', color: '#64748b' }
  ],
  ingreso: [
    { id: 'salario', name: 'Salario / Sueldo', icon: '💼', color: '#10b981' },
    { id: 'freelance', name: 'Freelance / Negocio', icon: '💻', color: '#3b82f6' },
    { id: 'inversiones', name: 'Inversiones / Rendimientos', icon: '📈', color: '#8b5cf6' },
    { id: 'otros_ingresos', name: 'Otros Ingresos', icon: '🎁', color: '#f59e0b' }
  ]
};

// Monedas soportadas
const CURRENCIES = {
  USD: { symbol: '$', code: 'USD', locale: 'en-US' },
  EUR: { symbol: '€', code: 'EUR', locale: 'es-ES' },
  MXN: { symbol: '$', code: 'MXN', locale: 'es-MX' },
  COP: { symbol: '$', code: 'COP', locale: 'es-CO' },
  ARS: { symbol: '$', code: 'ARS', locale: 'es-AR' },
  CLP: { symbol: '$', code: 'CLP', locale: 'es-CL' }
};

// Datos de demostración iniciales: Movimientos
const DEFAULT_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'ingreso',
    amount: 2800,
    category: 'Salario / Sueldo',
    description: 'Salario mensual Nómina',
    method: 'Transferencia',
    date: '2026-11-01'
  },
  {
    id: 'tx-2',
    type: 'ingreso',
    amount: 450,
    category: 'Freelance / Negocio',
    description: 'Proyecto diseño web cliente',
    method: 'Transferencia',
    date: '2026-11-12'
  },
  {
    id: 'tx-3',
    type: 'gasto',
    amount: 750,
    category: 'Vivienda y Servicios',
    description: 'Alquiler departamento',
    method: 'Transferencia',
    date: '2026-11-02'
  },
  {
    id: 'tx-4',
    type: 'gasto',
    amount: 320,
    category: 'Alimentación',
    description: 'Supermercado quincenal',
    method: 'Tarjeta de Débito',
    date: '2026-11-08'
  },
  {
    id: 'tx-5',
    type: 'gasto',
    amount: 120,
    category: 'Pago de Deudas / Créditos',
    description: 'Cuota Tarjeta Visa',
    method: 'Transferencia',
    date: '2026-11-15'
  },
  {
    id: 'tx-6',
    type: 'gasto',
    amount: 95,
    category: 'Transporte',
    description: 'Combustible y peajes',
    method: 'Tarjeta de Crédito',
    date: '2026-11-18'
  },
  {
    id: 'tx-7',
    type: 'gasto',
    amount: 60,
    category: 'Salud y Cuidado',
    description: 'Farmacia y vitaminas',
    method: 'Efectivo',
    date: '2026-11-20'
  }
];

const DEFAULT_BUDGETS = {
  'Alimentación': 500,
  'Vivienda y Servicios': 850,
  'Transporte': 180,
  'Pago de Deudas / Créditos': 350,
  'Ocio y Entretenimiento': 150,
  'Salud y Cuidado': 120
};

const DEFAULT_GOALS = [
  {
    id: 'goal-1',
    title: 'Fondo de Emergencia',
    target: 4000,
    current: 2600,
    icon: '🛡️',
    deadline: '2026-12-31'
  },
  {
    id: 'goal-2',
    title: 'Viaje a la Playa',
    target: 1200,
    current: 850,
    icon: '✈️',
    deadline: '2026-12-15'
  }
];

// Datos de demostración iniciales: Deudas Activas
const DEFAULT_DEBTS = [
  {
    id: 'debt-1',
    title: 'Tarjeta Visa Oro',
    total: 3200,
    balance: 1850,
    monthlyMin: 120,
    rate: 24.5,
    dueDay: 15,
    icon: '💳'
  },
  {
    id: 'debt-2',
    title: 'Préstamo Personal Banco',
    total: 6000,
    balance: 3900,
    monthlyMin: 210,
    rate: 14.0,
    dueDay: 5,
    icon: '🤝'
  },
  {
    id: 'debt-3',
    title: 'Computadora Portátil (12 cuotas)',
    total: 1200,
    balance: 400,
    monthlyMin: 100,
    rate: 0,
    dueDay: 20,
    icon: '🛍️'
  }
];

// Estado global de la aplicación
let state = {
  transactions: JSON.parse(localStorage.getItem('fp_transactions')) || DEFAULT_TRANSACTIONS,
  budgets: JSON.parse(localStorage.getItem('fp_budgets')) || DEFAULT_BUDGETS,
  goals: JSON.parse(localStorage.getItem('fp_goals')) || DEFAULT_GOALS,
  debts: JSON.parse(localStorage.getItem('fp_debts')) || DEFAULT_DEBTS,
  currency: localStorage.getItem('fp_currency') || 'USD',
  hideBalance: localStorage.getItem('fp_hide_balance') === 'true',
  activeTab: 'resumen',
  debtSubTab: 'list' // 'list' o 'simulator'
};

// Instancias de Chart.js
let categoryChartInstance = null;
let trendChartInstance = null;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupCurrency();
  setupCategoryOptions('gasto');
  setupBudgetCategoryOptions();
  setupEventListeners();
  setupSimulatorControls();
  renderApp();
  updateDebtSimulator();

  // Fecha de hoy por defecto para movimiento
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('tx-date');
  if (dateInput) dateInput.value = today;
});

// Guardar en LocalStorage
function saveState() {
  localStorage.setItem('fp_transactions', JSON.stringify(state.transactions));
  localStorage.setItem('fp_budgets', JSON.stringify(state.budgets));
  localStorage.setItem('fp_goals', JSON.stringify(state.goals));
  localStorage.setItem('fp_debts', JSON.stringify(state.debts));
  localStorage.setItem('fp_currency', state.currency);
  localStorage.setItem('fp_hide_balance', state.hideBalance);
}

// Configuración de Tema (Dark / Light)
function setupTheme() {
  const savedTheme = localStorage.getItem('fp_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('fp_theme', isDark ? 'dark' : 'light');
      updateChartsTheme();
    });
  }
}

// Configuración de Moneda
function setupCurrency() {
  const currencySelect = document.getElementById('currency-select');
  if (currencySelect) {
    currencySelect.value = state.currency;
    currencySelect.addEventListener('change', (e) => {
      state.currency = e.target.value;
      saveState();
      updateCurrencySymbols();
      renderApp();
      updateDebtSimulator();
      showToast(`Moneda cambiada a ${state.currency}`);
    });
  }
  updateCurrencySymbols();
}

function updateCurrencySymbols() {
  const symbol = CURRENCIES[state.currency]?.symbol || '$';
  document.querySelectorAll('.currency-symbol').forEach(el => {
    el.textContent = symbol;
  });
}

// Formateador de moneda
function formatMoney(amount, showSign = false) {
  if (state.hideBalance) return '••••••';
  const curr = CURRENCIES[state.currency] || CURRENCIES.USD;
  const formatted = new Intl.NumberFormat(curr.locale, {
    style: 'currency',
    currency: curr.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(amount));

  if (showSign) {
    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  }
  return amount < 0 ? `-${formatted}` : formatted;
}

// Ocultar / Mostrar Saldo
const eyeBtn = document.getElementById('toggle-balance-visibility');
if (eyeBtn) {
  eyeBtn.addEventListener('click', () => {
    state.hideBalance = !state.hideBalance;
    saveState();
    renderBalance();
    renderDebts();
    const icon = document.getElementById('eye-icon');
    if (icon) {
      icon.setAttribute('data-lucide', state.hideBalance ? 'eye-off' : 'eye');
      lucide.createIcons();
    }
  });
}

// Configuración de listeners
function setupEventListeners() {
  const searchInput = document.getElementById('tx-search');
  const typeFilter = document.getElementById('tx-type-filter');
  const catFilter = document.getElementById('tx-category-filter');

  if (searchInput) searchInput.addEventListener('input', renderTransactionsList);
  if (typeFilter) typeFilter.addEventListener('change', renderTransactionsList);
  if (catFilter) catFilter.addEventListener('change', renderTransactionsList);
}

// Cambio de Pestañas Principales
function switchTab(tabId) {
  state.activeTab = tabId;

  const sections = ['resumen', 'movimientos', 'deudas', 'presupuestos', 'metas'];
  sections.forEach(sec => {
    const el = document.getElementById(`view-${sec}`);
    if (el) {
      if (sec === tabId) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });

  // Botones Escritorio
  document.querySelectorAll('.nav-tab').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
      btn.classList.remove('text-slate-600', 'dark:text-slate-300');
    } else {
      btn.classList.remove('active');
      btn.classList.add('text-slate-600', 'dark:text-slate-300');
    }
  });

  // Botones Móvil
  document.querySelectorAll('.mobile-tab').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
      btn.classList.remove('text-slate-500', 'dark:text-slate-400');
    } else {
      btn.classList.remove('active');
      btn.classList.add('text-slate-500', 'dark:text-slate-400');
    }
  });

  if (tabId === 'resumen') {
    setTimeout(() => {
      if (categoryChartInstance) categoryChartInstance.resize();
      if (trendChartInstance) trendChartInstance.resize();
    }, 50);
  }

  if (tabId === 'deudas') {
    renderDebts();
    updateDebtSimulator();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cambio de Sub-pestaña de Deudas (Lista vs Simulador)
function switchDebtSubTab(subTab) {
  state.debtSubTab = subTab;
  const listEl = document.getElementById('subview-debts-list');
  const simEl = document.getElementById('subview-debts-simulator');
  const listBtn = document.getElementById('subtab-debts-list-btn');
  const simBtn = document.getElementById('subtab-debts-sim-btn');

  if (subTab === 'list') {
    if (listEl) listEl.classList.remove('hidden');
    if (simEl) simEl.classList.add('hidden');

    listBtn.className = 'flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm flex items-center justify-center gap-2';
    simBtn.className = 'flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-2';
    renderDebts();
  } else {
    if (listEl) listEl.classList.add('hidden');
    if (simEl) simEl.classList.remove('hidden');

    simBtn.className = 'flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm flex items-center justify-center gap-2';
    listBtn.className = 'flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-2';
    updateDebtSimulator();
  }
  lucide.createIcons();
}

// Renderizado General
function renderApp() {
  renderBalance();
  renderCharts();
  renderRecentTransactions();
  renderTransactionsList();
  renderBudgets();
  renderGoals();
  renderDebts();
  lucide.createIcons();
}

// 1. Balance y Métricas del Dashboard
function renderBalance() {
  let totalIncome = 0;
  let totalExpenses = 0;

  state.transactions.forEach(t => {
    if (t.type === 'ingreso') {
      totalIncome += t.amount;
    } else {
      totalExpenses += t.amount;
    }
  });

  const netBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  const totalBalEl = document.getElementById('total-balance');
  const totalIncEl = document.getElementById('total-income');
  const totalExpEl = document.getElementById('total-expenses');
  const savingsRateEl = document.getElementById('savings-rate');

  if (totalBalEl) totalBalEl.textContent = formatMoney(netBalance);
  if (totalIncEl) totalIncEl.textContent = formatMoney(totalIncome, true);
  if (totalExpEl) totalExpEl.textContent = `-${formatMoney(totalExpenses)}`;
  if (savingsRateEl) {
    savingsRateEl.textContent = state.hideBalance ? '••••' : `${Math.max(savingsRate, 0)}%`;
  }
}

// 2. Transacciones Recientes (Dashboard)
function renderRecentTransactions() {
  const container = document.getElementById('recent-transactions-list');
  if (!container) return;

  const sorted = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recent = sorted.slice(0, 5);

  if (recent.length === 0) {
    container.innerHTML = `
      <div class="py-8 text-center text-slate-400 text-sm">
        <i data-lucide="receipt" class="w-8 h-8 mx-auto mb-2 opacity-40"></i>
        No tienes transacciones registradas aún.
      </div>
    `;
    return;
  }

  container.innerHTML = recent.map(tx => createTransactionRowHTML(tx)).join('');
}

// 3. Lista Completa de Transacciones
function renderTransactionsList() {
  const container = document.getElementById('full-transactions-list');
  if (!container) return;

  const query = (document.getElementById('tx-search')?.value || '').toLowerCase().trim();
  const typeFilter = document.getElementById('tx-type-filter')?.value || 'all';
  const catFilter = document.getElementById('tx-category-filter')?.value || 'all';

  let filtered = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (typeFilter !== 'all') {
    filtered = filtered.filter(tx => tx.type === typeFilter);
  }

  if (catFilter !== 'all') {
    filtered = filtered.filter(tx => tx.category === catFilter);
  }

  if (query) {
    filtered = filtered.filter(tx => 
      tx.description.toLowerCase().includes(query) ||
      tx.category.toLowerCase().includes(query) ||
      (tx.method && tx.method.toLowerCase().includes(query))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-400 text-sm">
        <i data-lucide="search-x" class="w-10 h-10 mx-auto mb-2 opacity-40"></i>
        No se encontraron movimientos con los filtros seleccionados.
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(tx => createTransactionRowHTML(tx, true)).join('');
  lucide.createIcons();
}

// Fila HTML de Transacción
function createTransactionRowHTML(tx, showDelete = true) {
  const isIncome = tx.type === 'ingreso';
  const sign = isIncome ? '+' : '-';
  const colorClass = isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white';
  const bgClass = isIncome ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400';
  
  let iconEmoji = isIncome ? '💰' : '🏷️';
  const allCats = [...CATEGORIES.gasto, ...CATEGORIES.ingreso];
  const catObj = allCats.find(c => c.name.toLowerCase() === tx.category.toLowerCase());
  if (catObj) iconEmoji = catObj.icon;

  const formattedDate = new Date(tx.date + 'T00:00:00').toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return `
    <div class="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl ${bgClass} flex items-center justify-center text-base flex-shrink-0">
          <span>${iconEmoji}</span>
        </div>
        <div>
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100">${escapeHTML(tx.description)}</h4>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-[11px] font-medium text-slate-500 dark:text-slate-400">${escapeHTML(tx.category)}</span>
            <span class="text-[10px] text-slate-300 dark:text-slate-600">•</span>
            <span class="text-[11px] text-slate-400">${formattedDate}</span>
            ${tx.method ? `
              <span class="hidden sm:inline-block text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                ${escapeHTML(tx.method)}
              </span>
            ` : ''}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-right">
          <span class="text-sm font-extrabold ${colorClass}">
            ${sign}${formatMoney(tx.amount)}
          </span>
        </div>
        ${showDelete ? `
          <button onclick="deleteTransaction('${tx.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors" title="Eliminar">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

// 4. CONTROL DE DEUDAS (NUEVO)
function renderDebts() {
  const container = document.getElementById('debts-cards-grid');
  let totalPendingDebt = 0;
  let totalInitialDebt = 0;
  let totalMonthlyPayment = 0;

  state.debts.forEach(d => {
    totalPendingDebt += d.balance;
    totalInitialDebt += d.total;
    totalMonthlyPayment += (d.monthlyMin || 0);
  });

  const totalPaidDebt = Math.max(totalInitialDebt - totalPendingDebt, 0);
  const paidPct = totalInitialDebt > 0 ? Math.round((totalPaidDebt / totalInitialDebt) * 100) : 0;

  // Actualizar métricas superiores en vista de Deudas
  const metricTotalEl = document.getElementById('debt-metric-total');
  const metricCountEl = document.getElementById('debt-metric-count');
  const metricMonthlyEl = document.getElementById('debt-metric-monthly');
  const metricPaidEl = document.getElementById('debt-metric-paid');
  const metricPaidPctEl = document.getElementById('debt-metric-paid-pct');

  if (metricTotalEl) metricTotalEl.textContent = formatMoney(totalPendingDebt);
  if (metricCountEl) metricCountEl.textContent = `${state.debts.length} ${state.debts.length === 1 ? 'deuda registrada' : 'deudas registradas'}`;
  if (metricMonthlyEl) metricMonthlyEl.textContent = formatMoney(totalMonthlyPayment);
  if (metricPaidEl) metricPaidEl.textContent = formatMoney(totalPaidDebt);
  if (metricPaidPctEl) metricPaidPctEl.textContent = `Progreso de liquidación: ${paidPct}%`;

  // Actualizar tarjeta en Resumen Principal
  const dashDebtTotalEl = document.getElementById('dash-debt-total');
  const dashDebtStatusEl = document.getElementById('dash-debt-status-text');
  if (dashDebtTotalEl) dashDebtTotalEl.textContent = formatMoney(totalPendingDebt);
  if (dashDebtStatusEl) {
    if (state.debts.length > 0) {
      dashDebtStatusEl.textContent = `Tienes ${state.debts.length} deudas activas por un saldo total de ${formatMoney(totalPendingDebt)}.`;
    } else {
      dashDebtStatusEl.textContent = `No tienes deudas pendientes. ¡Excelente salud financiera!`;
    }
  }

  if (!container) return;

  if (state.debts.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400">
        <i data-lucide="shield-check" class="w-12 h-12 mx-auto mb-2 text-emerald-500 opacity-80"></i>
        <h4 class="font-bold text-slate-700 dark:text-slate-200">¡Libre de deudas!</h4>
        <p class="text-xs text-slate-400 mt-1">No tienes deudas activas registradas en este momento.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.debts.map(debt => {
    const paidAmount = Math.max(debt.total - debt.balance, 0);
    const progress = Math.min(Math.round((paidAmount / debt.total) * 100), 100);
    const isPaidOff = debt.balance <= 0;

    return `
      <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border ${isPaidOff ? 'border-emerald-500/50 dark:border-emerald-500/50' : 'border-slate-200 dark:border-slate-800'} shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
        ${isPaidOff ? `
          <div class="absolute -right-7 top-4 bg-emerald-500 text-white text-[10px] font-extrabold uppercase py-0.5 px-8 rotate-45 shadow">
            ¡Pagada!
          </div>
        ` : ''}

        <div>
          <!-- Cabecera de la deuda -->
          <div class="flex items-start justify-between gap-2 mb-3">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-xl flex-shrink-0">
                <span>${debt.icon || '💳'}</span>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">${escapeHTML(debt.title)}</h4>
                <div class="flex items-center gap-2 mt-0.5">
                  ${debt.rate > 0 ? `
                    <span class="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">
                      ${debt.rate}% interés anual
                    </span>
                  ` : `
                    <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      0% interés
                    </span>
                  `}
                  ${debt.dueDay ? `<span class="text-[11px] text-slate-400">Día ${debt.dueDay}</span>` : ''}
                </div>
              </div>
            </div>
            <button onclick="deleteDebt('${debt.id}')" class="text-slate-300 hover:text-rose-500 p-1" title="Eliminar deuda">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Saldos -->
          <div class="flex items-baseline justify-between mb-1.5">
            <div>
              <span class="text-xs text-slate-400 block">Saldo pendiente</span>
              <span class="text-2xl font-extrabold text-slate-900 dark:text-white">${formatMoney(debt.balance)}</span>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-400 block">Total inicial</span>
              <span class="text-xs font-semibold text-slate-500">${formatMoney(debt.total)}</span>
            </div>
          </div>

          <!-- Barra de Progreso de Amortización -->
          <div class="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" style="width: ${progress}%"></div>
          </div>
          <div class="flex justify-between items-center text-[11px] mt-1.5 font-semibold">
            <span class="text-emerald-600 dark:text-emerald-400">${progress}% amortizado</span>
            <span class="text-slate-400">Pagado: ${formatMoney(paidAmount)}</span>
          </div>

          <!-- Cuota mensual comprometida -->
          ${debt.monthlyMin > 0 ? `
            <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span class="text-slate-500 dark:text-slate-400">Cuota mínima sugerida:</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">${formatMoney(debt.monthlyMin)} / mes</span>
            </div>
          ` : ''}
        </div>

        <!-- Botón Abonar -->
        <div class="pt-2">
          ${isPaidOff ? `
            <div class="w-full py-2.5 rounded-2xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-center flex items-center justify-center gap-1.5">
              <i data-lucide="check-circle" class="w-4 h-4"></i>
              <span>Deuda totalmente liquidada</span>
            </div>
          ` : `
            <button onclick="openDebtPaymentModal('${debt.id}', '${escapeHTML(debt.title)}', ${debt.balance})" class="w-full py-2.5 rounded-2xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/20 transition-colors flex items-center justify-center gap-1.5">
              <i data-lucide="credit-card" class="w-4 h-4"></i>
              <span>Abonar a esta deuda</span>
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

// 5. SIMULADOR DE PRÉSTAMOS / AMORTIZACIÓN (NUEVO)
let currentSimResults = null;

function setupSimulatorControls() {
  const amountRange = document.getElementById('sim-amount-range');
  const amountInput = document.getElementById('sim-amount-input');
  const rateRange = document.getElementById('sim-rate-range');
  const rateInput = document.getElementById('sim-rate-input');
  const monthsRange = document.getElementById('sim-months-range');
  const extraInput = document.getElementById('sim-extra-input');

  if (amountRange && amountInput) {
    amountRange.addEventListener('input', (e) => {
      amountInput.value = e.target.value;
      updateDebtSimulator();
    });
    amountInput.addEventListener('input', (e) => {
      amountRange.value = e.target.value;
      updateDebtSimulator();
    });
  }

  if (rateRange && rateInput) {
    rateRange.addEventListener('input', (e) => {
      rateInput.value = e.target.value;
      updateDebtSimulator();
    });
    rateInput.addEventListener('input', (e) => {
      rateRange.value = e.target.value;
      updateDebtSimulator();
    });
  }

  if (monthsRange) {
    monthsRange.addEventListener('input', () => {
      updateDebtSimulator();
    });
  }

  if (extraInput) {
    extraInput.addEventListener('input', () => {
      updateDebtSimulator();
    });
  }
}

function setSimMonths(months) {
  const monthsRange = document.getElementById('sim-months-range');
  if (monthsRange) {
    monthsRange.value = months;
    updateDebtSimulator();
  }
}

function updateDebtSimulator() {
  const principal = parseFloat(document.getElementById('sim-amount-input')?.value) || 5000;
  const annualRate = parseFloat(document.getElementById('sim-rate-input')?.value) || 14;
  const months = parseInt(document.getElementById('sim-months-range')?.value) || 24;
  const extraPayment = parseFloat(document.getElementById('sim-extra-input')?.value) || 0;

  // Actualizar textos de etiquetas
  const amountDisp = document.getElementById('sim-amount-display');
  const rateDisp = document.getElementById('sim-rate-display');
  const monthsDisp = document.getElementById('sim-months-display');
  const extraDisp = document.getElementById('sim-extra-display');

  if (amountDisp) amountDisp.textContent = formatMoney(principal);
  if (rateDisp) rateDisp.textContent = `${annualRate.toFixed(1)}%`;
  if (monthsDisp) {
    const years = (months / 12).toFixed(1).replace('.0', '');
    monthsDisp.textContent = `${months} meses (${years} ${years === '1' ? 'año' : 'años'})`;
  }
  if (extraDisp) extraDisp.textContent = `+${formatMoney(extraPayment)}/mes`;

  // Cálculo Matemático de Amortización (Cuota Fija / Sistema Francés)
  const monthlyRate = (annualRate / 100) / 12;
  let standardMonthlyPayment = 0;

  if (monthlyRate === 0) {
    standardMonthlyPayment = principal / months;
  } else {
    standardMonthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  const standardTotalCost = standardMonthlyPayment * months;
  const standardTotalInterest = standardTotalCost - principal;

  // Simulación con aporte extra mensual
  let simulatedBalance = principal;
  let simulatedTotalInterest = 0;
  let simulatedMonths = 0;
  const schedule = [];

  while (simulatedBalance > 0.01 && simulatedMonths < 600) {
    simulatedMonths++;
    const interestForMonth = simulatedBalance * monthlyRate;
    let paymentForMonth = standardMonthlyPayment + extraPayment;
    let principalForMonth = paymentForMonth - interestForMonth;

    if (simulatedBalance + interestForMonth < paymentForMonth) {
      paymentForMonth = simulatedBalance + interestForMonth;
      principalForMonth = simulatedBalance;
      simulatedBalance = 0;
    } else {
      simulatedBalance -= principalForMonth;
    }

    simulatedTotalInterest += interestForMonth;

    schedule.push({
      month: simulatedMonths,
      payment: paymentForMonth,
      principal: principalForMonth,
      interest: interestForMonth,
      remaining: Math.max(simulatedBalance, 0)
    });
  }

  // Guardar en variable global para modal de guardado
  currentSimResults = {
    principal,
    annualRate,
    months,
    standardMonthlyPayment,
    standardTotalInterest,
    standardTotalCost
  };

  // Actualizar UI de Resultados
  const resPaymentEl = document.getElementById('sim-result-payment');
  const resPrincipalEl = document.getElementById('sim-result-principal');
  const resInterestEl = document.getElementById('sim-result-interest');
  const resTotalEl = document.getElementById('sim-result-total');
  const ratioBar = document.getElementById('sim-ratio-bar');
  const ratioText = document.getElementById('sim-result-ratio');

  if (resPaymentEl) resPaymentEl.textContent = formatMoney(standardMonthlyPayment);
  if (resPrincipalEl) resPrincipalEl.textContent = formatMoney(principal);
  if (resInterestEl) resInterestEl.textContent = `+${formatMoney(standardTotalInterest)}`;
  if (resTotalEl) resTotalEl.textContent = formatMoney(standardTotalCost);

  if (ratioBar && ratioText) {
    const capitalPct = Math.round((principal / standardTotalCost) * 100);
    const interestPct = 100 - capitalPct;
    ratioBar.style.width = `${capitalPct}%`;
    ratioText.textContent = `${capitalPct}% Capital • ${interestPct}% Interés`;
  }

  // Tarjeta de Ahorro con Pago Extra
  const savingsCard = document.getElementById('sim-extra-savings-card');
  const savingsText = document.getElementById('sim-extra-savings-text');

  if (savingsCard && savingsText) {
    if (extraPayment > 0 && simulatedMonths < months) {
      const monthsSaved = months - simulatedMonths;
      const interestSaved = Math.max(standardTotalInterest - simulatedTotalInterest, 0);
      savingsCard.classList.remove('hidden');
      savingsText.innerHTML = `
        ¡Pagarás tu préstamo <strong>${monthsSaved} meses antes</strong> y te ahorrarás <strong>${formatMoney(interestSaved)}</strong> en intereses!
      `;
    } else {
      savingsCard.classList.add('hidden');
    }
  }

  // Rellenar tabla de cronograma
  renderAmortizationTable(schedule);
}

function renderAmortizationTable(schedule) {
  const tbody = document.getElementById('amortization-tbody');
  if (!tbody) return;

  tbody.innerHTML = schedule.map(row => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td class="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">Mes ${row.month}</td>
      <td class="py-2 px-3 font-bold">${formatMoney(row.payment)}</td>
      <td class="py-2 px-3 text-emerald-600 dark:text-emerald-400">${formatMoney(row.principal)}</td>
      <td class="py-2 px-3 text-rose-500">${formatMoney(row.interest)}</td>
      <td class="py-2 px-3 text-right font-semibold">${formatMoney(row.remaining)}</td>
    </tr>
  `).join('');
}

function toggleAmortizationTable() {
  const container = document.getElementById('amortization-table-container');
  const icon = document.getElementById('icon-toggle-amort');
  const btn = document.getElementById('btn-toggle-amort-table');
  if (!container) return;

  const isHidden = container.classList.contains('hidden');
  if (isHidden) {
    container.classList.remove('hidden');
    if (btn) btn.querySelector('span').textContent = 'Ocultar tabla';
    if (icon) icon.setAttribute('data-lucide', 'chevron-up');
  } else {
    container.classList.add('hidden');
    if (btn) btn.querySelector('span').textContent = 'Ver tabla completa';
    if (icon) icon.setAttribute('data-lucide', 'chevron-down');
  }
  lucide.createIcons();
}

// Convertir simulación en deuda activa
function saveSimulatedDebtToActive() {
  if (!currentSimResults) return;

  const name = prompt('Ingresa un nombre para esta deuda:', 'Préstamo Simulado');
  if (!name) return;

  const newDebt = {
    id: 'debt-' + Date.now(),
    title: name.trim(),
    total: currentSimResults.principal,
    balance: currentSimResults.principal,
    monthlyMin: Math.round(currentSimResults.standardMonthlyPayment),
    rate: currentSimResults.annualRate,
    dueDay: 15,
    icon: '🤝'
  };

  state.debts.push(newDebt);
  saveState();
  renderDebts();
  switchDebtSubTab('list');
  showToast(`¡Deuda "${newDebt.title}" guardada en seguimiento!`);
}

// 6. Presupuestos
function renderBudgets() {
  const container = document.getElementById('budget-cards-grid');
  if (!container) return;

  let totalBudget = 0;
  let totalSpentInBudget = 0;

  const categorySpending = {};
  state.transactions.forEach(t => {
    if (t.type === 'gasto') {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    }
  });

  const budgetEntries = Object.entries(state.budgets);

  if (budgetEntries.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400">
        <i data-lucide="pie-chart" class="w-10 h-10 mx-auto mb-2 opacity-40"></i>
        No tienes presupuestos activos. ¡Crea uno para empezar a ahorrar!
      </div>
    `;
  } else {
    container.innerHTML = budgetEntries.map(([catName, limit]) => {
      totalBudget += limit;
      const spent = categorySpending[catName] || 0;
      totalSpentInBudget += spent;

      const percentage = Math.round((spent / limit) * 100);
      const remaining = limit - spent;

      let barColor = 'bg-emerald-500';
      let statusBadge = `<span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">En orden</span>`;

      if (percentage >= 100) {
        barColor = 'bg-rose-500';
        statusBadge = `<span class="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">Excedido</span>`;
      } else if (percentage >= 80) {
        barColor = 'bg-amber-500';
        statusBadge = `<span class="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">Cerca del límite</span>`;
      }

      const catObj = CATEGORIES.gasto.find(c => c.name === catName);
      const icon = catObj ? catObj.icon : '🏷️';

      return `
        <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-xl">${icon}</span>
              <h4 class="font-bold text-slate-800 dark:text-white text-sm sm:text-base">${escapeHTML(catName)}</h4>
            </div>
            ${statusBadge}
          </div>

          <div class="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div class="${barColor} h-full rounded-full transition-all duration-500" style="width: ${Math.min(percentage, 100)}%"></div>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <div>
              <span class="font-bold text-slate-800 dark:text-slate-200">${formatMoney(spent)}</span>
              <span> de ${formatMoney(limit)}</span>
            </div>
            <div class="font-bold">
              ${remaining >= 0 ? `Restan: <span class="text-emerald-600 dark:text-emerald-400">${formatMoney(remaining)}</span>` : `<span class="text-rose-600 dark:text-rose-400">Exceso: ${formatMoney(Math.abs(remaining))}</span>`}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  const totalSpentEl = document.getElementById('budget-summary-spent');
  const totalLimitEl = document.getElementById('budget-summary-total');
  const totalPercentEl = document.getElementById('budget-summary-percent');
  const totalBarEl = document.getElementById('budget-summary-bar');

  if (totalSpentEl) totalSpentEl.textContent = `${formatMoney(totalSpentInBudget)} gastados`;
  if (totalLimitEl) totalLimitEl.textContent = `de un presupuesto total de ${formatMoney(totalBudget)}`;
  
  const overallPercent = totalBudget > 0 ? Math.round((totalSpentInBudget / totalBudget) * 100) : 0;
  if (totalPercentEl) totalPercentEl.textContent = `${overallPercent}%`;
  if (totalBarEl) totalBarEl.style.width = `${Math.min(overallPercent, 100)}%`;
}

// 7. Metas de Ahorro
function renderGoals() {
  const container = document.getElementById('goals-cards-grid');
  if (!container) return;

  if (state.goals.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400">
        <i data-lucide="target" class="w-10 h-10 mx-auto mb-2 opacity-40"></i>
        No tienes metas de ahorro registradas. ¡Crea una para dar el primer paso!
      </div>
    `;
    return;
  }

  container.innerHTML = state.goals.map(goal => {
    const percentage = Math.min(Math.round((goal.current / goal.target) * 100), 100);
    const isCompleted = goal.current >= goal.target;

    return `
      <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border ${isCompleted ? 'border-emerald-500/60 dark:border-emerald-500/60 shadow-emerald-500/10' : 'border-slate-200 dark:border-slate-800'} shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
        ${isCompleted ? `
          <div class="absolute -right-7 top-4 bg-emerald-500 text-white text-[10px] font-extrabold uppercase py-0.5 px-8 rotate-45 shadow">
            ¡Completado!
          </div>
        ` : ''}

        <div>
          <div class="flex items-start justify-between gap-2 mb-3">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-2xl">
                <span>${goal.icon || '🎯'}</span>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 dark:text-white text-base leading-snug">${escapeHTML(goal.title)}</h4>
                <p class="text-xs text-slate-400">${goal.deadline ? `Fecha meta: ${goal.deadline}` : 'Sin fecha límite'}</p>
              </div>
            </div>
            <button onclick="deleteGoal('${goal.id}')" class="text-slate-300 hover:text-rose-500 p-1" title="Eliminar meta">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>

          <div class="flex items-baseline justify-between mb-1.5">
            <span class="text-2xl font-extrabold text-slate-900 dark:text-white">${formatMoney(goal.current)}</span>
            <span class="text-xs font-semibold text-slate-500">de ${formatMoney(goal.target)}</span>
          </div>

          <div class="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
          </div>
          <div class="flex justify-between items-center text-xs mt-1.5 font-semibold">
            <span class="text-emerald-600 dark:text-emerald-400">${percentage}% conseguido</span>
            <span class="text-slate-400">${formatMoney(Math.max(goal.target - goal.current, 0))} restantes</span>
          </div>
        </div>

        <button onclick="openDepositModal('${goal.id}', '${escapeHTML(goal.title)}')" class="w-full py-2.5 rounded-2xl text-xs font-bold ${isCompleted ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20'} transition-colors flex items-center justify-center gap-1.5">
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>${isCompleted ? 'Aportar más' : 'Aportar a esta meta'}</span>
        </button>
      </div>
    `;
  }).join('');
}

// 8. Gráficos Interactivos (Chart.js)
function renderCharts() {
  renderCategoryChart();
  renderTrendChart();
}

function renderCategoryChart() {
  const canvas = document.getElementById('categoryChart');
  const noDataEl = document.getElementById('no-category-data');
  if (!canvas) return;

  const expenseCategories = {};
  state.transactions.forEach(t => {
    if (t.type === 'gasto') {
      expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
    }
  });

  const labels = Object.keys(expenseCategories);
  const data = Object.values(expenseCategories);

  if (labels.length === 0) {
    canvas.classList.add('hidden');
    if (noDataEl) noDataEl.classList.remove('hidden');
    if (categoryChartInstance) categoryChartInstance.destroy();
    return;
  }

  canvas.classList.remove('hidden');
  if (noDataEl) noDataEl.classList.add('hidden');

  const backgroundColors = labels.map(label => {
    const found = CATEGORIES.gasto.find(c => c.name === label);
    return found ? found.color : '#94a3b8';
  });

  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  const isDark = document.documentElement.classList.contains('dark');

  categoryChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColors,
        borderWidth: 2,
        borderColor: isDark ? '#0f172a' : '#ffffff',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 14,
            color: isDark ? '#cbd5e1' : '#475569',
            font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw || 0;
              return ` ${context.label}: ${formatMoney(value)}`;
            }
          }
        }
      },
      cutout: '68%'
    }
  });
}

function renderTrendChart() {
  const canvas = document.getElementById('monthlyTrendChart');
  if (!canvas) return;

  const months = ['Septiembre', 'Octubre', 'Noviembre'];
  const incomeData = [2400, 2600, 3250];
  const expenseData = [1600, 1850, 1420];

  let currentMonthIncome = 0;
  let currentMonthExpense = 0;
  state.transactions.forEach(t => {
    if (t.type === 'ingreso') currentMonthIncome += t.amount;
    else currentMonthExpense += t.amount;
  });
  incomeData[2] = currentMonthIncome;
  expenseData[2] = currentMonthExpense;

  if (trendChartInstance) {
    trendChartInstance.destroy();
  }

  const isDark = document.documentElement.classList.contains('dark');

  trendChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Ingresos',
          data: incomeData,
          backgroundColor: '#10b981',
          borderRadius: 8,
          barPercentage: 0.6
        },
        {
          label: 'Gastos',
          data: expenseData,
          backgroundColor: '#f43f5e',
          borderRadius: 8,
          barPercentage: 0.6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${formatMoney(context.raw)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: isDark ? '#94a3b8' : '#64748b',
            font: { family: 'Plus Jakarta Sans', size: 11 }
          }
        },
        y: {
          grid: {
            color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            color: isDark ? '#94a3b8' : '#64748b',
            font: { family: 'Plus Jakarta Sans', size: 11 },
            callback: function(value) {
              return CURRENCIES[state.currency]?.symbol + value;
            }
          }
        }
      }
    }
  });
}

function updateChartsTheme() {
  if (categoryChartInstance) renderCategoryChart();
  if (trendChartInstance) renderTrendChart();
}

// 9. Manejo de Modales
function openModal(modalId, forcedType = null) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  if (modalId === 'transaction-modal' && forcedType) {
    setTransactionType(forcedType);
  }
  lucide.createIcons();
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('fixed') && e.target.classList.contains('backdrop-blur-sm')) {
    e.target.classList.add('hidden');
    e.target.classList.remove('flex');
  }
});

// Tipos de Transacción
function setTransactionType(type) {
  document.getElementById('tx-type').value = type;
  const btnGasto = document.getElementById('btn-type-gasto');
  const btnIngreso = document.getElementById('btn-type-ingreso');
  const modalTitle = document.getElementById('tx-modal-title');

  if (type === 'gasto') {
    btnGasto.className = 'py-2 rounded-xl text-sm font-bold transition-all bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm';
    btnIngreso.className = 'py-2 rounded-xl text-sm font-bold transition-all text-slate-600 dark:text-slate-400';
    if (modalTitle) modalTitle.textContent = 'Nuevo Gasto';
  } else {
    btnIngreso.className = 'py-2 rounded-xl text-sm font-bold transition-all bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm';
    btnGasto.className = 'py-2 rounded-xl text-sm font-bold transition-all text-slate-600 dark:text-slate-400';
    if (modalTitle) modalTitle.textContent = 'Nuevo Ingreso';
  }

  setupCategoryOptions(type);
}

function setupCategoryOptions(type) {
  const catSelect = document.getElementById('tx-category');
  if (!catSelect) return;

  const cats = CATEGORIES[type] || [];
  catSelect.innerHTML = cats.map(c => `
    <option value="${c.name}">${c.icon} ${c.name}</option>
  `).join('');

  const txCatFilter = document.getElementById('tx-category-filter');
  if (txCatFilter) {
    const all = [...CATEGORIES.gasto, ...CATEGORIES.ingreso];
    const unique = [...new Set(all.map(c => c.name))];
    txCatFilter.innerHTML = '<option value="all">Todas las categorías</option>' + unique.map(name => `
      <option value="${name}">${name}</option>
    `).join('');
  }
}

function setupBudgetCategoryOptions() {
  const budgetSelect = document.getElementById('budget-category');
  if (!budgetSelect) return;

  budgetSelect.innerHTML = CATEGORIES.gasto.map(c => `
    <option value="${c.name}">${c.icon} ${c.name}</option>
  `).join('');
}

// Envío de Formulario: Transacción
function handleTransactionSubmit(e) {
  e.preventDefault();
  const type = document.getElementById('tx-type').value;
  const amount = parseFloat(document.getElementById('tx-amount').value);
  const category = document.getElementById('tx-category').value;
  const description = document.getElementById('tx-description').value.trim();
  const method = document.getElementById('tx-method').value;
  const date = document.getElementById('tx-date').value;

  if (isNaN(amount) || amount <= 0) {
    alert('Ingresa un monto válido mayor a 0');
    return;
  }

  const newTx = {
    id: 'tx-' + Date.now(),
    type,
    amount,
    category,
    description,
    method,
    date
  };

  state.transactions.unshift(newTx);
  saveState();
  renderApp();
  closeModal('transaction-modal');
  document.getElementById('transaction-form').reset();
  showToast(type === 'gasto' ? 'Gasto registrado con éxito' : 'Ingreso registrado con éxito');
}

// Envío de Formulario: Deuda Nueva
function handleDebtSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('debt-title').value.trim();
  const total = parseFloat(document.getElementById('debt-total').value);
  const balance = parseFloat(document.getElementById('debt-balance').value);
  const monthlyMin = parseFloat(document.getElementById('debt-monthly-min').value) || 0;
  const rate = parseFloat(document.getElementById('debt-rate').value) || 0;
  const dueDay = parseInt(document.getElementById('debt-due-day').value) || null;
  const icon = document.getElementById('debt-icon').value;

  if (isNaN(total) || total <= 0) {
    alert('Ingresa un monto inicial válido');
    return;
  }

  const newDebt = {
    id: 'debt-' + Date.now(),
    title,
    total,
    balance: isNaN(balance) ? total : balance,
    monthlyMin,
    rate,
    dueDay,
    icon
  };

  state.debts.push(newDebt);
  saveState();
  renderDebts();
  closeModal('debt-modal');
  document.getElementById('debt-form').reset();
  showToast(`Deuda "${title}" agregada al control`);
}

// Modal de Abono a Deuda
function openDebtPaymentModal(debtId, title, currentBalance) {
  document.getElementById('debt-pay-id').value = debtId;
  document.getElementById('debt-pay-title').textContent = `${title} (Saldo pendiente: ${formatMoney(currentBalance)})`;
  document.getElementById('debt-pay-amount').value = '';
  document.getElementById('debt-pay-amount').max = currentBalance;
  openModal('debt-payment-modal');
}

// Procesar Pago / Abono a Deuda
function handleDebtPaymentSubmit(e) {
  e.preventDefault();
  const debtId = document.getElementById('debt-pay-id').value;
  const amount = parseFloat(document.getElementById('debt-pay-amount').value);
  const createTx = document.getElementById('debt-pay-create-tx').checked;

  if (isNaN(amount) || amount <= 0) {
    alert('Ingresa un monto de pago válido');
    return;
  }

  const debt = state.debts.find(d => d.id === debtId);
  if (!debt) return;

  debt.balance = Math.max(debt.balance - amount, 0);
  const isNowPaidOff = debt.balance === 0;

  // Registrar como movimiento de gasto si se seleccionó
  if (createTx) {
    const today = new Date().toISOString().split('T')[0];
    state.transactions.unshift({
      id: 'tx-' + Date.now(),
      type: 'gasto',
      amount,
      category: 'Pago de Deudas / Créditos',
      description: `Abono a ${debt.title}`,
      method: 'Transferencia',
      date: today
    });
  }

  saveState();
  renderApp();
  closeModal('debt-payment-modal');
  showToast(`¡Abono de ${formatMoney(amount)} aplicado a ${debt.title}!`);

  if (isNowPaidOff && typeof confetti === 'function') {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  }
}

// Eliminar Deuda
function deleteDebt(id) {
  if (confirm('¿Deseas eliminar este registro de deuda?')) {
    state.debts = state.debts.filter(d => d.id !== id);
    saveState();
    renderDebts();
    showToast('Deuda eliminada del control');
  }
}

// Envío de Formulario: Presupuesto
function handleBudgetSubmit(e) {
  e.preventDefault();
  const category = document.getElementById('budget-category').value;
  const amount = parseFloat(document.getElementById('budget-amount').value);

  if (isNaN(amount) || amount <= 0) {
    alert('Ingresa un monto límite válido mayor a 0');
    return;
  }

  state.budgets[category] = amount;
  saveState();
  renderBudgets();
  closeModal('budget-modal');
  document.getElementById('budget-form').reset();
  showToast(`Presupuesto para ${category} actualizado`);
}

// Envío de Formulario: Meta de Ahorro
function handleGoalSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('goal-title').value.trim();
  const target = parseFloat(document.getElementById('goal-target').value);
  const current = parseFloat(document.getElementById('goal-current').value) || 0;
  const icon = document.getElementById('goal-icon').value;
  const deadline = document.getElementById('goal-deadline').value;

  if (isNaN(target) || target <= 0) {
    alert('Ingresa una meta objetivo válida mayor a 0');
    return;
  }

  const newGoal = {
    id: 'goal-' + Date.now(),
    title,
    target,
    current,
    icon,
    deadline
  };

  state.goals.push(newGoal);
  saveState();
  renderGoals();
  closeModal('goal-modal');
  document.getElementById('goal-form').reset();
  showToast(`Meta "${title}" creada con éxito`);
}

// Modal de Depósito para Meta
function openDepositModal(goalId, title) {
  document.getElementById('deposit-goal-id').value = goalId;
  document.getElementById('deposit-goal-title').textContent = title;
  document.getElementById('deposit-amount').value = '';
  openModal('deposit-modal');
}

function handleDepositSubmit(e) {
  e.preventDefault();
  const goalId = document.getElementById('deposit-goal-id').value;
  const amount = parseFloat(document.getElementById('deposit-amount').value);

  if (isNaN(amount) || amount <= 0) {
    alert('Ingresa un monto de aporte válido');
    return;
  }

  const goal = state.goals.find(g => g.id === goalId);
  if (!goal) return;

  goal.current += amount;
  const completedNow = goal.current >= goal.target;

  saveState();
  renderGoals();
  closeModal('deposit-modal');
  showToast(`¡Aporte de ${formatMoney(amount)} registrado!`);

  if (completedNow && typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// Eliminar Transacción
function deleteTransaction(id) {
  if (confirm('¿Deseas eliminar este movimiento?')) {
    state.transactions = state.transactions.filter(t => t.id !== id);
    saveState();
    renderApp();
    showToast('Movimiento eliminado');
  }
}

// Eliminar Meta
function deleteGoal(id) {
  if (confirm('¿Deseas eliminar esta meta de ahorro?')) {
    state.goals = state.goals.filter(g => g.id !== id);
    saveState();
    renderGoals();
    showToast('Meta eliminada');
  }
}

// Exportar a CSV
function exportToCSV() {
  if (state.transactions.length === 0) {
    alert('No hay movimientos para exportar');
    return;
  }

  const headers = ['ID', 'Tipo', 'Monto', 'Categoría', 'Descripción', 'Método de Pago', 'Fecha'];
  const rows = state.transactions.map(t => [
    t.id,
    t.type,
    t.amount,
    `"${t.category}"`,
    `"${t.description.replace(/"/g, '""')}"`,
    `"${t.method || ''}"`,
    t.date
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `FinanzaPro_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Archivo CSV descargado');
}

// Toast Notificaciones
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('translate-y-[-150%]', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-[-150%]', 'opacity-0');
  }, 2500);
}

// Escape de cadenas contra XSS
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
