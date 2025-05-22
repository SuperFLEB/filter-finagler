const DirtyState = Object.freeze({
	"CLEAN": false,
	"EDITOR_CHANGED": Symbol("EDITOR_CHANGED"),
	"DOCUMENT_CHANGED": Symbol("DOCUMENT_CHANGED"),
} as const);

export type DirtyStateValue = typeof DirtyState[keyof typeof DirtyState];
export default DirtyState;