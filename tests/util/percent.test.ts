import { expect, describe, it } from "vitest";
import percent from "@/util/percent.ts";

describe("percent", () => {
	it("Creates percentages properly with the default (3) places", () => {
		expect(percent(0.000001)).toBe("0.000%");
		expect(percent(0.00001)).toBe("0.001%");
		expect(percent(0.0001)).toBe("0.010%");
		expect(percent(0.001)).toBe("0.100%");
		expect(percent(0.01)).toBe("1.000%");
		expect(percent(0.1)).toBe("10.000%");
		expect(percent(1)).toBe("100.000%");
		expect(percent(10)).toBe("1000.000%");
		expect(percent(-0.000001)).toBe("-0.000%");
		expect(percent(-0.00001)).toBe("-0.001%");
		expect(percent(-0.0001)).toBe("-0.010%");
		expect(percent(-0.001)).toBe("-0.100%");
		expect(percent(-0.01)).toBe("-1.000%");
		expect(percent(-0.1)).toBe("-10.000%");
		expect(percent(-1)).toBe("-100.000%");
		expect(percent(-10)).toBe("-1000.000%");
	});
	it("Creates percentages properly with the 2 places", () => {
		expect(percent(0.000001, 2)).toBe("0.00%");
		expect(percent(0.00001, 2)).toBe("0.00%");
		expect(percent(0.0001, 2)).toBe("0.01%");
		expect(percent(0.001, 2)).toBe("0.10%");
		expect(percent(0.01, 2)).toBe("1.00%");
		expect(percent(0.1, 2)).toBe("10.00%");
		expect(percent(1, 2)).toBe("100.00%");
		expect(percent(10, 2)).toBe("1000.00%");
		expect(percent(-0.000001, 2)).toBe("-0.00%");
		expect(percent(-0.00001, 2)).toBe("-0.00%");
		expect(percent(-0.0001, 2)).toBe("-0.01%");
		expect(percent(-0.001, 2)).toBe("-0.10%");
		expect(percent(-0.01, 2)).toBe("-1.00%");
		expect(percent(-0.1, 2)).toBe("-10.00%");
		expect(percent(-1, 2)).toBe("-100.00%");
		expect(percent(-10, 2)).toBe("-1000.00%");
	});
})
