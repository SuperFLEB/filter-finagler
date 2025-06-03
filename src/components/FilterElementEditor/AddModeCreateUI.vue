<script setup lang="ts">
import useApplication from "@/providers/ApplicationProvider/useApplication.ts";
import type {FilterDef} from "@/MFilter/types.ts";

const {interface: applicationInterface, graphAdd} = useApplication();

function cancelAddMode() {
	applicationInterface.graphAddMode(false);
}
</script>

<template>
	<h1>Adding {{ (graphAdd as FilterDef).displayName }}</h1>
	<p>Click in the Graph editor where you would like to add the node, or below to cancel.</p>
	<button type="button" class="cancelAddMode" @click="cancelAddMode">Cancel</button>
</template>

<style scoped>

</style>