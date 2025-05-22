import type {FilterDef, FilterInputValues, MFilterInfo, Value} from "@/MFilter/types.ts";
import type Bang from "@t/Bang.ts";
import {Namespaces} from "@/constants.ts";
import objectMap from "@/util/objectMap.ts";
import xpath from "@/util/xpath.ts";
import setIntersect from "@/util/setIntersect.ts";
import {isProxy, toRaw} from "vue";
import {processInputsToValues, processOutputsToValues} from "./util.ts";
import type {SVGMFilterElement} from "@t/StructuredDocument.ts";

const nextInstanceId = (() => {
	let instance = 0;
	return () => (instance++).toString(36);
})();

export default class MFilter {
	#filterDef: FilterDef;
	#template: XMLDocument;
	#instanceId: string;
	#values: Record<string, Value> = {};
	#processedInputValues: Record<string, Value> = {};

	get instanceId(): string {
		if (isProxy(this)) return toRaw(this).instanceId;
		return this.#instanceId;
	}

	get info(): MFilterInfo {
		if (isProxy(this)) return toRaw(this).info;
		return {
			displayName: this.#filterDef.displayName,
			instanceId: this.#instanceId,
			inputs: this.#filterDef.inputs,
			outputs: this.#filterDef.outputs,
		}
	}

	#fillTemplate(): XMLDocument {
		const templateDoc = this.#template.cloneNode(true) as XMLDocument;
		templateDoc.documentElement.setAttribute("xmlns:m", Namespaces.svgmf1);

		// Namespace "in"/"result" references for internal connections to the instance ID
		const resultAttrs = new Set<string>(xpath<Attr>(templateDoc, "//*[@result]/@result").map(a => a.value));
		const inAttrs = new Set<string>(xpath<Attr>(templateDoc, "//*[@in or @in2]/@*[name()='in' or name()='in2']").map(a => a.value));
		const internalNames = setIntersect(resultAttrs, inAttrs);

		xpath<Attr>(templateDoc, "//*[@in or @in2 or @result]/@*[name()='in' or name()='in2' or name()='result']").forEach(attr => {
			if (internalNames.has(attr.value)) {
				attr.value = `${attr.value}@${this.#instanceId}`;
			}
		});

		// Fill v:... variable values
		const vAttrs = xpath<Attr>(templateDoc, "//*[@v:*]/@v:*", {v: "vars"});
		const normalizeAttr = (val: any | any[] | undefined) => val ? Array.isArray(val) ? val.map(e => e.toString()).join(" ") : val.toString() : val;
		for (const result of vAttrs) {
			const {ownerElement: element, localName: name, value} = result as Bang<Attr>;
			const isOutput = Boolean(name === "result" && this.#filterDef.outputs?.[value]);
			const attrValue = isOutput ? this.#processedInputValues[value] : normalizeAttr(this.#processedInputValues[value]);

			element.removeAttributeNode(result);
			if (attrValue === undefined) {
				console.warn(`Undefined variable "${result.value}" referenced in "${name}"`);
			} else if (attrValue !== null) {
				element.setAttribute(name, attrValue.toString());
			}
		}

		// Add m: attributes for MFilter and instance
		xpath(templateDoc, "//*").forEach(element => {
			element.setAttributeNS(Namespaces.svgmf1, "m:instance", this.#instanceId);
		})

		// Prepend filter reference
		const instanceRef = templateDoc.createElementNS(Namespaces.svgmf1, "instance");
		templateDoc.documentElement.prepend(instanceRef);

		instanceRef.setAttribute("id", this.#instanceId);
		instanceRef.setAttribute("appuid", this.#filterDef.appuid);

		return templateDoc;
	}

	updateInputValues(values: FilterInputValues, clearAllValues: boolean) {
		const allValues = clearAllValues ? values : {...this.#values, ...values};
		// String values
		this.#processedInputValues = processInputsToValues(allValues, this.#filterDef);

		// Derived values
		Object.assign(
			this.#processedInputValues,
			objectMap(this.#filterDef.derivations ?? {}, ([name, fn]) => [name, fn({...this.#processedInputValues})])
		);
		// Outputs
		Object.assign(this.#processedInputValues, processOutputsToValues(allValues as Record<string, string>, this.#filterDef));
	}

	constructor(filterDef: FilterDef, fe: SVGMFilterElement) {
		this.#filterDef = filterDef;
		this.#template = new DOMParser().parseFromString(this.#filterDef.template, "text/xml");
		this.#instanceId = nextInstanceId();
		this.updateInputValues(values ?? {}, true);
	}

	toWrappedXmlDoc(): XMLDocument {
		const source = this.#fillTemplate();
		const dest = document.implementation.createDocument(Namespaces.svgmf1, "");
		dest.appendChild(dest.createElementNS(Namespaces.svg, "svg"));
		dest.documentElement.setAttribute("xmlns:m", Namespaces.svgmf1);
		dest.documentElement.replaceChildren(...source.documentElement.childNodes);

		// Move namespace of elements without namespaces
		const rootNamespace = dest.lookupNamespaceURI(null);
		xpath(dest, "//*").filter(element => element.namespaceURI === null).forEach(element => {
			if (element.namespaceURI === null) {
				const copy = dest.createElementNS(rootNamespace, element.localName);
				for (const attr of [...element.attributes]) {
					element.removeAttributeNode(attr);
					copy.setAttributeNode(attr);
				}
				element.replaceWith(copy);
			}
		});

		return dest;
	}
}