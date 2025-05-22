const xmlSerializer = new XMLSerializer();
const domParser = new DOMParser();

export function stringToDom(text: string): XMLDocument {
	return domParser.parseFromString(text, "text/xml");
}

export function domToString(dom: Node): string {
	return xmlSerializer.serializeToString(dom);
}
