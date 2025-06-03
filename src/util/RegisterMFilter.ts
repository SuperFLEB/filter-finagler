import type {FilterDef, NodeDef, SVGFilterDef} from "@/MFilter/types.ts";

const registry = new Map<string, NodeDef>;
const nativeTagRegistry = new Map<string, SVGFilterDef>;

export function registerMFilter(...filters: NodeDef[]) {
	for (const filter of filters) {
		registry.set(filter.appuid, Object.freeze(filter));
		if (filter.type === "SVGNATIVE") {
			nativeTagRegistry.set(filter.interfaceFor, filter);
		}
	}
}

export function getFilterById(appuid: string): NodeDef | undefined {
	return registry.get(appuid);
}

export function getFilters() {
	return registry.values();
}
