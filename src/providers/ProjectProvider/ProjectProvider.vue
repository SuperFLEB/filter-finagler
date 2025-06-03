<script setup lang="ts">
import {onMounted, onUnmounted, provide, ref, triggerRef} from "vue";
import k from "./keys.ts";
import type {
	FilterElement,
	ProjectModel,
} from "@/ProjectModel/ProjectModel.ts";
import defaultProject from "@/defaultProject.ts";
import {toSVGDoc} from "@/ProjectModel/export.ts";
import {xmlNotate} from "@/ProjectModel/xmlNotate.ts";
import {add, connect, disconnect, remove, update} from "@/ProjectModel/manipulate.ts";
import {fromMFXMLDocument} from "@/ProjectModel/load.ts";
import type {FilterDef} from "@/MFilter/types.ts";
import feConnectionStatus, {type FEConnectionStatus} from "@/ProjectModel/validate.ts";

const project = ref<ProjectModel>(defaultProject);
const connectedNodes = ref<FEConnectionStatus>(feConnectionStatus(project.value, "filter"));

type ExportFormat = "svg" | "ff.svg" | "ff.xml";

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
	export(format: ExportFormat): XMLDocument {
		// svg and ff.svg has the original SVG. ff.xml does not.
		const svgDocument = format === "ff.xml" ? undefined : toSVGDoc(project.value, "filter", connectedNodes.value);
		// svg does not have XML notated, so return the svgDocument
		if (format === "svg") return svgDocument!;
		// ff.xml and ff.svg are notated
		return xmlNotate(project.value, "filter", svgDocument, connectedNodes.value);
	},
	toSvg(includeMFMeta: boolean = false): XMLDocument {
		return toSVGDoc(project.value, "filter", connectedNodes.value, includeMFMeta);
	},
	connect(outInstanceId: string, outputName: string, inInstanceId: string, inputName: string) {
		connect(project.value, "filter", outputName, outInstanceId, inputName, inInstanceId);
		connectedNodes.value = feConnectionStatus(project.value, "filter");
		triggerRef(project);
	},
	disconnect(inInstanceId: string, inputName: string) {
		disconnect(project.value, "filter", inputName, inInstanceId);
		connectedNodes.value = feConnectionStatus(project.value, "filter");
		triggerRef(project);
	},
	remove(fe: FilterElement) {
		remove(project.value, "filter", fe.instanceId);
		connectedNodes.value = feConnectionStatus(project.value, "filter");
		triggerRef(project);
	},
	add(filterDef: FilterDef, position: { x: number, y: number }) {
		add(project.value, "filter", filterDef, position);
		connectedNodes.value = feConnectionStatus(project.value, "filter");
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
provide(k.CONNECTED, connectedNodes);

</script>

<template>
	<slot/>
</template>
