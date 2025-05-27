<script setup lang="ts">
import percent from "@/util/percent.ts";
import Tabs from "@/components/Tabs/Tabs.vue";
import Tab from "@/components/Tabs/Tab.vue";
import ApplicationProvider from "@/providers/ApplicationProvider.vue";
import Editor from "@/components/XMLEditor/Editor.vue";
import Viewer from "@/components/Viewer.vue";
import Splitter from "@/components/Splitter.vue";
import Graph from "@/components/Graph/Graph.vue";
import XMLViewer from "@/components/XMLViewer.vue";
import {type CSSProperties, ref, shallowRef} from "vue";
import FilterElementEditor from "@/components/FilterElementEditor.vue";

const layoutRef = shallowRef<HTMLElement>();
const layoutStyleRef = ref<CSSProperties>({});

const setSplit = (leftProportion: number = 0.5) => {
	layoutStyleRef.value.gridTemplateColumns = `${percent(leftProportion)} min-content auto`;
};

const selected = ref<{ filter?: string, instanceId?: string }>({});

function select({ filter, instanceId }: { filter?: string, instanceId?: string }): void {
	selected.value = { filter, instanceId };
}
</script>

<template>
	<div class="layout" :style="layoutStyleRef" ref="layoutRef">
		<ApplicationProvider>
			<Tabs style="grid-area: nw">
				<Tab id="graph" title="Builder">
					<Graph class="visualizer" @graphNodeSelectionChange="select" />
				</Tab>
				<Tab id="xml" title="XML">
					<Editor />
				</Tab>
			</Tabs>
			<Tabs style="grid-area: sw">
				<Tab id="element" title="Element Editor">
					<FilterElementEditor :filter="selected.filter" :selectedInstanceId="selected.instanceId" />
				</Tab>
			</Tabs>
			<Splitter class="splitter" :onSplit="setSplit" :parent="layoutRef!" style="grid-area: splitter"/>
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
	grid-template-rows: 60% 40%;
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