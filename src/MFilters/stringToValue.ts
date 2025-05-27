import type {InputTypeMap, InputTypeName, Value} from "@/MFilters/types.ts";

export default function stringToValue(str: string, type: InputTypeName): Value {
	switch (type) {
		case "STRING":
		case "RESULT":
		case "SELECT":
		case "COLOR":
			return str;
		case "NUMBER":
			return Number(str);
		case "MATRIX":
		case "TABLE":
			return str.split(/[\s,]+/).map(n => Number(n));
	}
}