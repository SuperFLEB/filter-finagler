import {inject} from "vue";
import k from "@/providers/MFTransformProvider/keys.ts";
import {ComposableOutOfContextError} from "@/errors.ts";
import type {MFParseProvidesRefs} from "@/providers/MFTransformProvider/MFTransformProvider.vue";


export default function useMFTransform(): MFParseProvidesRefs {
	const provided = inject<MFParseProvidesRefs>(k.ALL);
	if (!provided) {
		throw new ComposableOutOfContextError("Cannot use useMFTransform outside of an MFTransformProvider");
	}
	return Object.freeze(provided) as MFParseProvidesRefs;
}
