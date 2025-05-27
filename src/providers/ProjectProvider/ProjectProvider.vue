<script setup lang="ts">
import {onMounted, onUnmounted, provide, ref, triggerRef} from "vue";
import k from "./keys.ts";
import type {
	FilterElement,
	ProjectModel,
} from "@/Project/ProjectModel.ts";

import sampleDocument from "@/sampleDocument.ts";
import {toSVGDoc} from "@/Project/export.ts";
import {xmlNotate} from "@/Project/xmlNotate.ts";
import {connect, disconnect, remove, update} from "@/Project/manipulate.ts";
import {fromMFXMLDocument} from "@/Project/load.ts";

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
	load(svgDocument: XMLDocument) {
		const newProject = fromMFXMLDocument(svgDocument);
		project.value = newProject;
	},
	import(svgDocument: XMLDocument) {
		svgDocument;
	},
	export(): XMLDocument {
		return xmlNotate(project.value, "filter");
	},
	toSvg(includeMFMeta: boolean = false): XMLDocument {
		return toSVGDoc(project.value, "filter", includeMFMeta);
	},
	connect(outInstanceId: string, outputName: string, inInstanceId: string, inputName: string) {
		connect(project.value, "filter", outputName, outInstanceId, inputName, inInstanceId);
		triggerRef(project);
	},
	disconnect(inInstanceId: string, inputName: string) {
		disconnect(project.value, "filter", inputName, inInstanceId);
		triggerRef(project);
	},
	remove(fe: FilterElement) {
		remove(project.value, "filter", fe.instanceId);
		triggerRef(project);
	},
	reposition(fe: FilterElement, where: {x: number, y: number}) {
		update(project.value, "filter", fe.instanceId, {display: where});
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
