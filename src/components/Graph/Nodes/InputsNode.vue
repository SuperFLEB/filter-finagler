<script setup lang="ts">
import OutsideConnections from "@t/OutsideConnections.ts";
import {type NodeProps} from "@vue-flow/core";
import FilterIOHandle from "@/components/Graph/Nodes/FilterIOHandle.vue";

type Props = NodeProps<{}>;
const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
	<div :class="['filterNode', { selected: props.selected }]" style="--barBg: #000; --barFg: #fff">
		<h1 class="title">Inputs</h1>

		<div class="handles">
			<div></div>
			<div class="outputHandles">
				<FilterIOHandle v-for="(_, key) in OutsideConnections" :key="key" direction="out" :attribute="key"
								:nodeId="props.id">
					{{ key }}
				</FilterIOHandle>
			</div>
		</div>
	</div>
</template>

<style scoped src="./node.scss"/>