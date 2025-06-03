<script setup lang="ts">
import {type FilterDef, InputTypeStringMap, type Value} from "@/MFilter/types.ts";
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import {computed, provide} from "vue";
import {getFilterDef} from "@/ProjectModel/info.ts";
import {update} from "@/ProjectModel/manipulate.ts";
import stringToValue from "@/MFilter/stringToValue.ts";
import k from "./keys.ts";

type Props = { filter: string, instanceId: string };
const props = withDefaults(defineProps<Props>(), {});

const { project } = useProjectProvider();

const filterElement= computed(() => project.value.filters.get(props.filter)?.elements.get(props.instanceId));
const filterDef = computed(() => filterElement.value && getFilterDef(filterElement.value));

const intf = {
	updateIndex(name: string, index: number, value: number) {
		if (!(filterElement.value && filterDef.value)) throw new Error("Invalid filter element. Cannot set value.");
		const type = filterDef.value?.values?.[name].type;
		if (!(type && InputTypeStringMap[type] === "number[]")) throw new Error(`Missing or invalid type for ${name}.`);
		const newValue = (filterElement.value.values?.[name] ?? (filterDef.value.values?.[name]?.defaultValue as number[] | undefined) ?? Array.from({length: index + 1}).map(e => 0)) as number[];
		newValue[index] = Number(value);
		this.updateValue(name, newValue);
	},
	updateValueFromString(name: string, value: string) {
		const type = filterDef.value?.values?.[name].type;
		if (!type) throw new Error(`Filter, element definition, or type not found for ${name}`);
		this.updateValue(name, stringToValue(value, type));
	},
	updateValue(name: string, value: Value) {
		if (!(filterElement.value && filterDef.value)) throw new Error("Invalid filter element. Cannot set value.");
		if (!filterDef.value.values?.[name]) throw new Error(`Attempt to set ${name} but it does not exist on instance ${filterElement?.value.instanceId}`);
		update(project.value, props.filter, props.instanceId, { values: { [name]: value }});
	}
}
export type InputUIProviderInterface = typeof intf;

provide(k.INTERFACE, intf);
</script>

<template>
	<slot />
</template>
