import {MFILTER_INSTANCE_TAG_NAME, Namespaces} from "@/constants.ts";
export default function isMfElement(element: Element): boolean {
	return (element.namespaceURI === Namespaces.svgmf1 && element.localName === MFILTER_INSTANCE_TAG_NAME);
}