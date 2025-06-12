import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import {getFilterById} from "@/util/RegisterMFilter.ts";
import type {NodeDef} from "@/MFilter/types.ts";

export function getFilterDef(fe: FilterElement, combineVectors: boolean = false): NodeDef | undefined{
	return getFilterById(fe.appuid);
}
