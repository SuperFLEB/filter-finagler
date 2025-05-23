<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import EditorView from "@/components/XMLEditor/EditorView.vue";
import useStructuredDocumentProvider from "@/providers/StructuredDocumentProvider/useStructuredDocumentProvider.ts";
import prettyXML from "@/util/prettyXML.ts";
import {domToString} from "@/util/xml";

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

function handleEditorUpdate(text: string): void {
	currentEditorText = text;
	isDirty.value = currentEditorText !== svgText.value;
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