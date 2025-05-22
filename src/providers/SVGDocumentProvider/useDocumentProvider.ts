import {inject, type Ref} from "vue";
import k from "./keys.ts";
import {ComposableOutOfContextError} from "@/errors.ts";
import type {
	DocumentProviderDocument,
	DocumentProviderInterface
} from "@/providers/SVGDocumentProvider/DocumentProvider.vue";

export default function useDocumentProvider() {
	const intf = inject<DocumentProviderInterface>(k.INTERFACE);
	const doc = inject<Ref<DocumentProviderDocument>>(k.DOCUMENT);

	if (!(intf && doc)) throw new ComposableOutOfContextError("useDocumentProvider can't be used without SVGDocumentProvider");

	return { interface: intf, document: doc };
}