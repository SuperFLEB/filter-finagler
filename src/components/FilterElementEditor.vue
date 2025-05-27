<script setup lang="ts">
import {computed} from "vue";
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import type {FilterElement} from "@/Project/ProjectModel.ts";
import UI from "@/components/UI/UI.vue";

type Props = { filter?: string, selectedInstanceId?: string };
const props = withDefaults(defineProps<Props>(), {});

const {project} = useProjectProvider();

const fe = computed<FilterElement | undefined>(() => {
	if (!props.filter) return undefined;
	const filter = project.value.filters.get(props.filter);
	if (!filter) return undefined;
	return filter.elements.find(e => e.instanceId === props.selectedInstanceId);
});
</script>

<template>
	<div v-if="!props.filter">No filter selected</div>
	<div v-else-if="!props.selectedInstanceId">
		(Add mechanism goes here)
	</div>
	<div v-else-if="!fe">
		(Error goes here)
	</div>
	<div v-else>
		<UI :fe/>
	</div>
</template>
