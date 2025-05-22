<script setup lang="ts">
import k from "./keys.ts";
import {inject, onMounted, onUnmounted, type Ref} from "vue";
import type {TabsInterface} from "@/components/Tabs/Tabs.vue";

type Props = { id: string, title: string };
const props = withDefaults(defineProps<Props>(), {});

const tabsIntf = inject<TabsInterface>(k.INTERFACE);
const active = inject<Ref<string>>(k.ACTIVE);

if (!(tabsIntf && active)) throw new Error("<Tab> must be used within a <Tabs> component body");

onMounted(() => tabsIntf.register(props.id, props.title));
onUnmounted(() => tabsIntf.unregister(props.id));
</script>

<template>
	<slot v-if="active === props.id" />
</template>

<style scoped>

</style>