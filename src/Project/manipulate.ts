import type {
	DisplayProperties,
	FilterElement,
	FilterInputReferences,
	FilterOutputReferences,
	ProjectModel
} from "@/Project/ProjectModel.ts";
import {getFilterDef} from "@/Project/info.ts";
import type {FilterAttributeValues} from "@/MFilters/types.ts";

function _connect(outputName: string, outputFe: FilterElement, inputName: string, inputFe: FilterElement, universal: boolean) {
	inputFe.inputs = {
		...inputFe.inputs,
		[inputName]: {
			outputName,
			outputInstanceId: universal ? null : outputFe.instanceId,
		}
	};
}

function _disconnect(inputName: string, inputFe: FilterElement) {
	if (inputFe.inputs) delete inputFe.inputs[inputName];
}


export function connect(project: ProjectModel, filterName: string, outputName: string, outInstanceId: string, inputName: string, inInstanceId: string): ProjectModel {
	const filter = project.filters.get(filterName);

	if (!filter) {
		console.error(`Could not find the filter ${filterName} in the project model`);
		return project;
	}

	const outFe = filter.elements.find(fe => fe.instanceId === outInstanceId);
	const inFe = filter.elements.find(fe => fe.instanceId === inInstanceId);

	if (!inFe) {
		console.error(`Could not find input node ${inInstanceId} in the project model.`);
		return project;
	}
	if (!outFe) {
		console.error(`Could not find output node ${outInstanceId} in the project model.`);
		return project;
	}

	const outFilterDef = getFilterDef(outFe);
	const inFilterDef = getFilterDef(inFe);

	if (!inFilterDef) {
		console.error(`Could not find input filter definition ${inFe.appuid ?? "(undefined)"} for filter ${outInstanceId}`);
		return project;
	}
	if (!outFilterDef) {
		console.error(`Could not find output filter definition ${outFe.appuid ?? "(undefined)"} for filter ${outInstanceId}`);
		return project;
	}
	if (!inFilterDef.inputs?.[inputName]) {
		console.error(`Could not find input definition for input ${inputName}`);
		return project;
	}
	if (!outFilterDef.outputs?.[outputName]) {
		console.error(`Could not find input definition for output ${outputName}`);
		return project;
	}

	_connect(outputName, outFe, inputName, inFe, outFilterDef.outputs[outputName].universal);
	return project;
}

export function disconnect(project: ProjectModel, filterName: string, inputName: string, inInstanceId: string): ProjectModel {
	const filter = project.filters.get(filterName);

	if (!filter) {
		console.error("Could not find the filter in the project model");
		return project;
	}

	const inFe = filter.elements.find(fe => fe.instanceId === inInstanceId);

	if (!inFe) {
		console.error(`Could not find input ${inputName} @ ${inInstanceId} in the project model.`);
		return project;
	}

	if (!inFe.inputs?.[inputName]) {
		console.error("Could not find input for the node in the project model.");
		return project;
	}

	_disconnect(inputName, inFe);
	return project;
}

type Updates = {
	inputs?: FilterInputReferences,
	outputs?: FilterOutputReferences,
	display?: DisplayProperties,
	values?: FilterAttributeValues,
};

export function update(project: ProjectModel, filterName: string, instanceId: string, updates: Updates) {
	const filter = project.filters.get(filterName);
	if (!filter) {
		console.error(`Could not find filter ${filterName} in the project model`);
		return project;
	}
	const instance = filter.elements.find(fe => fe.instanceId === instanceId);
	if (!instance) {
		console.error(`Could not find instance ${instanceId} of filter ${filterName} in the project model.`);
		return project;
	}

	if (updates.inputs) {
		instance.inputs ??= {};
		for (const input of Object.keys(updates.inputs)) {
			instance.inputs[input] = updates.inputs[input];
		}
	}

	if (updates.outputs) {
		instance.outputs ??= {};
		Object.assign(instance.outputs, updates.outputs);
	}

	if (updates.display) {
		instance.display ??= {};
		Object.assign(instance.display, updates.display);
	}

	if (updates.values) {
		instance.values ??= {};
		Object.assign(instance.values, updates.values);
	}
}

export function remove(project: ProjectModel, filterName: string, instanceId: string) {
	const filter = project.filters.get(filterName);
	if (!filter) {
		console.error(`Could not find filter ${filterName} in the project model`);
		return project;
	}

	const fe = filter.elements.find(fe => fe.instanceId === instanceId);
	if (!fe) {
		console.error(`Could not find instance ${instanceId} of filter ${filterName} in the project model.`);
		return project;
	}

	const filterDef = getFilterDef(fe);

	for (const name of Object.keys(fe?.inputs ?? {})) {
		_disconnect(name, fe);
	}

	if (fe.outputs) {
		for (const otherFe of project.filters.get(filterName)?.elements ?? []) {
			if (otherFe === fe || !otherFe.inputs) continue;
			for (const [inputName, input] of Object.entries(otherFe.inputs)) {
				if (input.outputInstanceId !== instanceId) continue;
				_disconnect(inputName, otherFe);
			}
		}
	}

	filter.elements.splice(filter.elements.indexOf(fe), 1);
	return project;
}