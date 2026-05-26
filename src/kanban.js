let allUsers = [];

export async function loadDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Limpiar columnas
    const cols = {
        'todo': document.getElementById('col-todo'),
        'in progress': document.getElementById('col-inprogress'),
        'in review': document.getElementById('col-inreview'),
        'done': document.getElementById('col-done')
    };
    Object.values(cols).forEach(col => col.innerHTML = '');

    try {
        // Carga paralela de usuarios y tareas
        const [resUsers, resTasks] = await Promise.all([
            fetch('http://localhost:3000/users'),
            fetch('http://localhost:3000/tasks')
        ]);
        allUsers = await resUsers.json();
        const tasks = await resTasks.json();

        // Contadores
        const counts = { 'todo': 0, 'in progress': 0, 'in review': 0, 'done': 0 };

        tasks.forEach(task => {
            const assignedUser = allUsers.find(u => u.id == task.userId);
            const userName = assignedUser ? assignedUser.name : 'No Asignado';
            
            // Incrementar contadores si el estado es correcto
            if(counts[task.status] !== undefined) counts[task.status]++;

            // Generar Tarjeta de Tarea
            const card = document.createElement('div');
            card.className = `task-card bg-white border-l-4 ${task.status === 'in progress' ? 'border-l-primary' : 'border-l-outline-variant'} border border-outline-variant rounded-xl p-md shadow-sm cursor-pointer transition-all`;
            card.innerHTML = `
                <div class="flex justify-between items-center mb-xs">
                    <span class="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full text-label-sm uppercase font-bold">${task.status}</span>
                </div>
                <h4 class="font-label-md font-bold text-on-surface mb-xs">${task.title}</h4>
                <p class="font-body-sm text-on-surface-variant line-clamp-2">${task.description}</p>
                <div class="mt-md flex items-center justify-between border-t border-dashed border-outline-variant pt-2">
                    <span class="text-body-sm font-medium text-secondary">👤 ${userName}</span>
                </div>
            `;
            
            // Evento para abrir edición al hacer click
            card.addEventListener('click', () => openEditModal(task, currentUser));

            if (cols[task.status]) {
                cols[task.status].appendChild(card);
            }
        });

        // Actualizar contadores visuales
        document.getElementById('count-todo').textContent = counts['todo'];
        document.getElementById('count-inprogress').textContent = counts['in progress'];
        document.getElementById('count-inreview').textContent = counts['in review'];
        document.getElementById('count-done').textContent = counts['done'];

    } catch (error) {
        console.error("Error cargando el tablero:", error);
    }
}

export function setupDashboardEvents() {
    const btnNewTask = document.getElementById('btnNewTask');
    if (btnNewTask) {
        btnNewTask.addEventListener('click', openCreateModal);
    }
    
    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.hash = '#/login';
    });

    document.getElementById('taskForm').addEventListener('submit', handleFormSubmit);
}

function populateUsersDropdown(selectedId = '') {
    const select = document.getElementById('taskUser');
    select.innerHTML = allUsers.map(u => `<option value="${u.id}" ${u.id == selectedId ? 'selected' : ''}>${u.name} (${u.role})</option>`).join('');
}

function openCreateModal() {
    const modal = document.getElementById('taskModal');
    document.getElementById('modalTitle').textContent = 'Nueva Tarea';
    document.getElementById('taskId').value = '';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskTitle').disabled = false;
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDescription').disabled = false;
    document.getElementById('taskStatus').value = 'todo';
    document.getElementById('taskStatus').disabled = true; 
    document.getElementById('taskUser').disabled = false;
    
    populateUsersDropdown();
    modal.classList.remove('hidden');
}

function openEditModal(task, currentUser) {
    const modal = document.getElementById('taskModal');
    document.getElementById('modalTitle').textContent = 'Editar Tarea';
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskStatus').value = task.status;
    
    populateUsersDropdown(task.userId);
    modal.classList.remove('hidden');

    // REGLAS DE ROLES (HU-05 y HU-06)
    if (currentUser.role === 'admin') {
        document.getElementById('taskTitle').disabled = false;
        document.getElementById('taskDescription').disabled = false;
        document.getElementById('taskStatus').disabled = false;
        document.getElementById('taskUser').disabled = false;
    } else if (currentUser.role === 'coder') {
        if (task.userId != currentUser.id) {
            // HU-06: No puede editar tareas de otros usuarios
            alert('Acceso denegado: Como Coder solo puedes editar tus propias tareas asignadas.');
            modal.classList.add('hidden');
            return;
        }
        // HU-06: El coder SÓLO puede cambiar estado y descripción
        document.getElementById('taskTitle').disabled = true;
        document.getElementById('taskUser').disabled = true;
        document.getElementById('taskDescription').disabled = false;
        document.getElementById('taskStatus').disabled = false;
    }
}

window.closeModal = function() {
    document.getElementById('taskModal').classList.add('hidden');
};

async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const status = document.getElementById('taskStatus').value;
    const userId = document.getElementById('taskUser').value;

    const taskData = { title, description, status, userId: userId };

    try {
        if (id) {
            // EDICIÓN (PUT/PATCH): Si eres coder, mandamos un PATCH solo con lo permitido para no romper datos deshabilitados
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const method = 'PATCH';
            const bodyData = currentUser.role === 'coder' ? { description, status } : taskData;

            await fetch(`http://localhost:3000/tasks/${id}`, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });
        } else {
            // CREACIÓN (POST)
            taskData.status = 'todo'; // Forzar estado inicial HU-03
            await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });
        }
        closeModal();
        loadDashboard(); // Refresco reactivo sin recargar la web
    } catch (error) {
        alert('Error al guardar la tarea en la base de datos.');
    }
}