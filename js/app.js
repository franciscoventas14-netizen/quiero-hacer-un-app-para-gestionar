// FinanzaPro - Lógica Principal de la Aplicación

// Categorías predefinidas
const CATEGORIES = {
  gasto: [
    { id: 'alimentacion', name: 'Alimentación', icon: '🛒', color: '#f97316' },
    { id: 'vivienda', name: 'Vivienda y Servicios', icon: '🏠', color: '#06b6d4' },
    { id: 'transporte', name: 'Transporte', icon: '🚗', color: '#3b82f6' },
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

// Datos de demostración iniciales
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
    description: 'Supermercado semanal',
    method: 'Tarjeta de Débito',
    date: '2026-11-08'
  },
  {
    id: 'tx-5',
    type: 'gasto',
    amount: 95,
    category: 'Transporte',
    description: 'Carga de combustible y peajes',
    method: 'Tarjeta de Crédito',
    date: '2026-11-15'
  },
  {
    id: 'tx-6',
    type: 'gasto',
    amount: 85,
    category: 'Ocio y Entretenimiento',
    description: 'Cena restaurante con amigos',
    method: 'Tarjeta de Débito',
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
  },
  {
    id: 'tx-8',
    type: 'gasto',
    amount: 110,
    category: 'Ropa y Compras',
    description: 'Zapatos deportivos',
    method: 'Tarjeta de Crédito',
    date: '2026-11-23'
  }
];

const DEFAULT_BUDGETS = {
  'Alimentación': 500,
  'Vivienda y Servicios': 850,
  'Transporte': 180,
  'Ocio y Entretenimiento': 150,
  'Ropa y Compras': 150,
  'Salud y Cuidado': 120
};

const DEFAULT_GOALS = [
  {
    id: 'goal-1',
    title: 'Fondo de Emergencia (3 meses)',
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
  },
  {
    id: 'goal-3',
    title: 'Nuevo Portátil de Trabajo',
    target: 1500,
    current: 1500,
    icon: '💻',
    deadline: '2026-11-30'
  }
];

// Estado de la aplicación
let state = {
  transactions: JSON.parse(localStorage.getItem('fp_transactions')) || DEFAULT_TRANSACTIONS,
  budgets: JSON.parse(localStorage.getItem('fp_budgets')) || DEFAULT_BUDGETS,
  goals: JSON.parse(localStorage.getItem('fp_goals')) || DEFAULT_GOALS,
  currency: localStorage.getItem('fp_currency') || 'USD',
  hideBalance: localStorage.getItem('fp_hide_balance') === 'true',
  activeTab: 'resumen'
};

// Variables para instancias de Chart.js
let categoryChartInstance = null;
let trendChartInstance = null;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupCurrency();
  setupCategoryOptions('gasto');
  setupBudgetCategoryOptions();
  setupEventListeners();
  renderApp();

  // Fecha por defecto hoy para nuevo movimiento
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('tx-date');
  if (dateInput) dateInput.value = today;
});

// Guardar en LocalStorage
function saveState() {
  localStorage.setItem('fp_transactions', JSON.stringify(state.transactions));
  localStorage.setItem('fp_budgets', JSON.stringify(state.budgets));
  localStorage.setItem('fp_goals', JSON.stringify(state.goals));
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
    const icon = document.getElementById('eye-icon');
    if (icon) {
      icon.setAttribute('data-lucide', state.hideBalance ? 'eye-off' : 'eye');
      lucide.createIcons();
    }
  });
}

// Configuración de listeners de eventos
function setupEventListeners() {
  // Filtros de transacciones
  const searchInput = document.getElementById('tx-search');
  const typeFilter = document.getElementById('tx-type-filter');
  const catFilter = document.getElementById('tx-category-filter');

  if (searchInput) searchInput.addEventListener('input', renderTransactionsList);
  if (typeFilter) typeFilter.addEventListener('change', renderTransactionsList);
  if (catFilter) catFilter.addEventListener('change', renderTransactionsList);
}

