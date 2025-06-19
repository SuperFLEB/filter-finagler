<script setup lang="ts">
import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import useInputUI from "@/providers/InputUIProvider/useInputUI.ts";
import VectorDot from "@superfleb/vue-vector-dot";

type Props = { label: string, value: number[], fe: FilterElement, property: string };
const props = withDefaults(defineProps<Props>(), {});

const { interface: uiInterface } = useInputUI();
function update(e: any) {
	uiInterface.updateValue(props.property, e.target.value);
}
</script>

<template>
	<VectorDot :x="value[0]" :y="value[1]" @change="update" />
</template>

<style scoped>

</style>