<script setup lang="ts">
import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import useInputUI from "@/providers/InputUIProvider/useInputUI.ts";

type Props = { label: string, stringValue: string, fe: FilterElement, property: string };
const props = withDefaults(defineProps<Props>(), {});

defineEmits(["update"]);

const { interface: uiInterface } = useInputUI();

function onInput(e: Event) {
	const value = (e.target as HTMLInputElement).value;
	uiInterface.updateValueFromString(props.property, value);
}
</script>

<template>
	<label>{{ label }}: <input type="text" :value="props.stringValue" @input="onInput" /></label>
</template>

<style scoped>

</style>