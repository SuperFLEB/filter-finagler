export default function xpath<T extends Node = Element>(xmlNode: XMLDocument | Node, search: string, namespaces?: Record<string, string>): T[] {
	const doc = xmlNode instanceof Document ? xmlNode : xmlNode.ownerDocument;
	if (!doc) throw new Error("Element must be or be within a document to run xpath");
	const result = doc.evaluate(
		search,
		xmlNode,
		(prefix) => (namespaces && prefix && prefix in namespaces) ? namespaces[prefix] : null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
	);
	const resultArray = [];
	for (let i = 0; i < result.snapshotLength; i++) {
		const item = result.snapshotItem(i);
		if (item) resultArray.push(item);
	}
	return resultArray as T[];
}
