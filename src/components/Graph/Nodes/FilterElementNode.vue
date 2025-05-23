<script setup lang="ts">
import type {NodeProps} from "@vue-flow/core";
import {computed} from "vue";
import {colord} from "colord";
import objectMap from "@/util/objectMap.ts";
import FilterIOHandle from "@/components/Graph/Nodes/FilterIOHandle.vue";
import type {FilterElementType, SVGMFilterElement} from "@t/StructuredDocument.ts";
import {getFilterDef} from "@/structuredDocument/info.ts";

type Props = NodeProps<SVGMFilterElement>;
const props = withDefaults(defineProps<Props>(), {});

type DisplayIO = { label: string; };

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

	const colors: Record<FilterElementType, [string, string]> = {
		MFILTER: ["#374", "#fff"],
		NATIVE: ["#c82", "#fff"],
		UNKNOWN: ["#faa", "#000"],
	};

	const [bgColor, fgColor] = colors[filterElement.type ?? "UNKNOWN"];
	const bgSelected = props.selected ? colord(bgColor).lighten(0.1).toRgbString() : bgColor;

	displayProps.colors = [bgSelected, fgColor];
	displayProps.colorCssVars = {"--barFg": fgColor, "--barBg": bgSelected};

	displayProps.inputs = {};
	displayProps.outputs = {};

	displayProps.inputs = objectMap(filterDef.inputs ?? {}, ([k, v]) => [k, {label: v?.label ?? k}]);
	displayProps.outputs = filterDef.outputs ?? {};

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
								:attribute="keyName" :nodeId="display.instanceId">
					{{ dio.label ?? keyName }}
				</FilterIOHandle>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss" src="./node.scss"/>