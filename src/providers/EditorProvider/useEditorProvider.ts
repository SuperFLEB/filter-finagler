import keys from "./keys.ts";
import {inject, type Ref} from "vue";
import type {EditorProviderInterface} from "@/components/XMLEditor/Editor.vue";
import type {DirtyStateValue} from "@/components/XMLEditor/DirtyState.ts";

const useEditorProvider = () => {
	const dirtyState = inject<Ref<DirtyStateValue>>(keys.DIRTY_STATE);
	const intf = inject<EditorProviderInterface>(keys.INTERFACE);

	if (!intf || dirtyState === undefined) throw new Error("useEditorProvider cannot be used outside an XMLEditor context");

	return {
		dirtyState,
		interface: intf,
	};
};

export default useEditorProvider;