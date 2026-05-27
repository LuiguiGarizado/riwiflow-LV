import { LoginView } from "./views/loginView.js";
import { DashboardView } from "./views/dashboardView.js";

export const AppSPA = {
    init() {
        // Run router when loading the app
        this.router();
    },

    router() {
        const container = document.getElementById("app");
        const user = this.getUserSession();

        // Route control based on local session (Route Guards)
        if (!user) {
            container.innerHTML = LoginView.render();
            LoginView.init();
        } else {
            container.innerHTML = DashboardView.render();
            DashboardView.init();
        }
    },

    setSession(user) {
        localStorage.setItem("riwiflow_session", JSON.stringify(user));
        this.router(); // Instant SPA transition without reloading
    },

    getUserSession() {
        return JSON.parse(localStorage.getItem("riwiflow_session"));
    },

    clearSession() {
        localStorage.removeItem("riwiflow_session");
        this.router(); // Clean return to login
    }
};

// Start the SPA automatically
document.addEventListener("DOMContentLoaded", () => AppSPA.init());