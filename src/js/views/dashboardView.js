import { ApiService } from "../api.js";
import { AppSPA } from "../app.js";

export const DashboardView = {
    render() {
        const body = document.getElementById("body-layout");
        body.className = "bg-background text-on-background overflow-hidden h-screen flex";

        return `
        <aside class="hidden md:flex flex-col pt-md pb-xl gap-xs h-full bg-surface-container-low border-r border-outline-variant w-[280px] shrink-0">
          <div class="px-gutter mb-xl">
            <h1 class="font-headline-md text-headline-md font-bold text-primary">Riwiflow</h1>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Product Team</p>
          </div>
          <nav class="flex-1 space-y-1">
            <a class="flex items-center bg-primary-fixed text-on-primary-fixed-variant rounded-lg mx-2 px-4 py-3 font-body-sm text-body-sm transition-all scale-[0.98]" href="#"><span class="material-symbols-outlined mr-3" data-icon="dashboard">dashboard</span><span>Dashboard</span></a>
            <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all" href="#"><span class="material-symbols-outlined mr-3" data-icon="assignment">assignment</span><span>Projects</span></a>
            <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all" href="#"><span class="material-symbols-outlined mr-3" data-icon="group">group</span><span>Team</span></a>
            <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all" href="#"><span class="material-symbols-outlined mr-3" data-icon="bar_chart">bar_chart</span><span>Reports</span></a>
            <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all" href="#"><span class="material-symbols-outlined mr-3" data-icon="settings">settings</span><span>Settings</span></a>
          </nav>
          <div class="px-4 mt-auto">
            <button id="btn-create-task" class="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity">
              <span class="material-symbols-outlined" data-icon="add">add</span> New Task
            </button>
          </div>
        </aside>

        <main class="flex-1 flex flex-col min-w-0 h-full">
          <header class="flex justify-between items-center h-16 px-gutter w-full bg-surface border-b border-outline-variant z-40">
            <div class="flex items-center gap-4 flex-1">
              <div class="relative max-w-md w-full">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" data-icon="search">search</span>
                <input class="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant rounded-full font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Search tasks or files..." type="text" />
              </div>
            </div>
            <div class="flex items-center gap-4 ml-4">
              <button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors" data-icon="notifications">notifications</button>
              <button id="btn-logout" class="material-symbols-outlined text-on-surface-variant hover:bg-error-container p-2 rounded-full transition-colors" title="Log Out">logout</button>
              <img alt="User profile" id="user-avatar-profile" class="w-8 h-8 rounded-full border border-outline-variant object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2-sF_Qd9jEF33fUrS3vMvdoA8rbw2_a6jzv7r_6oDikCkrertidHwLgqAtWuKvLnRx7Lcsi79ZYj4FBaL_pETFxeyeF27_PhXy-KnuioiYgCwYTKcWDEuZoRksSf8Jb0_ZmsxJkpTFGZ2bW8aTl5fhcA4DOHQQal_vu1KVBcizoM56dHRc7Ce_vkUul2aL96DSeDmqR4YdfGUuoIQkUF_F8AX45U05tmCFg7YyPH6xtgAx7e31u5_5e2rQxm_tgBEgnhV-LsqsEDH" />
            </div>
          </header>

          <div class="flex-1 overflow-x-auto p-gutter custom-scrollbar h-[calc(100vh-64px)]">
            <div class="flex gap-gutter h-full">
              <div class="kanban-column flex flex-col w-1/4 h-full">
                <div class="flex items-center justify-between mb-md">
                  <div class="flex items-center gap-2">
                    <h3 class="font-title-sm text-title-sm text-on-surface">To Do</h3>
                    <span class="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm count-badge">0</span>
                  </div>
                </div>
                <div id="col-todo" class="flex-1 space-y-md p-2 bg-surface-container-low/50 rounded-xl overflow-y-auto custom-scrollbar dynamic-task-container"></div>
              </div>

              <div class="kanban-column flex flex-col w-1/4 h-full">
                <div class="flex items-center justify-between mb-md">
                  <div class="flex items-center gap-2">
                    <h3 class="font-title-sm text-title-sm text-on-surface">In Progress</h3>
                    <span class="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm count-badge">0</span>
                  </div>
                </div>
                <div id="col-inprogress" class="flex-1 space-y-md p-2 bg-surface-container-low/50 rounded-xl overflow-y-auto custom-scrollbar dynamic-task-container"></div>
              </div>

              <div class="kanban-column flex flex-col w-1/4 h-full">
                <div class="flex items-center justify-between mb-md">
                  <div class="flex items-center gap-2">
                    <h3 class="font-title-sm text-title-sm text-on-surface">In Review</h3>
                    <span class="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm count-badge">0</span>
                  </div>
                </div>
                <div id="col-inreview" class="flex-1 space-y-md p-2 bg-surface-container-low/50 rounded-xl overflow-y-auto custom-scrollbar dynamic-task-container"></div>
              </div>

              <div class="kanban-column flex flex-col w-1/4 h-full">
                <div class="flex items-center justify-between mb-md">
                  <div class="flex items-center gap-2">
                    <h3 class="font-title-sm text-title-sm text-on-surface">Done</h3>
                    <span class="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm count-badge">0</span>
                  </div>
                </div>
                <div id="col-done" class="flex-1 space-y-md p-2 bg-surface-container-low/50 rounded-xl overflow-y-auto custom-scrollbar dynamic-task-container"></div>
              </div>
            </div>
          </div>
        </main>
        <div id="modal-wrapper"></div>
        `;
    },

    async init() {
        const user = AppSPA.getUserSession();
        
        document.getElementById("btn-logout").addEventListener("click", () => AppSPA.clearSession());

        const createBtn = document.getElementById("btn-create-task");
        if (user.role !== "admin") {
            createBtn.style.display = "none";
        } else {
            createBtn.addEventListener("click", () => this.openCreateModal());
        }

        await this.loadBoardData();
    },

    async loadBoardData() {
        const tasks = await ApiService.getTasks();
        const users = await ApiService.getUsers();
        
        const containers = {
            "todo": document.getElementById("col-todo"),
            "in progress": document.getElementById("col-inprogress"),
            "in review": document.getElementById("col-inreview"),
            "done": document.getElementById("col-done")
        };

        Object.values(containers).forEach(c => c.innerHTML = "");
        const counts = { "todo": 0, "in progress": 0, "in review": 0, "done": 0 };

        tasks.forEach(task => {
            const statusKey = task.status.toLowerCase();
            const assigned = users.find(u => u.id === task.userId);
            const name = assigned ? assigned.name : "Unassigned";

            const card = document.createElement("div");
            card.className = "task-card bg-surface border border-outline-variant rounded-xl p-md shadow-sm cursor-grab";
            card.dataset.taskId = task.id;
            card.dataset.userId = task.userId;
            card.innerHTML = `
                <div class="flex items-start justify-between mb-xs">
                  <span class="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm uppercase text-[10px]">${task.status}</span>
                </div>
                <h4 class="font-label-md text-label-md text-on-surface mb-xs font-semibold">${task.title}</h4>
                <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${task.description}</p>
                <div class="mt-md flex items-center justify-between">
                  <span class="text-[12px] text-primary font-medium">👤 ${name}</span>
                </div>
            `;

            card.addEventListener("click", () => this.handleCardClick(task, users));

            if (containers[statusKey]) {
                containers[statusKey].appendChild(card);
                counts[statusKey]++;
            }
        });

        const badges = document.querySelectorAll(".count-badge");
        if(badges.length === 4) {
            badges[0].textContent = counts["todo"];
            badges[1].textContent = counts["in progress"];
            badges[2].textContent = counts["in review"];
            badges[3].textContent = counts["done"];
        }

        this.initDragAndDrop();
    },

    initDragAndDrop() {
        const user = AppSPA.getUserSession();

        const colStatusMap = {
            "col-todo": "todo",
            "col-inprogress": "in progress",
            "col-inreview": "in review",
            "col-done": "done"
        };

        document.querySelectorAll(".dynamic-task-container").forEach(col => {
            col.addEventListener("dragover", (e) => {
                e.preventDefault();
                col.classList.add("ring-2", "ring-primary", "ring-inset");
            });

            col.addEventListener("dragleave", () => {
                col.classList.remove("ring-2", "ring-primary", "ring-inset");
            });

            col.addEventListener("drop", async (e) => {
                e.preventDefault();
                col.classList.remove("ring-2", "ring-primary", "ring-inset");

                const taskId = e.dataTransfer.getData("taskId");
                const taskUserId = e.dataTransfer.getData("taskUserId");
                const newStatus = colStatusMap[col.id];

                // AJUSTE SEGURIDAD: Si es coder, sólo puede mover sus propias tareas
                if (user.role === "coder" && String(taskUserId) !== String(user.id)) {
                    alert("No tienes permisos para mover las tareas de otros coders.");
                    return;
                }

                await ApiService.updateTask(String(taskId), { status: newStatus });
                await this.loadBoardData();
            });
        });

        document.querySelectorAll(".task-card").forEach(card => {
            card.setAttribute("draggable", "true");

            card.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("taskId", card.dataset.taskId);
                e.dataTransfer.setData("taskUserId", card.dataset.userId);
                card.classList.add("opacity-50", "scale-95");
            });

            card.addEventListener("dragend", () => {
                card.classList.remove("opacity-50", "scale-95");
            });
        });
    },

    handleCardClick(task, users) {
        const user = AppSPA.getUserSession();

        if (user.role === "admin") {
            this.openEditModal(task, users, true, true);
        } else if (user.role === "coder") {
            if (String(task.userId) === String(user.id)) {
                this.openEditModal(task, users, true, true);
            } else {
                alert("No tienes permisos para modificar las tareas de otros coders.");
            }
        }
    },

    openEditModal(task, users, canEditAll, canEditStatusAndDesc) {
        const wrapper = document.getElementById("modal-wrapper");
        wrapper.innerHTML = `
          <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
            <div class="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl w-full max-w-[440px] space-y-md">
              <h3 class="text-title-sm font-bold text-primary">Edit Task</h3>
              <form id="modal-form" class="space-y-md">
                <input type="text" id="m-title" value="${task.title}" ${!canEditAll ? 'disabled class="opacity-50 bg-gray-100"' : ''} class="w-full border p-2 rounded" placeholder="Title" required/>
                <textarea id="m-desc" ${!canEditStatusAndDesc ? 'disabled' : ''} class="w-full border p-2 rounded" placeholder="Description" required>${task.description}</textarea>
                
                <select id="m-status" ${!canEditStatusAndDesc ? 'disabled' : ''} class="w-full border p-2 rounded">
                    <option value="todo" ${task.status === "todo" ? "selected" : ""}>Todo</option>
                    <option value="in progress" ${task.status === "in progress" ? "selected" : ""}>In Progress</option>
                    <option value="in review" ${task.status === "in review" ? "selected" : ""}>In Review</option>
                    <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
                </select>

                <select id="m-user" ${!canEditAll ? 'disabled class="opacity-50 bg-gray-100"' : ''} class="w-full border p-2 rounded">
                    ${users.map(u => `<option value="${u.id}" ${task.userId === u.id ? "selected" : ""}>${u.name} (${u.role})</option>`).join('')}
                </select>

                <div class="flex gap-2">
                    <button type="button" id="m-close" class="w-1/2 border p-2 rounded">Cancel</button>
                    <button type="submit" class="w-1/2 bg-primary text-on-primary p-2 rounded">Save</button>
                </div>
              </form>
            </div>
          </div>
        `;

        document.getElementById("m-close").addEventListener("click", () => wrapper.innerHTML = "");
        document.getElementById("modal-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // Si el input está deshabilitado, tomamos el valor original para evitar que mande vacíos o alterados
            const payload = {
                title: document.getElementById("m-title").value,
                description: document.getElementById("m-desc").value,
                status: document.getElementById("m-status").value,
                userId: String(document.getElementById("m-user").value)
            };
            
            if (await ApiService.updateTask(task.id, payload)) {
                wrapper.innerHTML = "";
                await this.loadBoardData();
            }
        });
    },

    openCreateModal() {
        ApiService.getUsers().then(users => {
            const wrapper = document.getElementById("modal-wrapper");
            wrapper.innerHTML = `
              <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
                <div class="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl w-full max-w-[440px] space-y-md">
                  <h3 class="text-title-sm font-bold text-primary">New Task</h3>
                  <form id="create-form" class="space-y-md">
                    <input type="text" id="c-title" class="w-full border p-2 rounded" placeholder="Task title" required/>
                    <textarea id="c-desc" class="w-full border p-2 rounded" placeholder="Description" required></textarea>
                    
                    <select id="c-user" class="w-full border p-2 rounded">
                        ${users.filter(u => u.role === "coder" || u.role === "admin").map(u => `<option value="${u.id}">${u.name} (${u.role})</option>`).join('')}
                    </select>

                    <div class="flex gap-2">
                        <button type="button" id="c-close" class="w-1/2 border p-2 rounded">Cancel</button>
                        <button type="submit" class="w-1/2 bg-primary text-on-primary p-2 rounded">Create</button>
                    </div>
                  </form>
                </div>
              </div>
            `;
            document.getElementById("c-close").addEventListener("click", () => wrapper.innerHTML = "");
            document.getElementById("create-form").addEventListener("submit", async (e) => {
                e.preventDefault();
                const payload = {
                    title: document.getElementById("c-title").value,
                    description: document.getElementById("c-desc").value,
                    status: "todo", 
                    userId: String(document.getElementById("c-user").value)
                };
                if (await ApiService.createTask(payload)) {
                    wrapper.innerHTML = "";
                    await this.loadBoardData();
                }
            });
        });
    }
};