<script setup lang="ts">
import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import {getFilterDef} from "@/ProjectModel/info.ts";
import {computed} from "vue";
import useInputUI from "@/providers/InputUIProvider/useInputUI.ts";
import type {FilterDef, InputValueDef} from "@/MFilter/types.ts";

type Props = { label: string, stringValue: string, fe: FilterElement, property: string };
const props = withDefaults(defineProps<Props>(), {});

const { interface: uiInterface } = useInputUI();

const range = computed(() => {
	const fd = getFilterDef(props.fe) as FilterDef;
	const property = fd?.values?.[props.property] as InputValueDef<"NUMBER"> | undefined;
	return {
		min: property?.min ?? -10,
		max: property?.max ?? 10,
		step: property?.step ?? 0.1,
	};
});

function onInput(e: Event) {
	const value = Number((e.target as HTMLInputElement).value);
	uiInterface.updateValue(props.property, value);
}
</script>

<template>
	<input type="range" :min="range.min.toString()" :max="range.max.toString()" :step="range.step.toString()" :value="props.stringValue" @input="onInput"/>
</template>
