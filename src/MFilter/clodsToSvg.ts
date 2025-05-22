import {Namespaces} from "@/constants.ts";
import xpath from "@/util/xpath.ts";
import MFilter from "@/MFilter/MFilter.ts";
import type {Clod} from "@t/Clod.ts";
import {clodsToFilterElement} from "@/MFilter/clods.ts";

type MFElement = { mFilter: MFilter, element: Element };

export default function clodsToSvg(svgDoc: XMLDocument, clodsByFilter: Record<string, Clod[]>) {
	const svgDocCopy = document.implementation.createDocument(
		Namespaces.svg,
		""
	);

	svgDocCopy.appendChild(svgDocCopy.importNode(svgDoc.documentElement, true));

	const filterElements = Object.fromEntries(
		xpath(svgDocCopy, "/s:svg/s:defs/s:filter", {s: Namespaces.svg})
			.map(f => [f.id ?? "unknown", f]));

	for (const [filterName, clods] of Object.entries(clodsByFilter)) {
		if (!(filterName in filterElements)) {
			console.error(`Filter element for clod set ${filterName} not found in document. (Internal Error)`);
			continue;
		}
		filterElements[filterName].replaceWith(clodsToFilterElement(clods, filterName));
	}
	return svgDocCopy;
}