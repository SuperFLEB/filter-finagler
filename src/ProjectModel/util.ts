import type {FilterElement} from "@/ProjectModel/ProjectModel.ts";
import {getFilterDef} from "@/ProjectModel/info.ts";

function unescapeSplit(str: string, split: string, escapeChar: string, maxSplits: number = 1): string[] {
	const results = [];
	let result: string = "";
	let esc: boolean = false;
	for (const ch of str) {
		if (esc) {
			result += ch;
			esc = false;
			continue;
		}
		if (ch === escapeChar) {
			esc = true;
			continue;
		}
		if (ch === split && results.length < maxSplits + 1) {
			results.push(result);
			result = "";
			continue;
		}
		result += ch;
	}
	return [...results, result];
}

export function parseOutputRef(outputRef: string): string[] {
	return unescapeSplit(outputRef, "@", "\\", 2);
}

export function makeOutputNodeRef(targetOutputName: string, targetInstanceId: string | null, internal: boolean = false) {
	const escapedName = targetOutputName.replaceAll("\\", "\\\\").replaceAll("@", "\\@");
	if (targetInstanceId === null) return escapedName;
	const escapedInstanceId = targetInstanceId.replaceAll("\\", "\\\\").replaceAll("@", "\\@")
	return `${escapedName}@${escapedInstanceId}` + (internal ? "@internal" : "");
}

export function getOrCreateOutputRef(targetOutputId: string, targetFe: FilterElement) {
	const targetFilterDef = getFilterDef(targetFe);
	if (!targetFilterDef) throw new Error(`No filter definition for output FE ${targetFe.instanceId}`);
	if (!targetFilterDef.outputs?.[targetOutputId]) throw new Error(`No output definition for ${targetOutputId} in output FilterDef on ${targetFe.instanceId}`);
	if (!targetFe.outputs?.[targetOutputId]) {
		targetFe.outputs = {
			...targetFe.outputs,
			[targetOutputId]: getOutputRefName(targetOutputId, targetFe, false),
		};
	}
	const result = targetFe.outputs[targetOutputId];
	return result;
}

export function getOutputRefName(targetOutputId: string, targetFe: FilterElement | null, internal = false) {
	if (targetFe === null) return targetOutputId;

	const explicitName = targetFe.outputs?.[targetOutputId];
	if (explicitName) return explicitName;

	const targetFilterDef = getFilterDef(targetFe);
	if (!targetFilterDef) throw new Error("Output ref filter definition could not be found");
	if (!targetFilterDef.outputs?.[targetOutputId]) throw new Error(`Could not find output ${targetOutputId} on ${targetFe.instanceId}`);

	const targetInstanceId = targetFilterDef?.outputs?.[targetOutputId].universal ? undefined : targetFe.instanceId;
	return makeOutputNodeRef(targetOutputId, targetInstanceId ?? null, internal);
}