// Cambio de Pestañas
function switchTab(tabId) {
  state.activeTab = tabId;

  // Ocultar todas las secciones
  const sections = ['resumen', 'movimientos', 'presupuestos', 'metas'];
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

  // Actualizar botones de navegación escritorio
  document.querySelectorAll('.nav-tab').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
      btn.classList.remove('text-slate-600', 'dark:text-slate-300');
    } else {
      btn.classList.remove('active');
      btn.classList.add('text-slate-600', 'dark:text-slate-300');
    }
  });

  // Actualizar botones de navegación móvil
  document.querySelectorAll('.mobile-tab').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
      btn.classList.remove('text-slate-500', 'dark:text-slate-400');
    } else {
      btn.classList.remove('active');
      btn.classList.add('text-slate-500', 'dark:text-slate-400');
    }
  });

  // Si cambiamos a resumen, redimensionar gráficos
  if (tabId === 'resumen') {
    setTimeout(() => {
      if (categoryChartInstance) categoryChartInstance.resize();
      if (trendChartInstance) trendChartInstance.resize();
    }, 50);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Renderizado General
function renderApp() {
  renderBalance();
  renderCharts();
  renderRecentTransactions();
  renderTransactionsList();
  renderBudgets();
  renderGoals();
  lucide.createIcons();
}

// 1. Balance & Tarjeta Principal
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

// 3. Lista Completa de Transacciones con Filtros
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

// Generador HTML para una fila de transacción
function createTransactionRowHTML(tx, showDelete = true) {
  const isIncome = tx.type === 'ingreso';
  const sign = isIncome ? '+' : '-';
  const colorClass = isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white';
  const bgClass = isIncome ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400';
  
  // Buscar emoji según categoría
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

// 4. Presupuestos
function renderBudgets() {
  const container = document.getElementById('budget-cards-grid');
  if (!container) return;

  let totalBudget = 0;
  let totalSpentInBudget = 0;

  // Calcular gasto por categoría en el mes
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

      // Color según porcentaje
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

  // Actualizar Resumen general de presupuesto
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

// 5. Metas de Ahorro
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

          <!-- Montos -->
          <div class="flex items-baseline justify-between mb-1.5">
            <span class="text-2xl font-extrabold text-slate-900 dark:text-white">${formatMoney(goal.current)}</span>
            <span class="text-xs font-semibold text-slate-500">de ${formatMoney(goal.target)}</span>
          </div>

          <!-- Barra de Progreso -->
          <div class="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
          </div>
          <div class="flex justify-between items-center text-xs mt-1.5 font-semibold">
            <span class="text-emerald-600 dark:text-emerald-400">${percentage}% conseguido</span>
            <span class="text-slate-400">${formatMoney(Math.max(goal.target - goal.current, 0))} restantes</span>
          </div>
        </div>

        <!-- Botón Aportar -->
        <button onclick="openDepositModal('${goal.id}', '${escapeHTML(goal.title)}')" class="w-full py-2.5 rounded-2xl text-xs font-bold ${isCompleted ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20'} transition-colors flex items-center justify-center gap-1.5">
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>${isCompleted ? 'Aportar más' : 'Aportar a esta meta'}</span>
        </button>
      </div>
    `;
  }).join('');
}

// 6. Gráficos Interactivos (Chart.js)
function renderCharts() {
  renderCategoryChart();
  renderTrendChart();
}

function renderCategoryChart() {
  const canvas = document.getElementById('categoryChart');
  const noDataEl = document.getElementById('no-category-data');
  if (!canvas) return;

  // Agrupar gastos por categoría
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

  // Asignar colores según categoría
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

  // Calcular totales del mes actual dinámicamente
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

// 7. Manejo de Modales
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

// Cerrar modal al pulsar fuera del cuadro
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('fixed') && e.target.classList.contains('backdrop-blur-sm')) {
    e.target.classList.add('hidden');
    e.target.classList.remove('flex');
  }
});

// Tipo de Transacción (Gasto / Ingreso)
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

  // También sincronizar filtro de transacciones
  const txCatFilter = document.getElementById('tx-category-filter');
  if (txCatFilter && txCatFilter.children.length <= 1) {
    const all = [...CATEGORIES.gasto, ...CATEGORIES.ingreso];
    const unique = [...new Set(all.map(c => c.name))];
    unique.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      txCatFilter.appendChild(opt);
    });
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

// Abrir Modal de Depósito para Meta
function openDepositModal(goalId, title) {
  document.getElementById('deposit-goal-id').value = goalId;
  document.getElementById('deposit-goal-title').textContent = title;
  document.getElementById('deposit-amount').value = '';
  openModal('deposit-modal');
}

// Envío de Formulario: Aportar a Meta
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

  // Lanzar confeti si se completó la meta
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

// Notificación Toast
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

// Función auxiliar de escape contra XSS
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
