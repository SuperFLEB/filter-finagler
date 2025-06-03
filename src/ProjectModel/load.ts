import {Namespaces} from "@/constants.ts";
import xpath from "@/util/xpath.ts";
import type {FeElement, FilterElement, FilterModel} from "@/ProjectModel/ProjectModel.ts";
import {getFilterById} from "@/util/RegisterMFilter.ts";
import {parseOutputRef} from "@/ProjectModel/util.ts";
import stringToValue from "@/MFilter/stringToValue.ts";

function xmlFilterToProjectFilterElements(filterElement: Element) {
	const instanceElements = xpath(filterElement, "//*[@m:instance]", {m: Namespaces.svgmf});
	const elementsByInstanceId: Map<string, Element[]> = new Map();
	for (const instanceElement of instanceElements) {
		const instanceId = instanceElement.getAttributeNS(Namespaces.svgmf, "instance");
		if (!instanceId) {
			console.error("Null or empty m:instance attribute on an element that presumably has an instance attribute.");
			continue;
		}
		if (!elementsByInstanceId.has(instanceId)) elementsByInstanceId.set(instanceId, []);
		elementsByInstanceId.get(instanceId)!.push(instanceElement);
	}
	const definitiveElements = [];
	for (const elements of elementsByInstanceId.values()) {
		if (elements.length === 1) {
			definitiveElements.push(elements[0]);
			continue;
		}
		const mfElements = elements.filter(element => element.namespaceURI === Namespaces.svgmf);
		if (mfElements.length > 1) {
			console.error(`Multiple MFilter-related elements have the same instance ID. Ignoring the instance.`, mfElements);
			continue;
		}
		if (mfElements.length === 0) {
			console.error("Multiple elements with the same instance ID, but no MFilter-related element. Ignoring the instance.", mfElements);
			continue;
		}
		definitiveElements.push(mfElements[0]);
	}

	return new Map<string, FeElement>(
		definitiveElements.map(parseFilterElement).filter(de => de !== null).map(de => [de?.instanceId, de])
	);
}

function parseFilterElement(element: Element): FeElement | null {
	const appuid = element.getAttributeNS(Namespaces.svgmf, "filter");
	if (!appuid) return null;
	const filterDef = getFilterById(appuid);
	if (!filterDef) return null;

	const feElement = {
		instanceId: element.getAttributeNS(Namespaces.svgmf, "instance"),
		appuid,
	} as FilterElement;

	if (element.namespaceURI !== Namespaces.svgmf) {
		feElement.type = "SVGNATIVE";
	} else {
		feElement.type = ({
			"util": "UTILITY",
			"fe": "MFILTER",
		}[element.localName] ?? "UNKNOWN") as FilterElement["type"];
	}

	const inputs = filterDef.inputs ? Object.fromEntries(
		Object.keys(filterDef.inputs)
			.map(name => {
				const attr = element.getAttributeNS(null, name);
				if (attr === null) return null;
				const input = parseOutputRef(attr);
				if (!input[1]) return [name, input[0]];
				return [name, {
					outputName: input[0],
					outputInstanceId: input[1],
				}];
			})
			.filter(e => e !== null)
	) : undefined;

	const outputs = filterDef.outputs ? Object.fromEntries(
		Object.keys(filterDef.outputs)
			.map(name => {
				const attr = element.getAttributeNS(null, name);
				if (!attr) return null;
				return [name, parseOutputRef(attr)[0]];
			}).filter(o => o !== null)
	) : undefined;

	const values = filterDef.values ? Object.fromEntries(
		Object.entries(filterDef.values)
			.map(([name, valueDef]) => {
				const attr = element.getAttributeNS(null, name);
				if (!attr) return null;
				const value = stringToValue(attr, valueDef.type);
				return [name, value];
			})
			.filter(v => v !== null)
	) : undefined;

	const displayAttributes = Array.from(element.attributes).filter(attr => attr.namespaceURI === Namespaces.display);
	const display = Object.fromEntries(displayAttributes.map(attr => [attr.localName, attr.value]));

	return {
		...feElement,
		...(inputs && {inputs}),
		...(values && {values}),
		...(outputs && {outputs}),
		...(display && {display}),
	};
}

export function fromMFXMLDocument(xmlDocument: XMLDocument) {
	const docElement = xmlDocument.documentElement;
	if (!docElement) throw new Error("No root element");
	const filters = xpath(xmlDocument, "/s:svg/s:defs/s:filter", {s: Namespaces.svg});

	const project = {
		type: Namespaces.svg,
		filters: new Map<string, FilterModel>(
			filters.map(filter => {
					const id: string | null = filter.getAttribute("id");
					if (id === null) return null;
					const elements: Map<string, FilterElement> = xmlFilterToProjectFilterElements(filter);
					return [id, { id, elements }] as [string, FilterModel];
				}
			).filter(f => f !== null)
		)
	};
	return project;
}