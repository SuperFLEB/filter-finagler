import type {
	DisplayProperties,
	FilterElement,
	FilterInputReferences,
	FilterOutputReferences,
	ProjectModel
} from "@/ProjectModel/ProjectModel.ts";
import {getFilterDef} from "@/ProjectModel/info.ts";
import type {FilterAttributeValues, FilterDef} from "@/MFilter/types.ts";
import feConnectionStatus from "@/ProjectModel/validate.ts";

function _connect(outputId: string, outputFe: FilterElement, inputName: string, inputFe: FilterElement, universal: boolean) {
	inputFe.inputs = {
		...inputFe.inputs,
		[inputName]: {
			outputId,
			outputInstanceId: universal ? null : outputFe.instanceId,
		}
	};
}

function _disconnect(inputName: string, inputFe: FilterElement) {
	if (inputFe.inputs) delete inputFe.inputs[inputName];
}

function _nextInstanceId(project: ProjectModel, filter: string) {
	const elements = project.filters.get(filter)?.elements;
	if (!elements || !elements.size) return "1";
	const lastInstanceNumber = [...elements.keys()].reduce<number>((top, current) => {
		const numeric = Number(current);
		return (isNaN(numeric)) ? top : Math.max(numeric, top);
	}, 0);
	return (lastInstanceNumber + 1).toString();
}

export function connect(project: ProjectModel, filterId: string, outputName: string, outInstanceId: string, inputName: string, inInstanceId: string): ProjectModel {
	const filter = project.filters.get(filterId);

	if (!filter) {
		console.error(`Could not find the filter ${filterId} in the project model`);
		return project;
	}

	const outFe = filter.elements.get(outInstanceId);
	const inFe = filter.elements.get(inInstanceId);

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

	const outputAttrAndName =
		(outFe.outputs && outFe.outputs[outputName]) ??
		(outFilterDef.outputs && (outFilterDef.outputs[outputName]?.universal ||	 outputName));

	if (!outputAttrAndName) {
		console.error(`Could not find output for ${outputName}`);
		return project;
	}

	const universal = !!outFilterDef.outputs?.[outputAttrAndName[1]]?.universal;

	_connect(outputName, outFe, inputName, inFe, universal);
	return project;
}

export function disconnect(project: ProjectModel, filterId: string, inputName: string, inInstanceId: string): ProjectModel {
	const filter = project.filters.get(filterId);

	if (!filter) {
		console.error("Could not find the filter in the project model");
		return project;
	}

	const inFe = filter.elements.get(inInstanceId);

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

export function add(project: ProjectModel, filterId: string, filterDef: FilterDef, position: {x: number, y: number}) {
	const filter = project.filters.get(filterId);
	if (!filter) {
		console.error(`Could not find filter ${filterId} in the project model`);
		return project;
	}

	const instanceId = _nextInstanceId(project, "filter");
	filter.elements.set(instanceId, {
		instanceId,
		type: filterDef.type,
		appuid: filterDef.appuid,
		display: {
			x: position.x,
			y: position.y
		}
	});
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
	const instance = filter.elements.get(instanceId);
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

	const fe = filter.elements.get(instanceId);
	if (!fe) {
		console.error(`Could not find instance ${instanceId} of filter ${filterName} in the project model.`);
		return project;
	}

	const filterDef = getFilterDef(fe);

	// Disconnect all connections coming into this node's inputs
	for (const name of Object.keys(fe?.inputs ?? {})) {
		_disconnect(name, fe);
	}

	// Disconnect all connections coming from this node's outputs
	if (fe.outputs) {
	for (const otherFe of project.filters.get(filterName)?.elements.values() ?? []) {
			if (otherFe === fe || !otherFe.inputs) continue;
			for (const [inputName, input] of Object.entries(otherFe.inputs)) {
				if (input.outputInstanceId !== instanceId) continue;
				_disconnect(inputName, otherFe);
			}
		}
	}

	// Delete the filter element
	filter.elements.delete(fe.instanceId);
	return project;
}