<script setup lang="ts">
import {Handle, Position} from "@vue-flow/core";
import {computed} from "vue";

type Props = { direction: "in" | "out", attribute: string, nodeId: string, active?: boolean };
const props = withDefaults(defineProps<Props>(), {
	active: true,
});
const isInput = computed(() => props.direction === "in");
</script>

<template>
	<div :class="['socket', isInput ? 'input' : 'output']">
		<Handle
			:id="`${props.attribute}@${props.nodeId}`"
			:position="isInput ? Position.Left : Position.Right"
			:type="isInput ? 'target' : 'source'"
		/>
		<div class="label">
			<slot/>
		</div>
	</div>
</template>

<style scoped>
.socket {
	display: flex;
	flex-direction: row;
	flex-grow: 1;
}

.vue-flow__handle {
	position: static;
	height: 10px;
	aspect-ratio: 1 / 1;
	background-color: #46a;
	border-radius: 50%;
	border: 3px solid #ccc;
	transform: none;
}

.label {
	flex-grow: 1;
	margin: 0 1ch;
}

.socket {
	margin-bottom: 0.5lh;
}

.socket.input {
	text-align: left;
	margin-left: -8px;
}

.socket.output {
	flex-direction: row-reverse;
	text-align: right;
	margin-right: -8px;
}
</style>