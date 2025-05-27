<script setup lang="ts">
import type {FilterElement} from "@/Project/ProjectModel.ts";
import {getFilterDef} from "@/Project/info.ts";
import {computed} from "vue";
import useInputUI from "@/providers/InputUIProvider/useInputUI.ts";

type Props = { label: string, stringValue: string, fe: FilterElement, property: string };
const props = withDefaults(defineProps<Props>(), {});

const { interface: uiInterface } = useInputUI();

const range = computed(() => {
	const fd = getFilterDef(props.fe);
	return {
		min: fd?.values?.[props.property]?.min ?? -10,
		max: fd?.values?.[props.property]?.max ?? 10,
		step: fd?.values?.[props.property]?.step ?? 0.1,
	};
});

function onInput(e: InputEvent) {
	const value = Number((e.target as HTMLInputElement).value);
	uiInterface.updateValue(props.property, value);
}
</script>

<template>
	<label>{{ label }}: <input type="range" :min="range.min.toString()" :max="range.max.toString()" :step="range.step.toString()"
							   :value="props.stringValue" @input="onInput"/> {{ props.stringValue }}</label>
</template>
