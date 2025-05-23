<script setup lang="ts">
import {onMounted, onUnmounted, provide, ref, triggerRef} from "vue";
import k from "./keys.ts";
import type {ProjectModel} from "@/Project/ProjectModel.ts";

import sampleDocument from "@/sampleDocument.ts";
import {toSVGDoc} from "@/Project/export.ts";
import {xmlNotation} from "@/Project/xmlNotation.ts";
import {connect, disconnect} from "@/Project/manipulate.ts";

const project = ref<ProjectModel>(sampleDocument);

const intf = {
	takeSnapshot() {
	},
	getSnapshot(): string | null {
		return null;
	},
	updateText(svgText: string) {
		svgText;
	},
	import(svgDocument: XMLDocument) {
		svgDocument;
	},
	export(): XMLDocument {
		return xmlNotation(project.value, "filter");
	},
	toSvg(includeMFMeta: boolean = false): XMLDocument {
		return toSVGDoc(project.value, "filter", includeMFMeta);
	},
	connect(outInstanceId: string, outputName: string, inInstanceId: string, inputName: string) {
		connect(project.value, "filter", outInstanceId, outputName, inInstanceId, inputName);
		triggerRef(project);
	},
	disconnect(inInstanceId: string, inputName: string) {
		disconnect(project.value, "filter", inInstanceId, inputName);
		triggerRef(project);
	}
};
export type ProjectModelInterface = typeof intf;
export type {ProjectModel};

// const snapshot = location.hash.includes("reset") ? null : intf.getSnapshot();

onMounted(() => {
	window.addEventListener("unload", intf.takeSnapshot);
});

onUnmounted(() => window.removeEventListener("unload", intf.takeSnapshot));

provide(k.INTERFACE, intf);
provide(k.PROJECT, project);
</script>

<template>
	<slot/>
</template>
