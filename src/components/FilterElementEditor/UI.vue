<script setup lang="ts">
import type {Component} from "vue";
import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import {getFilterDef} from "@/ProjectModel/info.ts";
import DefaultUI from "@/components/FilterElementEditor/DefaultUI.vue";
import InputUIProvider from "@/providers/InputUIProvider/InputUIProvider.vue";
type Props = { fe: FilterElement };
const props = withDefaults(defineProps<Props>(), {});

const filterDef = getFilterDef(props.fe);
const component = filterDef?.uiComponent ?? DefaultUI;
</script>

<template>
	<InputUIProvider filter="filter" :instance-id="fe.instanceId">
		<component :is="component" :fe="props.fe" />
	</InputUIProvider>
</template>
