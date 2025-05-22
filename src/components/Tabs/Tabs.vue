<script setup lang="ts">
import {provide, ref} from "vue";
import randomString from "@/util/randomString.ts";
import tabSvg from "@/assets/tab.svg";
import k from "./keys.ts";

type TabInfo = {
	key: string;
	title: string;
};

const radioGroupName = randomString(10, "tabs-");

const tabDefs = ref(new Map<string, TabInfo>());
const active = ref<string | null>(null);

const firstTab = () => (tabDefs.value.values().next().value as TabInfo | undefined) ?? null;

const intf = {
	register(key: string, title: string) {
		tabDefs.value.set(key, { key, title });
		if (active.value === null) this.activate();
	},
	unregister(key: string) {
		tabDefs.value.delete(key);
		if (active.value === key) this.deactivate();
	},
	activate(key?: string) {
		let tab = key ? tabDefs.value.get(key) ?? null : null;
		if (!tab) {
			const first = firstTab();
			tab = first ?? null;
		}
		active.value = tab ? tab.key : null;
	},
	deactivate() {
		active.value = firstTab()?.key ?? null;
	}
};
export type TabsInterface = typeof intf;

provide(k.INTERFACE, intf);
provide(k.ACTIVE, active);

function update() {
	const checked = document.querySelector<HTMLInputElement>(`input:checked[name="${radioGroupName}"]`);
	if (checked) intf.activate(checked.value);
}

const activeTabSvg = `url("${tabSvg}#active")`;
const inactiveTabSvg = `url("${tabSvg}")`;
</script>

<template>
	<div class="setAndTab">
		<div class="tabSet">
			<ul v-if="tabDefs.size > 0" class="tabSelectSet">
				<li class="tabSelect" v-for="tabDef in tabDefs.values()" :key="tabDef.key">
					<label><input type="radio" :name="radioGroupName" :value="tabDef.key" :checked="tabDef.key === active" @input="update">{{ tabDef.title }}</label>
				</li>
			</ul>
		</div>
		<div class="tabContent">
			<slot/>
		</div>
	</div>
</template>

<style scoped lang="scss">
.setAndTab {
	display: flex;
	flex-direction: column;
}

.tabContent {
	flex-grow: 1;
	position: relative;
}

.tabSelectSet {
	font: 10pt "Helvetica Neue", Helvetica, Arial, sans-serif;

	list-style-type: none;
	margin: 0;
	padding: .25em 0 0 1em;
	background-color: #666;

	display: flex;
	flex-direction: row;

	> .tabSelect {
		display: inline-block;
		height: var(--height);
		padding: 0.25em;
		padding-right: 1em;
		margin-bottom: -1px;
		margin-right: -.25em;

		background-image: v-bind("inactiveTabSvg");
		background-size: 100% 100%;
	}

	> .tabSelect:has(input:checked) {
		border-bottom: none;
		background-image: v-bind("activeTabSvg");
		color: #000;
	}

	label:has(input:focus, input:active) {
		padding: calc(0.25em - 1px);
		margin-bottom: -1px;
		border: 1px dotted black;
	}

	label {
		display: block;
		padding: 0.25em;
	}

	input[type=radio] {
		appearance: none;
		display: inline;
		width: 0;
		height: 0;
		margin: 0;
		padding: 0;
	}
}
</style>