<script setup lang="ts">
import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import useInputUI from "@/providers/InputUIProvider/useInputUI.ts";
import {colord} from "colord";
import {computed} from "vue";
import ColorPicker from "@/components/ColorPicker/ColorPicker.vue";

type Props = { label: string, fe: FilterElement, property: string };
const props = withDefaults(defineProps<Props>(), {});

defineEmits(["update"]);

const { interface: uiInterface } = useInputUI();

function update(value: string) {
	uiInterface.updateValueFromString(props.property, value);
}

const color = computed(() => colord((props.fe.values?.[props.property] ?? "#000").toString()).toHex());
</script>

<template>
	<div class="color">
		<ColorPicker :color="color" @change="update" />
	</div>
	<label>{{ label }}: <input type="color" :value="color" @change="update(($event.target as HTMLInputElement).value)" /></label>
</template>

<style scoped>

</style>