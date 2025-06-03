<script setup lang="ts">
import {computed, ref} from "vue";
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import prettyXML from "@/util/prettyXML.ts";
import {domToString} from "@/util/xml.ts";

const {interface: intf, project} = useProjectProvider();

const format = ref<"svg"|"ff.svg"|"ff.xml">("svg");
const parsedString = computed(() => {
	project.value;
	return prettyXML(domToString(intf.export(format.value)));
});
const parsedStringLines = computed(() => (parsedString.value ?? "").split("\n"));

function setFormat(e: Event) {
	format.value = (e.target as HTMLInputElement).value as "svg"|"ff.svg"|"ff.xml";
}
</script>

<template>
	<div class="viewer">
		<div class="options">
			<select @change="setFormat">
				<option value="svg">SVG</option>
				<option value="ff.svg">SVG+FF</option>
				<option value="ff.xml">FF Filter</option>
			</select>
		</div>
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