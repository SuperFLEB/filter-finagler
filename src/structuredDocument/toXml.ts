import type {SVGMFilterElement} from "@t/StructuredDocument.ts";
import type {FilterDef} from "@/MFilter/types.ts";
import xpath from "@/util/xpath.ts";
import setIntersect from "@/util/setIntersect.ts";
import {getOutputRef} from "@/structuredDocument/util.ts";
import {Namespaces} from "@/constants.ts";
import type Bang from "@t/Bang.ts";

export default class MFilter2 {
	#filterDef: FilterDef;
	#template: XMLDocument;

	constructor(filterDef: FilterDef) {
		this.#filterDef = filterDef;
		this.#template = new DOMParser().parseFromString(this.#filterDef.template, "text/xml");
	}

	fillTemplate(fe: SVGMFilterElement): Element {
		const templateDoc = this.#template.cloneNode(true) as XMLDocument;
		templateDoc.documentElement.setAttribute("xmlns:m", Namespaces.svgmf1);

		// Namespace "in"/"result" references for internal connections to the instance ID
		const resultAttrs = new Set<string>(xpath<Attr>(templateDoc, "//*[@result]/@result").map(a => a.value));
		const inAttrs = new Set<string>(xpath<Attr>(templateDoc, "//*[@in or @in2]/@*[name()='in' or name()='in2']").map(a => a.value));
		const internalNames = setIntersect(resultAttrs, inAttrs);

		xpath<Attr>(templateDoc, "//*[@in or @in2 or @result]/@*[name()='in' or name()='in2' or name()='result']").forEach(attr => {
			if (internalNames.has(attr.value)) {
				attr.value = getOutputRef(attr.value, fe.instanceId);
			}
		});

		// Fill v:... variable values
		const vAttrs = xpath<Attr>(templateDoc, "//*[@v:*]/@v:*", {v: "vars"});

		const normalizeAttr = (val: any | any[] | undefined) => val ? Array.isArray(val) ? val.map(e => e.toString()).join(" ") : val.toString() : val;

		for (const vAttr of vAttrs) {
			const {ownerElement: element, localName: name, value} = vAttr as Bang<Attr>;

			let attrValue: string | undefined;

			if (name === "result" && this.#filterDef.outputs?.[value]) attrValue = fe.outputs?.[value] ?? "";
			if (this.#filterDef.inputs?.[value]) {
				const input = fe.inputs?.[value];
				if (!input || typeof input === "string") {
					attrValue = input ?? undefined;
				} else {
					attrValue = getOutputRef(input.outputName, input.outputInstanceId);
				}
			}
			if (this.#filterDef.values?.[value]) attrValue = normalizeAttr(fe.values?.[value]) ?? undefined;

			element.removeAttributeNode(vAttr);

			if (attrValue === undefined) {
				console.warn(`Undefined variable "${vAttr.value}" referenced in "${name}"`);
			} else if (attrValue !== null) {
				element.setAttribute(name, attrValue.toString());
			}
		}

		// Add m: attributes for MFilter and instance
		xpath(templateDoc, "//*").forEach(element => {
			element.setAttributeNS(Namespaces.svgmf1, "m:instance", fe.instanceId);
		})

		// Prepend filter reference
		const instanceRef = templateDoc.createElementNS(Namespaces.svgmf1, "instance");
		templateDoc.documentElement.prepend(instanceRef);

		instanceRef.setAttribute("id", fe.instanceId);
		instanceRef.setAttribute("appuid", this.#filterDef.appuid);

		return templateDoc.documentElement;
	}

}

