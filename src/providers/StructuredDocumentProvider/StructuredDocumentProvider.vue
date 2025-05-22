<script setup lang="ts">
import {onMounted, onUnmounted, provide, ref, triggerRef} from "vue";
import {Namespaces} from "@/constants.ts";
import k from "./keys.ts";
import type {StructuredDocument} from "@t/StructuredDocument.ts";

import sampleDocument from "@/sampleDocument.ts";
import {toSVGDoc, toSVGMFilterDoc} from "@/structuredDocument/export.ts";

const doc = ref<StructuredDocument>(sampleDocument);

export type StructuredDocumentProviderDocument = StructuredDocument;

const intf = {
	takeSnapshot() {
	},
	getSnapshot(): string | null {
	},
	updateText(svgText: string) {
	},
	import(svgDocuement: XMLDocument) {
	},
	export(): XMLDocument {
		return toSVGMFilterDoc(doc.value, "filter");
	},
	toSvg(): XMLDocument {
		return toSVGDoc(doc.value, "filter", true);
	}
};
export type StructuredDocumentProviderInterface = typeof intf;

// const snapshot = location.hash.includes("reset") ? null : intf.getSnapshot();

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
