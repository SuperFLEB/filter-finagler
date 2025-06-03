<script setup lang="ts">
import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import useInputUI from "@/providers/InputUIProvider/useInputUI.ts";
import {getFilterDef} from "@/ProjectModel/info.ts";
import {computed} from "vue";
import type {InputValueDef} from "@/MFilter/types.ts";

type Props = { label: string, stringValue: string, fe: FilterElement, property: string };
const props = withDefaults(defineProps<Props>(), {});

defineEmits(["update"]);

const {interface: uiInterface} = useInputUI();

function onInput(e: Event) {
	const value = (e.target as HTMLSelectElement).value;
	uiInterface.updateValueFromString(props.property, value);
}

const filterDef = computed(() => getFilterDef(props.fe));
const selectedValue = computed(() => props.fe.values?.[props.property] ?? filterDef.value?.values?.[props.property]);
const selectOptions = computed(() => (filterDef.value?.values?.[props.property] as InputValueDef<"SELECT">).values ?? []);
</script>

<template>
	<label>{{ label }}: <select @change="onInput">
		<option v-for="option of selectOptions" :value="option" :selected="selectedValue === option">{{
				option
			}}
		</option>
	</select></label>
</template>

<style scoped>

</style>