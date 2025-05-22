import type {
	FilterInputReferenceDefs,
	FilterInputValues,
	FilterOutputs,
	InputValueDef,
	SemverArray
} from "@/MFilter/types.ts";
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
};

export type MFilterFilter = {
	id: string;
	elements: SVGMFilterElement[];
}

export type StructuredDocument = {
	type: typeof Namespaces[keyof typeof Namespaces],
	filters: Map<string, MFilterFilter>;
}