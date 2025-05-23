import {inject, type Ref} from "vue";
import k from "./keys.ts";
import {ComposableOutOfContextError} from "@/errors.ts";
import type {
	ProjectModel,
	ProjectModelInterface
} from "./ProjectProvider.vue";

export default function useProjectProvider() {
	const intf = inject<ProjectModelInterface>(k.INTERFACE);
	const project = inject<Ref<ProjectModel>>(k.PROJECT);

	if (!(intf && project)) throw new ComposableOutOfContextError("useProjectProvider can't be used outside a ProjectProvider");

	return { interface: intf, project };
}