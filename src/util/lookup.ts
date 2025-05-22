/**
 * Given an array and a property name, returns an object with array values keyed on the property value.
 *
 * @example
 * type Thing = { id: string, value: string, ordinal: number };
 * const things = [
 *     { id: "first", value: "First value", ordinal: 1 },
 *     { id: "second", value: "Second value", ordinal: 1 },
 *     // ...
 * ];
 *
 * const thingsLookup = lookup<Thing>(things, "id");
 * // { first: { id: "first", value: "First value", ordinal: 1 }, second: { id: "second", value: "Second value", ordinal: 1 }, ... }
 */
export default function lookup<T extends any>(array: Record<string, any>[], property: string): Record<string, T> {
	return Object.fromEntries(array.map((item: any, index) => {
		if (!item.hasOwnProperty(property)) throw new Error(`Property ${property} does not exist on object at index ${index}.`);
		return [item[property], item];
	}));
}
