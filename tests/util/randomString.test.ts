import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import randomString, {RandomCharSet} from "@/util/randomString.ts";

describe("randomString", () => {
	beforeEach(() => {
		const cryptoMock = {
			getRandomValues: (buffer: Uint8Array) => {
				const unrandom = Array.from({length: buffer.length}).map((_, index) => index % 256);
				buffer.set(unrandom, 0);
				return buffer;
			}
		};
		vi.stubGlobal('crypto', cryptoMock);
	})

	it("Returns a default 5-character string", () => {
		expect(randomString()).toBe("ABCDE");
	});

	it.each(Object.entries(RandomCharSet))("Returns a 512-character string and converts all values correctly with character set %s", (csName, charSet) => {
		const expected = charSet.repeat(512 / charSet.length);
		expect(randomString(512, "", "", charSet)).toEqual(expected);
	});

	it("Properly prefixes and suffixes", () => {
		expect(randomString(5, "BEFORE:", ":AFTER")).toBe("BEFORE:ABCDE:AFTER");
	});
	afterEach(() => vi.restoreAllMocks());
});
