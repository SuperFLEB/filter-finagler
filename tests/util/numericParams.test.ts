import { expect, describe, it } from "vitest";
import {numeric} from "@/util/numericParams.ts";

describe("numericParams", () => {
	it("Generates numeric params object when all values are supplied", () => {
		expect(numeric(-10, 10, 20, 2, true, true)).toEqual({
			min: -10,
			defaultValue: 10,
			max: 20,
			step: 2,
			hardMin: true,
			hardMax: true,
		});
	});

	it("Generates numeric params object when defaultable values are not supplied", () => {
		expect(numeric(-10, 10, 20)).toEqual({
			min: -10,
			defaultValue: 10,
			max: 20,
			step: 0.001,
			hardMin: false,
			hardMax: false,
		});
	});
})
