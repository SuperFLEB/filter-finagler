<script setup lang="ts">
import {computed} from "vue";
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import {domToString} from "@/util/xml.ts";
import prettyXML from "@/util/prettyXML.ts";
import DOMRenderer from "@/components/DOMRenderer.ts";

const {interface: intf, project} = useProjectProvider();

const svgDoc = computed(() => {
	project.value;
	return intf.export("svg");
});
const filterUrl = computed(() => `url("#filter")`);

</script>

<template>
	<div :style="{'--filter-url': filterUrl}">
		<div class="container"/>
		<div class="filtered">
			<div><img src="@/assets/hand.png"></div>
			<p>
				Lauren Ipscombe dolorously sits unmet. Consecutive auspicious elites said, "Do temper indictments of
				laborious dullards magnified by liquor." Utter venom and menial vanity. Quips of nonsense
				excitation,
				ultimately laboring nicely but ill-equipped, ex-commando consequences.
			</p>
		</div>
	</div>
	<DOMRenderer :doc="svgDoc"/>
</template>

<style scoped>
.filtered {
	filter: var(--filter-url);
}
</style>