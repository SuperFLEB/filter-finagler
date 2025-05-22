import type {StructuredDocument, SVGMFilterElement} from "@t/StructuredDocument.ts";
import objectMap from "@/util/objectMap.ts";
import getConnections from "@/components/Graph/getConnections.ts";
import type {Node as FlowNode} from "@vue-flow/core/dist/types/node";
import {type Edge, Position} from "@vue-flow/core";
import type {Clod} from "@t/Clod.ts";
import layout from "@/components/Graph/autoLayout.ts";
import {Namespaces} from "@/constants.ts";
import {getOutputRef} from "@/structuredDocument/util.ts";
import randomString from "@/util/randomString.ts";
import getMFilter from "@/MFilter/getMFilter.ts";
import MFilter from "@/MFilter/MFilter.ts";
import {getFilterDef} from "@/structuredDocument/info.ts";
import MFilter2 from "@/structuredDocument/toXml.ts";

export function toGraph(doc: StructuredDocument, filterId: string = "filter") {
	const filter = doc.filters.get(filterId);
	if (!filter) throw new Error(`Filter ${filter} does not exist`);

	const inputsNode = {
		id: "in:0",
		type: "inputs",
		data: {},
		position: {x: 0, y: 0},
		sourcePosition: Position.Left,
		targetPosition: Position.Right,
	};

	const nodes: FlowNode[] = [inputsNode];
	const edges = [];

	for (const fe of filter.elements) {
		nodes.push({
			id: fe.instanceId,
			type: "filterElement",
			data: fe,
			position: {x: 0, y: 0},
			sourcePosition: Position.Left,
			targetPosition: Position.Right,
		});

		for (const [name, input] of Object.entries(fe.inputs)) {
			if (!input) continue;

			if (typeof input === "string") {
				edges.push({
					source: inputsNode.id,
					target: fe.instanceId,
					sourceHandleId: input,
					targetHandleId: name,
					id: `${input}-${name}@${fe.instanceId}`,
				});
				continue;
			}

			edges.push({
				source: input.outputInstanceId,
				target: fe.instanceId,
				sourceHandleId: input.outputName,
				targetHandleId: name,
				id: `${input.outputName}@${input.outputInstanceId}-${name}@${fe.instanceId}`,
			});
		}
	}

	return {nodes, edges};
}

function mfeToElement(fe: SVGMFilterElement, doc: XMLDocument): Element {
	const prefix = doc.lookupPrefix(Namespaces.svgmf1) ?? "m";
	const element = fe.type === "NATIVE" ? doc.createElementNS(Namespaces.svg, fe.nativeTag) : doc.createElement(`${prefix}:fe`);
	element.setAttribute(`${prefix}:instance`, fe.instanceId);
	element.setAttribute(`${prefix}:filter`, fe.appuid);
	for (const [name, input] of Object.entries(fe.inputs ?? {})) {
		const outputRef = (typeof input === "string") ? input : getOutputRef(input.outputName, input.outputInstanceId);
		element.setAttribute(name, outputRef);
	}
	for (const [fieldName, outputName] of Object.entries(fe.outputs ?? {})) {
		const outputRef = getOutputRef(outputName, fe.instanceId);
		element.setAttribute(fieldName, outputRef);
	}
	for (const [name, value] of Object.entries(fe.values ?? {})) {
		element.setAttribute(name, value.toString());
	}

	return element;
}

function mfeToSvg(fe: SVGMFilterElement, doc: XMLDocument): Element {
	const filterDef = getFilterDef(fe);
	if (!filterDef) return null;
	const mFilter = new MFilter2(filterDef);
	return mFilter.fillTemplate(fe);
}

export function toSVGMFilterDoc(doc: StructuredDocument, filterName: string): XMLDocument {
	const mfeElements = doc.filters.get(filterName)?.elements;
	if (!mfeElements) throw new Error(`Filter ${filterName} does not exist`);

	const svgDoc = document.implementation.createDocument(Namespaces.svg, "");
	const svgElement = svgDoc.appendChild(document.createElementNS(Namespaces.svg, "svg"));
	svgElement.setAttribute("xmlns:m", Namespaces.svgmf1);
	const defsElement = svgElement.appendChild(document.createElementNS(Namespaces.svg, "defs"));
	const filterElement = svgElement.appendChild(document.createElementNS(Namespaces.svg, "filter"));
	filterElement.setAttribute("id", filterName)
	const domElements = mfeElements.map<Element>(fe => fe.type === "MFILTER" ? mfeToElement(fe, svgDoc) : mfeToElement(fe, svgDoc));
	filterElement.append(...domElements);

	return svgDoc;
}

export function toSVGDoc(doc: StructuredDocument, filterName: string, reloadable: boolean = false): XMLDocument {
	const mfeElements = doc.filters.get(filterName)?.elements;
	if (!mfeElements) throw new Error(`Filter ${filterName} does not exist`);

	const svgDoc = document.implementation.createDocument(Namespaces.svg, "");
	const svgElement = svgDoc.appendChild(document.createElementNS(Namespaces.svg, "svg"));

	if (reloadable) svgElement.setAttribute("xmlns:m", Namespaces.svgmf1);

	const defsElement = svgElement.appendChild(document.createElementNS(Namespaces.svg, "defs"));
	const filterElement = defsElement.appendChild(document.createElementNS(Namespaces.svg, "filter"));

	filterElement.setAttribute("id", filterName)
	const domElements = mfeElements.map<Element>(fe => mfeToSvg(fe, svgDoc));
	filterElement.append(...domElements.flatMap(d => [...d.children]));

	return svgDoc;
}