import {expect, describe, it} from "vitest";
import stringifyPlus from "@/util/stringifyPlus.ts";

describe("stringifyPlus", () => {
	it("Stringifies an object containing a Map and Set", () => {
		const input = {
			aValue: 1000,
			aSet: new Set([1, 2, 3]),
			aMap: new Map([["a", 1], ["b", 2]]),
			anotherValue: 2000,
		};
		const expected = "{\"aValue\":1000,\"aSet\":newSet([1,2,3]),\"aMap\":newMap([[\"a\",1],[\"b\",2]]),\"anotherValue\":2000}";
		const rawResult = stringifyPlus(input);
		expect(rawResult.replace(/\s+/g, "")).toEqual(expected);
	});
});
