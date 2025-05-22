/* cyrb53 by github.com/bryc */
function hashString(str: string, seed = 0): number {
	let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
	h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
	h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export function hashXmlString(xml: string, cramBeforeHash = true): number {
	return hashString(cramBeforeHash ? cramXmlString(xml) : xml);
}

export function hashDocument(xmlDoc: Document, cramBeforeHash = true): number {
	return hashString(cramBeforeHash ? cramDocument(xmlDoc) : new XMLSerializer().serializeToString(xmlDoc));
}

export function cramXmlString(xml: string, type: DOMParserSupportedType = "image/svg+xml") {
	return cramDocument(new DOMParser().parseFromString(xml, type));
}

export function cramDocument(xmlDoc: XMLDocument) {
	const xmlDocCopy = new Document();
	xmlDocCopy.appendChild(xmlDoc.documentElement.cloneNode(true));
	const walker = xmlDocCopy.createTreeWalker(xmlDocCopy.documentElement, NodeFilter.SHOW_TEXT);
	walker.nextNode();
	while (true) {
		const node = walker.currentNode!;
		const currentText = node.textContent || "";
		const newText = currentText.replace(/([\n\t ]+| {2,}])+/gms, " ");
		if (newText === " " && newText !== currentText && node.parentNode) {
			const nextNode = walker.nextNode();
			node.parentNode.removeChild(node);
			if (!nextNode) break;
			continue;
		}
		node.textContent = newText;
		if (!walker.nextNode()) break;
	}

	const result = new XMLSerializer().serializeToString(xmlDocCopy);
	return result;
}
