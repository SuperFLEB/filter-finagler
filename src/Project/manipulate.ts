import type {ProjectModel, SVGMFilterElement} from "@/Project/ProjectModel.ts";
import {getFilterDef} from "@/Project/info.ts";
import OutsideConnections from "@t/OutsideConnections.ts";

function connectToNativeInput(project: ProjectModel, filterName: string, outputName: string, inInstance: SVGMFilterElement, inputName: string): ProjectModel {
	if (!OutsideConnections[outputName as keyof typeof OutsideConnections]) {
		console.error("Output name is not an allowed value");
		return project;
	}

	const inFilterDef = getFilterDef(inInstance);

	if (!inFilterDef) {
		console.error("Could not find filter definition for input node");
		return project;
	}

	if (!inFilterDef.inputs?.[inputName]) {
		console.error("Could not find input definitions for input node");
		return project;
	}

	inInstance.inputs = {
		...inInstance.inputs,
		[inputName]: outputName as keyof typeof OutsideConnections
	};

	return project;

}

export function connect(project: ProjectModel, filterName: string, outInstanceId: string, outputName: string, inInstanceId: string, inputName: string): ProjectModel {
	const filter = project.filters.get(filterName);

	if (!filter) {
		console.error("Could not find the filter in the project model");
		return project;
	}

	const outInstance = filter.elements.find(fe => fe.instanceId === outInstanceId);
	const inInstance = filter.elements.find(fe => fe.instanceId === inInstanceId);

	if (outInstanceId === "in:0" && inInstance) {
		return connectToNativeInput(project, filterName, outputName, inInstance, inputName);
	}

	if (!(outInstance && inInstance)) {
		console.error("Could not find input or output nodes in the project model.");
		return project;
	}

	const outFilterDef = getFilterDef(outInstance);
	const inFilterDef = getFilterDef(inInstance);

	if (!(outFilterDef && inFilterDef)) {
		console.error("Could not find filter definitions for input and output nodes");
		return project;
	}

	if (!(outFilterDef.outputs?.[outputName] && inFilterDef.inputs?.[inputName])) {
		console.error("Could not find input/output definitions for input and output nodes");
		return project;
	}

	inInstance.inputs = {
		...inInstance.inputs,
		[inputName]: {
			outputName,
			outputInstanceId: outInstanceId,
		}
	};

	return project;
}

export function disconnect(project: ProjectModel, filterName: string, inInstanceId: string, inputName: string): ProjectModel {
	const filter = project.filters.get(filterName);

	if (!filter) {
		console.error("Could not find the filter in the project model");
		return project;
	}

	const inInstance = filter.elements.find(fe => fe.instanceId === inInstanceId);

	if (!inInstance) {
		console.error(`Could not find input ${inputName} @ ${inInstanceId} in the project model.`);
		return project;
	}

	if (!inInstance.inputs?.[inputName]) {
		console.error("Could not find input for the node in the project model.");
		return project;
	}

	delete inInstance.inputs[inputName];
	return project;
}