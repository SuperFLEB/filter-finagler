<script setup lang="ts">
import {onMounted, onUnmounted, provide, ref, triggerRef} from "vue";
import {Namespaces} from "@/constants.ts";
import k from "@/providers/SVGDocumentProvider/keys.ts";
import defaultSvg from "@/assets/default.svg?raw";

type SvgDocState = {
	text: string;
	document: XMLDocument;
}

export type DocumentProviderDocument = {
	name: string;
	valid: boolean;
	lastValidState: SvgDocState;
}

const intf = {
	takeSnapshot() {
		const snap = doc.value.lastValidState.text;
		window.sessionStorage.setItem(`DocumentProviderSnapshot`, snap);
		console.log("Stored", snap);
	},
	getSnapshot(): string | null {
		const snap = window.sessionStorage.getItem(`DocumentProviderSnapshot`);
		console.log("Retrieved", snap);
		return snap ?? null;
	},
	updateText(svgText: string) {
		if (doc.value.lastValidState.text === svgText) return;
		const newDoc = new DOMParser().parseFromString(svgText, "text/xml");
		if (!newDoc) {
			doc.value.valid = false;
			return;
		}
		doc.value.valid = true;
		doc.value.lastValidState.text = svgText;
		doc.value.lastValidState.document = newDoc;
	},
	updateXmlDocument(svgDoc: XMLDocument) {
		if (doc.value.lastValidState.document === svgDoc) return;
		const newText = new XMLSerializer().serializeToString(svgDoc);
		doc.value.valid = true;
		doc.value.lastValidState.text = newText;
		doc.value.lastValidState.document = svgDoc;
	}
};
export type DocumentProviderInterface = typeof intf;

const snapshot = location.hash.includes("reset") ? null : intf.getSnapshot();
const startingText = snapshot ?? defaultSvg;

const startingDoc = snapshot ? new DOMParser().parseFromString(startingText, "text/xml") : document.implementation.createDocument(Namespaces.svg, null);
if (!snapshot) startingDoc.appendChild(startingDoc.createElement("svg"));

const doc = ref<DocumentProviderDocument>({
	name: "New Document",
	lastValidState: {
		text: startingText,
		document: startingDoc,
	},
	valid: true,
});

onMounted(() => {
	window.addEventListener("unload", intf.takeSnapshot);
});

onUnmounted(() => window.removeEventListener("unload", intf.takeSnapshot));

provide(k.INTERFACE, intf);
provide(k.DOCUMENT, doc);
</script>

<template>
	<slot/>
</template>
