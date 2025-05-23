type ElementPathItem = {
	name: string;
	index: number;
};
type ParserErrorPath = ElementPathItem[];
type ParserErrorLocation = { path: ParserErrorPath | null };
const parserErrorLocation: ParserErrorLocation = {
	path: null
};

const path = (from: Element, to: Node) => {
	const reversePath = [];
	if (from === to) return [];
	let currentElement = from;
	while (currentElement.parentElement) {
		if (currentElement.nodeType !== Node.ELEMENT_NODE) {
			currentElement = currentElement.parentElement;
		}
		if (!currentElement.parentElement) break;
		const name = currentElement.tagName;
		const index = Array.from(currentElement.parentElement.querySelectorAll(name)).indexOf(currentElement);
		reversePath.push({name, index});
		currentElement = currentElement.parentElement;
	}
	return reversePath.reverse();
}

function getText(node: Node) {
	let texts = [];
	for (const child of Array.from(node.childNodes)) {
		if (child.nodeType === Node.TEXT_NODE) {
			texts.push(child.textContent);
		}
	}
	return texts.join(" ");
}

function findParserErrorPath() {
	console.warn("On some browsers, you may see one XML parsing error next. Ignore it. I am just checking what your browser's XML parsing errors look like so I can present them in a better-looking way.");
	const testFail = new DOMParser().parseFromString("\n".repeat(1235) +  " ".repeat(4565) + '<', "text/xml");
	const parsererror = testFail.querySelector("parsererror");
	if (!parsererror) {
		console.warn("This browser is too weird for me. I can't figure out where the parse errors are.");
		return null;
	}
	const walker = testFail.createTreeWalker(parsererror);
	while (true) {
		const text = getText(walker.currentNode);
		if (text.includes("123") && text.includes("456")) {
			parserErrorLocation.path = path(parsererror, walker.currentNode);
		}
		if (!walker.nextNode()) break;
	}
}
findParserErrorPath();

function getParserErrorElement(xmlDoc: Document) {
	const parsererror = xmlDoc.querySelector("parsererror");
	if (!parsererror) return null;
	if (!parserErrorLocation.path?.length) return parsererror;
	const selector = parserErrorLocation.path.map(step => `${step.name}:nth-of-type(${step.index + 1})`).join(' > ');
	console.log("Looking for error at ", selector);
	return xmlDoc.querySelector(selector);
}

function getParserError(xmlDoc: Document) {
	const parserErrorElement = getParserErrorElement(xmlDoc);
	if (!parserErrorElement) return null;
	return getText(parserErrorElement);
}

export default getParserError;
