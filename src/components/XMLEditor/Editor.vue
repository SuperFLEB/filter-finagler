<script setup lang="ts">
import {computed, onMounted, ref, triggerRef} from "vue";
import useDocumentProvider from "@/providers/SVGDocumentProvider/useDocumentProvider.ts";
import EditorView from "@/components/XMLEditor/EditorView.vue";
import useStructuredDocumentProvider from "@/providers/StructuredDocumentProvider/useStructuredDocumentProvider.ts";
import prettyXML from "@/util/prettyXML.ts";
import { domToString } from "@/util/xml";

type Props = { for: string };
const props = defineProps<Props>();

const {interface: intf, document: doc} = useStructuredDocumentProvider();

let currentEditorText: string = "";
let editorUpdateFunction = (_: string) => {};

const editorDocumentText = ref<string>("");
const isDirty = ref<boolean>(false);

const svgText = computed(() => {
	doc.value;
	const svgDoc = intf.export();
	const text = domToString(svgDoc);
	return prettyXML(text);
});

console.log({s: svgText.value});

function handleEditorUpdate(text: string): void {
	currentEditorText = text;
	isDirty.value = currentEditorText !== svgText;
}

function setEditorUpdateFunction(cb: () => void): void {
	editorUpdateFunction = cb;
}

function applyEditor() {
/*
	updateText(currentEditorText);
	editorDocumentText.value = currentEditorText;
*/
}

function applyDocument() {
	currentEditorText = svgText.value;
	editorDocumentText.value = svgText.value;
	editorUpdateFunction(editorDocumentText.value);
}

onMounted(() => {
	editorUpdateFunction(svgText.value);
});

</script>

<template>
	<div v-if="isDirty" class="dirty">
		This SVG document differs from the document in the graph editor.
		<button @click="applyEditor">Use This</button>
		<button @click="applyDocument">Use Graph Editor</button>
	</div>
	<EditorView @update="handleEditorUpdate" @registerUpdateFunction="setEditorUpdateFunction" :text="editorDocumentText" />
</template>

<style scoped>

</style>