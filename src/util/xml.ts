let xmlSerializer;
let domParser;

export function stringToDom(text: string): XMLDocument {
	domParser ??= new DOMParser();
	return domParser.parseFromString(text, "text/xml");
}

export function domToString(dom: Node): string {
	xmlSerializer ??= new XMLSerializer();
	return xmlSerializer.serializeToString(dom);
}
