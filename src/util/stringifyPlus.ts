import randomString from "@/util/randomString.ts";

function jsonReplacer(key: string | Symbol, value: any, specialKey: string) {
	if (value instanceof Map) {
		return {
			[`${specialKey}START`]: "new Map(",
			[`${specialKey}VALUE`]: [...value.entries()],
			[`${specialKey}END`]: ")",
		};
	}
	if (value instanceof Set) {
		const startEndKey = randomString(20);
		return {
			[`${specialKey}START`]: "new Set(",
			[`${specialKey}VALUE`]: [...value.values()],
			[`${specialKey}END`]: ")",
		};
	}

	return value;
}

export default function stringifyPlus(value: any, space: number | string = 4) {
	const specialKey = randomString(20, "_");
	const stringified = JSON.stringify(value, (key, value) => jsonReplacer(key, value, specialKey), space);

	const replaced = stringified
		.replace(new RegExp(`\\{\\s*"${specialKey}START":\\s*"(.+?)"\s*,`, "gs"), "$1")
		.replace(new RegExp(`"${specialKey}VALUE":\s*`, "gs"), "")
		.replace(new RegExp(`\\s*,?\\s*"${specialKey}END":\\s*"(.+?)"\\s*\\}`, "gs"), "$1")

	return replaced;
}