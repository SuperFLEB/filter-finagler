<script setup lang="ts">
import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import {computed} from "vue";
import {getFilterDef} from "@/ProjectModel/info.ts";
import DefaultComponent from "@/components/FilterElementEditor/DefaultComponent.vue";

type Props = { fe: FilterElement };
const props = withDefaults(defineProps<Props>(), {});

const filterDef = computed(() => getFilterDef(props.fe));

type ComponentProps = {
	label?: string;
	fe: FilterElement;
	property: string;
};

const properties = computed<ComponentProps[]>(() => {
	const filterDef = getFilterDef(props.fe);
	if (!filterDef) {
		console.error(`No filter definition for ${props.fe.instanceId}`);
		return [];
	}

	return Object.entries(filterDef.values ?? {})
		.map(([name, fd]) => ({
			label: fd.label,
			fe: props.fe,
			property: name,
		}));
});
</script>

<template>
	<h1>{{ filterDef!.displayName }}</h1>
	<p v-if="!properties.length">{{ filterDef!.displayName.charAt(0).toUpperCase() + filterDef!.displayName.slice(1) }} has no options that can be set.</p>
	<DefaultComponent v-for="(property, index) in properties" :key="index" v-bind="{...property}" />
</template>
