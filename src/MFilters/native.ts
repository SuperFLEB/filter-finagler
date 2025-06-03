import feBlend from "@/MFilters/native/feBlend.ts";
import feColorMatrix from "@/MFilters/native/feColorMatrix.ts";
import feComponentTransfer from "@/MFilters/native/feComponentTransfer.ts";
import feComposite from "@/MFilters/native/feComposite.ts";
import feConvolveMatrix from "@/MFilters/native/feConvolveMatrix.ts";
import feDiffuseLighting from "@/MFilters/native/feDiffuseLighting.ts";
import feDisplacementMap from "@/MFilters/native/feDisplacementMap.ts";
import feDropShadow from "@/MFilters/native/feDropShadow.ts";
import feFlood from "@/MFilters/native/feFlood.ts";
import feGaussianBlur from "@/MFilters/native/feGaussianBlur.ts";
import feImage from "@/MFilters/native/feImage.ts";
import feMerge from "@/MFilters/native/feMerge.ts";
import feMorphology from "@/MFilters/native/feMorphology.ts";
import feOffset from "@/MFilters/native/feOffset.ts";
import feSpecularLighting from "@/MFilters/native/feSpecularLighting.ts";
import feTile from "@/MFilters/native/feTile.ts";
import feTurbulence from "@/MFilters/native/feTurbulence.ts";
import type {SVGFilterDef} from "@/MFilter/types.ts";

const nativeFilters: SVGFilterDef[] = [
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

export default function getNativeFilters(): SVGFilterDef[] {
	return [...nativeFilters];
}

export function getNativeFilterByTagName(tagName: string): SVGFilterDef | undefined {
	return getNativeFilters().find(fd => fd?.interfaceFor === tagName);
}

export function getNativeFiltersByTagName(): Record<string, SVGFilterDef> {
	return Object.fromEntries(getNativeFilters().filter(fd => fd.interfaceFor).map(fd => [fd.interfaceFor, fd]));
}
