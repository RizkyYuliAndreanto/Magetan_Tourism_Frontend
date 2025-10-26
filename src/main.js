import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routes";
import { initSessionManagement } from "./utils/auth.js";

// Initialize session management
initSessionManagement();

createApp(App).use(router).mount("#app");
