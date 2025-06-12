import { expect, describe, it } from "vitest";
import setIntersect from "@/util/setIntersect.ts";

describe("setIntersect", () => {
	it("Properly intersects sets of different sizes", () => {
		// @ts-ignore (This isn't a standard feature to TypeScript might not know about it.)
		const originalSetPrototypeIntersect: Function | undefined = Set.prototype.intersect;
		// @ts-ignore (ditto)
		Set.prototype.intersect = undefined;
		const setA = new Set(["a", "b", "c", "d"]);
		const setB = new Set(["c", "d"]);
		expect([...setIntersect(setA, setB).keys()]).toEqual(["c", "d"]);
		expect([...setIntersect(setB, setA).keys()]).toEqual(["c", "d"]);
		// @ts-ignore (ditto)
		Set.prototype.intersect = originalSetPrototypeIntersect;
	});
	it("Properly intersects sets of the same size", () => {
		// @ts-ignore (This isn't a standard feature to TypeScript might not know about it.)
		const originalSetPrototypeIntersect: Function | undefined = Set.prototype.intersect;
		// @ts-ignore (ditto)
		Set.prototype.intersect = undefined;
		const setA = new Set(["a", "b", "c"]);
		const setB = new Set(["b", "c", "d"]);
		expect([...setIntersect(setA, setB).keys()]).toEqual(["b", "c"]);
		expect([...setIntersect(setB, setA).keys()]).toEqual(["b", "c"]);
		// @ts-ignore (ditto)
		Set.prototype.intersect = originalSetPrototypeIntersect;
	});
	it("Returns an empty set when there are no similar items", () => {
		// @ts-ignore (This isn't a standard feature to TypeScript might not know about it.)
		const originalSetPrototypeIntersect: Function | undefined = Set.prototype.intersect;
		// @ts-ignore (ditto)
		Set.prototype.intersect = undefined;
		const setA = new Set(["a", "b", "c"]);
		const setB = new Set(["d", "e", "f"]);
		expect([...setIntersect(setA, setB).keys()]).toEqual([]);
		expect([...setIntersect(setB, setA).keys()]).toEqual([]);
		// @ts-ignore (ditto)
		Set.prototype.intersect = originalSetPrototypeIntersect;
	});
	it("Returns an empty set when comparing two empty sets", () => {
		// @ts-ignore (This isn't a standard feature to TypeScript might not know about it.)
		const originalSetPrototypeIntersect: Function | undefined = Set.prototype.intersect;
		// @ts-ignore (ditto)
		Set.prototype.intersect = undefined;
		const setA = new Set();
		const setB = new Set();
		expect([...setIntersect(setA, setB).keys()]).toEqual([]);
		expect([...setIntersect(setB, setA).keys()]).toEqual([]);
		// @ts-ignore (ditto)
		Set.prototype.intersect = originalSetPrototypeIntersect;
	});
	it("Compares with strict equality", () => {
		// @ts-ignore (This isn't a standard feature to TypeScript might not know about it.)
		const originalSetPrototypeIntersect: Function | undefined = Set.prototype.intersect;
		// @ts-ignore (ditto)
		Set.prototype.intersect = undefined;
		const setA = new Set([1, 2, 3, 4]);
		const setB = new Set(["1", "2", "3", 4]);
		expect([...setIntersect(setA, setB).keys()]).toEqual([4]);
		expect([...setIntersect(setB, setA).keys()]).toEqual([4]);
		// @ts-ignore (ditto)
		Set.prototype.intersect = originalSetPrototypeIntersect;
	});
});
