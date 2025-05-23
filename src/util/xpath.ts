export default function xpath<T extends Node = Element>(xmlNode: XMLDocument | Node, search: string, namespaces?: Record<string, string>, firstOnly: boolean = false): T[] {
	const doc = xmlNode instanceof Document ? xmlNode : xmlNode.ownerDocument;
	if (!doc) throw new Error("Element must be or be within a document to run xpath");
	const result = doc.evaluate(
		search,
		xmlNode,
		(prefix) => (namespaces && prefix && prefix in namespaces) ? namespaces[prefix] : null,
		firstOnly ? XPathResult.FIRST_ORDERED_NODE_TYPE : XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
	);

	if (firstOnly) {
		return result.singleNodeValue ? [result.singleNodeValue as T] : [];
	}

	const resultArray = [];
	for (let i = 0; i < result.snapshotLength; i++) {
		const item = result.snapshotItem(i);
		if (item) resultArray.push(item);
	}
	return resultArray as T[];
}
