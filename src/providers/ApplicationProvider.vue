<script setup lang="ts">
import ProjectProvider from "@/providers/ProjectProvider/ProjectProvider.vue";
</script>

<template>
	<ProjectProvider>
		<slot/>
	</ProjectProvider>
</template>

<style scoped>
</style>