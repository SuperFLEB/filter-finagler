import {inject, type Ref} from "vue";
import {type ApplicationProviderInterface} from "./ApplicationProvider.vue";
import {ComposableOutOfContextError} from "@/errors.ts";
import k from "./keys.ts";
import type {FilterDef} from "@/MFilter/types.ts";

export default function useApplication(): {
	interface: ApplicationProviderInterface,
	graphAdd: Readonly<Ref<FilterDef | false>>,
} {
	const intf = inject<ApplicationProviderInterface>(k.INTERFACE);
	const graphAdd = inject<Readonly<Ref<FilterDef | false>>>(k.GRAPH_ADD);
	if (!(intf && graphAdd)) {
		throw new ComposableOutOfContextError("Cannot call useApplication outside of an ApplicationProvider");
	}
	return { interface: intf, graphAdd };
}
