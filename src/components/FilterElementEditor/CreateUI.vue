<script setup lang="ts">
import {getFilters} from "@/util/RegisterMFilter.ts";
import type {FilterDef, MFilterDef, SVGFilterDef} from "@/MFilter/types.ts";
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import {ref} from "vue";
import useApplication from "@/providers/ApplicationProvider/useApplication.ts";

type Props = { addMode?: boolean };
const props = withDefaults(defineProps<Props>(), {addMode: false});

const {interface: applicationInterface, graphAdd} = useApplication();

const filters = getFilters();
const mFilters: MFilterDef[] = [];
const svgFilters: SVGFilterDef[] = [];

for (const filter of filters) {
	switch (filter.type) {
		case "MFILTER":
			mFilters.push(filter);
			continue;
		case "SVGNATIVE":
			svgFilters.push(filter);
			continue;
	}
}

function addMode(filterDef: FilterDef) {
	applicationInterface.graphAddMode(filterDef);
}
</script>

<template>
	<div class="createUI">
		<h1>Add Filter Element</h1>
		<section class="mfilter">
			<ul class="filterList">
				<li v-for="filter in mFilters" :key="filter.appuid">
					<button type="button" @click="addMode(filter)">{{ filter.displayName }}</button>
				</li>
			</ul>
		</section>

		<section class="native">
			<ul class="filterList">
				<li v-for="filter in svgFilters" :key="filter.appuid">
					<button type="button" @click="addMode(filter)">{{ filter.displayName }}</button>
				</li>
			</ul>
		</section>
	</div>
</template>
<style scoped lang="scss">
.filterList {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	list-style-type: none;
	gap: 1em;

	button {
		appearance: none;
		display: block;
		width: 14ch;
		aspect-ratio: 2/1;
		border: 0 none;
		background: none;
		border-radius: 1ch;
	}
}
.mfilter .filterList button {
	background-color: #080;
	color: #fff;
}
.native .filterList button {
	background-color: #c90;
	color: #fff;
}
</style>