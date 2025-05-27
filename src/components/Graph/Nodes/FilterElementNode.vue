<script setup lang="ts">
import {type NodeProps} from "@vue-flow/core";
import {computed} from "vue";
import {colord} from "colord";
import objectMap from "@/util/objectMap.ts";
import FilterIOHandle from "@/components/Graph/Nodes/FilterIOHandle.vue";
import type {NodeType, FilterElement} from "@/Project/ProjectModel.ts";
import {getFilterDef} from "@/Project/info.ts";

type Props = NodeProps<FilterElement>;
const props = withDefaults(defineProps<Props>(), {});

type DisplayIO = { name: string, label: string; };

defineOptions({
	inheritAttrs: false
});

type DisplayProps = {
	title: string;
	instanceId: string;
	native: boolean;
	tag: string;
	displayType: string;
	colors: [string, string];
	colorCssVars: Record<string, string>;
	inputs: Record<string, DisplayIO>,
	outputs: Record<string, DisplayIO>,
};

const display = computed(() => {
	const filterElement = props.data;
	const filterDef = getFilterDef(filterElement);

	if (!filterDef) throw new Error(`No filter for AppUID ${filterElement.appuid} found`);

	const displayProps = {
		title: "Unknown",
		instanceId: filterElement.instanceId,
	} as DisplayProps;

	const colors: Record<NodeType, [string, string]> = {
		MFILTER: ["#374", "#fff"],
		SVGNATIVE: ["#c82", "#fff"],
		UNKNOWN: ["#faa", "#000"],
		UTILITY: ["#000", "#fff"],
	};

	const [bgColor, fgColor] = colors[filterElement.type ?? "UNKNOWN"] ?? colors.UNKNOWN;
	const bgSelected = props.selected ? colord(bgColor).lighten(0.1).toRgbString() : bgColor;

	displayProps.colors = [bgSelected, fgColor];
	displayProps.colorCssVars = {"--barFg": fgColor, "--barBg": bgSelected};

	displayProps.inputs = {};
	displayProps.outputs = {};

	displayProps.inputs = objectMap(filterDef.inputs ?? {}, ([k, v]) => [k, {name: k, label: v?.label ?? k}]);
	displayProps.outputs = objectMap(filterDef.outputs ?? {}, ([k, v]) => [k, { name: filterElement.outputs?.[k] ?? k, label: v.label } ]);

	displayProps.displayType = filterDef.displayName;
	return displayProps;
});

</script>

<template>
	<div :class="['filterNode', { 'selected': props.selected }]" :style="{ ...display.colorCssVars }">
		<h1 class="title">{{ display.displayType }}</h1>
		<!--
					<menu class="vis">
						<li>
							<button><img :src="`${visibilitySvg}#on`" width="18" height="18" alt="Visible"/></button>
						</li>
						<li><img :src="`${visibilitySvg}#solo`" width="18" height="18" alt="Only This Filter"/></li>
						<li><img :src="`${visibilitySvg}#off`" width="18" height="18" alt="Off"/></li>
					</menu>
		-->
		<div class="handles">
			<div class="inputHandles">
				<FilterIOHandle v-for="(dio, keyName, index) in display.inputs" :key="index" direction="in"
								:attribute="keyName" :nodeId="display.instanceId">
					{{ dio.label ?? keyName }}
				</FilterIOHandle>
			</div>
			<div class="outputHandles">
				<FilterIOHandle v-for="(dio, keyName, index) in display.outputs" :key="index" direction="out"
								:attribute="dio.name" :nodeId="display.instanceId">
					{{ dio.label ?? dio.name }}
				</FilterIOHandle>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss" src="./node.scss"/>