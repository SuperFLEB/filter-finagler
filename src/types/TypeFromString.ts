export type StringToTypeMap = {
	"string": string,
	"number": number,
	"boolean": boolean,
	"symbol": symbol,
	"bigint": bigint,
	"string[]": string[],
	"number[]": number[],
	"boolean[]": boolean[],
	"symbol[]": symbol[],
	"bigint[]": bigint[],
};

export function verifyTypeFromString<S extends keyof StringToTypeMap>(value: any, type: S): value is StringToTypeMap[S] {
	if (!type.endsWith("[]")) return typeof value === type;
	if (!Array.isArray(value)) return false;
	const elementType = type.slice(0, -2) as keyof StringToTypeMap;
	return (!value.some(v => !verifyTypeFromString(v, elementType)));
}

export type TypeFromString<S extends keyof StringToTypeMap> = StringToTypeMap[S];
