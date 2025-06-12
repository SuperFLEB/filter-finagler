import { expect, describe, it } from "vitest";
import xpath from "@/util/xpath.ts";
import {Namespaces} from "../../src/constants";

describe("xpath", () => {
	it("Fails when not all namespace prefixes are defined", () => {
		const doc = document.implementation.createDocument("http://www.w3.org/XML/1998/namespace", "");
		expect(() => xpath(doc, "//a:foo/b:bar", { a: "http://example.com" })).toThrowError()
	});

	it("Finds an element with the default namespace", () => {
		const doc = document.implementation.createDocument("http://www.w3.org/XML/1998/namespace", "");
		const docElement = doc.appendChild(doc.createElement("documentElement"));
		const element = doc.createElement("something");
		docElement.appendChild(element);
		docElement.appendChild(doc.createElement("nothing"));
		expect(xpath(doc, "//something")).toEqual([element]);
	});

	it("Finds multiple elements with the default namespace", () => {
		const doc = document.implementation.createDocument("http://www.w3.org/XML/1998/namespace", "");
		const docElement = doc.appendChild(doc.createElement("documentElement"));
		const elements = [doc.createElement("something"), doc.createElement("something")];
		docElement.append(...elements);
		docElement.appendChild(doc.createElement("nothing"));
		expect(xpath(doc, "//something")).toEqual(elements);
	});

	it("Finds only the first matching element with called with the 'firstOnly' flag", () => {
		const doc = document.implementation.createDocument("http://www.w3.org/XML/1998/namespace", "");
		const docElement = doc.appendChild(doc.createElement("documentElement"));
		const elements = [doc.createElement("something"), doc.createElement("something")];
		docElement.append(...elements);
		docElement.appendChild(doc.createElement("nothing"));
		expect(xpath(doc, "//something", {}, true)).toEqual([elements[0]]);
	});

	it("Finds only elements with the matching namespace", () => {
		const doc = document.implementation.createDocument("http://www.w3.org/XML/1998/namespace", "");
		const docElement = doc.appendChild(doc.createElement("documentElement"));
		docElement.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:namespace", "http://example.com");
		const elements = [
			doc.createElementNS(null, "something"),
			doc.createElementNS("http://example.com", "something"),
			doc.createElementNS("http://example.com", "something"),
			doc.createElementNS("http://www.w3.org/XML/1998/namespace", "something"),
			doc.createElementNS("http://www.w3.org/XML/1998/namespace", "something"),
		];
		docElement.append(...elements);
		docElement.appendChild(doc.createElement("nothing"));
		expect(xpath(doc, "//n:something", { x: "http://www.w3.org/XML/1998/namespace", n: "http://example.com" })).toEqual([elements[1], elements[2]]);
	});

	it("Finds only the first element with the matching namespace when the firstOnly flag is set", () => {
		const doc = document.implementation.createDocument("http://www.w3.org/XML/1998/namespace", "");
		const docElement = doc.appendChild(doc.createElement("documentElement"));
		docElement.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:namespace", "http://example.com");
		const elements = [
			doc.createElementNS(null, "something"),
			doc.createElementNS("http://example.com", "something"),
			doc.createElementNS("http://example.com", "something"),
			doc.createElementNS("http://www.w3.org/XML/1998/namespace", "something"),
			doc.createElementNS("http://www.w3.org/XML/1998/namespace", "something"),
		];
		docElement.append(...elements);
		docElement.appendChild(doc.createElement("nothing"));
		expect(xpath(doc, "//n:something", { x: "http://www.w3.org/XML/1998/namespace", n: "http://example.com" }, true)).toEqual([elements[1]]);
	});
})
