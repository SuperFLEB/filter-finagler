import {inject, type Ref} from "vue";
import k from "./keys.ts";
import {ComposableOutOfContextError} from "@/errors.ts";
import type {
	ProjectModel,
	ProjectModelInterface
} from "./ProjectProvider.vue";
import type {FEConnectionStatus} from "@/ProjectModel/validate.ts";

export default function useProjectProvider() {
	const intf = inject<ProjectModelInterface>(k.INTERFACE);
	const project = inject<Ref<ProjectModel>>(k.PROJECT);
	const connected = inject<Ref<FEConnectionStatus>>(k.CONNECTED);

	if (!(intf && project && connected)) throw new ComposableOutOfContextError("useProjectProvider can't be used outside a ProjectProvider");

	return { interface: intf, project, connected };
}