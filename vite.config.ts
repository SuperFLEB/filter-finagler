import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
	appType: 'mpa', // disable history fallback
	plugins: [vue()],
	build: {
		assetsInlineLimit: 0,
	},
	resolve: {
		alias: [
			{find: "@t", replacement: path.resolve(__dirname, "./src/types")},
			{find: "@", replacement: path.resolve(__dirname, "./src")},
		],
	}
});
