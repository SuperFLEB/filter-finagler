<script setup lang="ts">
import versionInfo from "@superfleb/vite-plugin-versioninfo";
import {ref} from "vue";

const v = versionInfo();
const seen = localStorage.getItem("jankWarningSeenOn");
const show = ref<boolean>(seen !== v.version);

function close() {
	localStorage.setItem("jankWarningSeenOn", v.version);
	show.value = false;
}
</script>

<template>
	<div v-if="show" class="shader" @click="close">
		<div class="hereBeDragons">
			<h1>Filter Finagler: The Work-in-progress</h1>
			<p>Version {{ v.version }}, built {{ new Date(v.buildTime).toLocaleDateString() }}</p>
			<p>
				Thanks for checking out <strong>Filter Finagler</strong>. Currently, it's in <strong>active initial development</strong>.
				This is to say that it's a work in progress and right now it's chock full of jank, debug, missing features,
				and is straight-up busted in some fundamental ways. If you'd like to see the code (or fork it and race me to the finish line), check out
				<a href="https://github.com/SuperFLEB/filter-finagler" target="_blank" @click="$event.stopPropagation()">the GitHub repo</a>.
			</p>
			<p>
				If you've already seen this message and you're seeing it again, that probably means this is a newer version.
				Hey, maybe something works now that didn't last time!
			</p>
			<p class="clickOff">Click anywhere to dive in!</p>
		</div>
	</div>
</template>

<style scoped>
.shader {
	display: flex;
	position: fixed;
	inset: 0;
	z-index: 10000;
	background-color: rgba(160, 160, 160, 0.8);
	backdrop-filter: blur(10px) saturate(0);
}

.hereBeDragons {
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-size: 1.25em;

	align-self: center;
	margin: auto;
	padding: 2em;

	background-color: #444;
	color: #ddd;
	width: calc(60vw - 2em);
	max-height: calc(40vw - 2em);

	overflow-y: auto;

	border-radius: 1em;
	box-shadow: 8px 8px 12px rgba(0, 0, 0, 0.5);


	a, a:visited, a:active {
		color: #c80;
	}

	.clickOff {
		display: block;
		padding: 0.5em 2em;
		text-align: center;

		border: none;
		color: #210;
		background-color: #c80;
		border-radius: 0.5em;
	}
}
</style>