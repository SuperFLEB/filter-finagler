import {vi, expect, describe, it, beforeEach, afterEach} from "vitest";
import RandomNamespace from "@/util/randomNamespace.ts";
import randomString, {RandomCharSet} from "@/util/randomString.ts";

describe("randomNamespace", () => {
	beforeEach(() => {
		vi.mock("@/util/randomString.ts", async (importOriginal) => {
			return {
				...(await importOriginal()),
				default: vi.fn(() => "random"),
			};
		});
	});

	it("Generates a suffixed ID", () => {
		const ns = new RandomNamespace();
		expect(ns.id("name")).toEqual("randomname");
	});

	it("Generates a suffixed fragment name", () => {
		const ns = new RandomNamespace();
		expect(ns.fragment("name")).toEqual("#randomname");
	});

	it("Generates a suffixed fragment URL", () => {
		const ns = new RandomNamespace();
		expect(ns.url("name")).toEqual("url('#randomname')");
	});

	it("Passes options to randomString", () => {
		const ns = new RandomNamespace(10, "prefix", RandomCharSet.hex);
		expect(randomString).toHaveBeenCalledExactlyOnceWith(10, "prefix", "", RandomCharSet.hex);
	})

	it("Allows changing the ID", () => {
		const ns = new RandomNamespace(10, "prefix", RandomCharSet.hex);
		ns.setId("notrandom");
		expect(ns.id("name")).toEqual("notrandomname");
	})

	afterEach(() => {
		vi.clearAllMocks();
	})
})