/// <reference types="vitest/config" />

import { defineConfig, mergeConfig } from 'vite';
import vue from "@vitejs/plugin-vue";
import * as path from "node:path";

// https://vite.dev/config/
const pluginsConfig = defineConfig({
	plugins: [vue()],
});

const config = {
	appType: "mpa", // disable history fallback
	build: {
		assetsInlineLimit: 0,
	},
	resolve: {
		alias: [
			{find: "@t", replacement: path.resolve(__dirname, "./src/types")},
			{find: "@", replacement: path.resolve(__dirname, "./src")},
		],
	},
	test: {
		projects: [
			{
				test: {
					name: "base",
					include: ["./tests/**/*.test.ts", "./tests/**/*.test.js"],
					environment: "jsdom",
					root: ".",
					alias: [
						{find: "@t", replacement: path.resolve(__dirname, "./src/types")},
						{find: "@", replacement: path.resolve(__dirname, "./src")},
					],
				}
			},
			{
				test: {
					name: "browser",
					root: ".",
					include: ["./tests/**/*.test.ts", "./tests/**/*.test.js"],
					alias: [
						{find: "@t", replacement: path.resolve(__dirname, "./src/types")},
						{find: "@", replacement: path.resolve(__dirname, "./src")},
					],
					browser: {
						enabled: true,
						provider: "playwright",
						// https://vitest.dev/guide/browser/playwright
						instances: [
							{browser: "chromium"},
							/*
														{browser: "firefox"},
							*/
						],
						include: ["./tests/**/*.test.ts", "./tests/**/*.test.js"],
					},
				}
			},
		],
	}
};

export default mergeConfig(pluginsConfig, config);
