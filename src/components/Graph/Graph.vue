<script setup lang="ts">
import {computed, markRaw} from "vue";
import {ConnectionMode, useVueFlow, VueFlow} from "@vue-flow/core";
import FilterElementNode from "@/components/Graph/Nodes/FilterElementNode.vue";
import layout from "@/components/Graph/autoLayout.ts";
import InputsNode from "@/components/Graph/Nodes/InputsNode.vue";
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import {toGraph} from "@/Project/export.ts";
import {parseOutputRef} from "@/Project/util.ts";

const {project, interface: projectInterface } = useProjectProvider();
const { applyEdgeChanges, applyNodeChanges } = useVueFlow();

const processed = computed(() => {

	// TODO: Support multiple filters
	const {nodes, edges} = toGraph(project.value, "filter");

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

function update(actions) {
	const removes = [];
	const etc = [];
	for (const action of actions) {
		(action.type === "remove" ? removes : etc).push(action);
	}
	applyEdgeChanges(etc);
	for (const action of removes) {
		console.log(processed.value.edges);
		const edge = processed.value.edges.find(e => e.id === action.id);
		if (edge) {
			const target = parseOutputRef(edge.targetHandleId);
			console.log(edge);
			projectInterface.disconnect(target[1], target[0]);
		}
	}
}

function connect(info) {
	const source = parseOutputRef(info.sourceHandle);
	const target = parseOutputRef(info.targetHandle);
	console.log({source, target, info});
	projectInterface.connect(source[1], source[0], target[1], target[0]);
}

</script>

<template>
	<div :class="['graph', $style.graph]">
		<VueFlow
			v-if="processed"
			:nodes="processed.nodesLayout"
			:edges="processed.edges"
			:nodeTypes
			:connection-mode="ConnectionMode.Strict"
			:edges-updatable="true"
			:apply-default="false"
			@nodes-change="applyNodeChanges"
			@edges-change="update($event)"
			@connect="connect"
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