import {Namespaces} from "@/constants.ts";
import type {FilterAttributeValues, NodeType, SemverArray} from "@/MFilters/types.ts";

export type DisplayProperties = {
	x?: number;
	y?: number;
	displayName?: string;
};

export type FilterInputReference = {
	outputName: string;
	outputInstanceId: string | null;
};
export type FilterInputReferences = Record<string, FilterInputReference>;

export type FilterOutputReference = string;
export type FilterOutputReferences = Record<string, FilterOutputReference>;

type AnyFilterElement = {
	type: NodeType;
	instanceId: string;
	appuid?: string,
	nativeTag?: string,
	display?: DisplayProperties;
	singleton?: boolean,
	version?: SemverArray;
	inputs?: FilterInputReferences,
	values?: FilterAttributeValues,
	outputs?: FilterOutputReferences,
}

export type FeMFilterElement = AnyFilterElement & {
	type: "MFILTER",
	instanceId: string;
	appuid: string,
	nativeTag?: never,
	singleton?: never,
};

export type FeTagElement = AnyFilterElement & {
	type: "SVGNATIVE",
	instanceId: string;
	appuid: string,
	nativeTag: string,
	singleton?: never,
};

export type FeUnknownElement = AnyFilterElement & {
	type: "UNKNOWN",
	nativeTag?: string,
	instanceId: string,
	appuid?: string,
	singleton?: never,
}

export type FeElement = FeMFilterElement | FeTagElement;

export type FilterUtilityElement = AnyFilterElement & {
	type: "UTILITY",
	appuid: string,
	instanceId: string;
	singleton: boolean,
	nativeTag?: never,
};

export type FilterElement = FeElement | FilterUtilityElement;

export type FilterModel = {
	id: string;
	elements: FilterElement[];
};

export type ProjectModel = {
	type: typeof Namespaces[keyof typeof Namespaces],
	filters: Map<string, FilterModel>;
}