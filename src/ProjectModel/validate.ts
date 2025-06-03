import type {FilterElement, FilterModel, ProjectModel} from "@/ProjectModel/ProjectModel.ts";
import SvgOutput from "@/MFilters/utility/SvgOutput.ts";
import {getFilterDef} from "@/ProjectModel/info.ts";

export type FEConnectionStatus = Map<string, boolean>;

function markElement(ok: boolean, fe: FilterElement, results: FEConnectionStatus) {
	results.set(fe.instanceId, ok);
	return results;
}

function validateElement(fe: FilterElement, elements: FilterModel["elements"], results: FEConnectionStatus) {
	const instanceId = fe.instanceId;
	if (results.has(instanceId)) return results;
	const fd = getFilterDef(fe);
	if (!fd) throw new Error(`Cannot validate filter: Filter definition for ${fe.instanceId} not found`);
	const inputNames = Object.keys(fd.inputs ?? {});
	if (!(fd.inputs && inputNames.length)) return markElement(true, fe, results);
	for (const name of inputNames) {
		if (!fe.inputs?.[name]) return markElement(false, fe, results);
		const outputInstanceId = fe.inputs[name].outputInstanceId;
		if (outputInstanceId === null) continue;
		if (results.has(outputInstanceId)) {
			if (results.get(outputInstanceId) === false) return markElement(false, fe, results);
			continue;
		}
		const outputFe = elements.get(outputInstanceId);
		if (!outputFe) return markElement(false, fe, results);
		validateElement(outputFe, elements, results);
		if (!results.get(outputInstanceId)) return markElement(false, fe, results);
	}
	return markElement(true, fe, results);
}

export default function feConnectionStatus(project: ProjectModel, filterId: string) {
	const elements = project.filters?.get(filterId)?.elements;
	const results: FEConnectionStatus = new Map<string, boolean>();
	if (!elements) return results;
	const sink = [...elements.values()].find(e => e.appuid === SvgOutput.appuid);
	if (!sink) return results;
	validateElement(sink, elements, results);

	return new Map<string, boolean>([
		...[...elements.keys()].map(k => [k, false] as [string, boolean]),
		...results
	]);
}