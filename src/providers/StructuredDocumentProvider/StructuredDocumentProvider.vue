<script setup lang="ts">
import {onMounted, onUnmounted, provide, ref, triggerRef} from "vue";
import {Namespaces} from "@/constants.ts";
import k from "./keys.ts";
import type {StructuredDocument} from "@t/StructuredDocument.ts";

import sampleDocument from "@/sampleDocument.ts";
import {toSVGDoc} from "@/structuredDocument/export.ts";
import { annotate } from "@/structuredDocument/annotate.ts";

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
		return annotate(doc.value, "filter");
	},
	toSvg(includeMFMeta: boolean = false): XMLDocument {
		return toSVGDoc(doc.value, "filter", includeMFMeta);
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
