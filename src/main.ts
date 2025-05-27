import { createApp } from 'vue'
import App from './components/App.vue'
import registerMFilters from "./mFilters.ts";
import registerRequiredMFilters from "@/MFilters/required.ts";

registerMFilters();
registerRequiredMFilters();
createApp(App).mount('#app')
