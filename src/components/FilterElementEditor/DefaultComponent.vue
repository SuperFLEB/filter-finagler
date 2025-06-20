<script setup lang="ts">
import StringInput from "@/components/FilterElementEditor/components/StringInput.vue";
import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import {type Component, computed} from "vue";
import {getFilterDef} from "@/ProjectModel/info.ts";
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import NumberInput from "@/components/FilterElementEditor/components/NumberInput.vue";
import SelectInput from "@/components/FilterElementEditor/components/SelectInput.vue";
import ColorInput from "@/components/FilterElementEditor/components/ColorInput.vue";
import VectorInput from "@/components/FilterElementEditor/components/VectorInput.vue";

type Props = { fe: FilterElement, property: string, label?: string };
const props = withDefaults(defineProps<Props>(), {});

const { project } = useProjectProvider();

const filterDef = computed(() => getFilterDef(props.fe));
const currentValue = computed(() => props.fe.values?.[props.property] ?? filterDef?.value?.values?.[props.property]?.defaultValue ?? "");
const type = computed(() => filterDef.value?.values?.[props.property]?.type);

const component = computed(() => {
	const inputUIComponents: Record<string, Component> = {
		"STRING": StringInput,
		"NUMBER": NumberInput,
		"SELECT": SelectInput,
		"COLOR": ColorInput,
		"VECTOR": VectorInput,
	};
	return inputUIComponents[type.value ?? "STRING"] ?? inputUIComponents["STRING"];
})
</script>

<template>
	<component :is="component" :label="props.label" :stringValue="currentValue.toString()" :value="currentValue" :fe="props.fe" :property="props.property" />
</template>
