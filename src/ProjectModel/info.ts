import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import {getFilterById} from "@/util/RegisterMFilter.ts";

export function getFilterDef(fe: FilterElement) {
	return getFilterById(fe.appuid);
}
