import { handleLogin } from './auth.js';
import { loadDashboard, setupDashboardEvents } from './kanban.js';

const app = document.getElementById('app');

export function router() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const hash = window.location.hash;

    if (!user) {
        window.location.hash = '#/login';
        renderLogin();
    } else {
        if (hash === '#/dashboard' || hash === '' || hash === '#/login') {
            window.location.hash = '#/dashboard';
            renderDashboard(user);
        }
    }
}

function renderLogin() {
    app.innerHTML = `
    <main class="min-h-screen flex items-center justify-center px-gutter py-xxl flex-col relative overflow-hidden">
      <div class="w-full max-w-[440px] space-y-xl z-10">
        <div class="text-center space-y-md">
          <h1 class="font-headline-md text-headline-md font-bold text-primary tracking-tight">Riwiflow</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">Inicia sesión en tu espacio de trabajo profesional</p>
        </div>
        <div class="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl space-y-lg shadow-sm">
          <form class="space-y-lg" id="loginForm">
            <div id="loginError" class="hidden p-sm bg-error-container text-error rounded-lg font-body-sm text-center"></div>
            <div class="space-y-sm">
              <label class="font-label-md text-label-md text-on-surface" for="email">Dirección de Email</label>
              <input class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring" id="email" type="email" placeholder="name@company.com" required />
            </div>
            <div class="space-y-sm">
              <label class="font-label-md text-label-md text-on-surface" for="password">Contraseña</label>
              <input class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring" id="password" type="password" placeholder="••••••••" required />
            </div>
            <button class="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md py-md px-lg rounded-lg flex items-center justify-center gap-sm transition-all" type="submit">
              Ingresar <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>
        </div>
      </div>
      <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-fixed/20 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary-fixed/10 blur-[100px] rounded-full"></div>
      </div>
    </main>`;
    
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function renderDashboard(user) {
    app.className = "bg-background text-on-background overflow-hidden h-screen flex";
    app.innerHTML = `
    <aside class="hidden md:flex flex-col pt-md pb-xl gap-xs h-full bg-surface-container-low border-r border-outline-variant w-[280px] shrink-0">
      <div class="px-gutter mb-xl">
        <h1 class="font-headline-md text-headline-md font-bold text-primary">Riwiflow</h1>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Equipo de Desarrollo</p>
      </div>
      <nav class="flex-1 space-y-1">
        <a class="flex items-center bg-primary-fixed text-on-primary-fixed-variant rounded-lg mx-2 px-4 py-3 font-body-sm" href="#"><span class="material-symbols-outlined mr-3">dashboard</span>Tablero Kanban</a>
      </nav>
      <div class="px-4 mt-auto space-y-2">
        ${user.role === 'admin' ? `<button id="btnNewTask" class="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity"><span class="material-symbols-outlined">add</span>Nueva Tareas</button>` : ''}
        <button id="btnLogout" class="w-full border border-error text-error py-2 rounded-xl font-label-md flex items-center justify-center gap-2 hover:bg-error-container/20 transition-all"><span class="material-symbols-outlined">logout</span>Cerrar Sesión</button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col min-w-0 h-full">
      <header class="flex justify-between items-center h-16 px-gutter w-full bg-surface border-b border-outline-variant z-40">
        <div class="flex items-center gap-4 flex-1">
            <span class="font-title-sm text-on-surface-variant font-bold">Rol: ${user.role.toUpperCase()} | Usuario: ${user.name}</span>
        </div>
      </header>

      <div class="flex-1 overflow-x-auto p-gutter custom-scrollbar bg-surface-container/30">
        <div class="flex gap-gutter h-full pb-4">
          <div class="kanban-column flex flex-col w-1/4 h-full">
            <div class="flex items-center justify-between mb-md">
              <h3 class="font-title-sm font-bold text-on-surface">To Do</h3>
              <span id="count-todo" class="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full text-label-sm">0</span>
            </div>
            <div id="col-todo" class="flex-1 space-y-md p-2 bg-surface-container-low/50 rounded-xl overflow-y-auto custom-scrollbar"></div>
          </div>
          <div class="kanban-column flex flex-col w-1/4 h-full">
            <div class="flex items-center justify-between mb-md">
              <h3 class="font-title-sm font-bold text-on-surface">In Progress</h3>
              <span id="count-inprogress" class="bg-primary-container text-on-primary px-2 py-0.5 rounded-full text-label-sm">0</span>
            </div>
            <div id="col-inprogress" class="flex-1 space-y-md p-2 bg-surface-container-low/50 rounded-xl overflow-y-auto custom-scrollbar"></div>
          </div>
          <div class="kanban-column flex flex-col w-1/4 h-full">
            <div class="flex items-center justify-between mb-md">
              <h3 class="font-title-sm font-bold text-on-surface">In Review</h3>
              <span id="count-inreview" class="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full text-label-sm">0</span>
            </div>
            <div id="col-inreview" class="flex-1 space-y-md p-2 bg-surface-container-low/50 rounded-xl overflow-y-auto custom-scrollbar"></div>
          </div>
          <div class="kanban-column flex flex-col w-1/4 h-full">
            <div class="flex items-center justify-between mb-md">
              <h3 class="font-title-sm font-bold text-on-surface">Done</h3>
              <span id="count-done" class="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full text-label-sm">0</span>
            </div>
            <div id="col-done" class="flex-1 space-y-md p-2 bg-surface-container-low/50 rounded-xl overflow-y-auto custom-scrollbar"></div>
          </div>
        </div>
      </div>
    </main>`;

    loadDashboard();
    setupDashboardEvents();
}

// Escuchamos los cambios de hash para navegación asíncrona
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);