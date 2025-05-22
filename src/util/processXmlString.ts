import getParserError from "@/util/xmlParserError.ts";
import {Namespaces} from "@/constants.ts";

export default function processXmlString(xml: string, fallbackText: string = "<svg />", type: DOMParserSupportedType = "image/svg+xml") {
	const xmlDoc = new DOMParser().parseFromString(xml || fallbackText, type);
	const errorNode: HTMLElement | null = xmlDoc.querySelector("parsererror");

	if (errorNode) {
		const error = getParserError(xmlDoc);
		console.warn("XML error:", error, xmlDoc, xml);
		return null;
	}

	let documentNamespace = xmlDoc.documentElement.getAttribute("xmlns");
	if (!documentNamespace) {
		documentNamespace = Namespaces.svg;
		console.warn(`XML document missing its namespace. Assuming ${documentNamespace}`);
		xmlDoc.documentElement.setAttribute("xmlns", documentNamespace);
	}

	if (xmlDoc.documentElement.tagName !== "svg") {
		throw new Error("Root element must be an <svg> tag.");
	}

	return xmlDoc;
}
