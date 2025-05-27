// Map of prefix to key (of the Namespaces object), e.g., { "m": "mfilter", ... }
import {Namespaces} from "@/constants.ts";

type PrefixNSMap = Record<string, keyof typeof Namespaces>;

/**
 * Add the given xmlns namespace prefixes to the element. Mutates the given element and returns nothing.
 * @param element Element to add
 * @param prefixNsMap Object in the form { prefix: key, ... } with prefix being the prefix and key being the key from the Namespaces lookup.
 * @example namespace(theElement, { "svg": "svg", "m": "svgmf", "d": "display });
 */
export default function namespace(element: Element, prefixNsMap: PrefixNSMap): Element {
	for (const [prefix, namespaceKey] of Object.entries(prefixNsMap)) {
		element.setAttributeNS(Namespaces.xmlns, `xmlns:${prefix}`, Namespaces[namespaceKey]);
	}
	return element;
}
