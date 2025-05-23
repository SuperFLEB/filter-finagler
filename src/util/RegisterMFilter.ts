import type {FilterDef} from "@t/MFilter.ts";

const registry = new Map<string, FilterDef>;
const nativeTagRegistry = new Map<string, FilterDef>;

export function registerMFilter(...filters: FilterDef[]) {
	for (const filter of filters) {
		registry.set(filter.appuid, Object.freeze(filter));
		if (filter.native) {
			nativeTagRegistry.set(filter.interfaceFor, filter);
		}
	}
}

export function getFilterById(appuid: string): FilterDef | undefined {
	return registry.get(appuid);
}

export function getFilters() {
	return registry.values();
}
