<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import EditorView from "@/components/XMLEditor/EditorView.vue";
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import prettyXML from "@/util/prettyXML.ts";
import {domToString, stringToDom} from "@/util/xml";

const {interface: intf, project} = useProjectProvider();

let currentEditorText: string = "";
let editorUpdateFunction = (_: string) => {};

const editorDocumentText = ref<string>("");
const isDirty = ref<boolean>(false);

const ffText = computed(() => {
	project.value;
	const ffDoc = intf.export("ff.xml");
	const text = domToString(ffDoc);
	return prettyXML(text);
});

function handleEditorUpdate(text: string): void {
	currentEditorText = text;
	isDirty.value = currentEditorText !== ffText.value;
}

function setEditorUpdateFunction(cb: () => void): void {
	editorUpdateFunction = cb;
}

function applyEditor() {
	const xmlDocument = stringToDom(currentEditorText);
	intf.load(xmlDocument);
}

function applyDocument() {
	currentEditorText = ffText.value;
	editorDocumentText.value = ffText.value;
	editorUpdateFunction(editorDocumentText.value);
}

onMounted(() => {
	editorUpdateFunction(ffText.value);
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