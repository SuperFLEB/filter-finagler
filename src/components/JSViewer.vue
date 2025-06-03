<script setup lang="ts">
import useProjectProvider from "@/providers/ProjectProvider/useProjectProvider.ts";
import {computed} from "vue";
import stringifyPlus from "@/util/stringifyPlus.ts";

const { project } = useProjectProvider();
const stringified = computed(() => stringifyPlus(project.value));
</script>

<template>
<pre>{{ stringified }}</pre>
</template>
