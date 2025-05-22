<script setup lang="ts">
import useMFTransform from "@/providers/MFTransformProvider/useMFTransform.ts";
import {computed} from "vue";
import useStructuredDocumentProvider from "@/providers/StructuredDocumentProvider/useStructuredDocumentProvider.ts";
import prettyXML from "@/util/prettyXML.ts";

const {interface: intf, document: doc} = useStructuredDocumentProvider();
const parsedString = computed(() => {
	doc.value;
	return prettyXML(new XMLSerializer().serializeToString(intf.toSvg()));
});
const parsedStringLines = computed(() => (parsedString.value ?? "").split("\n"));
</script>

<template>
	<div class="viewer">
		<div class="lines">
			<template v-for="line, idx in parsedStringLines">
				<div class="number">{{ idx + 1 }}</div>
				<div class="content">{{ line }}</div>
			</template>
			<div class="number fill"></div>
		</div>
	</div>
</template>

<style scoped>
.viewer {
	display: flex;
	flex-direction: column;
}

.lines {
	display: grid;
	grid-template-columns: min-content 1fr;
	counter-reset: line;
	flex-grow: 1;
}

.number {
	text-align: right;
	padding-left: 2em;
	padding-right: 1ch;

	background-color: #eee;
	border-right: 1px solid #ccc;
	margin-right: 1ch;

	user-select: none;
}

.number, .content {
	font-family: Consolas, "Liberation Mono", "Courier New", monospace;
	font-size: 10pt;
	white-space: pre-wrap;
}

.fill {
	height: 1000px;
}
</style>