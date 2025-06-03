import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import type {FilterDef, Value} from "@/MFilter/types.ts";
import objectMap from "@/util/objectMap.ts";

export default function values(fe: FilterElement, fd: FilterDef): Record<string, Value | undefined> {
	return {
		...objectMap(
			fd.values ?? {},
			([k, v]) => v.defaultValue !== null ? [k, v.defaultValue] : null
		),
		...fe.values,
	};
}