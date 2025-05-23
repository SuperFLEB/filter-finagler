import {Namespaces} from "@/constants";
import type {StructuredDocument, SVGMFilterElement} from "@/types/StructuredDocument";
import xpath from "@/util/xpath";
import {getOutputRef} from "@/structuredDocument/util.ts";

/**
 * Adds an annotation to a native filter element, or creates an m:fe element for an MFilter.
 *
 * If a sourceElement is given and it is a native element, m:... attributes are added to the element and it is returned.
 * If a sourceElement is given and it is part of an MFilter, an m:fe element is returned along with the original element.
 * If a sourceElement is not given, a native fe... element or an m:fe element is returned, depending on whether the filter is native.
 *
 * The return value is always an array of one or two Elements.
 */
function annotateElement(fe: SVGMFilterElement, ownerDocument: XMLDocument, sourceElement?: Element): Element[] {
	const prefix = sourceElement?.ownerDocument?.lookupPrefix(Namespaces.svgmf1) ?? "m";

	let destElement: Element;

	if (sourceElement && fe.type === "NATIVE") {
		destElement = sourceElement;
	} else {
		destElement = fe.type === "NATIVE" ? ownerDocument.createElementNS(Namespaces.svg, fe.nativeTag) : ownerDocument.createElement(`${prefix}:fe`);
	}

	destElement.setAttribute(`${prefix}:instance`, fe.instanceId);
	destElement.setAttribute(`${prefix}:filter`, fe.appuid);

	for (const [name, input] of Object.entries(fe.inputs ?? {})) {
		const outputRef = (typeof input === "string") ? input : getOutputRef(input.outputName, input.outputInstanceId);
		destElement.setAttribute(name, outputRef);
	}
	for (const [fieldName, outputName] of Object.entries(fe.outputs ?? {})) {
		const outputRef = getOutputRef(outputName, fe.instanceId);
		destElement.setAttribute(fieldName, outputRef);
	}
	for (const [name, value] of Object.entries(fe.values ?? {})) {
		destElement.setAttribute(name, value.toString());
	}

	const results = [destElement];
	if (sourceElement && destElement !== sourceElement) results.push(destElement);

	return results;
}

/**
 * Annotate a filter in the SVG document, adding m:fe nodes or m:... attributes as appropriate.
 */
export function annotate(doc: StructuredDocument, filterName: string, svgDoc?: XMLDocument): XMLDocument {
	const hasSvgDoc = Boolean(svgDoc);
	const mfeElements = doc.filters.get(filterName)?.elements;
	if (!mfeElements) throw new Error(`Filter ${filterName} does not exist`);

	let filterElement = svgDoc ? xpath(svgDoc, `/s:svg/s:defs/s:filter[@id="${filterName}"]`, {s: Namespaces.svg}, true)[0] : undefined;

	if (!(svgDoc && filterElement)) {
		svgDoc = document.implementation.createDocument(Namespaces.svg, "");
		const svgElement = svgDoc.appendChild(document.createElementNS(Namespaces.svg, "svg"));
		svgElement.setAttributeNS(Namespaces.xmlns, "xmlns:m", Namespaces.svgmf1);
		const defsElement = svgElement.appendChild(document.createElementNS(Namespaces.svg, "defs"));
		filterElement = defsElement.appendChild(document.createElementNS(Namespaces.svg, "filter"));
		filterElement.setAttribute("id", filterName);
	}

	for (const fe of mfeElements) {
		const firstInstanceElement: Element | undefined = xpath(filterElement, `//s:*[@m:instance=${fe.instanceId}]`, {
			s: Namespaces.svg,
			m: Namespaces.svgmf1
		}, true)[0];

		const annotatedElements = annotateElement(fe, svgDoc, firstInstanceElement);

		if (firstInstanceElement) {
			firstInstanceElement.replaceWith(...annotatedElements);
		} else {
			filterElement.append(...annotatedElements)
		}
	}

	return svgDoc;
}


