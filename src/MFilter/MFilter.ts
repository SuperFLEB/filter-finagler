import type {FilterElement, FilterModel} from "@/ProjectModel/ProjectModel.ts";
import type {FilterDef} from "@/MFilter/types.ts";
import xpath from "@/util/xpath.ts";
import setIntersect from "@/util/setIntersect.ts";
import {getOrCreateOutputRef, getOutputRefName, makeOutputNodeRef} from "@/ProjectModel/util.ts";
import {Namespaces} from "@/constants.ts";
import values from "@/MFilter/values.ts";

const templateCache = new Map<string, Element>();

const normalizeAttr = (val: any | any[] | undefined) => val ? Array.isArray(val) ? val.map(e => e.toString()).join(" ") : val.toString() : val;

export default class MFilter {
	#filterDef: FilterDef;
	#parentFilter: FilterModel;
	#template: XMLDocument;

	constructor(filterDef: FilterDef, parentFilter: FilterModel) {
		this.#filterDef = filterDef;
		this.#parentFilter = parentFilter;

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

	#getVAttrValue(vAttr: Attr, fe: FilterElement, fillDisconnectedInputs: boolean = true) {
		// Output
		if (vAttr.localName === "result" && this.#filterDef.outputs?.[vAttr.value]) {
			return getOrCreateOutputRef(vAttr.value, fe);
		}

		// Input
		if (this.#filterDef.inputs?.[vAttr.value]) {
			const input = fe.inputs?.[vAttr.value];
			const outputFe = input?.outputInstanceId ? this.#parentFilter.elements.get(input.outputInstanceId) : null;
			if (!(input?.outputInstanceId === null || outputFe)) {
				console.error(`Could not connect ${fe.instanceId} to output ${input?.outputInstanceId} because ${input?.outputInstanceId} is not a valid instanceId`);
				return;
			}
			return input ? getOutputRefName(input.outputId, outputFe ?? null) : "";
		}

		// Value
		if (this.#filterDef.values?.[vAttr.value]) return normalizeAttr(fe.values?.[vAttr.value]) ?? this.#filterDef.values?.[vAttr.value]?.defaultValue ?? undefined;

	}

	fillTemplate(fe: FilterElement, includeMFMeta: boolean): Element {
		const templateDoc = this.#template.cloneNode(true) as XMLDocument;
		if (includeMFMeta) templateDoc.documentElement.setAttributeNS(Namespaces.xmlns, `xmlns:m`, Namespaces.svgmf);

		if (includeMFMeta) {
			xpath(templateDoc, "//*").forEach(element => {
				element.setAttributeNS(Namespaces.svgmf, "m:instance", fe.instanceId);
			});
		}

		// Namespace "in"/"result" references for internal connections to the instance ID
		const resultAttrs = new Set<string>(xpath<Attr>(templateDoc, "//*[@result]/@result").map(a => a.value));
		const inAttrs = new Set<string>(xpath<Attr>(templateDoc, "//*[@in or @in2]/@*[name()='in' or name()='in2']").map(a => a.value));
		const internalNames = setIntersect(resultAttrs, inAttrs);

		xpath<Attr>(templateDoc, "//*[@in or @in2 or @result]/@*[name()='in' or name()='in2' or name()='result']").forEach(attr => {
			if (internalNames.has(attr.value)) {
				attr.value = makeOutputNodeRef(attr.value, fe.instanceId, true);
			}
		});

		// Fill v:... variable values
		const vAttrs = xpath<Attr>(templateDoc, "//*[@v:*]/@v:*", {v: "vars"});

		for (const vAttr of vAttrs) {
			let attrValue: string | undefined;

			attrValue = this.#getVAttrValue(vAttr, fe, true);

			if (attrValue === undefined && !this.#filterDef.derivations?.[vAttr.value]) {
				console.warn(`Variable "${vAttr.value}" was referenced in "<${vAttr.ownerElement!.localName} ... ${vAttr.name}="${vAttr.value}">" in "${this.#filterDef.displayName}" (${this.#filterDef.appuid}) template, but a value was not provided in instance "${fe.instanceId}" and there was no defaultValue.`);
			} else if (attrValue !== undefined) {
				vAttr.ownerElement?.setAttribute(vAttr.localName, attrValue.toString());
			}
		}

		// Fill derived values and remove all v:... attributes from the resulting SVG element(s)
		const allValues = values(fe, this.#filterDef);
		for (const vAttr of vAttrs) {
			if (this.#filterDef.derivations?.[vAttr.value]) {
				const value = this.#filterDef.derivations[vAttr.value](allValues);
				vAttr.ownerElement?.setAttribute(vAttr.localName, value.toString());
			}
			vAttr.ownerElement?.removeAttributeNode(vAttr);
		}

		return templateDoc.documentElement;
	}
}
