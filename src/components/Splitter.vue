<script setup lang="ts">
import useDraggable from "@superfleb/draggable/vue";
import {Button, type DragState} from "@superfleb/draggable";

type Props = { parent: HTMLElement, onSplit: (proportion: number) => void };
const props = defineProps<Props>();

const {dragStartHandler} = useDraggable({
	onMove: (_: MouseEvent, {pxClientX}: DragState) => {
		const parentRect = props.parent.getBoundingClientRect();
		const proportion = ((pxClientX ?? 0) - parentRect.x) / parentRect.width;
		props.onSplit(proportion);
	}
}, { buttons: Button.PRIMARY });
</script>

<template>
	<div class="splitter" @mousedown="dragStartHandler"></div>
</template>

<style scoped>
	.splitter {
		cursor: ew-resize;
		box-sizing: border-box;
		width: 5px;
		height: 100%;
		border: 1px solid #ccc;
		border-style: none solid;
		user-select: none;
	}
</style>