<script setup lang="ts">
import ProjectProvider from "@/providers/ProjectProvider/ProjectProvider.vue";
import k from "./keys.ts";
import type {FilterDef} from "@/MFilter/types.ts";
import {provide, readonly, ref} from "vue";

const graphAddMode = ref<FilterDef | false>(false);
const intf = {
	graphAddMode(filterDefOrFalse: FilterDef | false) {
		graphAddMode.value = filterDefOrFalse;
	}
};
export type ApplicationProviderInterface = typeof intf;

provide(k.INTERFACE, intf);
provide(k.GRAPH_ADD, readonly(graphAddMode));
</script>

<template>
	<ProjectProvider>
		<slot/>
	</ProjectProvider>
</template>

<style scoped>
</style>