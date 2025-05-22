<script setup lang="ts">
import {computed, markRaw} from "vue";
import {ConnectionMode, type Edge, type Node as FlowNode, Position, VueFlow} from "@vue-flow/core";
import getConnections from "@/components/Graph/getConnections.ts";
import FilterElementNode from "@/components/Graph/Nodes/FilterElementNode.vue";
import layout from "@/components/Graph/autoLayout.ts";
import useMFTransform from "@/providers/MFTransformProvider/useMFTransform.ts";
import objectMap from "@/util/objectMap.ts";
import type {Clod} from "@t/Clod.ts";
import {OutsideConnectionsKeys} from "@t/OutsideConnections.ts";
import InputsNode from "@/components/Graph/Nodes/InputsNode.vue";
import useStructuredDocumentProvider from "@/providers/StructuredDocumentProvider/useStructuredDocumentProvider.ts";
import type {SVGMFilterElement} from "@t/StructuredDocument.ts";
import {toGraph} from "@/structuredDocument/export.ts";

const {document: doc} = useStructuredDocumentProvider();

const processed = computed(() => {

	// TODO: Support multiple filters
	const {nodes, edges} = toGraph(doc.value, "filter");

	const nodesLayout = layout(
		nodes,
		edges
	);

	return {nodesLayout, edges};
});

const nodeTypes = {
	filterElement: markRaw(FilterElementNode),
	inputs: markRaw(InputsNode),
};

</script>

<template>
	<div :class="['graph', $style.graph]">
		<VueFlow
			v-if="processed"
			:nodes="processed.nodesLayout"
			:edges="processed.edges"
			:edges-updatable="true"
			:nodeTypes
			:connection-mode="ConnectionMode.Strict"
		/>
	</div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
</style>
<style module lang="scss" src="./vueFlowStyle.scss"/>
<style scoped>
.graph {
	position: absolute;
	inset: 0;
}
</style>