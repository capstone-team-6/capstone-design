import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.tsx";
import { HelloWorld } from "./components/HelloWorld.tsx";
import Measure from "./pages/Measure.tsx";
import "./style.css";

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HelloWorld },
    { path: "/measure", component: Measure },
  ],
});

app.use(router);
app.mount("#app");
