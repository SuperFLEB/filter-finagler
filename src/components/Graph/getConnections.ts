import type {Clod} from "@t/Clod.ts";
import type {InputValueDef} from "@/MFilter/types.ts";
import objectValueFilter from "@/util/objectValueFilter.ts";
import objectMap from "@/util/objectMap.ts";
import OutsideConnections from "@t/OutsideConnections.ts";

type IOConnection = {
	clodId: number | symbol;
	key: string;
	attribute?: string;
};
type InternalIOConnection = IOConnection & { clodId: number, attribute: string };
type ConnectionPair = [IOConnection, InternalIOConnection]
type Connections = ConnectionPair[];

export default function getConnections(clods: Clod[]): Connections {
	type KeyString = string;

	// InputsNode
	const resultUsers = new Map<KeyString, { clod: Clod, attribute: string, key: string }[]>;
	// Outputs/results
	const resultProviders = new Map<KeyString, { clod: Clod, attribute: string, key: string }>();

	for (const clod of clods) {
		if (!clod.element) continue;

		let clodInputAttributes: Record<string, KeyString | null> = {};
		let clodOutputAttributes: Record<KeyString, string | null> = {};

		if (!clod.mf) {
			clodInputAttributes = Object.fromEntries(
				["in", "in2"]
					.filter(attrName => clod.element!.hasAttribute(attrName))
					.map(attrName => [attrName, clod.element!.getAttribute(attrName)!])
			);

			clodOutputAttributes = Object.fromEntries(
				["result"]
					.filter(attrName => clod.element!.hasAttribute(attrName))
					.map(attrName => [attrName, clod.element!.getAttribute(attrName)!])
			);
		} else {
			const filterDefInputs = objectValueFilter<InputValueDef>(clod.mf.info.inputs ?? {}, (v: InputValueDef) => v.type === "RESULT");
			clodInputAttributes = objectMap(filterDefInputs, ([k]) => clod.element?.hasAttribute(k) ? [k, clod.element!.getAttribute(k)] : null);
			for (const attrName of Object.keys(clod.mf.info.outputs ?? {})) {
				const key = clod.element!.getAttribute(attrName);
				if (!key) continue;
				if (clodOutputAttributes[key]) {
					console.error(`Multiple uses of the result key ${key}`);
					continue;
				}
				clodOutputAttributes[key] = attrName;
			}
		}

		for (const [attribute, key] of Object.entries(clodInputAttributes)) {
			if (!key) continue;
			if (!resultUsers.has(attribute)) {
				resultUsers.set(attribute, []);
			}
			resultUsers.get(attribute)!.push({clod, attribute, key});
		}

		for (const [key, attribute] of Object.entries(clodOutputAttributes)) {
			if (!attribute) continue;
			resultProviders.set(key, {clod, attribute, key});
		}
	}

	const connections: Connections = [];
	for (const user of resultUsers.values()) {
		for (const {key, clod, attribute} of user) {
			if (["SourceGraphic", "SourceAlpha", "BackgroundImage", "BackgroundAlpha", "FillPaint", "StrokePaint"].includes(key)) {
				connections.push([
					{
						clodId: OutsideConnections[key as keyof typeof OutsideConnections],
						key
					},
					{
						key,
						clodId: clod.id,
						attribute
					}
				]);
			}

			if (!resultProviders.has(key)) {
				console.warn(`Unknown output ${key} referenced.`);
				continue;
			}

			const result = resultProviders.get(key)!;

			connections.push([
				{
					key,
					clodId: result.clod.id,
					attribute: result.attribute,
				},
				{
					key,
					clodId: clod.id,
					attribute
				}
			]);
		}
	}

	return connections;
}