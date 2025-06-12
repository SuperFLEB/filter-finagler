import { expect, describe, it } from "vitest";
import xmlns from "@/util/xmlns.ts";
import {Namespaces} from "@/constants.ts";

describe("XMLNS adder", () => {
	const doc = document.implementation.createDocument(null, "");
	it("Adds XMLNS prefixes to an element and returns it", () => {
		const element = doc.createElement("something");
		const alsoElement = xmlns(element, { a: "svg", b: "xml" });
		expect(element.getAttribute("xmlns:a")).toBe(Namespaces.svg);
		expect(element.getAttribute("xmlns:b")).toBe(Namespaces.xml);
		expect(element).toBe(alsoElement);
	});
})
