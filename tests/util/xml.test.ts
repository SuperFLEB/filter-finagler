import {vi, expect, describe, it} from "vitest";
import { stringToDom, domToString } from "@/util/xml";

describe("XMLSerializer", () => {
	it("calls DOMParser with stringToDom", () => {
		const parseFromString = vi.fn();
		const DOMParserMock = vi.fn().mockImplementation(() => ({
			parseFromString
		}));
		vi.stubGlobal("DOMParser", DOMParserMock);
		stringToDom("A string");
		expect(parseFromString).toHaveBeenCalledExactlyOnceWith("A string", "text/xml");
		vi.unstubAllGlobals();
	});

	it("calls the XMLSerializer with domToString", () => {
		const serializeToString = vi.fn();
		const mockXMLSerializer = vi.fn().mockImplementation(() => ({
			XMLSerializer: vi.fn(),
			serializeToString,
		}))
		vi.stubGlobal('XMLSerializer', mockXMLSerializer)
		const doc = document.implementation.createDocument(null, "");
		domToString(doc);
		expect(serializeToString).toHaveBeenCalledExactlyOnceWith(doc);
		vi.unstubAllGlobals();
	});
});
