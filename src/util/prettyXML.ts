import XmlBeautify from "xml-beautify";
const xmlBeautify = new XmlBeautify();

const prettyXML = (xmlText: string) => {
	xmlText = xmlText.replace(/xmlns="" ?/g, "");
	return xmlBeautify.beautify(xmlText, {
		useSelfClosingElement: true
	});
};

export default prettyXML;