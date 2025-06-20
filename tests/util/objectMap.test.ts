import { expect, describe, it } from "vitest";
import objectMap from "@/util/objectMap.ts";

describe("objectMap", () => {
	it("Maps with default filtering (on)", () => {
		const input: Record<string, number> = { a: 1000, b: 2000, c: 3000, d: 0 };
		const expected: Record<string, number> = { a: 2000, b: 4000, c: 6000 };
		expect(objectMap(input, ([name, num]) => num ? [name, num * 2] : null)).toEqual(expected);
		expect(objectMap(input, ([name, num]) => num ? [name, num * 2] : false)).toEqual(expected);
		expect(objectMap(input, ([name, num]) => num ? [name, num * 2] : undefined)).toEqual(expected);
	});
	it("Maps with filtering on", () => {
		const input: Record<string, number> = { a: 1000, b: 2000, c: 3000, d: 0 };
		const expected: Record<string, number> = { a: 2000, b: 4000, c: 6000 };
		expect(objectMap(input, ([name, num]) => num ? [name, num * 2] : null, true)).toEqual(expected);
		expect(objectMap(input, ([name, num]) => num ? [name, num * 2] : false, true)).toEqual(expected);
		expect(objectMap(input, ([name, num]) => num ? [name, num * 2] : undefined, true)).toEqual(expected);
	});
	it("Maps with filtering off", () => {
		const input: Record<string, number> = { a: 1000, b: 2000, c: 3000 };
		const expected: Record<string, number> = { a: 2000, b: 4000, c: 6000 };
		expect(objectMap(input, ([name, num]) => [name, num * 2], false)).toEqual(expected);
	});
	it("Throws whem mapping with filtering off and a null value is produced", () => {
		const input: Record<string, number> = { a: 1000, b: 0 };
		// @ts-ignore
		expect(() => objectMap(input, ([name, num]) => num ? [name, num * 2] : null, false)).toThrowError();
	});
})
