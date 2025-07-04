<script setup lang="ts">
import percent from "@/util/percent.ts";
import Tabs from "@/components/Tabs/Tabs.vue";
import Tab from "@/components/Tabs/Tab.vue";
import ApplicationProvider from "@/providers/ApplicationProvider/ApplicationProvider.vue";
import Editor from "@/components/XMLEditor/Editor.vue";
import Viewer from "@/components/Viewer.vue";
import Splitter from "@/components/Splitter.vue";
import Graph from "@/components/Graph/Graph.vue";
import XMLViewer from "@/components/XMLViewer.vue";
import {type CSSProperties, ref, shallowRef} from "vue";
import FilterElementEditor from "@/components/FilterElementEditor/FilterElementEditor.vue";
import JSViewer from "@/components/JSViewer.vue";
import Warning from "@/components/Warning.vue";

const layoutRef = shallowRef<HTMLElement>();
const layoutStyleRef = ref<CSSProperties>({});

function setVerticalSplit(leftProportion: number = 0.5) {
	layoutStyleRef.value.gridTemplateColumns = `${percent(leftProportion)} min-content auto`;
}

const graphAddMode = ref<boolean>(false);
const selected = ref<{ filter?: string, instanceId?: string }>({});

function select({filter, instanceId}: { filter?: string, instanceId?: string }): void {
	selected.value = {filter, instanceId};
}
</script>

<template>
	<Warning />
	<div class="layout" :style="layoutStyleRef" ref="layoutRef">
		<ApplicationProvider>
			<Tabs style="grid-area: nw">
				<Tab id="graph" title="Builder" :graphAddMode>
					<Graph class="visualizer" @graphNodeSelectionChange="select"/>
				</Tab>
				<Tab id="xml" title="XML">
					<Editor/>
				</Tab>
				<Tab id="internal" title="Debug">
					<JSViewer/>
				</Tab>
			</Tabs>
			<Tabs style="grid-area: sw">
				<Tab id="element" title="Element Editor">
					<FilterElementEditor :graphAddMode :filter="selected.filter"
										 :selectedInstanceId="selected.instanceId"/>
				</Tab>
			</Tabs>
			<Splitter class="splitter" :onSplit="setVerticalSplit" :parent="layoutRef!"
					  style="grid-area: splitter"/>
			<Tabs style="grid-area: e">
				<Tab id="preview" title="Preview">
					<Viewer class="viewer"/>
				</Tab>
				<Tab id="rendered" title="Rendered XML">
					<XMLViewer/>
				</Tab>
			</Tabs>
		</ApplicationProvider>
	</div>
</template>

<style scoped lang="scss">
.layout {
	position: absolute;
	inset: 0;
	display: grid;
	max-width: 100%;
	grid-template-columns: 1fr min-content 1fr;
	grid-template-rows: 50% 50%;
	grid-template-areas: "nw splitter e"
	                     "sw splitter e";

	font-family: sans-serif;
}

.layout > * {
	min-width: 1px;
	position: relative;
}

.layout:deep(.cm-editor), .layout:deep(.tabContent) {
	overflow: auto;
}
</style>