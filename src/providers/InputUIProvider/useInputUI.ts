import k from "./keys.ts";
import {inject} from "vue";
import type {InputUIProviderInterface} from "@/providers/InputUIProvider/InputUIProvider.vue";
import {ComposableOutOfContextError} from "@/errors.ts";

export default function useInputUI() {
	const intf = inject<InputUIProviderInterface>(k.INTERFACE);
	if (!intf) throw new ComposableOutOfContextError("Cannot use useInputUI outside of an InputUIProvider");
	return {interface: intf};
}