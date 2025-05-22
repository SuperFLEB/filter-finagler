export default function isElementNode(node: any): node is Element {
	return node && node instanceof Node && node.nodeType === Node.ELEMENT_NODE;
}
