import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.tsx";
import { router } from "./routers/index.ts";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount("#app");
