<script setup lang="ts">
import {computed, useTemplateRef} from "vue";
import useMFTransform from "@/providers/MFTransformProvider/useMFTransform.ts";

const containerRef = useTemplateRef("containerRef");
/*
const { parsedUrl } = useMFTransform();
const filterUrl = computed(() => {
	return `url("${parsedUrl.value}#filter")`;
});
*/
const parsedUrl = "";
const filterUrl = computed(() => `url("")`);
</script>

<template>
		<div :style="{'--filter-url': filterUrl}">
			<object v-if="parsedUrl" type="image/svg+xml" :data="parsedUrl" style="width: 0; height: 0; visibility: hidden"></object>
			<div class="container" ref="containerRef" />
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