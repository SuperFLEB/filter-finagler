import { createApp } from 'vue'
import App from './components/App.vue'
import registerInterpreters from "./interpreters.ts";

registerInterpreters();
createApp(App).mount('#app')
