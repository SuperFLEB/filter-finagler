import type {InputTypeMap, InputTypeName, Value} from "@/MFilter/types.ts";
import {colord} from "colord";

export default function stringToValue(str: string, type: InputTypeName): Value {
	switch (type) {
		case "STRING":
		case "RESULT":
		case "SELECT":
			return str;
		case "COLOR":
			return colord(str).toRgbString();
		case "NUMBER":
			return Number(str);
		case "TABLE":
		case "MATRIX":
			return str.split(/[\s,]+/).map(n => Number(n));
		case "VECTOR":
			return str.split(/[\s,]+/).map(n => Number(n));
	}
}