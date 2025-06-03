<script setup lang="ts">
import {type CSSProperties, ref} from "vue";
import useApplication from "@/providers/ApplicationProvider/useApplication.ts";
import type {FilterDef} from "@/MFilter/types.ts";
import {useVueFlow} from "@vue-flow/core";

const emit = defineEmits<{
	(e: "place", filterDef: FilterDef, coords: { x: number, y: number }): void;
}>();

const proxyPositionStyle = ref<CSSProperties>({display: "none"});
const { interface: applicationInterface, graphAdd } = useApplication();

const { screenToFlowCoordinate } = useVueFlow();

function move(e: MouseEvent) {
	proxyPositionStyle.value = {
		...proxyPositionStyle.value,
		display: "block",
		left: `${e.offsetX}px`,
		top: `${e.offsetY}px`,
	};
}

function leave() {
	proxyPositionStyle.value = {
		...proxyPositionStyle.value,
		display: "none",
	};
}

function click(e: MouseEvent) {
	e.preventDefault();
	switch (e.button) {
		case 0:
			emit("place", graphAdd.value as FilterDef, screenToFlowCoordinate({ x: e.clientX, y: e.clientY }));
			return;
		case 2:
			applicationInterface.graphAddMode(false);
			return;
		default:
			return;
	}
}

</script>

<template>
	<div class="addModeOverlay" @mousemove="move" @mouseleave="leave" @mouseup="click" @contextmenu="$event.preventDefault()">
		<div :class="['proxy', 'filterNode']" :style="{ ...proxyPositionStyle, '--barBg': '#fff', '--barFg': '#000'}">
			<h1>{{ (graphAdd as FilterDef).displayName }}</h1>
			<div class="handles"></div>
		</div>
	</div>
</template>

<style scoped lang="scss" src="./node.scss"/>
<style scoped lang="scss">
.addModeOverlay {
	position: absolute;
	cursor: none;
	overflow: hidden;

	inset: 0;
}

.proxy.filterNode {
	position: absolute;
	pointer-events: none;
	box-shadow: 0 0 40px 20px #def;

	border: 1px dashed #000;
	background-color: #fff;

	h1 {
		border-bottom: 1px dashed #000;
	}
}
</style>