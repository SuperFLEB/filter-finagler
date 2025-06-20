<script setup lang="ts">
import {computed, ref} from "vue";
import {colord} from "colord";
import randomString from "@/util/randomString.ts";

type Props = { color: string };
const props = withDefaults(defineProps<Props>(), {color: "#000"});
const emit = defineEmits(["change"]);

type ColorComponentName = "h" | "s" | "l" | "r" | "g" | "b";
type ColorModel = "hsl" | "rgb";

const rainbowSize = [360, 180];

const layoutsByComponent: Record<ColorComponentName, [ColorComponentName, ColorComponentName, ColorComponentName]> = {
	h: ["h", "l", "s"],
	s: ["h", "l", "s"],
	l: ["h", "l", "s"],
	r: ["b", "g", "r"],
	g: ["b", "r", "g"],
	b: ["r", "g", "b"],
};

const max = {
	h: 360,
	s: 100,
	l: 100,
	r: 255,
	g: 255,
	b: 255,
};

const gradientDefs = {
	h: ["#f00", "#ff0", "#0f0", "#0ff", "#00f", "#f0f", "#f00"],
	s: ["#000", "#f00"],
	l: ["#000", "transparent", "#fff"],
	r: ["#000", "#f00"],
	g: ["#000", "#0f0"],
	b: ["#000", "#00f"],
};

function setActiveComponent(component: ColorComponentName) {
	components.value = layoutsByComponent[component];
}

function getColorModel(component: ColorComponentName): ColorModel {
	for (const model of ["hsl", "rgb"] as const) {
		if (model.includes(component)) return model;
	}
	return "rgb";
}

function getZColor(component: ColorComponentName, value: number) {
	const components = {h: 0, s: 100, l: 50, r: 0, g: 0, b: 0};
	components[component] = value;
	switch (getColorModel(component)) {
		case "hsl":
			return `hsl(${components.h}deg, ${components.s}%, ${components.l}%)`;
		case "rgb":
			return `rgb(${components.r}, ${components.g}, ${components.b})`;
	}
}

function linearGradient(colors: string[], direction?: string) {
	if (direction) colors = [direction, ...colors];
	return "linear-gradient(" + colors.join(",") + ")";
}

function getZGradient(component: ColorComponentName, direction?: string) {
	// Simple gradients not based on other components
	if ("hrgb".includes(component)) return linearGradient(gradientDefs[component], direction);
	const baseColor = colord(props.color);
	switch (component) {
		case "s":
			return linearGradient([
				colord({...baseColor.toHsl(), s: 0}).toHex(),
				colord({...baseColor.toHsl(), s: 100}).toHex(),
			], direction);
		case "l":
			return linearGradient([
				colord({...baseColor.toHsl(), l: 0}).toHex(),
				colord({...baseColor.toHsl(), l: 50}).toHex(),
				colord({...baseColor.toHsl(), l: 100}).toHex(),
			], direction);
	}
}

const values = computed<Record<ColorComponentName, number>>(() => {
	const pHSL = colord(props.color).toHsl();
	const pRGB = colord(props.color).toRgb();
	return {
		h: pHSL.h,
		s: pHSL.s,
		l: pHSL.l,
		r: pRGB.r,
		g: pRGB.g,
		b: pRGB.b,
	};
});

const components = ref<[ColorComponentName, ColorComponentName, ColorComponentName]>(["h", "l", "s"]);

const zValue = computed(() => Number(values.value[components.value[2]]));
const zColor = computed(() => getZColor(components.value[2], zValue.value));
const zGradient = computed(() => getZGradient(components.value[2], "0deg"));

const pointer = computed(() => [
	values.value[components.value[0]] * rainbowSize[0] / max[components.value[0]],
	rainbowSize[1] - (values.value[components.value[1]] * rainbowSize[1] / max[components.value[1]]),
]);

const gradients = computed(() => {
	const result: { x?: string[], y?: string[] } = {};
	if (components.value[0] in gradientDefs) result.x = gradientDefs[components.value[0] as keyof typeof gradientDefs];
	if (components.value[1] in gradientDefs) result.y = gradientDefs[components.value[1] as keyof typeof gradientDefs];
	return result;
});

const random = randomString(10);

const styleVars = computed(() => ({
	"--z-gradient": zGradient.value,
	"--z-color": zColor.value,
	"--selected-color": colord(props.color).toHex(),
}));

