import type {
	FilterInputValues,
	FilterOutputs,
	SemverArray
} from "@t/MFilter.ts";


import {Namespaces} from "@/constants.ts";
import type OutsideConnections from "@t/OutsideConnections.ts";

export type FilterElementType = "MFILTER" | "NATIVE" | "UNKNOWN";
type FilterInputReference = {
	outputInstanceId: string;
	outputName: string;
} | keyof typeof OutsideConnections;
type FilterInputReferences = Record<string, FilterInputReference>;

type TagElement = {
	type: "NATIVE" | "UNKNOWN",
	nativeTag: string,
};

type MFilterElement = {
	type: "MFILTER",
	nativeTag?: never,
};

type DisplayProperties = {
	x?: number;
	y?: number;
	displayName?: string;
};

export type SVGMFilterElement =
	(TagElement | MFilterElement) &
	{
		type: FilterElementType;
		nativeTag?: string;
		instanceId: string;
		appuid: string;
		version?: SemverArray;
		inputs?: FilterInputReferences,
		values?: FilterInputValues,
		outputs?: FilterOutputs,
		display?: DisplayProperties,
	};

export type MFilterFilter = {
	id: string;
	elements: SVGMFilterElement[];
}

export type StructuredDocument = {
	type: typeof Namespaces[keyof typeof Namespaces],
	filters: Map<string, MFilterFilter>;
}