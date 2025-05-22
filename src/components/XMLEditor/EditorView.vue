<script setup lang="ts">
import {onMounted, useTemplateRef, watch} from "vue";
import {
	crosshairCursor,
	drawSelection,
	dropCursor,
	EditorView, highlightActiveLine, highlightActiveLineGutter,
	highlightSpecialChars, keymap,
	lineNumbers,
	rectangularSelection, type ViewUpdate
} from "@codemirror/view";
import {
	bracketMatching,
	defaultHighlightStyle,
	foldGutter, foldKeymap,
	indentOnInput,
	syntaxHighlighting
} from "@codemirror/language";
import {EditorState} from "@codemirror/state";
import {autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap} from "@codemirror/autocomplete";
import {
	defaultKeymap, history, historyKeymap, indentWithTab
} from "@codemirror/commands";
import {
	searchKeymap
} from "@codemirror/search";
import {xml} from "@codemirror/lang-xml"

const editorRef = useTemplateRef("editorRef");
let view: EditorView;

type Props = { text: string };
const props = withDefaults(defineProps<Props>(), { text: "<svg />"});
const emit = defineEmits(["update", "registerUpdateFunction"]);

function documentUpdated(vu: ViewUpdate) {
	emit("update", vu.state.doc.toString());
}

function updateDocument(is: string) {
	if (view && is !== view.state.doc.toString()) {
		console.log("Text update", is);
		view.dispatch({ changes: [{ from: 0, to: view.state.doc.length, insert: is }] });
	}
}

onMounted(() => {
	emit("registerUpdateFunction", updateDocument);
	const startingDoc = props.text ?? "<svg />";
	view = new EditorView({
		doc: startingDoc,
		parent: editorRef.value as Element,
		extensions: [
			// XML support
			xml(),
			// A line number gutter
			lineNumbers(),
			// A gutter with code folding markers
			foldGutter(),
			// Replace non-printable characters with placeholders
			highlightSpecialChars(),
			// The undo history
			history(),
			// Replace native cursor/selection with our own
			drawSelection(),
			// Show a drop cursor when dragging over the editor
			dropCursor(),
			// Allow multiple cursors/selections
			EditorState.allowMultipleSelections.of(true),
			// Re-indent lines when typing specific input
			indentOnInput(),
			// Highlight syntax with a default style
			syntaxHighlighting(defaultHighlightStyle),
			// Highlight matching brackets near cursor
			bracketMatching(),
			// Automatically close brackets
			closeBrackets(),
			// Load the autocompletion system
			autocompletion(),
			// Allow alt-drag to select rectangular regions
			rectangularSelection(),
			// Change the cursor to a crosshair when holding alt
			crosshairCursor(),
			// Style the current line specially
			highlightActiveLine(),
			// Style the gutter for current line specially
			highlightActiveLineGutter(),
			// Update listener,
			EditorView.updateListener.of(documentUpdated),
			keymap.of([
				// Closed-brackets aware backspace
				...closeBracketsKeymap,
				// A large set of basic bindings
				...defaultKeymap,
				// Search-related keys
				...searchKeymap,
				// Redo/undo keys
				...historyKeymap,
				// Code folding bindings
				...foldKeymap,
				// Autocompletion keys
				...completionKeymap,
				//
				indentWithTab,
				// Keys related to the linter system
				// ...lintKeymap
			])
		]
	});
});
</script>

<template>
	<div class="editor" ref="editorRef"></div>
</template>

<style scoped>
.editor {
	display: flex;
	height: 100%;
}

.editor > * {
	flex-grow: 1;
}
</style>