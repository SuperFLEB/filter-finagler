import { createApp } from 'vue'
import App from './components/App.vue'
import registerInterpreters from "./mFilters.ts";

registerInterpreters();
createApp(App).mount('#app')
