import { createApp } from "vue";
import App from "./App.tsx";
import { router } from "./router/index.ts";
import "./style.css";

const app = createApp(App);

app.use(router);
app.mount("#app");
