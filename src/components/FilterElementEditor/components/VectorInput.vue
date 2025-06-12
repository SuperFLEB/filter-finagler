<script setup lang="ts">
import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import VectorInputComponent from "@/components/VectorInput/VectorInput.vue";
import useInputUI from "@/providers/InputUIProvider/useInputUI.ts";

type Props = { label: string, value: number[], fe: FilterElement, property: string };
const props = withDefaults(defineProps<Props>(), {});

const { interface: uiInterface } = useInputUI();
function update(value: number[]) {
	uiInterface.updateValue(props.property, value);
}
</script>

<template>
	<VectorInputComponent :x="value[0]" :y="value[1]" @change="update" />
</template>

<style scoped>

</style>