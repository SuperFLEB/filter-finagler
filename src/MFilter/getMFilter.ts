import {Namespaces} from "@/constants.ts";
import {getFilterById} from "@/util/RegisterMFilter.ts";
import MFilter from "@/MFilter/MFilter.ts";
import {getNativeFilterByTagName} from "@/FilterDef/native/native.ts";
import getFilterVersion from "@/MFilter/FilterVersion.ts";
import type {FilterDef, Value} from "@/MFilter/types.ts";
import isMfElement from "@/util/isMfElement.ts";
import objectValueFilter from "@/util/objectValueFilter.ts";
import {parseStringInput} from "@/MFilter/util.ts";
import unknownElementFilter from "@/MFilter/unknownElementFilter.ts";

const enum ElementType {
	Unknown,
	MFilter,
	SupportedNative,
}

function getElementType(element: Element): ElementType {
	if (isMfElement(element)) return ElementType.MFilter;
	if (getNativeFilterByTagName(element.localName)) return ElementType.SupportedNative;
	return ElementType.Unknown;
}

function getName(element: Element, type: ElementType): string | undefined {
	switch (type) {
		case ElementType.MFilter:
			return (element.hasAttributeNS(Namespaces.svgmf1, "filter") ?
				element.getAttributeNS(Namespaces.svgmf1, "filter") :
				element.getAttributeNS(null, "filter")) ?? undefined;
		case ElementType.SupportedNative:
			return element.localName;
	}
	return undefined;
}

export default function getMFilter(feElement: Element, svgDoc: XMLDocument): MFilter<FilterDef> | undefined {
	const type = getElementType(feElement);
	const name = getName(feElement, type);
	const filterSpecs = getFilterVersion(svgDoc);

/*
	if (!name || (type === ElementType.MFilter && !filterSpecs[name])) {
		console.error(`${feElement.localName} is unsupported or is missing the filter attribute`);
		return undefined;
	}
*/

	const appuid = filterSpecs[name]?.appuid;
	const filterDef = type === ElementType.MFilter ? getFilterById(appuid) : getNativeFilterByTagName(name) ?? unknownElementFilter(feElement);

	if (!filterDef) {
		console.error(`Filter ${name} (${appuid ?? "Native Filter"}) is not loaded`);
		return undefined;
	}

	// Get attributes as raw strings
	let elementAttributes: Record<string, Value | undefined> = Object.fromEntries(
		feElement.getAttributeNames()
			.filter(attrName => !attrName.includes(":") && (filterDef.outputs?.[attrName] || filterDef.inputs?.[attrName as keyof FilterDef['inputs']]))
			.map<[string, string | null]>(attrName => [attrName, feElement.getAttributeNS(null, attrName)])
	);

	// Transform attributes
	if (filterDef.transformAttributes) {
		elementAttributes = filterDef.transformAttributes(feElement, elementAttributes);
	}

	// Parse string attributes
	elementAttributes = Object.fromEntries(
		Object.entries(elementAttributes).map<[string, Value | undefined]>(([attrName, stringValue]) => {
			// Remember: All returns must be [name, value] even if the value is undefined.
			if (stringValue === null) return [attrName, undefined];
			const inputDef = filterDef.inputs?.[attrName];
			if (!inputDef) return [attrName, stringValue];
			return [attrName, parseStringInput(stringValue, inputDef)];
		})
	);

	return new MFilter(
		filterDef,
		objectValueFilter<Value>(elementAttributes, (attr: Value | undefined) => attr !== undefined),
		name
	);
}