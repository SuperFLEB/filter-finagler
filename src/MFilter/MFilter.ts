import type {SVGMFilterElement} from "@t/StructuredDocument.ts";
import type {FilterDef} from "@t/MFilter.ts";
import xpath from "@/util/xpath.ts";
import setIntersect from "@/util/setIntersect.ts";
import {getOutputRef} from "@/structuredDocument/util.ts";
import {Namespaces} from "@/constants.ts";

const templateCache = new Map<string, Element>();

export default class MFilter {
	#filterDef: FilterDef;
	#template: XMLDocument;

	constructor(filterDef: FilterDef) {
		this.#filterDef = filterDef;

		if (!templateCache.has(filterDef.appuid)) {
			// Wrap it in a wrapper with the SVG namespace so the elements in the template are marked with the right namespaces.
			const wrappedNamespacedDocument = new DOMParser().parseFromString(`<wrapper xmlns="${Namespaces.svg}">${this.#filterDef.template}</wrapper>`, "text/xml");
			const templateElement = wrappedNamespacedDocument.documentElement.children[0];
			if (!templateElement) throw new Error(`Invalid template in MFilter ${filterDef.appuid}`);
			templateCache.set(filterDef.appuid, templateElement);
		}

		const templateDocument = document.implementation.createDocument(Namespaces.svg, "");
		templateDocument.appendChild(templateCache.get(filterDef.appuid)!.cloneNode(true));
		this.#template = templateDocument;
	}

	fillTemplate(fe: SVGMFilterElement, includeMFMeta: boolean): Element {
		const templateDoc = this.#template.cloneNode(true) as XMLDocument;
		if (includeMFMeta) templateDoc.documentElement.setAttributeNS(Namespaces.xmlns, `xmlns:m`, Namespaces.svgmf1);

		if (includeMFMeta) {
			xpath(templateDoc, "//*").forEach(element => {
				element.setAttributeNS(Namespaces.svgmf1, "m:instance", fe.instanceId);
			});
		}

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
			let attrValue: string | undefined;

			// Fill outputs
			if (vAttr.localName === "result" && this.#filterDef.outputs?.[vAttr.value]) {
				attrValue = fe.outputs?.[vAttr.value] ?? "";
			}

			// Fill inputs
			if (this.#filterDef.inputs?.[vAttr.value]) {
				const input = fe.inputs?.[vAttr.value];
				if (!input || typeof input === "string") {
					attrValue = input ?? undefined;
				} else {
					attrValue = getOutputRef(input.outputName, input.outputInstanceId);
				}
			}

			// Fill values
			if (this.#filterDef.values?.[vAttr.value]) attrValue = normalizeAttr(fe.values?.[vAttr.value]) ?? undefined;

			if (attrValue === undefined) {
				console.warn(`Undefined variable "${vAttr.value}" referenced in "${name}"`);
			} else if (attrValue !== null) {
				vAttr.ownerElement?.setAttribute(vAttr.localName, attrValue.toString());
			}
		}

		// Fill derived values and remove all v:... attributes from the resulting SVG element(s)
		for (const vAttr of vAttrs) {
			if (this.#filterDef.derivations?.[vAttr.localName]) {
				const value = this.#filterDef.derivations[vAttr.localName](fe.values ?? {});
				vAttr.ownerElement?.setAttribute(vAttr.localName, value.toString());
			}
			vAttr.ownerElement?.removeAttributeNode(vAttr);
		}

		return templateDoc.documentElement;
	}
}

