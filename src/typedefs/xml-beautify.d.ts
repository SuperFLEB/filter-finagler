declare module "xml-beautify" {
	export default class XmlBeautify {
		constructor(): void;
		beautify(srcXmlText: string | Document, options?: {
			indent?: string,
			useSelfClosingElement?: boolean,
		}): string;
	}
}
