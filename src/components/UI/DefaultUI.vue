<script setup lang="ts">
import type {FilterElement} from "@/Project/ProjectModel.ts";
import {computed} from "vue";
import {getFilterDef} from "@/Project/info.ts";
import DefaultComponent from "@/components/UI/DefaultComponent.vue";

type Props = { fe: FilterElement };
const props = withDefaults(defineProps<Props>(), {});

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

	return Object.keys(props.fe.values ?? {})
		.map(name => ({
			label: filterDef.values?.[name].label,
			fe: props.fe,
			property: name,
		}));
});
</script>

<template>
	<DefaultComponent v-for="(property, index) in properties" :key="index" v-bind="{...property}" />
</template>
