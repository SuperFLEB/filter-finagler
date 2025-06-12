<script setup lang="ts">
import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import {computed} from "vue";
import {getFilterDef} from "@/ProjectModel/info.ts";
import DefaultComponent from "@/components/FilterElementEditor/DefaultComponent.vue";
import RandomNamespace from "@/util/randomNamespace.ts";

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

const ns = new RandomNamespace(5, "_", "xml");
</script>

<template>
	<h1>{{ filterDef!.displayName }}</h1>
	<p v-if="!properties.length">{{ filterDef!.displayName.charAt(0).toUpperCase() + filterDef!.displayName.slice(1) }} has no options that can be set.</p>
	<div class="uiForm">
		<template v-for="(property, index) in properties" :key="index">
			<div><label :for="ns.id(index.toString())">{{ property.label ?? property.property }}</label></div>
			<div><DefaultComponent :id="ns.id(index.toString())" v-bind="{...property}" /></div>
		</template>
	</div>
</template>

<style scoped lang="scss">
	.uiForm {
		display: grid;
		grid-template-columns: min-content 1fr;
		gap: 2rem;
	}
</style>