import {h, type VNode} from "vue";

function render(element: Element, xmlns: string | null): VNode {
	const attributes = Object.fromEntries(Array.from(element.attributes).map(attr => [attr.name, attr.value]));
	const children = Array.from(element.children).map(child => render(child));
	if (xmlns && !("xmlns" in attributes)) attributes.xmlns = xmlns;
	return h(element.tagName, attributes, children);
}

export default function DOMRenderer({ doc }: { doc : XMLDocument }) {
	return render(doc.documentElement, doc.documentElement.namespaceURI);
}