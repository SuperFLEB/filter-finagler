import feBlend from "@/FilterDef/native/feBlend.ts";
import feColorMatrix from "@/FilterDef/native/feColorMatrix.ts";
import feComponentTransfer from "@/FilterDef/native/feComponentTransfer.ts";
import feComposite from "@/FilterDef/native/feComposite.ts";
import feConvolveMatrix from "@/FilterDef/native/feConvolveMatrix.ts";
import feDiffuseLighting from "@/FilterDef/native/feDiffuseLighting.ts";
import feDisplacementMap from "@/FilterDef/native/feDisplacementMap.ts";
import feDropShadow from "@/FilterDef/native/feDropShadow.ts";
import feFlood from "@/FilterDef/native/feFlood.ts";
import feGaussianBlur from "@/FilterDef/native/feGaussianBlur.ts";
import feImage from "@/FilterDef/native/feImage.ts";
import feMerge from "@/FilterDef/native/feMerge.ts";
import feMorphology from "@/FilterDef/native/feMorphology.ts";
import feOffset from "@/FilterDef/native/feOffset.ts";
import feSpecularLighting from "@/FilterDef/native/feSpecularLighting.ts";
import feTile from "@/FilterDef/native/feTile.ts";
import feTurbulence from "@/FilterDef/native/feTurbulence.ts";
import type {FilterDef} from "@/MFilter/types.ts";

const nativeFilters = [
	feBlend,
	feColorMatrix,
	feComponentTransfer,
	feComposite,
	feConvolveMatrix,
	feDiffuseLighting,
	feDisplacementMap,
	feDropShadow,
	feFlood,
	feGaussianBlur,
	feImage,
	feMerge,
	feMorphology,
	feOffset,
	feSpecularLighting,
	feTile,
	feTurbulence,
];

export default function getNativeFilters(): FilterDef[] {
	return [...nativeFilters];
}

export function getNativeFilterByTagName(tagName: string): FilterDef | undefined {
	return getNativeFilters().find(fd => fd?.interfaceFor === tagName);
}

export function getNativeFiltersByTagName(): Record<string, FilterDef> {
	return Object.fromEntries(getNativeFilters().filter(fd => fd.interfaceFor).map(fd => [fd.interfaceFor, fd]));
}
