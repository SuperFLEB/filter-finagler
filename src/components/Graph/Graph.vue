<script setup lang="ts">
import {computed, markRaw} from "vue";
import {
	type Connection,
	ConnectionMode,
	type Edge,
	type EdgeChange,
	type Node as FlowNode,
	type NodeChange,
	useVueFlow,
	VueFlow
} from "@vue-flow/core";
import FilterElementNode from "@/components/Graph/Nodes/FilterElementNode.vue";
import SvgInputsNode from "@/components/Graph/Nodes/SVGInputsNode.vue";
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import {toGraph} from "@/Project/export.ts";
import {parseOutputRef} from "@/Project/util.ts";

const emit = defineEmits<{
	(e: "graphNodeSelectionChange", event: { filter?: string, instanceId?: string }): void
}>();


const {project, interface: projectInterface} = useProjectProvider();
const {applyEdgeChanges, applyNodeChanges, findNode, getSelectedNodes} = useVueFlow();

const processed = computed(() => {

	// TODO: Support multiple filters
	const {nodes, edges}: { nodes: FlowNode[], edges: Edge[] } = toGraph(project.value, "filter");

	return {nodes, edges};
});

const nodeTypes = {
	filterElement: markRaw(FilterElementNode),
	inputs: markRaw(SvgInputsNode),
};

function onEdgesChange(actions: EdgeChange[]) {
	const removes = [];
	const etc = [];

	for (const action of actions) {
		switch (action.type) {
			case "remove":
				removes.push(action);
				break;
			default:
				etc.push(action);
		}
	}
	applyEdgeChanges(etc);
	for (const action of removes) {
		const edge = processed.value.edges.find(e => e.id === action.id);
		if (edge) {
			const target = parseOutputRef(edge.targetHandle);
			projectInterface.disconnect(target[1], target[0]);
		}
	}
}

function onNodesChange(actions: NodeChange[]) {
	const removes = [];
	const etc = [];
	let selectChanged = false;

	for (const action of actions) {
		switch (action.type) {
			case "remove":
				removes.push(action);
				break;
			case "position":
				if (action.dragging === false) {
					const node = findNode(action.id);
					const { x = 0, y = 0 } = action.position ?? node?.computedPosition ?? {};
					if (node?.data?.type) projectInterface.reposition(node.data, {x, y});
				}
				etc.push(action);
				break;
			case "select":
				selectChanged = true;
				etc.push(action);
				break;
			default:
				etc.push(action);
		}
	}

	for (const action of removes) {
		const node = processed.value.nodes.find(e => e.id === action.id);
		if (node) {
			projectInterface.remove(node.data);
		}
	}

	if (selectChanged) {
		const selectedInstanceId = getSelectedNodes.value[0]?.data?.instanceId;
		if (!(selectedInstanceId)) {
			emit("graphNodeSelectionChange", { filter: "filter" });
			return;
		}
		emit("graphNodeSelectionChange", { filter: "filter", instanceId: selectedInstanceId });
	}

	applyNodeChanges(etc);
}

function connect(connection: Connection) {
	if (!(connection.sourceHandle && connection.targetHandle)) {
		console.error("Connection could not be made because source or target handle was null or undefined");
		return;
	}
	const source = parseOutputRef(connection.sourceHandle);
	const target = parseOutputRef(connection.targetHandle);
	projectInterface.connect(source[1], source[0], target[1], target[0]);
}

</script>

<template>
	<div :class="['graph', $style.graph]">
		<VueFlow
			:nodes="processed.nodes"
			:edges="processed.edges"
			:nodeTypes
			:connection-mode="ConnectionMode.Strict"
			:edges-updatable="true"
			:apply-default="false"
			@nodes-change="onNodesChange"
			@edges-change="onEdgesChange"
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