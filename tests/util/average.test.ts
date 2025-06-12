import { expect, describe, it } from "vitest";
import average from "@/util/average.ts";

describe("average", () => {
	it("Averages numbers", () => {
		expect(average([1,2,3])).toBe(2);
		expect(average([0,0,0])).toBe(0);
	});
})
