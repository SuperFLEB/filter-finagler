/// <reference types="vitest/config" />
/// <reference types="vite/client" />

import versionPlugin from "@superfleb/vite-plugin-versioninfo/plugin";
import vue from "@vitejs/plugin-vue";
import * as path from "node:path";

const config = {
	plugins: [versionPlugin(), vue()],
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

export default config;
