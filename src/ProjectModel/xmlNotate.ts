import {Namespaces} from "@/constants";
import type {ProjectModel, FilterElement} from "@/ProjectModel/ProjectModel.ts";
import xpath from "@/util/xpath";
import {getOutputRefName, makeOutputNodeRef} from "@/ProjectModel/util.ts";
import {getFilterDef} from "@/ProjectModel/info.ts";
import type {FEConnectionStatus} from "@/ProjectModel/validate.ts";

const RESERVED_M_FIELDS = ["instance", "filter"];

function createElement(fe: FilterElement, doc: XMLDocument): Element {
	switch (fe.type) {
		case "MFILTER":
			return doc.createElementNS(Namespaces.svgmf, "fe");
		case "SVGNATIVE":
			const filterDef = getFilterDef(fe);
			if (!filterDef) throw new Error("No filter definition found to create SVG element");
			if (!filterDef.interfaceFor) throw new Error("SVGNATIVE element has a type with no interfaceFor");
			return doc.createElementNS(Namespaces.svg, filterDef.interfaceFor);
		case "UTILITY":
			return doc.createElementNS(Namespaces.svgmf, "util");
		default:
			const unknownFe = fe as FilterElement;
			const unknown = doc.createElementNS(Namespaces.svgmf, "unknown");
			unknown.setAttributeNS(Namespaces.svgmf, "m:unknownType", unknownFe.type);
			// if (unknownFe.nativeTag) unknown.setAttributeNS(Namespaces.svgmf, "m:nativeTagPropertyValue", unknownFe.nativeTag);
			unknown.appendChild(doc.createTextNode(`An element with type ${unknownFe.type} was encountered in internal data and could not be converted to XML.`));
			return unknown;
	}
}

/**
 * Adds an annotation to a native filter element, or creates an m:fe element for an MFilter.
 *
 * If a sourceElement is given and it is a native element, m:... attributes are added to the element and it is returned.
 * If a sourceElement is given and it is part of an MFilter, an m:fe element is returned along with the original element.
 * If a sourceElement is not given, a native fe... element or an m:fe element is returned, depending on whether the filter is native.
 *
 * The return value is always an array of one or two Elements.
 */
function annotateElement(fe: FilterElement, ownerDocument: XMLDocument, sourceElement?: Element): Element[] {
	const prefix = sourceElement?.ownerDocument?.lookupPrefix(Namespaces.svgmf) ?? "m";
	const displayPrefix = sourceElement?.ownerDocument?.lookupPrefix(Namespaces.display) ?? "d";

	let destElement: Element;
	const filterDef = getFilterDef(fe);
	if (!filterDef) throw new Error("No filter type for the given element");

	if (sourceElement && fe.type === "SVGNATIVE" && filterDef.interfaceFor) {
		destElement = sourceElement;
	} else {
		destElement = createElement(fe, ownerDocument);
	}

	destElement.setAttributeNS(Namespaces.svgmf, `${prefix}:instance`, fe.instanceId);
	if (fe.appuid) destElement.setAttributeNS(Namespaces.svgmf, `${prefix}:filter`, fe.appuid);

	// Create attributes for inputs
	for (const [name, input] of Object.entries(fe.inputs ?? {})) {
		destElement.setAttribute(name, makeOutputNodeRef(input.outputId, input.outputInstanceId));
	}
	// Create attributes for outputs
	for (const [fieldName, outputName] of Object.entries(fe.outputs ?? {})) {
		const outputRef = makeOutputNodeRef(outputName, fe.instanceId);
		destElement.setAttribute(fieldName, outputRef);
	}
	// Create attributes for values
	for (const [name, value] of Object.entries(fe.values ?? {})) {
		destElement.setAttribute(name, value.toString());
	}
	// Create attributes for display
	for (const [name, value] of Object.entries(fe.display ?? {})) {
		destElement.setAttributeNS(Namespaces.display, `${displayPrefix}:${name}`, value.toString());
	}

	const results = [destElement];
	if (sourceElement && destElement !== sourceElement) results.push(destElement);

	return results;
}

/**
 * Add meta-info nodes and attributes to an existing filter document, or create a new one if one was not given.
 */
export function xmlNotate(project: ProjectModel, filterName: string, svgDoc?: XMLDocument, connected?: FEConnectionStatus): XMLDocument {
	const filterElements = project.filters.get(filterName)?.elements;
	if (!filterElements) throw new Error(`Filter ${filterName} does not exist`);
	let filterElement = svgDoc ? xpath(svgDoc, `/s:svg/s:defs/s:filter[@id="${filterName}"]`, {s: Namespaces.svg}, true)[0] : undefined;

	if (!(svgDoc && filterElement)) {
		svgDoc = document.implementation.createDocument(Namespaces.svg, "");
		const svgElement = svgDoc.appendChild(document.createElementNS(Namespaces.svg, "svg"));
		svgElement.setAttributeNS(Namespaces.xmlns, "xmlns:m", Namespaces.svgmf);
		svgElement.setAttributeNS(Namespaces.xmlns, "xmlns:d", Namespaces.display);
		const defsElement = svgElement.appendChild(document.createElementNS(Namespaces.svg, "defs"));
		filterElement = defsElement.appendChild(document.createElementNS(Namespaces.svg, "filter"));
		filterElement.setAttribute("id", filterName);
	}

	for (const fe of filterElements.values()) {
		const firstInstanceElement = xpath(filterElement, `//s:*[@m:instance="${fe.instanceId}"]`, {
			s: Namespaces.svg,
			m: Namespaces.svgmf
		}, true)[0] as Element | undefined;

		let annotatedElements = annotateElement(fe, svgDoc, firstInstanceElement);

		if (connected && fe.type === "SVGNATIVE" && !connected.get(fe.instanceId)) {
			const replacement = svgDoc.createElementNS(Namespaces.svgmf, "svg-ignore");
			replacement.append(svgDoc.createComment("This element was not properly connected to inputs and outputs, and has been omitted from the SVG output."));
			replacement.append(...annotatedElements);
			annotatedElements = [replacement];
		}

		if (firstInstanceElement) {
			firstInstanceElement.replaceWith(...annotatedElements);
		} else {
			filterElement.append(...annotatedElements);
		}
	}

	return svgDoc;
}


