import {inject, type Ref} from "vue";
import k from "./keys.ts";
import {ComposableOutOfContextError} from "@/errors.ts";
import type {
	StructuredDocumentProviderDocument,
	StructuredDocumentProviderInterface
} from "./StructuredDocumentProvider.vue";

export default function useStructuredDocumentProvider() {
	const intf = inject<StructuredDocumentProviderInterface>(k.INTERFACE);
	const doc = inject<Ref<StructuredDocumentProviderDocument>>(k.DOCUMENT);

	if (!(intf && doc)) throw new ComposableOutOfContextError("useStructuredDocumentProvider can't be used without StructuredDocumentProvider");

	return { interface: intf, document: doc };
}