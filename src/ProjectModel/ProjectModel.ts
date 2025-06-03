import {Namespaces} from "@/constants.ts";
import type {FilterAttributeValues, NodeType, SemverArray} from "@/MFilter/types.ts";

export type DisplayProperties = {
	x?: number;
	y?: number;
	displayName?: string;
};

export type FilterInputReference = {
	outputId: string;
	outputInstanceId: string | null;
};
export type FilterInputReferences = Record<string, FilterInputReference>;

export type FilterOutputReference = string;
export type FilterOutputReferences = Record<string, FilterOutputReference>;

type AnyFilterElement = {
	type: NodeType;
	instanceId: string;
	appuid?: string,
	display?: DisplayProperties;
	singleton?: boolean,
	version?: SemverArray;
	inputs?: FilterInputReferences,
	values?: FilterAttributeValues,
	outputs?: FilterOutputReferences,
}

export type FeElement = AnyFilterElement & {
	type: "MFILTER" | "SVGNATIVE",
	instanceId: string;
	appuid: string,
	singleton?: never,
};

export type FeUnknownElement = AnyFilterElement & {
	type: "UNKNOWN",
	instanceId: string,
	appuid?: string,
	singleton?: never,
}

export type FilterUtilityElement = AnyFilterElement & {
	type: "UTILITY",
	appuid: string,
	instanceId: string;
	singleton: boolean,
};

export type FilterElement = FeElement | FilterUtilityElement;

export type FilterModel = {
	id: string;
	elements: Map<string, FilterElement>;
};

export type ProjectModel = {
	type: typeof Namespaces[keyof typeof Namespaces],
	filters: Map<string, FilterModel>;
}