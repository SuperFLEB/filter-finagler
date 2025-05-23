<script setup lang="ts">
import {computed} from "vue";
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import {domToString} from "@/util/xml.ts";
import prettyXML from "@/util/prettyXML.ts";

const {interface: intf, project} = useProjectProvider();

const svgText = computed(() => {
	project.value;
	return prettyXML(domToString(intf.toSvg()));
});
const svgUrl = computed(() => URL.createObjectURL(new Blob([svgText.value], { type: "image/svg+xml" })));
const filterUrl = computed(() => `url("${svgUrl.value}#filter")`);

</script>

<template>
		<div :style="{'--filter-url': filterUrl}">
			<div class="container" />
			<div class="filtered">
				<div><img src="@/assets/decorative-eggs_PB6TLGYIXH.png"></div>
				<p>
					Lauren Ipscombe dolorously sits unmet. Consecutive auspicious elites said, "Do temper indictments of
					laborious dullards magnified by liquor." Utter venom and menial vanity. Quips of nonsense
					excitation,
					ultimately laboring nicely but ill-equipped, ex-commando consequences.
				</p>
			</div>
		</div>
</template>

<style scoped>
.filtered {
	filter: var(--filter-url);
}
</style>