type ColorValues = { r: number, g: number, b: number } | { h: number, s: number, l: number };

function rainbowClick(e: MouseEvent) {
	changeColor({
		[components.value[0]]: e.offsetX / (rainbowSize[0] / max[components.value[0]]),
		[components.value[1]]: (rainbowSize[1] - e.offsetY) / (rainbowSize[1] / max[components.value[1]]),
		[components.value[2]]: zValue.value,
	});
}

function input(component: ColorComponentName, e: Event) {
	changeColor({ [component]: Number((e.target as HTMLInputElement).value) });
}

function changeColor(changes: Partial<ColorValues>) {
	let newColor: string = props.color;
	let firstKey = Object.keys(changes)[0];
	if ('rgb'.includes(firstKey)) newColor = colord({ ...colord(props.color).toRgb(), ...changes }).toHex();
	if ('hsl'.includes(firstKey)) newColor = colord({ ...colord(props.color).toHsl(), ...changes }).toHex();
	emit("change", newColor);
}

</script>

<template>
	<div class="colorPicker" :style="styleVars">
		<svg class="rainbow" :width="rainbowSize[0]" :height="rainbowSize[1]" :viewBox="[0, 0, rainbowSize[0], rainbowSize[1]].join(' ')" @click="rainbowClick">
			<defs>
				<linearGradient v-for="(stops, axis, index) in gradients" :id="`${random}-gradient-${axis}`"
								v-bind="{ ...(axis === 'y' && {gradientTransform: 'rotate(-90 .5 .5)'}) }">
					<stop v-for="(stop, index) in stops ?? []" :offset="100 * index / ((stops ?? []).length - 1) + '%'"
						  :stop-color="stop"/>
				</linearGradient>
			</defs>
			<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
				<template v-for="(component, index) of components.slice(0,2)">
					<rect :class="[component, `layer-${index}`]" width="100" height="100"
						  :fill="`url('#${random}-gradient-${('xy')[index]}')`"/>
				</template>
				<rect :class="components[2]" :fill="zColor" width="100" height="100"/>
			</svg>
			<circle class="pointer" r="4.5" fill="none" stroke="#fff" stroke-width="3" :cx="pointer[0]" :cy="pointer[1]"/>
		</svg>
		<input type="range" min="0" max="100" :value="zValue" class="z-slider" @input="changeColor({ [components[2]]: Number(($event.target as HTMLInputElement).value) })"/>

		<div class="rgbComponents">
			<label class="componentLabel" v-for="component in 'rgb'">
				{{ component }}:
				<input type="number" min="0" max="100" step="1" :name="component" :value="values[component as keyof typeof values]"
					   @focus="setActiveComponent(component as ColorComponentName)"
					   @change="input(component as ColorComponentName, $event)" />
			</label>
		</div>
		<div>
			<label class="componentLabel" v-for="component in 'hsl'">
				{{ component }}:
				<input type="number" :name="component" :value="values[component as keyof typeof values]" min="0" :max="component === 'h' ? 360 : 100" step="1"
					   @focus="setActiveComponent(component as ColorComponentName)"
					   @change="input(component as ColorComponentName, $event)" />
			</label>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "./range.scss" as r;

input[type=number] {
	width: 5ch;
}

.rainbow {
	position: relative;
}

.pointer {
	mix-blend-mode: difference;
}

.rainbow {
	.l {
		mix-blend-mode: luminosity;
	}

	.h {
		mix-blend-mode: hue;
	}

	.s {
		mix-blend-mode: saturation;
	}

	.r, .g, .b {
		mix-blend-mode: screen;
	}

	.layer-0 {
		mix-blend-mode: normal;
	}
}

.z-slider {
	@include r.reset;

	writing-mode: vertical-lr;
	direction: rtl;
	inline-size: 180px;

	@include r.track {
		block-size: 0.5em;
		margin-block: 0.5em;
		background: var(--z-gradient);
		border-radius: .5em;
	}

	@include r.thumb {
		border: 3px solid rgba(0, 0, 0, 0.4);
		inline-size: 1.5em;
		margin-block-start: -.5em;
		aspect-ratio: 1 / 1;
		background-color: var(--selected-color);
		border-radius: .75em;
	}
}
</style>