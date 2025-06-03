<script setup lang="ts">
import StringInput from "@/components/FilterElementEditor/components/StringInput.vue";
import type {FilterElement, FilterInputReference} from "@/ProjectModel/ProjectModel.ts";
import {type Component, computed} from "vue";
import stringToValue from "@/MFilter/stringToValue.ts";
import type {InputValueDef} from "@/MFilter/types.ts";
import {getFilterDef} from "@/ProjectModel/info.ts";
import {update} from "@/ProjectModel/manipulate.ts";
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import NumberInput from "@/components/FilterElementEditor/components/NumberInput.vue";
import SelectInput from "@/components/FilterElementEditor/components/SelectInput.vue";
import ColorInput from "@/components/FilterElementEditor/components/ColorInput.vue";

type Props = { fe: FilterElement, property: string, label?: string };
const props = withDefaults(defineProps<Props>(), {});

const { project } = useProjectProvider();

const filterDef = computed(() => getFilterDef(props.fe));
const currentValue = computed(() => props.fe.values?.[props.property] ?? filterDef?.value.values?.[props.property]?.defaultValue ?? "");
const type = computed(() => filterDef.value?.values?.[props.property]?.type);

const component = computed(() => {
	const inputUIComponents: Record<string, Component> = {
		"STRING": StringInput,
		"NUMBER": NumberInput,
		"SELECT": SelectInput,
		"COLOR": ColorInput,
	};
	return inputUIComponents[type.value ?? "STRING"] ?? inputUIComponents["STRING"];
})
</script>

<template>
	<component :is="component" :label="props.label" :string-value="currentValue.toString()" :fe="props.fe" :property="props.property" />
</template>
