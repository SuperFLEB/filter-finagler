type Entry<T = any> = [string, T];
type FailableMappingFunction<T, TOut = T> = (kv: Entry<T>) => Entry<TOut> | null | undefined | false;
type MappingFunction<T, TOut = T> = (kv: [string, T]) => Entry<TOut>;

export default function objectMap<T = any, TOut = T>(obj: Record<string, T>, mapFn: MappingFunction<T, TOut>, filterInvalid: false): Record<string, TOut>
export default function objectMap<T = any, TOut = T>(obj: Record<string, T>, mapFn: FailableMappingFunction<T, TOut>, filterInvalid?: true): Record<string, TOut>
export default function objectMap<T = any, TOut = T>(obj: Record<string, T>, mapFn: MappingFunction<T, TOut> | FailableMappingFunction<T, TOut>, filterInvalid = true): Record<string, TOut> {
	const mapped = (Object.entries(obj) as Entry<T>[]).map<Entry<TOut> | null | undefined | false>(mapFn);
	const filtered = filterInvalid ? mapped.filter(e => e && Array.isArray(e) && e.length >= 2) : mapped;
	return Object.fromEntries<TOut>(filtered as Entry<TOut>[]);
}
