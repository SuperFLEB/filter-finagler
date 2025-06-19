<script setup lang="ts">
import {computed} from "vue";
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import UI from "@/components/FilterElementEditor/UI.vue";
import CreateUI from "@/components/FilterElementEditor/CreateUI.vue";
import AddModeCreateUI from "@/components/FilterElementEditor/AddModeCreateUI.vue";
import useApplication from "@/providers/ApplicationProvider/useApplication.ts";

type Props = { filter?: string, selectedInstanceId?: string };
const props = withDefaults(defineProps<Props>(), {});

const {project} = useProjectProvider();
const {graphAdd} = useApplication();

const fe = computed<FilterElement | undefined>(() => {
	if (!(props.filter && props.selectedInstanceId)) return undefined;
	const filter = project.value.filters.get(props.filter);
	if (!filter) return undefined;
	return filter.elements.get(props.selectedInstanceId);
});
</script>

<template>
	<div v-if="!props.filter">No filter selected</div>
	<div v-else-if="!props.selectedInstanceId">
		<AddModeCreateUI v-if="graphAdd" />
		<CreateUI v-else/>
	</div>
	<div v-else-if="!fe">
		(There was an error loading the selected filter details.)
	</div>
	<div v-else>
		<UI :fe/>
	</div>
</template>
