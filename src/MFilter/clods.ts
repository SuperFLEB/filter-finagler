import type {Clod} from "@t/Clod.ts";
import isElementNode from "@/util/isElementNode.ts";
import getMFilter from "@/MFilter/getMFilter.ts";
import {Namespaces} from "@/constants.ts";
import {toRaw} from "vue";

const nextId = (() => {
	let id = 0;
	return () => id++;
})();

function isValidNode(node: Node) {
	if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) return false;
	return true;
}

export function clodsToFilterElement(clods: Clod[], filterId: string): SVGFilterElement {
	const filter: SVGFilterElement = document.createElementNS(Namespaces.svg, "filter");
	filter.setAttribute("id", filterId);
	for (const clod of clods) {
		for (const commentText of clod.comments ?? []) {
			filter.appendChild(
				document.createComment(commentText)
			);
		}

		// Comment-only clods
		if (!clod.element) continue;

		// Most elements should be covered by MFs, but this covers our butt if that's not the case.
		if (!clod.mf) {
			filter.appendChild(clod.element.cloneNode(true));
			continue;
		}

		// Generate the output from an MF clod.
		const wrappedSvg = toRaw(clod.mf)?.toWrappedXmlDoc();
		filter.append(...wrappedSvg?.documentElement.childNodes);
	}

	return filter;
}

export function filterToClods(svgDoc: XMLDocument, filterElement: Element) {
	const children = Array.from(filterElement.childNodes).filter(n => isValidNode(n));

	const clods: Clod[] = [];
	let clod: Clod | undefined;

	for (const child of children) {
		// Ignore text nodes when parsing filters. They shouldn't be here in the first place.
		if (child.nodeType === Node.TEXT_NODE) continue;

		if (clod === undefined) {
			clods.push(clod = {id: nextId()});
		}

		if (child.nodeType === Node.COMMENT_NODE) {
			if (!child.textContent?.trim()) {
				// This is an empty comment meant to separate prior comment blocks from being applied to the next node.
				clod = undefined;
				continue;
			}
			clod.comments ??= [];
			clod.comments.push(child.textContent ?? "");
			continue;
		}

		if (isElementNode(child)) {
			clod.element = child;
			clod.mf = getMFilter(child, svgDoc);
			clod = undefined;
			continue;
		}

		console.warn(`Unknown node type ${child.nodeType} encountered (${child.nodeName} node)`);
	}

	return clods;
}