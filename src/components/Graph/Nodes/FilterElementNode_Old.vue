<script setup lang="ts">
import type {Clod} from "@t/Clod.ts";
import type {NodeProps} from "@vue-flow/core";
import {computed} from "vue";
import {Namespaces} from "@/constants.ts";
import {colord} from "colord";
import objectValueFilter from "@/util/objectValueFilter.ts";
import type {InputValueDef} from "@/MFilter/types.ts";
import objectMap from "@/util/objectMap.ts";
import FilterIOHandle from "@/components/Graph/Nodes/FilterIOHandle.vue";

const enum ClodTypes {
	Unknown = "UNKNOWN",
	Comment = "COMMENT",
	MFilter = "MFILTER",
	FilterElement = "FILTER_ELEMENT",
};

type Props = NodeProps<{ clod: Clod }>;
const props = withDefaults(defineProps<Props>(), {});

defineOptions({
	inheritAttrs: false
});

type DisplayIO = { label: string };

type DisplayProps = {
	title: string;
	nodeId: string;
	native: boolean;
	tag: string;
	type: ClodTypes;
	displayType: string;
	colors: [string, string];
	colorCssVars: Record<string, string>;
	inputs: Record<string, DisplayIO>,
	outputs: Record<string, DisplayIO>,
};

function getType(clod: Clod): ClodTypes {
	if (!clod.element && !clod.comments?.length) return ClodTypes.Unknown;
	if (!clod.element) return ClodTypes.Comment;
	if (clod.element.namespaceURI === Namespaces.svgmf1) {
		if (clod.element.localName === "fe") return ClodTypes.MFilter;
		return ClodTypes.Unknown;
	}
	return ClodTypes.FilterElement;
}

function getDisplayType(clod: Clod, clodType?: ClodTypes) {
	if (clod.mf?.info.displayName) return clod.mf.info.displayName;
	const type = clodType ?? getType(clod);
	if (type === ClodTypes.Comment) return "(Comment)";
	if (type === ClodTypes.FilterElement) return clod.element!.localName;
	if (type === ClodTypes.Unknown) return "(Unknown)";
	return clod.mf?.info.displayName ?? "(Unknown MFilter)";
}

const display = computed(() => {
	const clod = props.data.clod;
	const displayProps = {
		title: "Unknown",
		nodeId: clod.id.toString(),
	} as DisplayProps;

	if (clod.element) {
		const element = clod.element;
		const type = getType(clod);
		const displayType = getDisplayType(clod, type);

		Object.assign(displayProps, {
			...displayProps,
			native: !(element.namespaceURI === Namespaces.svgmf1 && element.localName === "fe"),
			tag: element.localName,
			type,
			displayType,
		});

		const colors: Record<ClodTypes, [string, string]> = {
			[ClodTypes.MFilter]: ["#374", "#fff"],
			[ClodTypes.FilterElement]: ["#c82", "#fff"],
			[ClodTypes.Comment]: ["#666", "#fff"],
			[ClodTypes.Unknown]: ["#faa", "#000"],
		};

		const [bgColor, fgColor] = colors[displayProps.type];
		const bgSelected = props.selected ? colord(bgColor).lighten(0.1).toRgbString() : bgColor;
		displayProps.colors = [bgSelected, fgColor];
		displayProps.colorCssVars = {"--barFg": fgColor, "--barBg": bgSelected};

		displayProps.inputs = {};
		displayProps.outputs = {};

		if (clod.mf) {
			displayProps.inputs = objectMap<InputValueDef, DisplayIO>(
				objectValueFilter<InputValueDef>(clod.mf.info.inputs ?? {}, (v: InputValueDef) => v.type === "RESULT"),
				([k, v]) => [k, {label: v?.label ?? k}]
			);
			displayProps.outputs = clod.mf.info.outputs ?? {};
		}
	}

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
								:attribute="keyName" :nodeId="display.nodeId">
					{{ dio.label ?? keyName }}
				</FilterIOHandle>
			</div>
			<div class="outputHandles">
				<FilterIOHandle v-for="(dio, keyName, index) in display.outputs" :key="index" direction="out"
								:attribute="keyName" :nodeId="display.nodeId">
					{{ dio.label ?? keyName }}
				</FilterIOHandle>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss" src="./node.scss" />