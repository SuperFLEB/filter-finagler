import { expect, describe, it } from "vitest";
import lookup from "@/util/lookup.ts";

describe("lookup", () => {
	it("Creates lookup objects from an array of objects", () => {
		const aok = [{ key: "foo", value: "bar" }, { key: "baz", value: "bletch" }];
		expect(lookup(aok, "key")).toEqual({ foo: aok[0], baz: aok[1] });
	});
	it("Throws an error when no key is present in an array element", () => {
		expect(() => lookup([{ no: "key" }], "key")).toThrow();
	});
	it("Returns an empty object when given an empty array", () => {
		expect(lookup([], "key")).toEqual({});
	});
});
