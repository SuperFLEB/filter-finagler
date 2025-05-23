import type {SVGMFilterElement} from "@/Project/ProjectModel.ts";
import {getFilterById} from "@/util/RegisterMFilter.ts";

export function getFilterDef(fe: SVGMFilterElement) {
	const appuid = fe.appuid;
	return getFilterById(appuid);
}
