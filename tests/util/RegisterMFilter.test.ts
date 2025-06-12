import { vi, expect, describe, it } from "vitest";
import {registerMFilter, getFilterById, getFilters} from "@/util/RegisterMFilter.ts";

const mFilterDef = {
	type: "MFILTER",
	appuid: "mfilter",
	displayName: "",
	author: "",
	version: [1,2,3],
	template: ""
}

const svgFilterDef = {
	type: "SVGNATIVE",
	appuid: "svgfilter",
	interfaceFor: "",
	displayName: "",
	author: "",
	version: [1,2,3],
	template: ""
}

const utilityFilterDef = {
	type: "UTILITY",
	appuid: "utility",
	displayName: "",
	author: "",
	version: [1,2,3],
}

describe("RegisterMFilter", () => {
	it("Registers filters and gets them by ID", () => {
		vi.resetModules();
		registerMFilter(mFilterDef, svgFilterDef, utilityFilterDef);
		expect(getFilterById("mfilter")).toEqual(mFilterDef);
		expect(getFilterById("svgfilter")).toEqual(svgFilterDef);
		expect(getFilterById("utility")).toEqual(utilityFilterDef);
	});

	it("Registers filters and gets them all", () => {
		vi.resetModules();
		registerMFilter(mFilterDef, svgFilterDef, utilityFilterDef);
		expect([...getFilters()]).toEqual([mFilterDef, svgFilterDef, utilityFilterDef]);
	});
})
