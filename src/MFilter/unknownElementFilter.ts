import type {FilterDef, InputValueDef} from "@/MFilter/types.ts";
import {domToString} from "@/util/xml.ts";

const inputAttrs = ["in", "in2"];
const resultAttrs = ["result"];
let serial = 0;

type SimpleInputDef = InputValueDef & ({ type: "RESULT", label: string } | { type: "STRING", label: string });

export default function unknownElementFilter(feElement: Element) {
	const tagName = feElement.localName;
	const attributeNames = feElement.getAttributeNames();
	const inputs: Record<string, SimpleInputDef> = Object.fromEntries(attributeNames
		.filter(n => !resultAttrs.includes(n))
		.map(n => {
			if (inputAttrs.includes(n)) {
				return [n, { type: "RESULT", label: n }];
			}
			return [n, { type: "STRING", label: n }];
		}));

	const outputs = Object.fromEntries(
		resultAttrs.map<[string, {label: string}] | null>(n => attributeNames.includes(n) ? [n, { label: n }] : null)
			.filter(r => r !== null)
	);

	const templateXML = document.implementation.createDocument(feElement.namespaceURI, "");
	const templateDocumentElement = templateXML.createElement("fragment");

	templateDocumentElement.setAttribute("xmlns:v", "vars");
	const templateElement = templateXML.createElementNS(feElement.namespaceURI, tagName);
	for (const attrName of attributeNames) {
		templateElement.setAttributeNS("vars", `v:${attrName}`, feElement.getAttribute(attrName) ?? "");
	}

	templateElement.append(...(feElement.cloneNode(true) as Element).children);
	templateXML.appendChild(templateElement);
	const template = domToString(templateXML);

	return {
		displayName: `(${tagName})`,
		author: "(SVG Native)",
		appuid: `unknown${++serial}:${tagName}`,
		version: [1, 0, 0],
		template,
		contexts: ["//filter"],
		inputs,
		outputs,
	} as FilterDef;
}
