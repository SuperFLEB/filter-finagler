<script setup lang="ts">
import {computed, ref} from "vue";
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import prettyXML from "@/util/prettyXML.ts";
import {domToString} from "@/util/xml.ts";

const {interface: intf, project} = useProjectProvider();

const includeMFMeta = ref<boolean>(false);
const parsedString = computed(() => {
	project.value;
	return prettyXML(domToString(intf.toSvg(includeMFMeta.value)));
});
const parsedStringLines = computed(() => (parsedString.value ?? "").split("\n"));

function toggleMFMeta(e: InputEvent) {
	includeMFMeta.value = (e.target as HTMLInputElement).checked;
}
</script>

<template>
	<div class="viewer">
		<div class="options">
			<label><input type="checkbox" :checked="includeMFMeta" @input="toggleMFMeta($event as InputEvent)" /> Retain Edit Ability (MFilter metadata)</label>
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