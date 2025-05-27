<script setup lang="ts">
import StringInput from "@/components/UI/components/StringInput.vue";
import type {FilterElement, FilterInputReference} from "@/Project/ProjectModel.ts";
import {type Component, computed} from "vue";
import stringToValue from "@/MFilters/stringToValue.ts";
import type {InputValueDef} from "@/MFilters/types.ts";
import {getFilterDef} from "@/Project/info.ts";
import {update} from "@/Project/manipulate.ts";
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import NumberInput from "@/components/UI/components/NumberInput.vue";

type Props = { fe: FilterElement, property: string, label?: string };
const props = withDefaults(defineProps<Props>(), {});

const { project } = useProjectProvider();

const currentValue = computed(() => props.fe.values?.[props.property] ?? "");

const type = computed(() => {
	const filterDef = getFilterDef(props.fe);
	return filterDef?.values?.[props.property]?.type;
});

function formUpdate(e: InputEvent) {
	if (!type.value) {
		console.error(`Default component could not find a Filter Definition or data type for ${props.property} on ${props.fe.instanceId}`);
	}
	const newValue = stringToValue((e.target as HTMLInputElement).value, type);
	const updates = { values: { [props.property]: newValue } };
	update(project.value, "filter", props.fe.instanceId, updates);
}

const component = computed(() => {
	const inputUIComponents: Record<string, Component> = {
		"STRING": StringInput,
		"NUMBER": NumberInput,
	};
	return inputUIComponents[type.value ?? "STRING"] ?? inputUIComponents["STRING"];
})
</script>

<template>
	<component :is="component" :label="props.label" :string-value="currentValue.toString()" :fe="props.fe" :property="props.property" />
</template>
