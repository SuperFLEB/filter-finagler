import type {SemverArray} from "@/MFilter/types.ts";
import xpath from "@/util/xpath.ts";
import {Namespaces} from "@/constants.ts";
import lookup from "@/util/lookup.ts";

let cached: [XMLDocument, Record<string, FilterVersion>] | undefined = undefined;

export type FilterVersion = { name: string, appuid: string, version: SemverArray };
export default function getFilterVersion(svgDoc: XMLDocument): Record<string, FilterVersion> {
	if (cached?.[0] === svgDoc) return cached[1];
	const filters: FilterVersion[] = xpath<Element>(svgDoc, "//m:filters/m:filter", {m: Namespaces.svgmf1})
		.map(filterEl => {
			const filterSpec = {
				name: filterEl.getAttribute("name"),
				appuid: filterEl.getAttribute("appuid"),
				version: filterEl.getAttribute("version")?.split(".").map(part => Number(part)) ?? [0, 0, 0],
			};
			if (filterSpec.name === null || filterSpec.appuid === null) return null;
			return filterSpec as FilterVersion;
		}).filter(f => f !== null);
	cached = [svgDoc, lookup<FilterVersion>(filters, "name")];
	return cached[1];
}