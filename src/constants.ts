export const MFILTER_INSTANCE_TAG_NAME = "fe";
export const MFILTER_DEFS_TAG_NAME = "mdefs";
export const MFILTER_DEF_TAG_NAME = "filter";

export const Namespaces = Object.freeze({
	svgmf1: "@superfleb/svg-mfilter-extensions/1.0",

	xml: "http://www.w3.org/XML/1998/namespace",
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	mathml: "http://www.w3.org/1998/Math/MathML",
	xsl: "http://www.w3.org/1999/XSL/Transform",
} as const);
export type CommonNamespacePrefixes = keyof typeof Namespaces;

